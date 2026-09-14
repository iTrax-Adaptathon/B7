# Adaptive Fitness Coach

> **"Your workout adapts to you."**

Track your performance, tell us how you feel, and get a workout plan that continuously adapts to your progress, recovery, and equipment access.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Architecture & The Adaptive Cycle](#core-architecture--the-adaptive-cycle)
3. [Key Features](#key-features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Adaptive Engine Mathematical Formulation](#adaptive-engine-mathematical-formulation)
7. [Intelligent Equipment Filtering Rules](#intelligent-equipment-filtering-rules)
8. [Configurable Weight & Bodyweight Progression](#configurable-weight--bodyweight-progression)
9. [Database Models & Relationships](#database-models--relationships)
10. [REST API Documentation](#rest-api-documentation)
11. [Installation & Setup](#installation--setup)
12. [Running Tests](#running-tests)
13. [Safety Disclaimer](#safety-disclaimer)

---

## 1. Project Overview

Fixed workout programs do not adapt when a user's actual performance, effort, energy, or recovery changes. **Adaptive Fitness Coach** solves this problem by using a continuous multi-signal feedback loop:

```
USER PROFILE
    ↓
PREFERENCES + EQUIPMENT
    ↓
PERSONALIZED WORKOUT
    ↓
ACTUAL PERFORMANCE
    ↓
DIFFICULTY + ENERGY + RECOVERY
    ↓
ADAPTIVE ENGINE
    ↓
PROGRESS / HOLD / BACK OFF
    ↓
NEXT PERSONALIZED WORKOUT
```

---

## 2. Core Architecture & The Adaptive Cycle

The frontend and backend are completely decoupled. The React application communicates exclusively with Django through authenticated REST APIs using JSON Web Tokens (JWT).

### End-to-End Cycle:
1. **Landing & Authentication**: User registers or logs in with secure JWT access and refresh tokens.
2. **Multi-Step Onboarding**: Guided 6-step setup configuring Profile, Goals, Focus areas, Equipment, Schedule, and Progression methods.
3. **Smart Generation**: The backend filters exercises by available equipment and generates a personalized routine.
4. **Execution & Logging**: Real-time workout execution with individual set completions, actual weights, reps, hold durations, and RPE ratings.
5. **Post-Workout Calibration**: User rates Perceived Difficulty (1–5), Energy (1–5), and Recovery Readiness (1–5).
6. **Multi-Signal Evaluation**: The engine analyzes rolling history (last 3–5 sessions), computes an **Adaptation Score (0–100)**, applies safety overrides, and assigns **PROGRESS**, **HOLD**, or **BACK OFF**.
7. **Immediate Next Plan Adaptation**: The next session's target weights, reps, and sets are immediately calibrated and presented with a transparent, data-driven narrative explanation.

---

## 3. Key Features

- **JWT Authentication & User Data Isolation**: Full token refresh cycle, protected routes, and strict database ownership checks ensuring User A can never access User B's data.
- **6-Step Onboarding Wizard**: Step indicator, bidirectional navigation, and comprehensive preference capture.
- **Strict Backend Equipment Filtering**: Zero chance of generating exercises with missing equipment (e.g. No Equipment $\rightarrow$ only bodyweight; Dumbbells $\rightarrow$ dumbbells + bodyweight, no barbells/machines).
- **Configurable Progression**: Fixed (+1.25kg, +2.5kg, +5kg) or Percentage (+2.5%, +5%, +7.5%) with smart 0.5kg rounding.
- **Adaptive Progression Engine**: Weighted 5-factor scoring model with safety overrides and automated narrative explanation builder.
- **Interactive Workout Logger**: Set-by-set checklist, input overrides, live timer, and mobile touch-friendly ergonomics.
- **Immediate Post-Submission Result**: Instant feedback modal displaying score gauge, component breakdown, explanation, and next target preview.
- **Analytics Dashboard**: Weekly workout target tracking, average exertion, recovery stats, equipment badges, and live training status badge.
- **History & Filtering**: Filter logged sessions by date range, exercise, workout name, and adaptation decision.
- **Visual Progress Charts**: Interactive SVG graphs for weight progression, RPE vs Recovery trends, and decision distribution.
- **User Profile & Settings**: Dynamic updates to goals, equipment, frequency, duration, and progression settings that immediately reflect in upcoming workouts.
- **Rich Seed Data**: Built-in library of beginner-to-advanced exercises covering Bodyweight, Dumbbells, Barbells, Bands, Machines, and Cardio.

---

## 4. Tech Stack

### Frontend:
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with automatic JWT interceptors and 401 token refresh queue
- **Icons**: Lucide React
- **Styling**: Vanilla CSS design system with dark glassmorphism, responsive tokens, and micro-animations

### Backend:
- **Language**: Python 3.10+
- **Framework**: Django 4.2+
- **API**: Django REST Framework (DRF)
- **Authentication**: `djangorestframework-simplejwt`
- **CORS**: `django-cors-headers`
- **Database**: SQLite (ORM persistence)

---

## 5. Project Structure

```
adaptive-fitness-coach/
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── src/
│       ├── api/
│       │   ├── client.js              # Centralized Axios client with JWT refresh interceptors
│       │   └── endpoints.js           # Auth, Profile, Workouts, Logs, Analytics APIs
│       ├── context/
│       │   └── AuthContext.jsx        # Auth state management & token lifecycle
│       ├── components/
│       │   ├── common/                # Navbar, Sidebar, ProtectedRoute, LoadingSpinner, EmptyState, StatCard, StatusBadge, Toast
│       │   ├── workout/               # ExerciseCard, SetLogger, PostWorkoutModal, AdaptationResultModal
│       │   └── charts/                # ProgressCharts (SVG charts for weight, RPE, recovery)
│       ├── pages/
│       │   ├── LandingPage.jsx        # Hero, visual cycle, feature highlights
│       │   ├── LoginPage.jsx          # Login form
│       │   ├── RegisterPage.jsx       # Registration form
│       │   ├── OnboardingPage.jsx     # 6-step guided wizard
│       │   ├── DashboardPage.jsx      # Greeting, Next workout, Status, Stats
│       │   ├── WorkoutPage.jsx        # Execution and set logging interface
│       │   ├── HistoryPage.jsx        # Filterable workout logs & performance breakdown
│       │   ├── ProgressPage.jsx       # Long-term trend analytics
│       │   └── ProfilePage.jsx        # User preferences and equipment editor
│       ├── styles/
│       │   └── index.css              # Custom fitness dark-mode CSS tokens & utilities
│       ├── App.jsx                    # Routing & protected routes configuration
│       └── main.jsx
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py                # DRF, SimpleJWT, CORS, SQLite setup
│   │   ├── urls.py                    # Top-level API routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── fitness/
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py                  # Profile, Exercise, WorkoutPlan, WorkoutExercise, WorkoutSession, ExerciseLog, AdaptationResult
│       ├── serializers.py             # DRF serializers with strict range & validation rules
│       ├── views.py                   # API endpoints with user data isolation
│       ├── urls.py                    # Fitness API routes
│       ├── engine/
│       │   ├── __init__.py
│       │   ├── adaptation.py          # Multi-signal rolling history engine
│       │   ├── progression.py         # Weight & bodyweight progression calculators
│       │   └── generator.py           # Strict equipment filtering & routine generator
│       ├── management/
│       │   └── commands/
│       │       └── seed_data.py       # Exercise database seeder
│       ├── migrations/
│       │   └── 0001_initial.py
│       └── tests/
│           ├── test_auth.py           # Registration, login, token refresh
│           ├── test_profile.py        # Profile CRUD & bounds validation
│           ├── test_equipment.py      # Strict backend equipment filtering rules
│           ├── test_progression.py    # Fixed/Percentage weight jumps & bodyweight scaling
│           ├── test_adaptive.py       # Scoring, decision thresholds, safety overrides
│           ├── test_validation.py     # Negative weight/rep & invalid RPE/difficulty rejection
│           └── test_isolation.py      # Cross-user data isolation verification
│
└── README.md
```

---

## 6. Adaptive Engine Mathematical Formulation

The engine analyzes the rolling history of the most recent **3–5 workout sessions** to compute a normalized **Adaptation Score (0–100)**:

$$\text{Adaptation Score} = 0.30 \cdot P + 0.20 \cdot C_{\text{reps}} + 0.20 \cdot S_{\text{rpe/diff}} + 0.20 \cdot R_{\text{recov/energy}} + 0.10 \cdot K_{\text{consistency}}$$

### Component Definitions:
1. **Performance Trend ($P$, 30%)**:
   - Compares actual volume load (weight $\times$ reps $\times$ sets) against planned targets across exercises.
   - $\text{Score} = 80.0 + (\text{Average Ratio} - 1.0) \times 120.0$ (clamped to $[0, 100]$).
2. **Rep & Set Completion ($C_{\text{reps}}$, 20%)**:
   - Ratio of successfully completed target sets/reps without early failure:
   - $C_{\text{reps}} = \frac{\text{Completed Sets}}{\text{Planned Sets}} \times 100.0$.
3. **RPE & Exertion Strain ($S_{\text{rpe/diff}}$, 20%)**:
   - Inversely mapped: Moderate RPE (6–7) or Difficulty 3 indicates optimal adaptation capacity ($75–85$ pts); Very Hard (5/5) or RPE 10 indicates low headroom ($20–35$ pts); Very Easy (1–2) yields $90–95$ pts.
4. **Recovery & Physical Readiness ($R_{\text{recov/energy}}$, 20%)**:
   - Normalized average of subjective Recovery Rating ($1–5 \rightarrow 20–100$) and Energy Level ($1–5 \rightarrow 20–100$).
5. **Consistency ($K_{\text{consistency}}$, 10%)**:
   - Frequency of completed sessions in the past 14 days relative to the user's targeted `days_per_week`.

### Decision Thresholds:
- **$\text{Score} \ge 70.0 \rightarrow$ `PROGRESS`**: Evidence indicates the user is handling the workload well; increase load by user's progression setting or increase bodyweight reps/duration.
- **$45.0 \le \text{Score} < 70.0 \rightarrow$ `HOLD`**: Performance is stable; maintain current working weight and volume to consolidate strength.
- **$\text{Score} < 45.0 \rightarrow$ `BACK OFF`**: Evidence of fatigue or missed reps; reduce load conservatively by 5–10% or reduce target volume.

### Conservative Safety Overrides:
- If perceived difficulty is **5 (Very Hard)** AND recovery is **$\le 2$ (Poor / Very Poor)**, progression is strictly blocked and overridden to **`HOLD`** or **`BACK OFF`**.
- If two consecutive sessions exhibit extreme fatigue (difficulty 5 + recovery $\le 2$), the engine automatically enforces a restorative **`BACK OFF`** deload.

---

## 7. Intelligent Equipment Filtering Rules

Equipment filtering is strictly enforced **at the database query layer** on the backend:
- If `gym_access == True`: User can access all equipment categories (Barbells, Dumbbells, Cables, Machines, Cardio).
- If `gym_access == False`:
  - If user selects **`No Equipment`**: Only exercises with `equipment_required == []` or `is_bodyweight == True` are fetched (e.g. Push-ups, Squats, Lunges, Planks). Barbells, Dumbbells, and Machines are **never generated**.
  - If user selects **`Dumbbells`** (without Bench): Dumbbell Rows, Shoulder Presses, and Bicep Curls are allowed; Dumbbell Bench Press is excluded because it requires a bench; Barbell and Machine exercises are strictly excluded.
  - If user selects **`Dumbbells + Bench`**: Dumbbell Bench Press is unlocked; Barbell Bench Press remains excluded.

---

## 8. Configurable Weight & Bodyweight Progression

### Weighted Progression Formula:
- **Fixed Progression**:
  $$\text{Next Weight} = \text{Current Weight} + \text{Increment} \quad (\text{for } +1.25\text{kg}, +2.5\text{kg}, +5.0\text{kg})$$
- **Percentage Progression**:
  $$\text{Next Weight} = \text{Current Weight} \times \left(1 + \frac{\text{Percentage}}{100}\right) \quad (\text{for } +2.5\%, +5.0\%, +7.5\%)$$
- Results are rounded to the nearest practical $0.5\text{kg}$ increment and never drop below $0.0\text{kg}$.

### Bodyweight Progression Formula:
- Pure bodyweight exercises (Push-ups, Lunges, Planks) **never have arbitrary external weight added**.
- Progression adjusts:
  - Repetitions: $+2$ reps when progressing (e.g. $3 \times 10 \rightarrow 3 \times 12$).
  - Hold Duration: $+5$ seconds for static holds (e.g. Plank $30\text{s} \rightarrow 35\text{s}$).
  - Volume Sets: Adds $+1$ set when rep threshold exceeds 18 reps.

---

## 9. Database Models & Relationships

```
User (Django Auth)
 └── Profile (OneToOne)
      ├── Name, Age, Height, Weight, Experience
      ├── Fitness Goal, Focus Areas (JSON), Equipment (JSON), Gym Access
      ├── Schedule & Duration Preferences
      └── Progression Method & Increment

User
 ├── WorkoutPlan (1:M)
 │    └── WorkoutExercise (1:M) ── Exercise
 │
 ├── WorkoutSession (1:M)
 │    ├── Difficulty (1-5), Energy (1-5), Recovery (1-5), Notes
 │    └── ExerciseLog (1:M) ── Exercise
 │
 └── AdaptationResult (1:M)
      ├── Adaptation Score (0-100), Decision (PROGRESS / HOLD / BACK_OFF)
      ├── 5 Component Breakdown Scores
      └── Personalized Narrative Explanation
```

---

## 10. REST API Documentation

| Endpoint | Method | Permission | Description |
|---|---|---|---|
| `/api/auth/register/` | POST | AllowAny | Register new user & issue JWT tokens |
| `/api/auth/login/` | POST | AllowAny | Log in with credentials & return tokens |
| `/api/auth/refresh/` | POST | AllowAny | Refresh access token using refresh token |
| `/api/profile/` | GET, PATCH | IsAuthenticated | View or update user profile & settings |
| `/api/exercises/` | GET | IsAuthenticated | List exercises (supports `?compatible_only=true`) |
| `/api/workouts/` | GET, POST | IsAuthenticated | List workout plans or generate a new plan |
| `/api/workouts/<id>/` | GET | IsAuthenticated | Retrieve detailed workout plan by ID |
| `/api/next-workout/` | GET | IsAuthenticated | Get currently active adapted workout plan |
| `/api/logs/` | GET, POST | IsAuthenticated | Log workout session, calculate adaptation, & regenerate next plan |
| `/api/adaptation/latest/` | GET | IsAuthenticated | Get latest adaptation evaluation score & explanation |
| `/api/adaptation/calculate/`| POST | IsAuthenticated | On-demand engine recalculation |
| `/api/history/` | GET | IsAuthenticated | Filter workout history by exercise, date, or decision |
| `/api/progress/` | GET | IsAuthenticated | Aggregate analytics for weight trends, RPE, and recovery |
| `/api/dashboard/stats/` | GET | IsAuthenticated | Live dashboard summary cards & status |

---

## 11. Installation & Setup

### Backend Setup:
```bash
# 1. Navigate to backend
cd adaptive-fitness-coach/backend

# 2. Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run database migrations
python manage.py migrate

# 5. Seed initial exercise database
python manage.py seed_data

# 6. Start the development server
python manage.py runserver 8000
```

### Frontend Setup:
```bash
# 1. Navigate to frontend
cd adaptive-fitness-coach/frontend

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 12. Running Tests

The backend includes comprehensive test coverage for authentication, equipment filtering, weight progression, multi-signal adaptive scoring, safety overrides, input validation, and user data isolation:

```bash
cd adaptive-fitness-coach/backend
python manage.py test fitness
```

---

## 13. Safety Disclaimer

> **Notice**: This application provides general fitness guidance and algorithmic training progression for informational purposes only, not medical advice. Always consult a certified healthcare professional before starting any vigorous physical exercise. Stop exercising immediately if you experience pain, dizziness, or discomfort.
