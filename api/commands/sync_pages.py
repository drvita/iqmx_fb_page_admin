import logging
import os
import sys

# Add project root directory to path to ensure modules are found correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from api.db.database import SessionLocal
import api.models as db_models
from api.helpers.sync import sync_page_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("iqiss_insight_sync_command")

def run_sync():
    logger.info("Starting nightly page synchronization command...")
    db = SessionLocal()
    try:
        # Fetch all pages marked for monitoring
        pages = db.query(db_models.FacebookPage).filter(
            db_models.FacebookPage.is_monitored == True
        ).all()
        
        logger.info(f"Found {len(pages)} monitored pages to sync.")
        success_count = 0
        fail_count = 0
        
        for page in pages:
            try:
                logger.info(f"Syncing page '{page.name}' (ID: {page.id}, FB ID: {page.fb_page_id})...")
                success = sync_page_data(db, page.id)
                if success:
                    success_count += 1
                else:
                    fail_count += 1
            except Exception as e:
                logger.error(f"Failed to sync page ID {page.id}: {str(e)}")
                fail_count += 1
                
        logger.info(f"Page synchronization completed. Successes: {success_count}, Failures: {fail_count}")
    finally:
        db.close()

if __name__ == "__main__":
    run_sync()
