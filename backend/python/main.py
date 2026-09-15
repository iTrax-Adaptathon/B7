import os
import uuid
from datetime import datetime
from typing import List, Optional, Any, Dict
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: SUPABASE_URL or SUPABASE_KEY missing in .env")
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Pydantic Models ---

class Feedback(BaseModel):
    difficulty: float
    energy: float
    recovery: float
    notes: Optional[str] = ""

class ExerciseTarget(BaseModel):
    sets: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None
    durationSec: Optional[int] = None

class SessionExercise(BaseModel):
    id: str
    name: str
    type: str
    plannedSets: Optional[int] = None
    plannedReps: Optional[int] = None
    plannedWeight: Optional[float] = None
    plannedDurationSec: Optional[int] = None
    actualSets: Optional[int] = None
    actualReps: Optional[int] = None
    actualWeight: Optional[float] = None
    actualDurationSec: Optional[int] = None

class Session(BaseModel):
    id: str
    exercises: List[SessionExercise]
    feedback: Feedback
    date: Optional[str] = None
    focus: Optional[str] = None

class Profile(BaseModel):
    experience: str
    duration: Optional[str] = None
    # Add other fields as needed

class AdaptRequest(BaseModel):
    user_id: str
    session: Session
    profile: Profile

# --- Helper Functions (ported from JS) ---

def uid():
    return uuid.uuid4().hex[:8]

def ratio_for(ex: SessionExercise) -> float:
    set_ratio = 1.0
    if ex.plannedSets:
        actual_sets = ex.actualSets if ex.actualSets is not None else 0
        set_ratio = min(actual_sets / ex.plannedSets, 1.4)
    
    rep_ratio = 1.0
    if ex.type == "reps" and ex.plannedReps:
        actual_reps = ex.actualReps if ex.actualReps is not None else ex.plannedReps
        rep_ratio = min(actual_reps / ex.plannedReps, 1.4)
    elif ex.type == "duration" and ex.plannedDurationSec:
        actual_dur = ex.actualDurationSec if ex.actualDurationSec is not None else ex.plannedDurationSec
        rep_ratio = min(actual_dur / ex.plannedDurationSec, 1.4)
        
    return (set_ratio * 0.4) + (rep_ratio * 0.6)

def decide_for(ratio: float, feedback: Feedback) -> str:
    diff = feedback.difficulty
    energy = feedback.energy
    recov = feedback.recovery
    if diff >= 4.5 or recov <= 1.5 or ratio < 0.8:
        return "BACK_OFF"
    if diff <= 2.5 and ratio >= 1.0 and energy >= 3.5 and recov >= 3.5:
        return "PROGRESS"
    return "HOLD"

def reason_for(decision: str, ratio: float, feedback: Feedback) -> str:
    diff = feedback.difficulty
    recov = feedback.recovery
    if decision == "BACK_OFF":
        if recov <= 1.5:
            return "Your recovery felt low, so we're easing the load to help your body catch up."
        if ratio < 0.8:
            return "You came in under target this session, so we're scaling back to a level you can hit consistently."
        return "That session felt hard, so we're dialing back the intensity a bit before building again."
    if decision == "PROGRESS":
        return "You hit every target with energy and recovery to spare, so we're raising the bar."
    
    if ratio >= 1.0 and diff >= 3.5:
        return "You hit your targets but it took real effort, so we're holding steady here."
    return "You're performing consistently at this level, so we're keeping things steady before the next push."

def nudge(value: float, factor: float, min_val: float, step: float = 0) -> float:
    if value is None:
        return None
    raw = value * factor
    rounded = round(raw / step) * step if step else round(raw)
    return max(min_val, rounded)

