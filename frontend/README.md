# React + Vite

# News Publishing Platform (Django + React)

## Overview

This project is a **News Publishing Platform** built using **Django** (Backend) and **React** (Frontend). The platform allows users to read news articles, comment on them, like/dislike them, and manage their profiles. Admins can create, edit, and delete articles. Every user has a personal profile with details such as contact information, bio, and profile picture.

---

## Features

### Backend (Django)

-   **User Profiles**: Personal user profiles with editable fields like phone number, country, city, bio, and profile picture.
-   **Articles**: Users can read and comment on news articles, while admins can create, edit, and delete articles.
-   **Comments**: Commenting system with threaded replies.
-   **Likes**: Users can like or dislike articles.
-   **Authentication**: Secure user authentication with JWT and token-based sessions.
-   **Admin Controls**: Admins can manage articles and users with full CRUD operations.

### Frontend (React)

-   **Responsive UI**: User interface built with **React** and styled with **TailwindCSS** for responsiveness.
-   **Dynamic Content**: Fetch articles and profiles dynamically from the backend using **Axios** for API calls.
-   **User Authentication**: Login, registration, and session management with JWT authentication.
-   **Profile Management**: Users can view and update their profile information directly in the frontend.
-   **Article Interaction**: Users can comment on articles, like/dislike them, and view article details.

---

## Technology Stack

### Backend

-   **Django** 5.1.6
-   **Django REST Framework** 3.15.2
-   **JWT Authentication** (`djangorestframework_simplejwt`)
-   **Database**: PostgreSQL (via `psycopg2`)

### Frontend

-   **React** (v18)
-   **Axios** for API requests
-   **TailwindCSS** for responsive styling
-   **React Router** for routing between different views
-   **React Redux** (optional, for state management)

---

## Installation

### Backend Setup (Django)

#### Prerequisites

Ensure you have the following installed:

-   Python 3.8 or higher
-   PostgreSQL (or any other compatible DB)
-   `pip` for installing Python packages

#### Steps

1. **Clone the repository**:

    ```bash
    git clone <your-repository-url>
    cd <project-folder>
    ```
