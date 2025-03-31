#!/bin/bash
# EC2 Instance Setup Script for Donshack Application
# This script will set up an EC2 instance with the necessary software and configurations
# to run the Donshack application backend and serve it through Nginx.

# Exit immediately if any command fails
set -e

echo "=== Starting EC2 instance setup ==="

# Update and upgrade system packages
echo "=== Updating system packages ==="
sudo apt update -y
sudo apt upgrade -y

# Install required packages
echo "=== Installing required packages ==="
sudo apt install -y \
    python3-pip \
    python3-dev \
    nginx \
    postgresql \
    postgresql-contrib \
    libpq-dev \
    git \
    docker.io \
    docker-compose

# Enable and start Docker
echo "=== Setting up Docker ==="
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $(whoami)

# Create application directory
echo "=== Creating application directory ==="
mkdir -p /home/ubuntu/donshack
cd /home/ubuntu/donshack

# Clone application repository if needed
# Uncomment and modify the following lines if you want to clone from a Git repository
# echo "=== Cloning application repository ==="
# git clone https://github.com/yourusername/donshack-spring-2024.git .

# Set up Nginx
echo "=== Setting up Nginx ==="
sudo tee /etc/nginx/sites-available/donshack <<EOF
server {
    listen 80;
    server_name your-ec2-instance-domain.amazonaws.com;  # REPLACE with your actual domain or EC2 public DNS

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Larger upload size for media files
    client_max_body_size 20M;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/donshack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Create PostgreSQL user and database
echo "=== Setting up PostgreSQL ==="
sudo -u postgres psql -c "CREATE USER donshack WITH PASSWORD 'change_this_password';"
sudo -u postgres psql -c "CREATE DATABASE donshack WITH OWNER donshack;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE donshack TO donshack;"

# Create Docker Compose file
echo "=== Creating Docker Compose configuration ==="
tee docker-compose.yml <<EOF
version: '3.8'

services:
  web:
    build: ./backend
    restart: always
    env_file:
      - .env
    command: gunicorn dons_hack.wsgi:application --bind 0.0.0.0:8000 --workers 3
    volumes:
      - static_volume:/app/staticfiles
    ports:
      - "8000:8000"
    depends_on:
      - db
  
  db:
    image: postgres:13
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - .env
    environment:
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_DB=\${POSTGRES_DB}

volumes:
  postgres_data:
  static_volume:
EOF

# Create .env file template
echo "=== Creating environment file template ==="
tee .env.example <<EOF
# Database Settings
POSTGRES_USER=donshack
POSTGRES_PASSWORD=change_this_password
POSTGRES_DB=donshack
DATABASE_URL=postgres://donshack:change_this_password@db:5432/donshack

# AWS S3 Bucket Information (no credentials needed with IAM role)
AWS_STORAGE_BUCKET_NAME=donshack-project-media-spring-2025
AWS_S3_REGION_NAME=us-west-1

# Django Settings
SECRET_KEY=generate_a_strong_secret_key_here
DEBUG=False

# Frontend domain for CORS
FRONTEND_DOMAIN=https://your-frontend-domain.com
EOF

echo "=== EC2 setup completed ==="
echo ""
echo "Next steps:"
echo "1. Copy your backend code to /home/ubuntu/donshack/backend/"
echo "2. Copy .env.example to .env and update with your actual values"
echo "3. Update the Nginx configuration with your actual domain"
echo "4. Run 'docker-compose up -d' to start the application"
echo ""
echo "Important: Don't forget to assign an IAM role to this EC2 instance"
echo "with permissions to access your S3 bucket."
