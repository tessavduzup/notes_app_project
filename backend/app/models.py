#pylint: disable=not-callable
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import DeclarativeBase, relationship

class Base(DeclarativeBase): pass

class Note(Base):
    __tablename__ = "Notes"

    id = Column("NoteID", Integer, primary_key = True, index = True)
    title = Column("Title", String)
    description = Column("Description", String, default = "")
    user_id = Column("UserID", Integer, ForeignKey("Users.UserID"),)
    created_at = Column("CreatedAt", DateTime, default = func.now())
    updated_at = Column("UpdatedAt", DateTime, default = func.now(), onupdate = func.now())

    user = relationship("User", back_populates = "notes")
    
class User(Base):
    __tablename__ = "Users"

    id = Column("UserID", Integer, primary_key= True, index = True)
    name = Column("UserName", String, unique = True, index = True)
    email = Column("E-mail", String, unique = True, index = True)
    hashed_password = Column(String, nullable = False)
    created_at = Column("CreatedAt", DateTime, default = func.now())
    updated_at = Column("UpdatedAt", DateTime, default = func.now(), onupdate = func.now())

    notes = relationship("Note", back_populates = "user", cascade="all, delete-orphan")