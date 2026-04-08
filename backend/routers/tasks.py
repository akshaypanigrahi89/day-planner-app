from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
import models, schemas, auth, database
from pydantic import BaseModel

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_task = models.Task(**task.model_dump(), owner_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.post("/bulk", response_model=List[schemas.Task])
def create_bulk_tasks(tasks: List[schemas.TaskCreate], db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_tasks = [models.Task(**t.model_dump(), owner_id=current_user.id) for t in tasks]
    db.add_all(db_tasks)
    db.commit()
    for t in db_tasks:
        db.refresh(t)
    return db_tasks

@router.get("/", response_model=List[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).offset(skip).limit(limit).all()
    return tasks

class ReviewRequest(BaseModel):
    date: str

@router.post("/review")
def review_tasks_for_date(request: ReviewRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id, models.Task.date == request.date).all()
    for task in tasks:
        task.is_reviewed = True
        if task.status == "Done" and not task.completion_time:
            task.completion_time = datetime.datetime.utcnow().isoformat()
    db.commit()
    return {"message": f"Successfully reviewed {len(tasks)} tasks for {request.date}."}

@router.get("/analytics", response_model=schemas.AnalyticsSummary)
def get_analytics(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == "Done")
    time_spent = 0
    cats = {}
    stats = {}
    for t in tasks:
        cats[t.category or "None"] = cats.get(t.category or "None", 0) + 1
        stats[t.status or "Todo"] = stats.get(t.status or "Todo", 0) + 1
    
    return schemas.AnalyticsSummary(
        total_tasks=total,
        completed_tasks=completed,
        total_time_spent_minutes=time_spent,
        tasks_by_category=cats,
        tasks_by_status=stats
    )

@router.put("/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    
    db_task.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}
