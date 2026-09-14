import React, { useState, useMemo } from "react";
import {
  Home, Dumbbell, History as HistoryIcon, TrendingUp, User as UserIcon,
  ChevronRight, ChevronLeft, Check, Plus, Minus, Play, Flame, Clock,
  Calendar, ArrowRight, Sparkles, Info, X, Edit2, ChevronDown
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap');";

const C = {
  bg: "#F7F6F1",
  card: "#FFFFFF",
  ink: "#26281F",
  inkSoft: "#6B6E60",
  inkFaint: "#9A9C8E",
  line: "#E7E4D9",
  moss: "#3D6B54",
  mossSoft: "#E7EFE9",
  mossDeep: "#274939",
  gold: "#B08A4E",
  goldSoft: "#F3ECDD",
  rust: "#B0553C",
  rustSoft: "#F6E7E1",
  sky: "#3F6E8C",
  skySoft: "#E5EEF3",
};

const heading = { fontFamily: "'Fraunces', serif" };
const body = { fontFamily: "'Manrope', sans-serif" };

/* ============================================================
   STATIC DATA
   ============================================================ */
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const GOALS = ["Build strength", "Build muscle", "Improve fitness", "General wellness", "Flexibility/Mobility"];
const FOCUS_AREAS = ["Full Body", "Upper Body", "Lower Body", "Core", "Cardio", "Mobility/Flexibility"];
const EQUIPMENT_LIST = [
  "No equipment", "Dumbbells", "Barbell", "Weight plates", "Resistance bands",
  "Kettlebell", "Bench", "Pull-up bar", "Cable machine", "Weight machines",
  "Treadmill", "Exercise bike", "Other"
];
const EQUIPMENT_KEY = {
  "No equipment": "none", "Dumbbells": "dumbbells", "Barbell": "barbell",
  "Weight plates": "plates", "Resistance bands": "bands", "Kettlebell": "kettlebell",
  "Bench": "bench", "Pull-up bar": "pullupbar", "Cable machine": "cable",
  "Weight machines": "machines", "Treadmill": "treadmill", "Exercise bike": "bike", "Other": "other"
};
const LOCATIONS = ["Home", "Gym", "Outdoors"];
const DURATIONS = ["15-20 min", "30 min", "45 min", "60+ min"];
const DURATION_COUNT = { "15-20 min": 4, "30 min": 5, "45 min": 6, "60+ min": 7 };

const FOCUS_TAG_MAP = {
  "Full Body": ["upper", "lower", "core", "fullbody"],
  "Upper Body": ["upper"],
  "Lower Body": ["lower"],
  "Core": ["core"],
  "Cardio": ["cardio"],
  "Mobility/Flexibility": ["mobility"],
};

const EXERCISES = [
  { id: "pushup", name: "Push-ups", tags: ["upper"], equipment: "none", type: "reps", instructions: "Hands under shoulders, body in a straight line, lower chest to the floor and press back up." },
  { id: "squat", name: "Bodyweight squats", tags: ["lower"], equipment: "none", type: "reps", instructions: "Feet shoulder-width apart, sit hips back and down, keep chest tall, drive through your heels." },
  { id: "lunge", name: "Alternating lunges", tags: ["lower"], equipment: "none", type: "reps", instructions: "Step forward, lower until both knees hit 90 degrees, push back to start and switch legs." },
  { id: "plank", name: "Plank hold", tags: ["core"], equipment: "none", type: "duration", instructions: "Forearms on the floor, body in a straight line from head to heels, brace your core." },
  { id: "mtnclimb", name: "Mountain climbers", tags: ["core", "cardio"], equipment: "none", type: "duration", instructions: "In a plank position, drive knees toward your chest quickly, alternating legs." },
  { id: "burpee", name: "Burpees", tags: ["fullbody", "cardio"], equipment: "none", type: "reps", instructions: "Drop to a squat, kick back to a plank, return, then explode up into a jump." },
  { id: "jjacks", name: "Jumping jacks", tags: ["cardio"], equipment: "none", type: "duration", instructions: "Jump feet out while raising arms overhead, then return to start. Keep a steady rhythm." },
  { id: "glutebridge", name: "Glute bridges", tags: ["lower"], equipment: "none", type: "reps", instructions: "Lie on your back, knees bent, drive hips upward by squeezing your glutes, lower with control." },
  { id: "bicyclecrunch", name: "Bicycle crunches", tags: ["core"], equipment: "none", type: "reps", instructions: "Lying on your back, bring opposite elbow to opposite knee in a pedaling motion." },
  { id: "highknees", name: "High knees", tags: ["cardio"], equipment: "none", type: "duration", instructions: "Jog in place, driving knees up toward your chest as quickly as you can while staying controlled." },
  { id: "tricepdip", name: "Chair tricep dips", tags: ["upper"], equipment: "none", type: "reps", instructions: "Hands on a sturdy chair behind you, lower your hips toward the floor by bending your elbows, then press up." },
  { id: "superman", name: "Superman holds", tags: ["core"], equipment: "none", type: "reps", instructions: "Lying face down, lift arms and legs off the floor at once, hold briefly, then lower." },
  { id: "wallsit", name: "Wall sit", tags: ["lower"], equipment: "none", type: "duration", instructions: "Back against a wall, knees at 90 degrees like sitting in an invisible chair. Hold steady." },
  { id: "catcow", name: "Cat-cow flow", tags: ["mobility"], equipment: "none", type: "duration", instructions: "On hands and knees, alternate arching and rounding your spine slowly with your breath." },
  { id: "wgs", name: "World's greatest stretch", tags: ["mobility"], equipment: "none", type: "reps", instructions: "Lunge forward, drop the back knee, rotate your torso toward the front leg and reach up. Alternate sides." },
  { id: "downdog", name: "Down dog to cobra flow", tags: ["mobility"], equipment: "none", type: "duration", instructions: "Flow slowly between downward dog and a gentle cobra stretch, breathing through each transition." },
  { id: "dbgoblet", name: "Dumbbell goblet squat", tags: ["lower"], equipment: "dumbbells", type: "reps", instructions: "Hold a dumbbell close to your chest, squat down keeping your chest tall, drive back up." },
  { id: "dbshoulderpress", name: "Dumbbell shoulder press", tags: ["upper"], equipment: "dumbbells", type: "reps", instructions: "Press dumbbells overhead from shoulder height until arms are extended, lower with control." },
  { id: "dbrow", name: "Dumbbell bent-over row", tags: ["upper"], equipment: "dumbbells", type: "reps", instructions: "Hinge at the hips, pull dumbbells toward your ribs, squeeze your shoulder blades together." },
  { id: "dbcurl", name: "Dumbbell bicep curl", tags: ["upper"], equipment: "dumbbells", type: "reps", instructions: "Elbows at your sides, curl the dumbbells up toward your shoulders, lower slowly." },
  { id: "dbrdl", name: "Dumbbell Romanian deadlift", tags: ["lower"], equipment: "dumbbells", type: "reps", instructions: "Hinge at the hips with a slight knee bend, lower dumbbells along your legs, feel a stretch in your hamstrings." },
  { id: "dblunge", name: "Dumbbell walking lunges", tags: ["lower"], equipment: "dumbbells", type: "reps", instructions: "Holding dumbbells at your sides, step forward into a lunge and continue alternating as you move." },
  { id: "bbsquat", name: "Barbell back squat", tags: ["lower"], equipment: "barbell", type: "reps", instructions: "Bar across your upper back, squat down keeping your chest up, drive through your heels to stand." },
  { id: "bbdeadlift", name: "Barbell deadlift", tags: ["lower", "fullbody"], equipment: "barbell", type: "reps", instructions: "Hinge down to grip the bar, keep your back flat, drive through your legs to stand tall." },
  { id: "bbbench", name: "Barbell bench press", tags: ["upper"], equipment: "barbell", type: "reps", instructions: "Lower the bar to your chest with control, press back up until your arms are extended." },
  { id: "bbohp", name: "Barbell overhead press", tags: ["upper"], equipment: "barbell", type: "reps", instructions: "Press the bar from shoulder height straight overhead, keeping your core braced." },
  { id: "platefrontraise", name: "Plate front raise", tags: ["upper"], equipment: "plates", type: "reps", instructions: "Hold a weight plate with both hands, raise it to shoulder height with straight arms, lower slowly." },
  { id: "platetwist", name: "Weighted Russian twist", tags: ["core"], equipment: "plates", type: "reps", instructions: "Seated, lean back slightly, rotate a plate side to side while keeping your core engaged." },
  { id: "bandpullapart", name: "Band pull-apart", tags: ["upper"], equipment: "bands", type: "reps", instructions: "Hold the band with both hands in front of you, pull it apart until your arms are wide, return slowly." },
  { id: "bandsquat", name: "Band squat", tags: ["lower"], equipment: "bands", type: "reps", instructions: "Stand on the band, hold the handles at your shoulders, squat down and drive back up against the resistance." },
  { id: "bandrow", name: "Band row", tags: ["upper"], equipment: "bands", type: "reps", instructions: "Anchor the band in front of you, pull the handles toward your ribs, squeeze your back." },
  { id: "kbswing", name: "Kettlebell swing", tags: ["fullbody", "cardio"], equipment: "kettlebell", type: "reps", instructions: "Hinge at the hips and swing the kettlebell up to chest height using your hips, not your arms." },
  { id: "kbgoblet", name: "Kettlebell goblet squat", tags: ["lower"], equipment: "kettlebell", type: "reps", instructions: "Hold the kettlebell at your chest, squat down between your knees, drive back up." },
  { id: "benchstepup", name: "Bench step-ups", tags: ["lower"], equipment: "bench", type: "reps", instructions: "Step fully onto the bench with one leg, drive up to standing, step back down and alternate." },
  { id: "inclinepushup", name: "Incline push-ups", tags: ["upper"], equipment: "bench", type: "reps", instructions: "Hands on the bench, body straight, lower your chest to the bench and press back up." },
  { id: "pullup", name: "Pull-ups", tags: ["upper"], equipment: "pullupbar", type: "reps", instructions: "Hang with an overhand grip, pull your chin above the bar, lower with control." },
  { id: "hangingknee", name: "Hanging knee raises", tags: ["core"], equipment: "pullupbar", type: "reps", instructions: "Hang from the bar, raise your knees toward your chest without swinging, lower slowly." },
  { id: "cablerow", name: "Cable seated row", tags: ["upper"], equipment: "cable", type: "reps", instructions: "Pull the handle toward your torso, squeezing your shoulder blades together, extend back out with control." },
  { id: "cabletricep", name: "Cable tricep pushdown", tags: ["upper"], equipment: "cable", type: "reps", instructions: "Elbows at your sides, push the bar down until your arms are extended, return slowly." },
  { id: "legpress", name: "Leg press machine", tags: ["lower"], equipment: "machines", type: "reps", instructions: "Feet shoulder-width on the platform, press away until legs are extended without locking your knees." },
  { id: "latpulldown", name: "Lat pulldown machine", tags: ["upper"], equipment: "machines", type: "reps", instructions: "Pull the bar down toward your chest, squeeze your back, control the bar back up." },
  { id: "treadmillintervals", name: "Treadmill intervals", tags: ["cardio"], equipment: "treadmill", type: "duration", instructions: "Alternate 30 seconds at a hard pace with 30 seconds easy walking or jogging." },
  { id: "bikeintervals", name: "Stationary bike intervals", tags: ["cardio"], equipment: "bike", type: "duration", instructions: "Alternate 30 seconds of fast pedaling with 30 seconds of easy pedaling." },
];

const EXP_DEFAULTS = {
  Beginner: { reps: 8, sets: 3, holdSec: 20, cardioSec: 30 },
  Intermediate: { reps: 12, sets: 3, holdSec: 30, cardioSec: 45 },
  Advanced: { reps: 15, sets: 4, holdSec: 45, cardioSec: 60 },
};

/* ============================================================
   HELPERS
   ============================================================ */
function uid() { return Math.random().toString(36).slice(2, 10); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function defaultTargetFor(ex, profile) {
  const d = EXP_DEFAULTS[profile.experience] || EXP_DEFAULTS.Intermediate;
  if (ex.type === "duration") {
    return { sets: ex.tags.includes("cardio") ? 1 : 3, durationSec: ex.tags.includes("cardio") ? d.cardioSec : d.holdSec, reps: null, weight: null };
  }
  const isWeighted = !["none"].includes(ex.equipment);
  return { sets: d.sets, reps: d.reps, weight: isWeighted ? null : null, durationSec: null };
}

function equipmentAllowed(ex, profile) {
  if (ex.equipment === "none") return true;
  const equipKeys = (profile.equipment || []).map(e => EQUIPMENT_KEY[e]);
  return equipKeys.includes(ex.equipment);
}

function focusMatch(ex, profile) {
  const focusAreas = profile.focusAreas && profile.focusAreas.length ? profile.focusAreas : FOCUS_AREAS;
  const desired = new Set();
  focusAreas.forEach(f => (FOCUS_TAG_MAP[f] || []).forEach(t => desired.add(t)));
  return ex.tags.some(t => desired.has(t));
}

function generateWorkout(profile, levels, lastSession) {
  let pool = EXERCISES.filter(ex => equipmentAllowed(ex, profile) && focusMatch(ex, profile));
  if (pool.length < 3) pool = EXERCISES.filter(ex => equipmentAllowed(ex, profile));
  if (pool.length < 3) pool = EXERCISES.filter(ex => ex.equipment === "none");

  const count = DURATION_COUNT[profile.duration] || 5;
  const lastIds = new Set((lastSession?.exercises || []).map(e => e.id));

  const fresh = pool.filter(e => !lastIds.has(e.id));
  const candidates = fresh.length >= count ? fresh : pool;

  const focusAreas = profile.focusAreas && profile.focusAreas.length ? profile.focusAreas : FOCUS_AREAS;
  const desiredTags = new Set();
  focusAreas.forEach(f => (FOCUS_TAG_MAP[f] || []).forEach(t => desiredTags.add(t)));

  const chosen = [];
  const usedIds = new Set();
  for (const tag of desiredTags) {
    if (chosen.length >= count) break;
    const opts = shuffle(candidates.filter(e => e.tags.includes(tag) && !usedIds.has(e.id)));
    if (opts.length) {
      chosen.push(opts[0]);
      usedIds.add(opts[0].id);
    }
  }
  const remaining = shuffle(candidates.filter(e => !usedIds.has(e.id)));
  for (const ex of remaining) {
    if (chosen.length >= count) break;
    chosen.push(ex);
    usedIds.add(ex.id);
  }

  const focusLabel = focusAreas.length === 1 ? focusAreas[0] : focusAreas.includes("Full Body") ? "Full Body" : focusAreas.slice(0, 2).join(" + ");

  const exercises = chosen.map(ex => {
    const level = levels[ex.id];
    const base = defaultTargetFor(ex, profile);
    const target = level ? { ...base, ...level } : base;
    return {
      id: ex.id,
      name: ex.name,
      tags: ex.tags,
      equipment: ex.equipment,
      type: ex.type,
      instructions: ex.instructions,
      plannedSets: target.sets,
      plannedReps: target.reps,
      plannedWeight: target.weight,
      plannedDurationSec: target.durationSec,
      weightKnown: target.weight != null,
    };
  });

  return {
    id: uid(),
    focusLabel,
    duration: profile.duration,
    exercises,
  };
}

function ratioFor(ex) {
  const setRatio = ex.plannedSets ? Math.min((ex.actualSets ?? 0) / ex.plannedSets, 1.4) : 1;
  let repRatio = 1;
  if (ex.type === "reps" && ex.plannedReps) {
    repRatio = Math.min((ex.actualReps ?? ex.plannedReps) / ex.plannedReps, 1.4);
  } else if (ex.type === "duration" && ex.plannedDurationSec) {
    repRatio = Math.min((ex.actualDurationSec ?? ex.plannedDurationSec) / ex.plannedDurationSec, 1.4);
  }
  return (setRatio * 0.4 + repRatio * 0.6);
}

function decideFor(ratio, feedback) {
  const { difficulty, energy, recovery } = feedback;
  if (difficulty >= 4.5 || recovery <= 1.5 || ratio < 0.8) return "BACK_OFF";
  if (difficulty <= 2.5 && ratio >= 1.0 && energy >= 3.5 && recovery >= 3.5) return "PROGRESS";
  return "HOLD";
}

function reasonFor(decision, ratio, feedback) {
  const { difficulty, energy, recovery } = feedback;
  if (decision === "BACK_OFF") {
    if (recovery <= 1.5) return "Your recovery felt low, so we're easing the load to help your body catch up.";
    if (ratio < 0.8) return "You came in under target this session, so we're scaling back to a level you can hit consistently.";
    return "That session felt hard, so we're dialing back the intensity a bit before building again.";
  }
  if (decision === "PROGRESS") {
    return "You hit every target with energy and recovery to spare, so we're raising the bar.";
  }
  if (ratio >= 1.0 && difficulty >= 3.5) return "You hit your targets but it took real effort, so we're holding steady here.";
  return "You're performing consistently at this level, so we're keeping things steady before the next push.";
}

function nudge(value, factor, min, step) {
  const raw = value * factor;
  const rounded = step ? Math.round(raw / step) * step : Math.round(raw);
  return Math.max(min, rounded);
}

function computeAdaptation(session, profile) {
  const feedback = session.feedback;
  const results = session.exercises.map(ex => {
    const ratio = ratioFor(ex);
    const decision = decideFor(ratio, feedback);
    const reason = reasonFor(decision, ratio, feedback);

    let newSets = ex.plannedSets, newReps = ex.plannedReps, newWeight = ex.plannedWeight, newDuration = ex.plannedDurationSec;

    if (decision === "PROGRESS") {
      if (ex.type === "reps") {
        newReps = nudge(ex.plannedReps, 1.12, ex.plannedReps + 1, 1);
        if (newReps > 20) { newReps = 10; newSets = ex.plannedSets + 1; }
        if (ex.actualWeight != null) newWeight = nudge(ex.actualWeight, 1.05, ex.actualWeight + 1, 2.5);
        else if (ex.plannedWeight != null) newWeight = nudge(ex.plannedWeight, 1.05, ex.plannedWeight + 1, 2.5);
      } else {
        newDuration = nudge(ex.plannedDurationSec, 1.12, ex.plannedDurationSec + 5, 5);
      }
    } else if (decision === "BACK_OFF") {
      if (ex.type === "reps") {
        newReps = nudge(ex.plannedReps, 0.85, 5, 1);
        if (ex.actualWeight != null) newWeight = nudge(ex.actualWeight, 0.9, 2.5, 2.5);
        else if (ex.plannedWeight != null) newWeight = nudge(ex.plannedWeight, 0.9, 2.5, 2.5);
        if (ratio < 0.6 && ex.plannedSets > 2) newSets = ex.plannedSets - 1;
      } else {
        newDuration = nudge(ex.plannedDurationSec, 0.85, 10, 5);
      }
    } else {
      if (ex.actualWeight != null) newWeight = ex.actualWeight;
    }

    return {
      id: ex.id,
      name: ex.name,
      type: ex.type,
      decision,
      reason,
      previous: { sets: ex.plannedSets, reps: ex.plannedReps, weight: ex.plannedWeight, durationSec: ex.plannedDurationSec },
      next: { sets: newSets, reps: newReps, weight: newWeight, durationSec: newDuration },
    };
  });
  return { id: uid(), date: new Date().toISOString(), exercises: results };
}

function fmtTarget(t) {
  if (t.durationSec != null) {
    const m = Math.floor(t.durationSec / 60), s = t.durationSec % 60;
    const dur = m > 0 ? `${m}m ${s}s` : `${s}s`;
    return `${t.sets > 1 ? t.sets + " x " : ""}${dur}`;
  }
  const w = t.weight != null ? ` @ ${t.weight}kg` : "";
  return `${t.sets} x ${t.reps}${w}`;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function Card({ children, style, className }) {
  return (
    <div
      className={className}
      style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: "1.25rem", ...style }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, style, disabled, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? C.inkFaint : C.moss,
        color: "#fff", border: "none", borderRadius: 14,
        padding: "0.85rem 1.4rem", fontWeight: 600, fontSize: 15,
        cursor: disabled ? "not-allowed" : "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", gap: 8,
        transition: "transform 0.1s ease", ...body, ...style,
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent", color: C.ink, border: `1.5px solid ${C.line}`,
        borderRadius: 14, padding: "0.8rem 1.3rem", fontWeight: 600, fontSize: 15,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, ...body, ...style,
      }}
    >
      {children}
    </button>
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0.55rem 1rem", borderRadius: 999, fontSize: 14, fontWeight: 500,
        border: `1.5px solid ${active ? C.moss : C.line}`,
        background: active ? C.mossSoft : "#fff",
        color: active ? C.mossDeep : C.inkSoft,
        cursor: "pointer", ...body,
      }}
    >
      {label}
    </button>
  );
}

