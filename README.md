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



Sprint 2


Fitness Tracking & Wellness Platform

An integrated fitness and wellness platform for tracking workouts, monitoring exercise performance, analyzing posture, managing nutrition, and connecting with a fitness community.

The application extends a basic fitness tracking system with personalized fitness information, exercise monitoring, nutrition analysis, progress logging, and community features.

Overview

The platform is designed around the idea of helping users not only record their workouts, but also understand their performance and progress over time.

Users can create a fitness profile, track their workouts, receive posture feedback while exercising, analyze and log meals, monitor their progress, and interact with other users.

The main workflow is:

User Profile → Workout → Performance → Nutrition → Progress → Community

Features
1. Workout Tracking

Users can record and monitor their workout activity.

Select exercises
Track repetitions and sets
Record completed workouts
Provide feedback on exercise difficulty and fatigue
Maintain workout history
Monitor performance over time
Adjust exercise targets based on previous performance
2. Exercise Posture Detection

The application uses computer vision to monitor exercise form.

During an exercise, the system:

Captures the user's movement through the camera.
Detects body landmarks.
Calculates relevant joint angles.
Compares the user's posture with a reference posture.
Identifies incorrect positioning.
Provides corrective feedback.
Records posture performance.

For example:

Lower your hips.

or:

Good posture. Keep going.

Reference posture measurements can also be stored and used when evaluating subsequent exercise sessions.

3. Meal Recommendation

Users can receive meal suggestions based on their fitness requirements.

Recommendations can take into account:

Fitness goal
Calorie requirements
Dietary preference
Nutritional requirements

The recommendations are intended to help users choose meals that fit their overall fitness goals.

4. Meal Analyzer

Users can upload an image of a meal and provide an approximate quantity.

The application provides an estimated nutritional analysis, including:

Calories
Protein
Carbohydrates
Fats

The analyzed meal can then be added to the user's nutrition log.

Nutritional values are estimates. Actual values can vary depending on ingredients, preparation methods, portion size, and other factors.

5. Fitness Profile

During onboarding, users can enter information such as:

Age
Height
Weight
Fitness goal
Dietary preference

The application uses this information to establish a basic fitness profile and calculate metrics such as BMI.

6. Progress Tracking

Workout and nutrition activity is stored in logs so users can monitor their progress.

The system can track:

Workouts completed
Repetitions and sets
Exercise performance
Posture scores
Calories consumed
Protein, carbohydrates, and fats
Daily and weekly activity
Progress toward fitness goals
7. Adaptive Exercise Tracking

Historical performance and user feedback can be used to adjust exercise targets.

For example, if a user consistently completes an exercise with good posture and reports that the exercise is easy, the system can recommend increasing the target.

If the user repeatedly struggles with an exercise or experiences high fatigue, the current target can be maintained or adjusted.

This creates a continuous feedback loop:

Perform → Measure → Log → Analyze → Adapt

8. Community

The application includes a community section where users can interact and share their fitness progress.

Users can:

Share workout achievements
Share progress
Discuss fitness-related topics
Encourage other users
Interact with community posts

The community is intended to provide motivation and social engagement alongside individual fitness tracking.
