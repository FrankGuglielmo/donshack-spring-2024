#!/bin/bash
set -e

# apply all migrations to the database if necessary
echo "Applying database migrations..."
python manage.py migrate

# start Django app
echo "Starting Django app..."
python manage.py runserver 0.0.0.0:8000
