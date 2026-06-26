from sqlalchemy import Column, ForeignKey, Table, Integer
from api.db.database import Base

# N:M intermediate association table for Users and Roles
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)
)
