# Django Backend 

## Prerequisites for Backend
- Python 3.x installed on your system
- Basic knowledge of Python
- Download [Postman](https://www.postman.com/downloads/)
- Your own `S3 bucket`
- Your own `.env` file that contains your `AWS S3 secrets`

### Create Virtual Environment
WINDOWS: env\Scripts\activate
LINUX/MacOS: source env/bin/activate

### Installing Dependencies
1.   `cd backend`
2. `pip install -r requirements.txt`

### Starting the server for local development
1. `python manage.py makemigrations`
2. `python manage.py migrate`
3. `python manage.py runserver`
4. Go to `localhost:8000` and you will be greeted with the `DRF` for an interactive experience with the API
