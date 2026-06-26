from datetime import datetime, timezone, timedelta
import logging
import os
import requests
from sqlalchemy.orm import Session as DBSession
import api.models as db_models

logger = logging.getLogger("fb_page_admin_api.helpers.sync")
FB_API_VERSION = os.getenv("NEXT_PUBLIC_FB_API_VERSION", "v25.0")

def sync_page_data(db: DBSession, page_id: int) -> bool:
    """
    Downloads page metrics (followers, reach, engagement) and recent posts
    from the Facebook Graph API and saves them directly to the database.
    Returns True if successful, raises Exception on error.
    """
    page = db.query(db_models.FacebookPage).filter(db_models.FacebookPage.id == page_id).first()
    if not page:
        logger.error(f"Sync failed: FacebookPage with ID {page_id} not found in DB.")
        return False
        
    page_token = page.page_access_token
    fb_page_id = page.fb_page_id
    
    if not page_token:
        logger.warning(f"Sync aborted: No Page Access Token stored for Page ID {page_id}")
        return False

    try:
        # A. Basic Details (Followers & Likes)
        details_url = f"https://graph.facebook.com/{FB_API_VERSION}/{fb_page_id}"
        details_params = {
            "fields": "followers_count,fan_count,name",
            "access_token": page_token
        }
        details_resp = requests.get(details_url, params=details_params, timeout=10)
        details_resp.raise_for_status()
        details_data = details_resp.json()
        
        followers = details_data.get("followers_count", details_data.get("fan_count", 0))
        page.name = details_data.get("name", page.name)

        # B. Page Insights (Reach with fallback)
        reach = 0
        reach_metrics = ["page_total_media_view_unique", "page_impressions_unique"]
        for metric in reach_metrics:
            reach_url = f"https://graph.facebook.com/{FB_API_VERSION}/{fb_page_id}/insights/{metric}"
            reach_params = {
                "period": "days_28",
                "access_token": page_token
            }
            try:
                reach_resp = requests.get(reach_url, params=reach_params, timeout=10)
                if reach_resp.status_code == 200:
                    data_list = reach_resp.json().get("data", [])
                    if data_list and "values" in data_list[0]:
                        values = data_list[0]["values"]
                        if values:
                            reach = values[-1].get("value", 0)
                    logger.info(f"Successfully retrieved reach metric '{metric}': {reach}")
                    break
                else:
                    logger.warning(f"Facebook reach metric '{metric}' responded with status {reach_resp.status_code}: {reach_resp.text}")
            except Exception as reach_err:
                logger.error(f"Error fetching reach metric '{metric}': {str(reach_err)}")

        # C. Page Insights (Engagement with fallback)
        engagement = 0
        engagement_metrics = ["page_post_engagements", "page_engaged_users"]
        for metric in engagement_metrics:
            engagement_url = f"https://graph.facebook.com/{FB_API_VERSION}/{fb_page_id}/insights/{metric}"
            engagement_params = {
                "period": "days_28",
                "access_token": page_token
            }
            try:
                engagement_resp = requests.get(engagement_url, params=engagement_params, timeout=10)
                if engagement_resp.status_code == 200:
                    data_list = engagement_resp.json().get("data", [])
                    if data_list and "values" in data_list[0]:
                        values = data_list[0]["values"]
                        if values:
                            engagement = values[-1].get("value", 0)
                    logger.info(f"Successfully retrieved engagement metric '{metric}': {engagement}")
                    break
                else:
                    logger.warning(f"Facebook engagement metric '{metric}' responded with status {engagement_resp.status_code}: {engagement_resp.text}")
            except Exception as eng_err:
                logger.error(f"Error fetching engagement metric '{metric}': {str(eng_err)}")

        # C. Posts Feed (with reactions, comments, and shares counts in a single query)
        posts_url = f"https://graph.facebook.com/{FB_API_VERSION}/{fb_page_id}/posts"
        posts_params = {
            "fields": (
                "id,message,created_time,is_published,full_picture,"
                "reactions.summary(total_count).limit(0),"
                "comments.summary(total_count).limit(0),"
                "shares"
            ),
            "limit": 10,
            "access_token": page_token
        }
        
        raw_posts = []
        posts_resp = requests.get(posts_url, params=posts_params, timeout=10)
        if posts_resp.status_code == 200:
            raw_posts = posts_resp.json().get("data", [])
        else:
            logger.warning(f"Facebook Posts API responded with status {posts_resp.status_code}: {posts_resp.text}")

        now = datetime.now(timezone.utc)
        thirty_days_ago = now - timedelta(days=30)
        new_posts_count = 0

        # Save/update posts in database
        for item in raw_posts:
            fb_post_id = item.get("id")
            if not fb_post_id:
                continue

            created_str = item.get("created_time")
            created_dt = datetime.utcnow()  # Fallback
            is_new = False
            if created_str:
                try:
                    clean_time_str = created_str.replace("+0000", "+00:00")
                    created_dt = datetime.fromisoformat(clean_time_str)
                    # Convert to naive datetime if comparison or db is naive UTC
                    if created_dt.tzinfo is not None:
                        created_dt = created_dt.astimezone(timezone.utc).replace(tzinfo=None)
                    
                    naive_thirty_days_ago = thirty_days_ago.replace(tzinfo=None)
                    if created_dt >= naive_thirty_days_ago:
                        is_new = True
                except Exception as dt_err:
                    logger.debug(f"Error parsing created_time '{created_str}': {str(dt_err)}")

            if is_new:
                new_posts_count += 1

            reactions_count = item.get("reactions", {}).get("summary", {}).get("total_count", 0)
            comments_count = item.get("comments", {}).get("summary", {}).get("total_count", 0)
            shares_count = item.get("shares", {}).get("count", 0)

            # Check if post already exists
            existing_post = db.query(db_models.FacebookPost).filter(
                db_models.FacebookPost.fb_post_id == fb_post_id
            ).first()

            if existing_post:
                # Update attributes
                existing_post.message = item.get("message")
                existing_post.is_published = item.get("is_published", True)
                existing_post.full_picture = item.get("full_picture")
                existing_post.reactions_count = reactions_count
                existing_post.comments_count = comments_count
                existing_post.shares_count = shares_count
                # Keep created_time and ai_observations intact
            else:
                # Insert new post
                new_post = db_models.FacebookPost(
                    page_id=page.id,
                    fb_post_id=fb_post_id,
                    message=item.get("message"),
                    created_time=created_dt,
                    is_published=item.get("is_published", True),
                    full_picture=item.get("full_picture"),
                    reactions_count=reactions_count,
                    comments_count=comments_count,
                    shares_count=shares_count
                )
                db.add(new_post)

        # Update metrics changes if they were non-zero previously
        # Followers change
        if page.followers and page.followers > 0 and followers > 0:
            page.followers_change = round(((followers - page.followers) / page.followers) * 100, 1)
        else:
            page.followers_change = 0.0

        # Reach change
        if page.reach and page.reach > 0 and reach > 0:
            page.reach_change = round(((reach - page.reach) / page.reach) * 100, 1)
        else:
            page.reach_change = 0.0

        # Engagement change
        if page.engagement and page.engagement > 0 and engagement > 0:
            page.engagement_change = round(((engagement - page.engagement) / page.engagement) * 100, 1)
        else:
            page.engagement_change = 0.0

        # New posts change
        if page.new_posts_count is not None:
            page.new_posts_change = new_posts_count - page.new_posts_count
        else:
            page.new_posts_change = 0

        # Update cached fields on FacebookPage
        page.followers = followers
        page.reach = reach
        page.engagement = engagement
        page.new_posts_count = new_posts_count
        page.last_sync_at = datetime.utcnow()

        db.commit()
        logger.info(f"Successfully synced page ID {page_id} (fb_page_id: {fb_page_id}). Followers: {followers}, Reach: {reach}, Posts: {new_posts_count}")
        return True

    except Exception as e:
        db.rollback()
        logger.error(f"Sync failed for Page ID {page_id}: {str(e)}")
        raise e
