import logging
import os
import sys
from api.db.database import SessionLocal, Base, engine
import api.models as db_models
from api.helpers.auth import hash_password

# Logger configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("iqiss_insight_db_seeder")

def seed_database():
    # Detect the environment (defaults to development)
    app_env = os.getenv("APP_ENV", "development").lower()
    is_production = app_env in ["production", "prod"]

    logger.info(f"Starting database seeding process in '{app_env}' environment...")

    # Interactive confirmation prompt for production
    if is_production:
        print("\n" + "!" * 80)
        print("🚨 WARNING: YOU ARE ATTEMPTING TO RUN SEEDING ON A PRODUCTION ENVIRONMENT!")
        print("!" * 80 + "\n")
        try:
            confirmation = input("Are you absolutely sure you want to seed default database roles? (yes/no): ").strip().lower()
            if confirmation not in ["yes", "y"]:
                logger.warning("Database seeding aborted by the user.")
                sys.exit(0)
        except KeyboardInterrupt:
            print()
            logger.warning("Database seeding cancelled.")
            sys.exit(0)

    # Ensure all tables exist before seeding
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Seed Roles (Runs in all environments)
        roles_to_seed = ["admin", "user"]
        seeded_roles = {}
        for role_name in roles_to_seed:
            role = db.query(db_models.Role).filter(db_models.Role.name == role_name).first()
            if not role:
                role = db_models.Role(name=role_name)
                db.add(role)
                db.flush()
                logger.info(f"Seeded role: {role_name}")
            else:
                logger.info(f"Role '{role_name}' already exists.")
            seeded_roles[role_name] = role

        # If production, save roles and skip user seeding
        if is_production:
            db.commit()
            logger.info("Production seeding completed successfully. Roles verified/created. Seeding users skipped.")
            return

        # Seed password definition (Only for development/testing environments)
        plain_password = "Password.01#"
        hashed_pwd = hash_password(plain_password)

        # 2. Seed Admin User
        admin_email = "admin@iqissinsight.com"
        admin = db.query(db_models.User).filter(db_models.User.email == admin_email).first()
        if not admin:
            admin = db_models.User(
                facebook_user_id="fb-admin-seed",
                name="Admin User",
                email=admin_email,
                password=hashed_pwd
            )
            db.add(admin)
            db.flush()
            
            # Associate admin with both 'admin' and 'user' roles
            admin.roles.append(seeded_roles["admin"])
            admin.roles.append(seeded_roles["user"])
            logger.info(f"Seeded Admin User: {admin_email} with password '{plain_password}'")
        else:
            logger.info(f"Admin User '{admin_email}' already exists.")

        # 3. Seed Normal User
        user_email = "user@iqissinsight.com"
        user = db.query(db_models.User).filter(db_models.User.email == user_email).first()
        if not user:
            user = db_models.User(
                facebook_user_id="fb-user-seed",
                name="Normal User",
                email=user_email,
                password=hashed_pwd
            )
            db.add(user)
            db.flush()
            
            # Associate user with 'user' role
            user.roles.append(seeded_roles["user"])
            logger.info(f"Seeded Normal User: {user_email} with password '{plain_password}'")
        else:
            logger.info(f"Normal User '{user_email}' already exists.")

        db.commit()
        logger.info("Development database seeding process finished successfully.")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {str(e)}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
