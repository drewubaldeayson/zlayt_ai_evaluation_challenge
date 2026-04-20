FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential sqlite3

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . ./backend

RUN chmod +x ./backend/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./backend/entrypoint.sh"]
