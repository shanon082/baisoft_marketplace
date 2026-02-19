# Baisoft Marketplace Take-Home

## What I implemented (which parts)
This submission implements:

- Frontend (Next.js)
- Backend (Django + DRF)
- AI Chatbot: not implemented (intentionally excluded)

### Implemented features
- JWT authentication (`/api/token/`, `/api/token/refresh/`)
- Custom user model with business membership and roles:
  - `admin`
  - `editor`
  - `approver`
  - `viewer`
- Business-scoped users and products
- User management API for business admins/superusers:
  - list/create users
  - retrieve/update/delete users
- Product management:
  - create/edit/delete products (role-restricted)
  - approve product endpoint
  - status workflow (`draft`, `pending_approval`, `approved`)
  - public listing shows approved products only
- Product image upload (file upload, not URL)
- Responsive frontend pages:
  - home dashboard with approved products + user recent activity
  - products
  - users
  - public marketplace
  - login

## Setup instructions

### Prerequisites
- Python 3.13+ (or compatible with Django 6 setup)
- Node.js 18+ and npm

### 1. Clone repository
```bash
git clone "https://github.com/shanon082/baisoft_marketplace.git"
cd baisoft-marketplace
```

### 2. Backend setup
```bash
cd backend/marketplace
python -m venv ../venv
../venv/Scripts/activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs on `http://localhost:8000`.

### 3. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### 4. Environment notes
- Frontend API base URL defaults to:
  - `http://localhost:8000/api`
- Optional `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Tech decisions and assumptions
- DRF + SimpleJWT chosen for clear API-first auth and role-based permissions.
- Custom `User` model used to attach:
  - `business`
  - `role`
- Permission design is role-based and method-aware:
  - `admin`: full internal access
  - `editor`: create/edit/delete products
  - `approver`: create/edit/approve products
  - `viewer`: read-only (approved items only)
- Products are always business-scoped (except superuser).
- Product edits reset status to `pending_approval` to preserve review workflow.
- Image upload implemented using multipart form data and stored locally in `media/`.

## Any known limitations
- AI chatbot section is not implemented.
- Automated tests are minimal/not comprehensive.
- No Docker setup included.
- Production hardening is not fully covered (dev settings currently enabled).
- Image field uses `FileField` with mime-type validation (not `ImageField` + Pillow).
- Pagination/filtering is basic and can be expanded.

## Anything more to communicate
- Focus was on clean permission boundaries and practical UX for role-based workflows.
- UI is responsive and role-aware (actions hidden/disabled based on role).
- Public users only see approved products.
- If needed, I can add:
  - full API test coverage
  - stricter audit/activity logs
  - deployment configuration

## How to run the project

### Start backend
```bash
cd backend/marketplace
../venv/Scripts/activate
python manage.py runserver
```

### Start frontend
```bash
cd frontend
npm run dev
```

### Access
- App: `http://localhost:3000`
- API root paths:
  - `/api/token/`
  - `/api/users/`
  - `/api/businesses/`
  - `/api/products/`
  - `/api/products/public/`