function ScaleSelector({ value, onChange, labels }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            flex: 1, padding: "0.9rem 0.4rem", borderRadius: 12, cursor: "pointer",
            border: `1.5px solid ${value === n ? C.moss : C.line}`,
            background: value === n ? C.mossSoft : "#fff",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: value === n ? C.mossDeep : C.ink }}>{n}</span>
          <span style={{ fontSize: 10.5, color: C.inkSoft, textAlign: "center", lineHeight: 1.2 }}>{labels[n - 1]}</span>
        </button>
      ))}
    </div>
  );
}

const decisionColor = { PROGRESS: { bg: C.mossSoft, text: C.mossDeep, border: C.moss }, HOLD: { bg: C.goldSoft, text: "#6B5122", border: C.gold }, BACK_OFF: { bg: C.rustSoft, text: "#7A3624", border: C.rust } };
const decisionLabel = { PROGRESS: "Progress", HOLD: "Hold", BACK_OFF: "Back off" };

function DecisionBadge({ decision }) {
  const c = decisionColor[decision];
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 999, padding: "0.25rem 0.7rem", fontSize: 12.5, fontWeight: 600 }}>
      {decisionLabel[decision]}
    </span>
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "workout", label: "Workout", icon: Dumbbell },
  { id: "history", label: "History", icon: HistoryIcon },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "profile", label: "Profile", icon: UserIcon },
];

