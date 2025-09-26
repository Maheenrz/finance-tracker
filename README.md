# Finance Tracker

A personal finance tracker built with Django REST Framework and React. Users can authenticate via Google OAuth and manage their income and expense transactions through an interactive dashboard.

## Features

- Google OAuth 2.0 Authentication
- Add, edit, delete transactions
- Categorize transactions as INCOME or EXPENSE
- View total income, expenses, and net balance
- Filter transactions by type
- Responsive, styled UI using Tailwind CSS

> ⚠️ Note: This is a simulation-based app. No real ATM, debit card, or bank account information is used or required. All financial data is user-provided for demonstration and practice purposes only.

## Tech Stack

- **Frontend**: React, Tailwind CSS, FontAwesome
- **Backend**: Django, Django REST Framework
- **Auth**: dj-rest-auth, allauth, Google OAuth2

## API Endpoints
POST /api/auth/google/ – Authenticate with Google
GET /api/transactions/ – List transactions
POST /api/transactions/ – Create new transaction
PUT /api/transactions/:id/ – Update a transaction
DELETE /api/transactions/:id/ – Delete a transaction

## Setup Instructions

### Backend (Django)

1. Clone the repository and create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate
2. Install dependencies:
   ```bash
   pip install -r requirements.txt

3. Run migrations:
   ```bash
   python manage.py migrate

4. Create a .env or configure Google credentials in settings.py
5. Start the server:
   ```bash
   python manage.py runserver

## Frontend (React)
1. Install dependencies:
   ```bash
   npm install

2. Add your Google Client ID to a .env file:
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
3. Start the development server:
   ```bash
    npm run dev



