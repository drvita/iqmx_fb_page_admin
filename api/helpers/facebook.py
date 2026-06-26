import os
import requests
import logging

logger = logging.getLogger("fb_page_admin_api.facebook_helper")

# Facebook parameters configuration loaded from environment variables
FB_APP_ID = os.getenv("FB_APP_ID") or os.getenv("NEXT_PUBLIC_FB_APP_ID", "")
FB_APP_SECRET = os.getenv("FB_APP_SECRET", "")
FB_API_VERSION = os.getenv("NEXT_PUBLIC_FB_API_VERSION", "v25.0")

def verify_facebook_token(access_token: str) -> dict | None:
    """
    Validates the Facebook access token by fetching the user profile.
    Returns basic profile info (id, name, email) if valid, otherwise None.
    """
    url = f"https://graph.facebook.com/{FB_API_VERSION}/me"
    params = {
        "fields": "id,name,email",
        "access_token": access_token
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            return response.json()
        logger.error(f"Error validating token with Facebook: {response.status_code} - {response.text}")
        return None
    except Exception as e:
        logger.error(f"Exception in verify_facebook_token: {str(e)}")
        return None

def exchange_long_lived_token(short_lived_token: str) -> str:
    """
    Exchanges a short-lived user access token for a long-lived one (~60 days).
    Returns the long-lived token, or the original token as a fallback if app credentials are missing.
    """
    if not FB_APP_ID or not FB_APP_SECRET:
        logger.warning("Missing FB_APP_ID or FB_APP_SECRET in Backend environment variables. Falling back to short-lived token.")
        return short_lived_token

    url = f"https://graph.facebook.com/{FB_API_VERSION}/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": FB_APP_ID,
        "client_secret": FB_APP_SECRET,
        "fb_exchange_token": short_lived_token
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token", short_lived_token)
        logger.error(f"Error exchanging token with Facebook: {response.status_code} - {response.text}")
        return short_lived_token
    except Exception as e:
        logger.error(f"Exception in exchange_long_lived_token: {str(e)}")
        return short_lived_token

def get_facebook_user_pages(user_access_token: str) -> list[dict]:
    """
    Fetches the list of Facebook pages managed by the user,
    along with their indefinite Page Access Tokens.
    """
    url = f"https://graph.facebook.com/{FB_API_VERSION}/me/accounts"
    params = {
        "fields": "id,name,access_token,category",
        "access_token": user_access_token
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            return response.json().get("data", [])
        logger.error(f"Error fetching Facebook pages: {response.status_code} - {response.text}")
        return []
    except Exception as e:
        logger.error(f"Exception in get_facebook_user_pages: {str(e)}")
        return []