function Sidebar({ view, setView }) {
  return (
    <div style={{ width: 236, flexShrink: 0, borderRight: `1px solid ${C.line}`, padding: "1.75rem 1.1rem", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 0.6rem", marginBottom: "2rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: C.moss, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span style={{ ...heading, fontSize: 21, fontWeight: 600, color: C.ink }}>FITTO</span>
      </div>
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 11, padding: "0.7rem 0.85rem",
              borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left",
              background: active ? C.mossSoft : "transparent",
              color: active ? C.mossDeep : C.inkSoft, fontWeight: active ? 600 : 500,
              fontSize: 14.5, ...body,
            }}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function BottomNav({ view, setView }) {
  return (
    <div style={{
      position: "sticky", bottom: 0, left: 0, right: 0, background: C.card,
      borderTop: `1px solid ${C.line}`, display: "flex", padding: "0.4rem 0.3rem",
      paddingBottom: "calc(0.4rem + env(safe-area-inset-bottom))", zIndex: 20,
    }}>
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, padding: "0.45rem 0", background: "transparent", border: "none",
              color: active ? C.moss : C.inkFaint, cursor: "pointer",
            }}
          >
            <Icon size={21} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, ...body }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   WELCOME
   ============================================================ */
function WelcomeScreen({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: "2rem 1.25rem" }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: C.moss, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.75rem" }}>
          <Sparkles size={30} color="#fff" />
        </div>
        <h1 style={{ ...heading, fontSize: 44, fontWeight: 600, color: C.ink, margin: "0 0 0.6rem" }}>FITTO</h1>
        <p style={{ ...heading, fontStyle: "italic", fontSize: 18, color: C.moss, margin: "0 0 1.1rem" }}>Your body speaks. FITTO listens.</p>
        <p style={{ ...body, fontSize: 15.5, color: C.inkSoft, lineHeight: 1.6, margin: "0 0 2.4rem" }}>
          Personalized workouts that adapt to you, session by session.
        </p>
        <PrimaryButton onClick={onStart} style={{ width: "100%", padding: "1rem" }}>
          Get started <ArrowRight size={18} />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ============================================================
   ONBOARDING
   ============================================================ */
const ONBOARD_STEPS = ["basics", "goal", "focus", "equipment", "preferences"];

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", age: "", height: "", weight: "", experience: "",
    goal: "", focusAreas: [], equipment: [], gymAccess: null,
    location: "", daysPerWeek: 3, duration: "",
  });
  const [error, setError] = useState("");

  const toggle = (key, val) => {
    setForm(f => {
      const list = f[key];
      return { ...f, [key]: list.includes(val) ? list.filter(v => v !== val) : [...list, val] };
    });
  };

  const validate = () => {
    if (step === 0) {
      if (!form.name || !form.age || !form.height || !form.weight || !form.experience) return "Fill in every field to continue.";
    }
    if (step === 1 && !form.goal) return "Pick a goal to continue.";
    if (step === 2 && form.focusAreas.length === 0) return "Pick at least one focus area.";
    if (step === 3) {
      if (form.equipment.length === 0) return "Pick at least one equipment option.";
      if (form.gymAccess === null) return "Let us know if you have gym access.";
    }
    if (step === 4) {
      if (!form.location || !form.duration) return "Fill in your location and duration.";
    }
    return "";
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    if (step === ONBOARD_STEPS.length - 1) onComplete(form);
    else setStep(step + 1);
  };
  const back = () => { setError(""); if (step > 0) setStep(step - 1); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", justifyContent: "center", padding: "1.75rem 1.1rem" }}>
      <div style={{ maxWidth: 460, width: "100%" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: "1.75rem" }}>
          {ONBOARD_STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? C.moss : C.line }} />
          ))}
        </div>

        {step === 0 && (
          <Section title="Tell us about you" subtitle="This helps FITTO shape your starting point.">
            <Field label="Name">
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </Field>
            <div style={{ display: "flex", gap: 12 }}>
              <Field label="Age" style={{ flex: 1 }}>
                <input style={inputStyle} type="number" min="1" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="28" />
              </Field>
              <Field label="Height (cm)" style={{ flex: 1 }}>
                <input style={inputStyle} type="number" min="1" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} placeholder="175" />
              </Field>
              <Field label="Weight (kg)" style={{ flex: 1 }}>
                <input style={inputStyle} type="number" min="1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="70" />
              </Field>
            </div>
            <Field label="Fitness experience">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {EXPERIENCE_LEVELS.map(lvl => (
                  <Pill key={lvl} label={lvl} active={form.experience === lvl} onClick={() => setForm({ ...form, experience: lvl })} />
                ))}
              </div>
            </Field>
          </Section>
        )}

        {step === 1 && (
          <Section title="What's your goal?" subtitle="FITTO will shape every workout around this.">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {GOALS.map(g => (
                <SelectRow key={g} label={g} selected={form.goal === g} onClick={() => setForm({ ...form, goal: g })} />
              ))}
            </div>
          </Section>
        )}

        {step === 2 && (
          <Section title="Focus areas" subtitle="Choose one or more areas to prioritize.">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FOCUS_AREAS.map(f => (
                <Pill key={f} label={f} active={form.focusAreas.includes(f)} onClick={() => toggle("focusAreas", f)} />
              ))}
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section title="Equipment" subtitle="FITTO only builds workouts you can actually do.">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {EQUIPMENT_LIST.map(e => (
                <Pill key={e} label={e} active={form.equipment.includes(e)} onClick={() => toggle("equipment", e)} />
              ))}
            </div>
            <Field label="Gym access?">
              <div style={{ display: "flex", gap: 8 }}>
                <Pill label="Yes" active={form.gymAccess === true} onClick={() => setForm({ ...form, gymAccess: true })} />
                <Pill label="No" active={form.gymAccess === false} onClick={() => setForm({ ...form, gymAccess: false })} />
              </div>
            </Field>
          </Section>
        )}

        {step === 4 && (
          <Section title="Preferences" subtitle="A few last details to finish your plan.">
            <Field label="Workout location">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {LOCATIONS.map(l => <Pill key={l} label={l} active={form.location === l} onClick={() => setForm({ ...form, location: l })} />)}
              </div>
            </Field>
            <Field label={`Days per week: ${form.daysPerWeek}`}>
              <input type="range" min="1" max="7" step="1" value={form.daysPerWeek} onChange={e => setForm({ ...form, daysPerWeek: Number(e.target.value) })} style={{ width: "100%" }} />
            </Field>
            <Field label="Workout duration">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {DURATIONS.map(d => <Pill key={d} label={d} active={form.duration === d} onClick={() => setForm({ ...form, duration: d })} />)}
              </div>
            </Field>
          </Section>
        )}

        {error && <p style={{ color: C.rust, fontSize: 13.5, marginTop: 10, ...body }}>{error}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: "1.75rem" }}>
          {step > 0 && <SecondaryButton onClick={back}><ChevronLeft size={16} /> Back</SecondaryButton>}
          <PrimaryButton onClick={next} style={{ flex: 1 }}>
            {step === ONBOARD_STEPS.length - 1 ? "Create my plan" : "Continue"} <ChevronRight size={16} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div>
      <h2 style={{ ...heading, fontSize: 25, fontWeight: 600, color: C.ink, margin: "0 0 0.35rem" }}>{title}</h2>
      <p style={{ ...body, color: C.inkSoft, fontSize: 14.5, margin: "0 0 1.5rem" }}>{subtitle}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
    </div>
  );
}
function Field({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ ...body, fontSize: 13, fontWeight: 600, color: C.inkSoft, display: "block", marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );
}
function SelectRow({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.95rem 1.1rem", borderRadius: 14, cursor: "pointer", textAlign: "left",
      border: `1.5px solid ${selected ? C.moss : C.line}`, background: selected ? C.mossSoft : "#fff",
      color: selected ? C.mossDeep : C.ink, fontWeight: 500, fontSize: 15, ...body,
    }}>
      {label}
      {selected && <Check size={18} color={C.moss} />}
    </button>
  );
}
const inputStyle = { width: "100%", padding: "0.7rem 0.85rem", borderRadius: 12, border: `1.5px solid ${C.line}`, fontSize: 15, ...body, outline: "none", boxSizing: "border-box", color: C.ink, background: "#fff" };

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ profile, plannedWorkout, sessions, adaptations, goToWorkout }) {
  const firstName = profile.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const weekStart = startOfWeek(new Date());
  const thisWeek = sessions.filter(s => new Date(s.date) >= weekStart);
  const target = profile.daysPerWeek || 3;

  const lastAdaptation = adaptations[adaptations.length - 1];
  const lastSession = sessions[sessions.length - 1];
  let status = "Ready";
  if (lastSession) {
    if (lastSession.feedback.recovery <= 2 || (lastAdaptation && lastAdaptation.exercises.some(e => e.decision === "BACK_OFF"))) status = "Recovering";
    else if (lastAdaptation && lastAdaptation.exercises.every(e => e.decision === "HOLD")) status = "Maintaining";
  }
  const statusColor = { Ready: C.moss, Maintaining: C.gold, Recovering: C.rust };

  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ ...heading, fontSize: 27, fontWeight: 600, color: C.ink, margin: "0 0 1.5rem" }}>{greeting}, {firstName}</h1>

      <Card style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ ...body, fontSize: 12.5, fontWeight: 700, color: C.moss, textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 0.4rem" }}>Today's workout</p>
            <h3 style={{ ...heading, fontSize: 21, fontWeight: 600, color: C.ink, margin: "0 0 0.6rem" }}>{plannedWorkout.focusLabel}</h3>
            <div style={{ display: "flex", gap: 14, color: C.inkSoft, fontSize: 13.5, ...body }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {plannedWorkout.duration}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Dumbbell size={14} /> {plannedWorkout.exercises.length} exercises</span>
            </div>
          </div>
        </div>
        <PrimaryButton onClick={goToWorkout} style={{ width: "100%", marginTop: "1.1rem" }}>
          <Play size={16} /> Start workout
        </PrimaryButton>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <Card>
          <p style={{ ...body, fontSize: 12.5, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 0.7rem" }}>Weekly activity</p>
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            {Array.from({ length: target }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < thisWeek.length ? C.moss : C.line }} />
            ))}
          </div>
          <p style={{ ...heading, fontSize: 20, fontWeight: 600, color: C.ink, margin: 0 }}>{thisWeek.length}<span style={{ fontSize: 14, color: C.inkSoft, fontWeight: 400 }}> / {target} sessions</span></p>
        </Card>
        <Card>
          <p style={{ ...body, fontSize: 12.5, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 0.7rem" }}>Current status</p>
          <p style={{ ...heading, fontSize: 20, fontWeight: 600, color: statusColor[status], margin: "0.35rem 0 0" }}>{status}</p>
        </Card>
      </div>

      <Card>
        <p style={{ ...body, fontSize: 12.5, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 0.9rem" }}>Recent activity</p>
        {lastSession ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ ...body, fontWeight: 600, fontSize: 15, color: C.ink, margin: "0 0 0.2rem" }}>{lastSession.focus}</p>
              <p style={{ ...body, fontSize: 13, color: C.inkSoft, margin: 0 }}>{fmtDate(lastSession.date)} · {lastSession.exercises.length} exercises · difficulty {lastSession.feedback.difficulty}/5</p>
            </div>
            <Flame size={20} color={C.gold} />
          </div>
        ) : (
          <p style={{ ...body, fontSize: 14, color: C.inkFaint, margin: 0 }}>Your first workout will show up here once you finish it.</p>
        )}
      </Card>
    </div>
  );
}

