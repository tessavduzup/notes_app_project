#pylint: disable=import-error
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.dependency import get_db
from app import schemas, crud, auth
from fastapi.exceptions import ResponseValidationError
router = APIRouter()

@router.post("/register", response_model = schemas.User, status_code = 201)
def create_user(
    user: schemas.UserIn,
    db: Session = Depends(get_db)
):
    user_db = crud.read_user_by_username(user.name, db)
    if user_db:
        raise HTTPException(status_code = 400, detail = "Username already registered")
    return crud.create_user(user, db)

@router.post("/token", response_model = schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(form_data, db)
    if not user:
        raise HTTPException(status_code = 401, detail = "Incorrect username or password")
    access_token = auth.create_access_token(data = {"sub": str(user.id), "username": user.name})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model = schemas.User)
def get_user_info(
    current_user: schemas.User = Depends(auth.get_current_user)
):  
    try:
        return current_user
    except ResponseValidationError:
        return HTTPException(status_code = 400, detail="incorredct email")

@router.delete("/users/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    crud.delete_user(current_user.id, db)

@router.put("/users/me", response_model = schemas.Token)
def update_account(
    user_update: schemas.UserUpdate,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    user = crud.read_user_by_username(user_update.name, db) #read_user_by_email
    if (user and user.name != current_user.name):
        raise HTTPException(status_code = 400, detail = "Username already registered")
    user = crud.read_user_by_email(user_update.email, db)
    if(user and user.email != current_user.email):
        raise HTTPException(status_code = 400, detail = "Email already registered")
    updated_user = crud.update_user(current_user.id, user_update, db)
    new_access_token = auth.create_access_token(data = {"sub": str(current_user.id), "username": updated_user.name})
    return {"access_token": new_access_token, "token_type": "bearer"}