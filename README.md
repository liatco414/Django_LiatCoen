## Overview

This project is a News Publishing Platform built using Django (Backend) and React (Frontend). The platform allows users to read news articles, comment on them, like/dislike them, and manage their profiles. Admins can create, edit, and delete articles. Every user has a personal profile with details such as contact information, bio, and profile picture.

## Features

Backend (Django)
User Profiles: Personal user profiles with editable fields like phone number, country, city, bio, and profile picture.

_Articles_: Users can read and comment on news articles, while admins can create, edit, and delete articles.

_Comments_: Commenting system with threaded replies.

_Authentication_: Secure user authentication with JWT and token-based sessions.

_Admin Controls_: Admins can manage articles and users with full CRUD operations, Only admins can create or edit articles. Additionally, they can move articles to the archive or save them as drafts to control their visibility on the platform.

## Frontend (React)

_Responsive UI_: User interface built with React and styled with TailwindCSS for responsiveness.

_Dynamic Content_: Fetch articles and profiles dynamically from the backend using Axios for API calls.

_User Authentication_: Login, registration, and session management with JWT authentication.

_Profile Management_: Users can view and update their profile information directly in the frontend.

_Article Interaction_: Users can comment on articles.

## Technology Stack

Backend
Django 5.1.6

Django REST Framework 3.15.2

JWT Authentication (djangorestframework_simplejwt)

_Database_: PostgreSQL (via psycopg2)

## Frontend

React (v18)

Axios for API requests

TailwindCSS for responsive styling

React Router for routing between different views

React Redux (optional, for state management)

Installation
Backend Setup (Django)
Prerequisites
Ensure you have the following installed:

Python 3.8 or higher

PostgreSQL (or any other compatible DB)

pip for installing Python packages

Steps
Clone the repository:

git clone <your-repository-url>
cd <project-folder>
Set up a virtual environment:

To create an isolated environment for the project:

python3 -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
Install the required dependencies:

pip install -r requirements.txt
Create a PostgreSQL database:

Log into PostgreSQL and create a new database:

psql
CREATE DATABASE news_platform;
CREATE USER your_username WITH PASSWORD 'your_password';
ALTER ROLE your_username SET client_encoding TO 'utf8';
ALTER ROLE your_username SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE news_platform TO your_username;
\q
Update the DATABASES settings in your settings.py file to match your PostgreSQL credentials.

Run migrations to set up the database schema:

python manage.py migrate
Create a superuser (for admin access):

python manage.py createsuperuser
Follow the prompts to set up the superuser.

## Run the server:

python manage.py runserver
The backend should now be running on http://localhost:8000.

Frontend Setup (React)
Prerequisites
Ensure you have the following installed:

Node.js (v16 or higher)

npm (or yarn)

Steps
Navigate to the frontend directory:
_cd frontend_
Install the required dependencies:

```bash
npm install
```

Set up environment variables:

Create a .env file in the frontend directory and add the following:
REACT_APP_API_URL=http://localhost:8000

Run the development server:

```bash
npm run dev
```

The frontend should now be running on http://localhost:5173.

How to Seed the Database (Optional)
If you'd like to add some initial articles or users to the database, you can create a custom management command to seed the database.

Create a management command:

In the backend, create a directory called management/commands inside one of your apps (e.g., articles), and inside it create a file called seed_data.py with the following content:

from django.core.management.base import BaseCommand
from articles.models import Article, User

class Command(BaseCommand):
def handle(self, \*args, \*\*kwargs): # Example to add a user
user = User.objects.create(username="admin", email="admin@example.com", password="password") # Example to add an article
Article.objects.create(title="Sample Article", content="This is a sample article.", author=user)
self.stdout.write(self.style.SUCCESS("Successfully seeded the database"))

_Run the command to seed the database_:

```bash
python manage.py seed_data
```

## Conclusion

After setting up both the backend and frontend, you should have a fully functioning News Publishing Platform running locally. You can interact with the system, create and manage articles, comment on them, and view user profiles.

If you face any issues, please consult the official documentation for Django and React.