/* ============================================================
   WORKOUT SCREEN
   ============================================================ */
function WorkoutScreen({ workout, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [log, setLog] = useState(() => workout.exercises.map(ex => ({
    id: ex.id, completedSets: 0, actualReps: ex.plannedReps, actualWeight: ex.plannedWeight, actualDurationSec: ex.plannedDurationSec,
  })));

  const ex = workout.exercises[idx];
  const entry = log[idx];

  const updateEntry = (patch) => {
    setLog(l => l.map((e, i) => i === idx ? { ...e, ...patch } : e));
  };

  const completeSet = () => {
    if (entry.completedSets < ex.plannedSets) updateEntry({ completedSets: entry.completedSets + 1 });
  };

  const goNext = () => {
    if (idx < workout.exercises.length - 1) setIdx(idx + 1);
  };
  const goPrev = () => { if (idx > 0) setIdx(idx - 1); };

  const finish = () => {
    const exercises = workout.exercises.map((e, i) => ({
      ...e,
      actualSets: log[i].completedSets,
      actualReps: e.type === "reps" ? log[i].actualReps : null,
      actualWeight: log[i].actualWeight,
      actualDurationSec: e.type === "duration" ? log[i].actualDurationSec : null,
    }));
    onFinish(exercises);
  };

  const isWeighted = ex.equipment !== "none" && ex.type === "reps";

  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 560, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" }}>
        <p style={{ ...body, fontSize: 13, color: C.inkSoft, fontWeight: 600 }}>Exercise {idx + 1} of {workout.exercises.length}</p>
        <p style={{ ...body, fontSize: 13, color: C.moss, fontWeight: 600 }}>{workout.focusLabel}</p>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: "1.5rem" }}>
        {workout.exercises.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < idx ? C.moss : i === idx ? C.gold : C.line }} />
        ))}
      </div>

      <Card>
        <h2 style={{ ...heading, fontSize: 24, fontWeight: 600, color: C.ink, margin: "0 0 0.5rem" }}>{ex.name}</h2>
        <p style={{ ...body, fontSize: 14, color: C.inkSoft, lineHeight: 1.6, margin: "0 0 1rem" }}>{ex.instructions}</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
          <Tag label={`${ex.plannedSets} sets`} />
          {ex.type === "reps" && <Tag label={`${ex.plannedReps} reps`} />}
          {ex.type === "duration" && <Tag label={`${ex.plannedDurationSec}s hold`} />}
          {ex.plannedWeight != null && <Tag label={`${ex.plannedWeight}kg suggested`} />}
          {ex.type === "reps" && ex.plannedWeight == null && ex.equipment !== "none" && <Tag label="Pick a challenging weight" />}
          <Tag label={`Rest ${ex.type === "duration" ? "30s" : "60-90s"}`} />
        </div>

        <div style={{ background: C.bg, borderRadius: 14, padding: "1.1rem", marginBottom: "1.25rem" }}>
          <p style={{ ...body, fontSize: 13, fontWeight: 700, color: C.inkSoft, margin: "0 0 0.9rem" }}>Set {Math.min(entry.completedSets + 1, ex.plannedSets)} of {ex.plannedSets}</p>

          {ex.type === "reps" ? (
            <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
              <NumberStepper label="Actual reps" value={entry.actualReps ?? 0} onChange={v => updateEntry({ actualReps: v })} min={0} />
              {isWeighted && <NumberStepper label="Weight (kg)" value={entry.actualWeight ?? 0} onChange={v => updateEntry({ actualWeight: v })} min={0} step={2.5} />}
            </div>
          ) : (
            <div style={{ marginBottom: "1rem" }}>
              <NumberStepper label="Actual duration (sec)" value={entry.actualDurationSec ?? 0} onChange={v => updateEntry({ actualDurationSec: v })} min={0} step={5} />
            </div>
          )}

          <PrimaryButton onClick={completeSet} disabled={entry.completedSets >= ex.plannedSets} style={{ width: "100%" }}>
            {entry.completedSets >= ex.plannedSets ? <><Check size={16} /> All sets complete</> : <>Complete set ({entry.completedSets}/{ex.plannedSets})</>}
          </PrimaryButton>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {idx > 0 && <SecondaryButton onClick={goPrev}><ChevronLeft size={16} /></SecondaryButton>}
          {idx < workout.exercises.length - 1 ? (
            <PrimaryButton onClick={goNext} style={{ flex: 1, background: C.ink }}>Next exercise <ChevronRight size={16} /></PrimaryButton>
          ) : (
            <PrimaryButton onClick={finish} style={{ flex: 1 }}>Finish workout <Check size={16} /></PrimaryButton>
          )}
        </div>
      </Card>
    </div>
  );
}

