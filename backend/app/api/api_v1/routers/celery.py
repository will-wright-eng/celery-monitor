from time import sleep

from fastapi import WebSocket, APIRouter

from app.core.celery_app import celery_app

celery_router = r = APIRouter()

@celery_app.task(acks_late=True)
def example_task(word: str) -> str:
    return f"test task returns {word}"

@celery_app.task
def example_task():
    sleep(5)  # Simulate a long-running task
    return "Task completed"

@r.post("/start_task/")
async def start_task():
    task = celery_app.send_task("tasks.example_task")
    return {"task_id": task.id}

@r.websocket("/ws/task_status/{task_id}")
async def websocket_task_status(websocket: WebSocket, task_id: str):
    await websocket.accept()
    while True:
        task = celery_app.AsyncResult(task_id)
        await websocket.send_text(f"Task {task_id}: {task.status}")
