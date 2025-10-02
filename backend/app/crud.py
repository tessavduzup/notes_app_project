from fastapi import HTTPException
from . import models, schemas
from sqlalchemy.orm import Session
from sqlalchemy import select
from .security import get_password_hash

def read_user_by_username(username: str, db: Session) -> schemas.User | None:
    stmt = select(models.User).where(models.User.name == username)
    user = db.execute(stmt)
    return user.scalars().first()

def read_user_by_email(email: str, db: Session) -> schemas.User | None:
    stmt = select(models.User).where(models.User.email == email)
    user = db.execute(stmt)
    return user.scalars().first()

def create_user(user: schemas.UserIn, db: Session) -> schemas.User:
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    db_user = models.User(name = user_dict["name"], email = user_dict["email"], hashed_password = hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def read_notes(user_id: int, db: Session) -> list[schemas.Note]:
    stmt = select(models.Note).where(models.Note.user_id == user_id)
    return db.execute(stmt).scalars().all()

def update_note(note_id: int, user_id: int, new_note: schemas.NoteIn, db: Session) -> schemas.Note:
    stmt = select(models.Note).where(models.Note.id == note_id, models.Note.user_id == user_id)
    note = db.execute(stmt).scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    for key, value in new_note.model_dump().items():
        setattr(note, key, value)

    db.commit()
    db.refresh(note)
    return note

def create_note(note: schemas.NoteIn, user_id: int, db: Session) -> schemas.Note:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    db_note = models.Note(**note.model_dump())
    user.notes.append(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def delete_note(note_id: int, user_id: int,  db: Session) -> schemas.Note:
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return note

def delete_user(user_id: int, db: Session):
    user_to_delete = db.get(models.User, user_id)
    db.delete(user_to_delete)
    db.commit()

def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session) -> schemas.User:
    user_to_update = db.query(models.User).filter(models.User.id == user_id).first()
    user_to_update.name = user_update.name
    user_to_update.email = user_update.email
    db.commit()
    db.refresh(user_to_update)
    return user_to_update