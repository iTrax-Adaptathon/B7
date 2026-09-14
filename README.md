# FITTO — Adaptive Fitness Coach

> **Your body speaks. FITTO listens.**  
> *Personalized workouts that adapt to you, session by session.*

Full-stack adaptive fitness web application built with **React + Vite** and **Django + Django REST Framework**, alongside an **instant standalone interactive app (`open_app.html`)**.

---

## ⚡ Instant Launch (Zero Setup)

Double-click `open_app.html` or `start_all.bat` to launch the complete interactive FITTO experience instantly in your browser:
- Direct file: `open_app.html`
- Local web server: `python -m http.server 3000` ➔ `http://localhost:3000/open_app.html`

---

## 🚀 Full-Stack Setup (React + Django)

For full architectural details, algorithm documentation, and tests, see [adaptive-fitness-coach/README.md](./adaptive-fitness-coach/README.md).

### 1. Backend (Django REST Framework):
```bash
cd adaptive-fitness-coach/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```

### 2. Frontend (React + Vite):
```bash
cd adaptive-fitness-coach/frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

---

## 🧠 Key Features
- **Adaptive Decision Engine**: Automatically calculates movement adjustments (`PROGRESS`, `HOLD`, `BACK OFF`) using completion rates, RPE scores, and recovery readiness.
- **Dynamic Workout Generator**: Tailors exercises, reps, sets, and suggested load based on profile goals and available equipment.
- **6-Step Onboarding Survey**: Captures user goals, focus areas, gym access, frequency, and progression strategies.
- **Interactive Workout Execution**: Live set logging, rest timer, RPE logging, and post-session calibration.
- **Analytics & History**: Visual progress charts and detailed adaptation timelines.
- **User Authentication & Registration**: Account creation, login, and profile persistence.