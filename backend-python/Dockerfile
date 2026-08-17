# Gunakan base image Python 3.10 slim untuk ukuran image yang kecil dan efisien
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=5000

# Set working directory
WORKDIR /app

# Install system dependencies if needed (ctypes/ssl dependencies are included in slim)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first for Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh source code backend
COPY . .

# Expose port yang digunakan oleh Flask/Gunicorn
EXPOSE 5000

# Jalankan Gunicorn pada host 0.0.0.0 dan port dari environment variable (default 5000)
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 2 --threads 4 app:app"]
