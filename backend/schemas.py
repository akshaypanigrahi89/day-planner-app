from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
import datetime

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = "DayPlanner User"
    profession: Optional[str] = "Professional"
    location: Optional[str] = "Earth"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    profession: Optional[str] = None
    location: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class TaskBase(BaseModel):
    date: Optional[str] = None
    day: Optional[str] = None
    title: str
    subtasks: Optional[List[Dict[str, Any]]] = []
    category: Optional[str] = None
    priority: Optional[str] = "Medium"
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    completion_time: Optional[str] = None
    progress: Optional[int] = 0
    status: Optional[str] = "Todo"
    comment: Optional[str] = None
    is_reviewed: Optional[bool] = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    owner_id: int
    created_at: datetime.datetime
    updated_at: Optional[datetime.datetime] = None
    model_config = ConfigDict(from_attributes=True)

class AnalyticsSummary(BaseModel):
    total_tasks: int
    completed_tasks: int
    total_time_spent_minutes: int
    tasks_by_category: dict
    tasks_by_status: dict