function Tag({ label }) {
  return <span style={{ background: C.mossSoft, color: C.mossDeep, fontSize: 12.5, fontWeight: 600, padding: "0.35rem 0.7rem", borderRadius: 999, ...body }}>{label}</span>;
}

function NumberStepper({ label, value, onChange, min = 0, step = 1 }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ ...body, fontSize: 12, color: C.inkSoft, margin: "0 0 0.4rem", fontWeight: 600 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", background: "#fff", border: `1.5px solid ${C.line}`, borderRadius: 12, overflow: "hidden" }}>
        <button onClick={() => onChange(Math.max(min, Number((value - step).toFixed(2))))} style={stepperBtn}><Minus size={16} /></button>
        <span style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 16, color: C.ink, ...body }}>{value}</span>
        <button onClick={() => onChange(Number((value + step).toFixed(2)))} style={stepperBtn}><Plus size={16} /></button>
      </div>
    </div>
  );
}
const stepperBtn = { border: "none", background: "transparent", padding: "0.7rem 0.85rem", cursor: "pointer", color: C.moss, display: "flex" };

/* ============================================================
   FEEDBACK SCREEN
   ============================================================ */
function FeedbackScreen({ onSubmit }) {
  const [difficulty, setDifficulty] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [recovery, setRecovery] = useState(3);
  const [notes, setNotes] = useState("");

  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 520, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ ...heading, fontSize: 26, fontWeight: 600, color: C.ink, margin: "0 0 0.4rem" }}>How did that feel?</h1>
      <p style={{ ...body, fontSize: 14.5, color: C.inkSoft, margin: "0 0 1.75rem" }}>Your answers shape tomorrow's targets.</p>

      <Card style={{ marginBottom: "1rem" }}>
        <FieldTitle>How did the workout feel?</FieldTitle>
        <ScaleSelector value={difficulty} onChange={setDifficulty} labels={["Very easy", "Easy", "Moderate", "Hard", "Very hard"]} />
      </Card>

      <Card style={{ marginBottom: "1rem" }}>
        <FieldTitle>Energy level</FieldTitle>
        <ScaleSelector value={energy} onChange={setEnergy} labels={["Drained", "Low", "Okay", "Good", "Great"]} />
      </Card>

      <Card style={{ marginBottom: "1rem" }}>
        <FieldTitle>Recovery / readiness</FieldTitle>
        <ScaleSelector value={recovery} onChange={setRecovery} labels={["Sore", "Tired", "Okay", "Fresh", "Fully recovered"]} />
      </Card>

      <Card style={{ marginBottom: "1.5rem" }}>
        <FieldTitle>Notes (optional)</FieldTitle>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Anything FITTO should know — a tweak in form, a niggle, how it went"
          rows={3}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />
      </Card>

      <PrimaryButton onClick={() => onSubmit({ difficulty, energy, recovery, notes })} style={{ width: "100%" }}>
        Submit feedback <ArrowRight size={16} />
      </PrimaryButton>
    </div>
  );
}
function FieldTitle({ children }) {
  return <p style={{ ...body, fontWeight: 600, fontSize: 15, color: C.ink, margin: "0 0 0.9rem" }}>{children}</p>;
}

