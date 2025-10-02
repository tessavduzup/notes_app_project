from . import database

def get_db():
    db = database.localSession()
    try:
        yield db
    finally:
        db.close()