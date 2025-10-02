#pylint: disable=import-error
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependency import get_db
from app import schemas, crud, auth

router = APIRouter()

@router.get("/users/me/notes", response_model = list[schemas.Note])
def get_user_notes(
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return crud.read_notes(current_user.id, db)

@router.put("/users/me/notes/{note_id}", response_model = schemas.Note)
def update_note(
    note_id: int,
    new_note: schemas.NoteIn,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return crud.update_note(note_id, current_user.id, new_note, db)

@router.delete("/users/me/notes/{note_id}", response_model = schemas.Note)
def delete_note(
    note_id: int,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return crud.delete_note(note_id, current_user.id, db)

@router.post("/users/me/notes/", response_model = schemas.Note)
def create_note(
    note: schemas.NoteIn,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_note(note, current_user.id, db)
