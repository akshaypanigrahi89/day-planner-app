from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, default="DayPlanner User")
    profession = Column(String, default="Professional")
    location = Column(String, default="Earth")
    phone_no = Column(String, nullable=True)
    otp_verified = Column(Boolean, default=False)
    state = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)

    tasks = relationship("Task", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True, nullable=True) 
    day = Column(String, nullable=True) 
    title = Column(String, index=True)
    subtasks = Column(JSON, default=list) 
    category = Column(String, index=True, nullable=True)
    priority = Column(String, default="Medium")
    start_time = Column(String, nullable=True)
    end_time = Column(String, nullable=True)
    completion_time = Column(String, nullable=True)
    progress = Column(Integer, default=0)
    status = Column(String, default="Todo") 
    comment = Column(String, nullable=True)
    is_reviewed = Column(Boolean, default=False)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tasks")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
