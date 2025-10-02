from pydantic import BaseModel, ConfigDict, Field, EmailStr
from datetime import datetime

class NoteBase(BaseModel):
    title: str = Field(min_length = 1, max_length = 50)
    description: str | None = None

class NoteIn(NoteBase): pass

class Note(NoteBase):
    id: int
    model_config = ConfigDict(from_attributes = True)
    user_id: int
    created_at: datetime
    updated_at: datetime

class UserBase(BaseModel):
    name: str = Field(min_length = 1, max_length = 50)
    email: EmailStr | None = None

class UserUpdate(UserBase):
    pass

class UserIn(UserBase):
    password: str = Field(min_length = 8, max_length = 50)

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes = True)

class Token(BaseModel):
    access_token: str
    token_type: str