/* ============================================================
   ADAPTATION RESULT SCREEN
   ============================================================ */
function AdaptationResultScreen({ adaptation, onNext }) {
  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 620, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: C.mossSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <Sparkles size={24} color={C.moss} />
        </div>
        <h1 style={{ ...heading, fontSize: 28, fontWeight: 600, color: C.ink, margin: "0 0 0.5rem" }}>FITTO listened.</h1>
        <p style={{ ...body, fontSize: 14.5, color: C.inkSoft, margin: 0, lineHeight: 1.6 }}>Your next workout has been adjusted based on your recent performance and feedback.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.75rem" }}>
        {adaptation.exercises.map(a => (
          <Card key={a.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
              <p style={{ ...body, fontWeight: 600, fontSize: 15.5, color: C.ink, margin: 0 }}>{a.name}</p>
              <DecisionBadge decision={a.decision} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.6rem", fontSize: 13.5, ...body }}>
              <span style={{ color: C.inkFaint, textDecoration: "line-through" }}>{fmtTarget(a.previous)}</span>
              <ArrowRight size={13} color={C.inkFaint} />
              <span style={{ color: C.ink, fontWeight: 700 }}>{fmtTarget(a.next)}</span>
            </div>
            <p style={{ ...body, fontSize: 13, color: C.inkSoft, margin: 0, lineHeight: 1.5 }}>{a.reason}</p>
          </Card>
        ))}
      </div>

      <PrimaryButton onClick={onNext} style={{ width: "100%" }}>
        View next workout <ArrowRight size={16} />
      </PrimaryButton>
    </div>
  );
}

/* ============================================================
   HISTORY
   ============================================================ */
