import os
import json
import logging
from datetime import datetime

logger = logging.getLogger("fb_page_admin_api.helpers.alerts")

# Default values if config file is missing or invalid
DEFAULT_RULES = {
    "min_posts_28_days": 4,
    "min_post_age_days": 2,
    "min_post_engagement_rate": 0.01,
    "max_allowed_followers_decline_pct": -2.0,
    "max_allowed_engagement_decline_pct": -10.0
}

def load_metric_rules() -> dict:
    """
    Loads custom rules configurations from metric_rules.json.
    Falls back to default settings on error.
    """
    config_path = os.path.join(os.path.dirname(__file__), "../config/metric_rules.json")
    if not os.path.exists(config_path):
        logger.warning(f"Configuration file not found at {config_path}. Using default rules.")
        return DEFAULT_RULES
    
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)
            # Ensure all required keys exist, fallback if missing
            resolved_rules = {}
            for k, v in DEFAULT_RULES.items():
                resolved_rules[k] = config.get(k, v)
            return resolved_rules
    except Exception as e:
        logger.error(f"Error reading configuration file: {str(e)}. Using default rules.")
        return DEFAULT_RULES

def evaluate_page_metrics(page, recent_posts) -> list[dict]:
    """
    Evaluates Facebook Page metrics and its recent posts against config rules.
    Returns a list of alert dictionaries:
    [
        {
            "id": str,
            "type": "warning" | "danger" | "info",
            "title": str,
            "message": str,
            "metric": "posts" | "followers" | "engagement"
        }
    ]
    """
    rules = load_metric_rules()
    alerts = []
    
    # 1. Posting Frequency Rule (last 28 days)
    posts_count = len(recent_posts)
    min_posts = rules.get("min_posts_28_days", DEFAULT_RULES["min_posts_28_days"])
    if posts_count < min_posts:
        alerts.append({
            "id": "low_posting_frequency",
            "type": "warning",
            "title": "Baja frecuencia de publicación",
            "message": f"Solo has publicado {posts_count} veces en los últimos 28 días. Se sugiere un mínimo de {min_posts} publicaciones para mantener activo tu alcance.",
            "metric": "posts"
        })
        
    # 2. General Trends: Followers Decline
    followers_change = page.followers_change or 0.0
    max_fol_decline = rules.get("max_allowed_followers_decline_pct", DEFAULT_RULES["max_allowed_followers_decline_pct"])
    if followers_change < max_fol_decline:
        alerts.append({
            "id": "followers_decline",
            "type": "danger",
            "title": "Pérdida de seguidores",
            "message": f"Tu total de seguidores ha decrecido un {followers_change}% en este periodo. Considera ajustar la relevancia de tus publicaciones.",
            "metric": "followers"
        })
        
    # 3. General Trends: Engagement Decline
    engagement_change = page.engagement_change or 0.0
    max_eng_decline = rules.get("max_allowed_engagement_decline_pct", DEFAULT_RULES["max_allowed_engagement_decline_pct"])
    if engagement_change < max_eng_decline:
        alerts.append({
            "id": "engagement_decline",
            "type": "danger",
            "title": "Caída en interacciones",
            "message": f"Las interacciones generales de la página han caído un {engagement_change}% en comparación con el periodo anterior. Revisa el contenido de las publicaciones más recientes.",
            "metric": "engagement"
        })

    # 4. Underperforming Individual Posts (low engagement rate compared to followers count)
    followers = page.followers or 0
    # Skip if page has no followers or too few to establish significant rate (e.g. < 10 followers)
    if followers >= 10:
        min_age_days = rules.get("min_post_age_days", DEFAULT_RULES["min_post_age_days"])
        min_eng_rate = rules.get("min_post_engagement_rate", DEFAULT_RULES["min_post_engagement_rate"])
        now = datetime.utcnow()
        
        for post in recent_posts:
            if not post.created_time:
                continue
            
            # Calculate exact age in days
            age_days = (now - post.created_time).total_seconds() / 86400.0
            if age_days >= min_age_days:
                # Interactions sum: reactions + comments + shares
                interactions = (post.reactions_count or 0) + (post.comments_count or 0) + (post.shares_count or 0)
                rate = interactions / followers
                
                if rate < min_eng_rate:
                    preview_text = post.message[:35] + "..." if post.message and len(post.message) > 35 else (post.message or "Publicación sin texto")
                    age_str = f"{int(age_days)}" if age_days >= 1 else f"{age_days:.1f}"
                    alerts.append({
                        "id": f"low_engagement_post_{post.fb_post_id}",
                        "type": "info",
                        "title": "Baja interacción en publicación",
                        "message": f"La publicación '{preview_text}' (hace {age_str} días) tiene baja interacción: tasa del {rate:.2%} ({interactions} interacciones) vs. objetivo esperado {min_eng_rate:.1%}.",
                        "metric": "posts"
                    })
                    
    return alerts

def calculate_post_performance(post, followers_count: int) -> dict:
    """
    Calculates the performance rating of an individual post based on the rules configuration.
    Returns:
        {
            "label": "Excelente" | "Regular" | "Baja" | "Reciente",
            "status": "excellent" | "moderate" | "poor" | "recent"
        }
    """
    rules = load_metric_rules()
    min_age_days = rules.get("min_post_age_days", DEFAULT_RULES["min_post_age_days"])
    min_eng_rate = rules.get("min_post_engagement_rate", DEFAULT_RULES["min_post_engagement_rate"])
    
    if not post.created_time:
        return {"label": "Reciente", "status": "recent"}
        
    now = datetime.utcnow()
    age_days = (now - post.created_time).total_seconds() / 86400.0
    interactions = (post.reactions_count or 0) + (post.comments_count or 0) + (post.shares_count or 0)
    
    if followers_count < 10:
        if age_days < min_age_days:
            return {"label": "Reciente", "status": "recent"}
        if interactions >= 1:
            return {"label": "Excelente", "status": "excellent"}
        return {"label": "Regular", "status": "moderate"}
        
    if age_days < min_age_days:
        return {"label": "Reciente", "status": "recent"}
        
    rate = interactions / followers_count
    if rate >= min_eng_rate:
        return {"label": "Excelente", "status": "excellent"}
    if rate >= min_eng_rate * 0.5:
        return {"label": "Regular", "status": "moderate"}
    return {"label": "Baja", "status": "poor"}
