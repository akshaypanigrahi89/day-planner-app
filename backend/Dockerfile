FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt psycopg2-binary
COPY . .
# Using gunicorn + uvicorn worker for production
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