function HistoryScreen({ sessions, adaptations, onOpen }) {
  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ ...heading, fontSize: 27, fontWeight: 600, color: C.ink, margin: "0 0 1.5rem" }}>History</h1>
      {sessions.length === 0 ? (
        <EmptyState text="Finish your first workout and it'll show up here." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...sessions].reverse().map(s => {
            const adaptation = adaptations.find(a => a.sourceSessionId === s.id);
            const avgRatio = s.exercises.reduce((sum, e) => sum + ratioFor(e), 0) / s.exercises.length;
            return (
              <Card key={s.id} style={{ cursor: "pointer" }} className="hist-row">
                <div onClick={() => onOpen(s.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ ...body, fontWeight: 600, fontSize: 15.5, color: C.ink, margin: "0 0 0.25rem" }}>{s.focus}</p>
                    <p style={{ ...body, fontSize: 13, color: C.inkSoft, margin: 0 }}>{fmtDate(s.date)} · {s.exercises.length} exercises · {Math.round(avgRatio * 100)}% of target</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {adaptation && (
                      <DecisionBadge decision={
                        adaptation.exercises.some(e => e.decision === "BACK_OFF") ? "BACK_OFF" :
                        adaptation.exercises.every(e => e.decision === "HOLD") ? "HOLD" : "PROGRESS"
                      } />
                    )}
                    <ChevronRight size={18} color={C.inkFaint} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HistoryDetailScreen({ session, adaptation, onBack }) {
  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 620, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.moss, fontWeight: 600, cursor: "pointer", marginBottom: "1.25rem", ...body, fontSize: 14 }}>
        <ChevronLeft size={16} /> Back to history
      </button>
      <h1 style={{ ...heading, fontSize: 25, fontWeight: 600, color: C.ink, margin: "0 0 0.3rem" }}>{session.focus}</h1>
      <p style={{ ...body, fontSize: 14, color: C.inkSoft, margin: "0 0 1.25rem" }}>{fmtDate(session.date)}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.25rem" }}>
        <MetricMini label="Difficulty" value={`${session.feedback.difficulty}/5`} />
        <MetricMini label="Energy" value={`${session.feedback.energy}/5`} />
        <MetricMini label="Recovery" value={`${session.feedback.recovery}/5`} />
      </div>

      {session.feedback.notes && (
        <Card style={{ marginBottom: "1.25rem" }}>
          <p style={{ ...body, fontSize: 13, fontWeight: 700, color: C.inkSoft, margin: "0 0 0.4rem" }}>Notes</p>
          <p style={{ ...body, fontSize: 14, color: C.ink, margin: 0 }}>{session.feedback.notes}</p>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {session.exercises.map(ex => {
          const a = adaptation?.exercises.find(x => x.id === ex.id);
          return (
            <Card key={ex.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <p style={{ ...body, fontWeight: 600, fontSize: 15, color: C.ink, margin: 0 }}>{ex.name}</p>
                {a && <DecisionBadge decision={a.decision} />}
              </div>
              <p style={{ ...body, fontSize: 13, color: C.inkSoft, margin: "0 0 0.2rem" }}>
                Planned: {fmtTarget({ sets: ex.plannedSets, reps: ex.plannedReps, weight: ex.plannedWeight, durationSec: ex.plannedDurationSec })}
              </p>
              <p style={{ ...body, fontSize: 13, color: C.ink, fontWeight: 600, margin: 0 }}>
                Actual: {ex.actualSets} sets{ex.type === "reps" ? ` · ${ex.actualReps} reps` : ` · ${ex.actualDurationSec}s`}{ex.actualWeight ? ` · ${ex.actualWeight}kg` : ""}
              </p>
              {a && <p style={{ ...body, fontSize: 12.5, color: C.inkSoft, margin: "0.5rem 0 0", lineHeight: 1.5 }}>{a.reason}</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
function MetricMini({ label, value }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "0.8rem", textAlign: "center" }}>
      <p style={{ ...body, fontSize: 11.5, color: C.inkSoft, margin: "0 0 0.3rem", fontWeight: 600 }}>{label}</p>
      <p style={{ ...heading, fontSize: 18, fontWeight: 600, color: C.ink, margin: 0 }}>{value}</p>
    </div>
  );
}
function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: C.inkFaint, ...body, fontSize: 14.5 }}>
      {text}
    </div>
  );
}

/* ============================================================
   PROGRESS
   ============================================================ */
function ProgressScreen({ sessions }) {
  const [selectedEx, setSelectedEx] = useState("");

  const exerciseOptions = useMemo(() => {
    const seen = new Map();
    sessions.forEach(s => s.exercises.forEach(e => { if (!seen.has(e.id)) seen.set(e.id, e.name); }));
    return Array.from(seen.entries());
  }, [sessions]);

  const activeExId = selectedEx || (exerciseOptions[0]?.[0] ?? "");

  const freqData = useMemo(() => {
    const weeks = [];
    for (let i = 5; i >= 0; i--) {
      const start = startOfWeek(new Date());
      start.setDate(start.getDate() - i * 7);
      const end = new Date(start); end.setDate(end.getDate() + 7);
      const count = sessions.filter(s => { const d = new Date(s.date); return d >= start && d < end; }).length;
      weeks.push({ week: start.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count });
    }
    return weeks;
  }, [sessions]);

  const feedbackData = sessions.map(s => ({
    date: fmtDate(s.date), difficulty: s.feedback.difficulty, energy: s.feedback.energy, recovery: s.feedback.recovery,
  }));

  const perfData = sessions.map(s => ({
    date: fmtDate(s.date),
    performance: Math.round((s.exercises.reduce((sum, e) => sum + ratioFor(e), 0) / s.exercises.length) * 100),
  }));

  const exProgressData = sessions
    .filter(s => s.exercises.some(e => e.id === activeExId))
    .map(s => {
      const e = s.exercises.find(x => x.id === activeExId);
      return { date: fmtDate(s.date), reps: e.type === "reps" ? e.actualReps : e.actualDurationSec, weight: e.actualWeight || 0 };
    });
  const activeExHasWeight = exProgressData.some(d => d.weight > 0);

  if (sessions.length === 0) {
    return (
      <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ ...heading, fontSize: 27, fontWeight: 600, color: C.ink, margin: "0 0 1.5rem" }}>Progress</h1>
        <EmptyState text="Complete a few workouts and your progress will show up here." />
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ ...heading, fontSize: 27, fontWeight: 600, color: C.ink, margin: "0 0 1.5rem" }}>Progress</h1>

      <ChartCard title="Workout frequency" subtitle="Sessions per week">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={freqData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: C.inkSoft }} axisLine={{ stroke: C.line }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.inkSoft }} axisLine={false} tickLine={false} width={24} />
            <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 12.5 }} />
            <Bar dataKey="count" fill={C.moss} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Performance over time" subtitle="Percent of target hit per session">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={perfData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.inkSoft }} axisLine={{ stroke: C.line }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: C.inkSoft }} axisLine={false} tickLine={false} width={30} unit="%" />
            <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 12.5 }} />
            <Line type="monotone" dataKey="performance" stroke={C.moss} strokeWidth={2.5} dot={{ r: 3, fill: C.moss }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Difficulty, energy and recovery" subtitle="Self-reported, 1 to 5">
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={feedbackData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.inkSoft }} axisLine={{ stroke: C.line }} tickLine={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: C.inkSoft }} axisLine={false} tickLine={false} width={20} />
            <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 12.5 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="difficulty" stroke={C.rust} strokeWidth={2} dot={{ r: 2.5 }} />
            <Line type="monotone" dataKey="energy" stroke={C.gold} strokeWidth={2} dot={{ r: 2.5 }} />
            <Line type="monotone" dataKey="recovery" stroke={C.sky} strokeWidth={2} dot={{ r: 2.5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Exercise progression"
        subtitle="Reps or duration, and resistance where logged"
        right={
          <select value={activeExId} onChange={e => setSelectedEx(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "0.4rem 0.6rem", fontSize: 13 }}>
            {exerciseOptions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        }
      >
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={exProgressData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.inkSoft }} axisLine={{ stroke: C.line }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: C.inkSoft }} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 12.5 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="reps" name="Reps/duration" stroke={C.moss} strokeWidth={2.5} dot={{ r: 3 }} />
            {activeExHasWeight && <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke={C.gold} strokeWidth={2.5} dot={{ r: 3 }} />}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
function ChartCard({ title, subtitle, right, children }) {
  return (
    <Card style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.9rem" }}>
        <div>
          <p style={{ ...body, fontWeight: 600, fontSize: 15, color: C.ink, margin: "0 0 0.15rem" }}>{title}</p>
          <p style={{ ...body, fontSize: 12.5, color: C.inkSoft, margin: 0 }}>{subtitle}</p>
        </div>
        {right}
      </div>
      {children}
    </Card>
  );
}

/* ============================================================
   PROFILE
   ============================================================ */
function ProfileScreen({ profile, users, activeUserId, onSwitchUser, onAddUser, onSave }) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const toggle = (key, val) => setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }));

  const save = () => { onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 560, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ ...heading, fontSize: 27, fontWeight: 600, color: C.ink, margin: "0 0 1.5rem" }}>Profile</h1>

      <Card style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Active user">
          <select value={activeUserId || ""} onChange={e => onSwitchUser(e.target.value)} style={inputStyle}>
            {users.map(user => <option key={user.id} value={user.id}>{user.profile.name}</option>)}
          </select>
        </Field>
        <button onClick={onAddUser} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.moss}`, background: C.mossSoft, color: C.mossDeep, fontWeight: 700, cursor: "pointer", ...body, fontSize: 13.5 }}>
          <Plus size={16} /> Add another user
        </button>
      </Card>

      <Card style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Name"><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="Age" style={{ flex: 1 }}><input type="number" style={inputStyle} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /></Field>
          <Field label="Height (cm)" style={{ flex: 1 }}><input type="number" style={inputStyle} value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} /></Field>
          <Field label="Weight (kg)" style={{ flex: 1 }}><input type="number" style={inputStyle} value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} /></Field>
        </div>
        <Field label="Fitness experience">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EXPERIENCE_LEVELS.map(l => <Pill key={l} label={l} active={form.experience === l} onClick={() => setForm({ ...form, experience: l })} />)}
          </div>
        </Field>
      </Card>

      <Card style={{ marginBottom: "1rem" }}>
        <Field label="Goal">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {GOALS.map(g => <Pill key={g} label={g} active={form.goal === g} onClick={() => setForm({ ...form, goal: g })} />)}
          </div>
        </Field>
      </Card>

      <Card style={{ marginBottom: "1rem" }}>
        <Field label="Focus areas">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FOCUS_AREAS.map(f => <Pill key={f} label={f} active={form.focusAreas.includes(f)} onClick={() => toggle("focusAreas", f)} />)}
          </div>
        </Field>
      </Card>

      <Card style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Equipment">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EQUIPMENT_LIST.map(e => <Pill key={e} label={e} active={form.equipment.includes(e)} onClick={() => toggle("equipment", e)} />)}
          </div>
        </Field>
        <Field label="Gym access?">
          <div style={{ display: "flex", gap: 8 }}>
            <Pill label="Yes" active={form.gymAccess === true} onClick={() => setForm({ ...form, gymAccess: true })} />
            <Pill label="No" active={form.gymAccess === false} onClick={() => setForm({ ...form, gymAccess: false })} />
          </div>
        </Field>
      </Card>

      <Card style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Workout location">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {LOCATIONS.map(l => <Pill key={l} label={l} active={form.location === l} onClick={() => setForm({ ...form, location: l })} />)}
          </div>
        </Field>
        <Field label={`Days per week: ${form.daysPerWeek}`}>
          <input type="range" min="1" max="7" step="1" value={form.daysPerWeek} onChange={e => setForm({ ...form, daysPerWeek: Number(e.target.value) })} style={{ width: "100%" }} />
        </Field>
        <Field label="Workout duration">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DURATIONS.map(d => <Pill key={d} label={d} active={form.duration === d} onClick={() => setForm({ ...form, duration: d })} />)}
          </div>
        </Field>
      </Card>

      <PrimaryButton onClick={save} style={{ width: "100%" }}>
        {saved ? <><Check size={16} /> Saved</> : "Save changes"}
      </PrimaryButton>
      <p style={{ ...body, fontSize: 12.5, color: C.inkFaint, textAlign: "center", marginTop: "0.8rem" }}>
        Changes apply to your next generated workout.
      </p>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [stage, setStage] = useState("welcome"); // welcome | onboarding | app
  const [view, setView] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [exerciseLevels, setExerciseLevels] = useState({});
  const [plannedWorkout, setPlannedWorkout] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [pendingSession, setPendingSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [adaptations, setAdaptations] = useState([]);
  const [historyDetailId, setHistoryDetailId] = useState(null);
  const [lastAdaptationResult, setLastAdaptationResult] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 860 : false);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const completeOnboarding = (form) => {
    const userId = uid();
    setProfile(form);
    const workout = generateWorkout(form, {}, null);
    setUsers(existing => [...existing, { id: userId, profile: form, exerciseLevels: {}, plannedWorkout: workout, sessions: [], adaptations: [] }]);
    setActiveUserId(userId);
    setExerciseLevels({});
    setSessions([]);
    setAdaptations([]);
    setPlannedWorkout(workout);
    setStage("app");
    setView("dashboard");
  };

  const startWorkout = () => {
    setActiveWorkout(plannedWorkout);
    setView("workout");
  };

  const finishWorkout = (exercisesWithActuals) => {
    const session = {
      id: activeWorkout.id,
      date: new Date().toISOString(),
      focus: activeWorkout.focusLabel,
      exercises: exercisesWithActuals,
    };
    setPendingSession(session);
    setView("feedback");
  };

  const submitFeedback = (feedback) => {
    const session = { ...pendingSession, feedback };
    const adaptation = computeAdaptation(session, profile);
    adaptation.sourceSessionId = session.id;

    const newLevels = { ...exerciseLevels };
    adaptation.exercises.forEach(a => { newLevels[a.id] = a.next; });

    const nextWorkout = generateWorkout(profile, newLevels, session);

    setSessions(s => [...s, session]);
    setAdaptations(a => [...a, adaptation]);
    setExerciseLevels(newLevels);
    setPlannedWorkout(nextWorkout);
    setLastAdaptationResult(adaptation);
    setPendingSession(null);
    setActiveWorkout(null);
    setView("adaptationResult");
  };

  const viewAfterAdaptation = () => setView("dashboard");

  const saveProfile = (form) => {
    setProfile(form);
    setUsers(existing => existing.map(user => user.id === activeUserId ? { ...user, profile: form } : user));
    const nextWorkout = generateWorkout(form, exerciseLevels, sessions[sessions.length - 1] || null);
    setPlannedWorkout(nextWorkout);
  };

  const switchUser = (userId) => {
    if (userId === activeUserId) return;
    const nextUser = users.find(user => user.id === userId);
    if (!nextUser) return;
    setUsers(existing => existing.map(user => user.id === activeUserId ? {
      ...user, profile, exerciseLevels, plannedWorkout, sessions, adaptations,
    } : user));
    setActiveUserId(nextUser.id);
    setProfile(nextUser.profile);
    setExerciseLevels(nextUser.exerciseLevels || {});
    setPlannedWorkout(nextUser.plannedWorkout);
    setSessions(nextUser.sessions || []);
    setAdaptations(nextUser.adaptations || []);
    setActiveWorkout(null);
    setPendingSession(null);
    setLastAdaptationResult(null);
    setView("dashboard");
  };

  const addUser = () => {
    setUsers(existing => existing.map(user => user.id === activeUserId ? {
      ...user, profile, exerciseLevels, plannedWorkout, sessions, adaptations,
    } : user));
    setStage("onboarding");
  };

  const openHistoryDetail = (id) => { setHistoryDetailId(id); setView("historyDetail"); };

  if (stage === "welcome") {
    return (
      <>
        <style>{FONT_IMPORT}</style>
        <WelcomeScreen onStart={() => setStage("onboarding")} />
      </>
    );
  }
  if (stage === "onboarding") {
    return (
      <>
        <style>{FONT_IMPORT}</style>
        <Onboarding onComplete={completeOnboarding} />
      </>
    );
  }

  let content = null;
  if (view === "dashboard") {
    content = <Dashboard profile={profile} plannedWorkout={plannedWorkout} sessions={sessions} adaptations={adaptations} goToWorkout={startWorkout} />;
  } else if (view === "workout") {
    if (activeWorkout) {
      content = <WorkoutScreen workout={activeWorkout} onFinish={finishWorkout} />;
    } else {
      content = <Dashboard profile={profile} plannedWorkout={plannedWorkout} sessions={sessions} adaptations={adaptations} goToWorkout={startWorkout} />;
    }
  } else if (view === "feedback") {
    content = <FeedbackScreen onSubmit={submitFeedback} />;
  } else if (view === "adaptationResult") {
    content = <AdaptationResultScreen adaptation={lastAdaptationResult} onNext={viewAfterAdaptation} />;
  } else if (view === "history") {
    content = <HistoryScreen sessions={sessions} adaptations={adaptations} onOpen={openHistoryDetail} />;
  } else if (view === "historyDetail") {
    const session = sessions.find(s => s.id === historyDetailId);
    const adaptation = adaptations.find(a => a.sourceSessionId === historyDetailId);
    content = <HistoryDetailScreen session={session} adaptation={adaptation} onBack={() => setView("history")} />;
  } else if (view === "progress") {
    content = <ProgressScreen sessions={sessions} />;
  } else if (view === "profile") {
    content = <ProfileScreen profile={profile} users={users} activeUserId={activeUserId} onSwitchUser={switchUser} onAddUser={addUser} onSave={saveProfile} />;
  }

  const showChrome = view !== "workout" || !activeWorkout ? true : true;

  return (
    <div style={{ ...body, background: C.bg, minHeight: "100vh", color: C.ink }}>
      <style>{FONT_IMPORT}{`* { box-sizing: border-box; } button { font-family: inherit; } input, textarea, select { font-family: inherit; }`}</style>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div style={{ flex: 1 }}>{content}</div>
          <BottomNav view={view === "historyDetail" ? "history" : view === "feedback" || view === "adaptationResult" ? "workout" : view} setView={setView} />
        </div>
      ) : (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar view={view === "historyDetail" ? "history" : view === "feedback" || view === "adaptationResult" ? "workout" : view} setView={setView} />
          <div style={{ flex: 1, overflowY: "auto" }}>{content}</div>
        </div>
      )}
    </div>
  );
}