def compute_exercise_adaptations(session: Session) -> List[Dict[str, Any]]:
    results = []
    feedback = session.feedback
    for ex in session.exercises:
        ratio = ratio_for(ex)
        decision = decide_for(ratio, feedback)
        reason = reason_for(decision, ratio, feedback)
        
        new_sets = ex.plannedSets
        new_reps = ex.plannedReps
        new_weight = ex.plannedWeight
        new_dur = ex.plannedDurationSec
        
        if decision == "PROGRESS":
            if ex.type == "reps":
                if ex.plannedReps is not None:
                    new_reps = nudge(ex.plannedReps, 1.12, ex.plannedReps + 1, 1)
                    if new_reps > 20:
                        new_reps = 10
                        if new_sets is not None:
                            new_sets += 1
                
                if ex.actualWeight is not None:
                    new_weight = nudge(ex.actualWeight, 1.05, ex.actualWeight + 1, 2.5)
                elif ex.plannedWeight is not None:
                    new_weight = nudge(ex.plannedWeight, 1.05, ex.plannedWeight + 1, 2.5)
            else:
                if ex.plannedDurationSec is not None:
                    new_dur = nudge(ex.plannedDurationSec, 1.12, ex.plannedDurationSec + 5, 5)
        elif decision == "BACK_OFF":
            if ex.type == "reps":
                if ex.plannedReps is not None:
                    new_reps = nudge(ex.plannedReps, 0.85, 5, 1)
                
                if ex.actualWeight is not None:
                    new_weight = nudge(ex.actualWeight, 0.9, 2.5, 2.5)
                elif ex.plannedWeight is not None:
                    new_weight = nudge(ex.plannedWeight, 0.9, 2.5, 2.5)
                
                if ratio < 0.6 and ex.plannedSets is not None and ex.plannedSets > 2:
                    new_sets -= 1
            else:
                if ex.plannedDurationSec is not None:
                    new_dur = nudge(ex.plannedDurationSec, 0.85, 10, 5)
        else: # HOLD
            if ex.actualWeight is not None:
                new_weight = ex.actualWeight
                
        results.append({
            "id": ex.id,
            "name": ex.name,
            "type": ex.type,
            "decision": decision,
            "reason": reason,
            "previous": {
                "sets": ex.plannedSets,
                "reps": ex.plannedReps,
                "weight": ex.plannedWeight,
                "durationSec": ex.plannedDurationSec
            },
            "next": {
                "sets": new_sets,
                "reps": new_reps,
                "weight": new_weight,
                "durationSec": new_dur
            }
        })
    return results

# --- Endpoints ---

@app.get("/api/health")
def health():
    return {"ok": True, "service": "fitto-adapt-api"}

@app.post("/api/adapt")
async def adapt_workout(req: AdaptRequest):
    session = req.session
    feedback = session.feedback
    
    # 1. Compute per-exercise adaptations
    exercise_adaptations = compute_exercise_adaptations(session)
    
    # 2. Determine Overall Recommendation
    notes = feedback.notes.lower() if feedback.notes else ""
    back_off_count = sum(1 for e in exercise_adaptations if e["decision"] == "BACK_OFF")
    total_exercises = len(exercise_adaptations)
    
    # Simple history trend analysis if supabase is available
    consecutive_hard_sessions = 0
    if supabase and req.user_id:
        try:
            res = supabase.table("sessions").select("feedback").eq("user_id", req.user_id).order("date", desc=True).limit(3).execute()
            if res.data:
                for s in res.data:
                    if s.get("feedback") and s["feedback"].get("difficulty", 0) >= 4:
                        consecutive_hard_sessions += 1
        except Exception as e:
            print("Could not fetch history:", e)

    overall_decision = "SAME_WORKOUT"
    overall_reason = "You're performing well. Keep going with this structure!"
    
    # Logic for overall recommendation
    if feedback.recovery <= 1.5 or "pain" in notes or "hurt" in notes:
        overall_decision = "REST_DAY"
        overall_reason = "Your recovery is very low or you mentioned pain. Take a rest day to recover safely."
    elif consecutive_hard_sessions >= 2:
        overall_decision = "REST_DAY"
        overall_reason = "You've had multiple highly difficult sessions in a row. A rest day will help you bounce back."
    elif back_off_count > total_exercises / 2 or feedback.difficulty >= 4.5:
        overall_decision = "REDUCE"
        overall_reason = "This session pushed you hard. We recommend reducing the overall volume or intensity for the next workout."
    
    # Build the final adaptation response (compatible with existing frontend structure, plus overall fields)
    adaptation_result = {
        "id": uid(),
        "sourceSessionId": session.id,
        "date": datetime.utcnow().isoformat() + "Z",
        "exercises": exercise_adaptations,
        "overall_decision": overall_decision,
        "overall_reason": overall_reason
    }
    
    # 3. Store recommendation in Supabase if configured
    if supabase and req.user_id:
        try:
            # We don't fail the request if saving fails (e.g. table might not exist yet)
            data_to_insert = {
                "id": adaptation_result["id"],
                "user_id": req.user_id,
                "session_id": session.id,
                "overall_decision": overall_decision,
                "overall_reason": overall_reason,
                "exercise_adaptations": exercise_adaptations,
                "created_at": adaptation_result["date"]
            }
            supabase.table("workout_recommendations").insert(data_to_insert).execute()
        except Exception as e:
            print("Failed to save recommendation to Supabase:", e)
    
    return adaptation_result

@app.get("/api/adapt/history/{user_id}")
async def get_history(user_id: str):
    if not supabase:
        return {"data": []}
    
    try:
        res = supabase.table("workout_recommendations").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(10).execute()
        return {"data": res.data}
    except Exception as e:
        print("Failed to fetch recommendation history:", e)
        return {"data": []}

if __name__ == "__main__":
    import uvicorn
    # If run directly via python main.py
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
