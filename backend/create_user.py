from database import SessionLocal
from models import User
from auth import get_password_hash

def create_or_update_user():
    db = SessionLocal()
    email = "user@123"
    password = "1234"
    hashed = get_password_hash(password)
    
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.hashed_password = hashed
        print(f"Updated password for {email}")
    else:
        user = User(email=email, hashed_password=hashed, full_name="User123")
        db.add(user)
        print(f"Created user {email}")
    db.commit()
    db.close()

if __name__ == "__main__":
    create_or_update_user()
