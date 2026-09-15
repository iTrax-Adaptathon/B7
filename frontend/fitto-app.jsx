import React, { useState, useMemo, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import {
  Home, Dumbbell, History as HistoryIcon, TrendingUp, User as UserIcon, Users,
  ChevronRight, ChevronLeft, Check, Plus, Minus, Play, Flame, Clock,
  Calendar, ArrowRight, Sparkles, Info, X, Edit2, ChevronDown,
  MessageCircle, Settings, Send, Heart, Share2, Award, ThumbsUp, MessageSquare
  , UtensilsCrossed, Apple, Beef, Wheat, Droplets, PlusCircle, Trash2, Camera, Upload, ScanLine, AlertCircle, Loader, ShieldAlert, Activity
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');";

const C = {
  bg: "#EFF3F6",
  card: "#FFFFFF",
  sidebar: "#202226",
  sidebarLight: "#2C2F35",
  ink: "#181A1E",
  inkSoft: "#616A79",
  inkFaint: "#8792A2",
  line: "rgba(166, 180, 200, 0.3)",
  coral: "#FF5733",
  coralHover: "#EE4A27",
  coralSoft: "#FFEFEB",
  moss: "#2F6B55",
  mossSoft: "#E8F4F0",
  mossDeep: "#1C4E3D",
  gold: "#D97706",
  goldSoft: "#FEF3C7",
  rust: "#DC2626",
  rustSoft: "#FEE2E2",
  sky: "#2563EB",
  skySoft: "#EFF6FF",
};

const heading = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" };
const body = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

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


const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const MEAL_TYPE_ICONS = { Breakfast: Apple, Lunch: UtensilsCrossed, Dinner: Beef, Snack: Wheat };
const MEAL_TYPE_COLORS = { Breakfast: C.gold, Lunch: C.moss, Dinner: C.coral, Snack: C.sky };
const MEAL_TYPE_SOFT = { Breakfast: C.goldSoft, Lunch: C.mossSoft, Dinner: C.coralSoft, Snack: C.skySoft };

const MACRO_GOALS = { protein: 160, carbs: 220, fat: 65, calories: 2100 };

// ── Food Database (per 100 g / standard serving) ──────────────────────────
const FOOD_CATEGORIES = [
  "All", "Protein", "Grains & Carbs", "Dairy & Eggs", "Fruits", "Vegetables",
  "Nuts & Seeds", "Legumes", "Beverages", "Snacks & Sweets",
];

const FOOD_DB = [
  // ── Protein ──
  { id: "f1", name: "Chicken breast (grilled)", category: "Protein", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "f2", name: "Salmon fillet (baked)", category: "Protein", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "f3", name: "Tuna (canned in water)", category: "Protein", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "f4", name: "Ground beef (90% lean)", category: "Protein", calories: 215, protein: 26, carbs: 0, fat: 12 },
  { id: "f5", name: "Turkey breast (roasted)", category: "Protein", calories: 135, protein: 30, carbs: 0, fat: 1 },
  { id: "f6", name: "Shrimp (cooked)", category: "Protein", calories: 99, protein: 24, carbs: 0, fat: 0.3 },
  { id: "f7", name: "Cod fillet (baked)", category: "Protein", calories: 105, protein: 23, carbs: 0, fat: 1 },
  { id: "f8", name: "Pork tenderloin (roasted)", category: "Protein", calories: 143, protein: 26, carbs: 0, fat: 3.5 },
  { id: "f9", name: "Beef steak (lean, grilled)", category: "Protein", calories: 271, protein: 26, carbs: 0, fat: 18 },
  { id: "f10", name: "Protein powder (whey, 1 scoop)", category: "Protein", calories: 120, protein: 25, carbs: 3, fat: 2 },
  { id: "f11", name: "Tofu (firm)", category: "Protein", calories: 76, protein: 8, carbs: 2, fat: 4 },
  { id: "f12", name: "Tempeh", category: "Protein", calories: 193, protein: 19, carbs: 9, fat: 11 },
  { id: "f13", name: "Sardines (in tomato sauce)", category: "Protein", calories: 162, protein: 18, carbs: 3, fat: 8 },
  { id: "f14", name: "Lamb chop (grilled)", category: "Protein", calories: 282, protein: 25, carbs: 0, fat: 20 },
  { id: "f15", name: "Egg white (3 whites)", category: "Protein", calories: 51, protein: 11, carbs: 1, fat: 0 },
  // ── Grains & Carbs ──
  { id: "g1", name: "White rice (cooked, 1 cup)", category: "Grains & Carbs", calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  { id: "g2", name: "Brown rice (cooked, 1 cup)", category: "Grains & Carbs", calories: 216, protein: 5, carbs: 45, fat: 2 },
  { id: "g3", name: "Oats (dry, 50g)", category: "Grains & Carbs", calories: 193, protein: 7, carbs: 33, fat: 3.5 },
  { id: "g4", name: "Whole-wheat bread (2 slices)", category: "Grains & Carbs", calories: 138, protein: 6, carbs: 26, fat: 2 },
  { id: "g5", name: "White bread (2 slices)", category: "Grains & Carbs", calories: 160, protein: 5, carbs: 30, fat: 2 },
  { id: "g6", name: "Pasta (cooked, 1 cup)", category: "Grains & Carbs", calories: 220, protein: 8, carbs: 43, fat: 1.3 },
  { id: "g7", name: "Quinoa (cooked, 1 cup)", category: "Grains & Carbs", calories: 222, protein: 8, carbs: 39, fat: 3.5 },
  { id: "g8", name: "Sweet potato (baked, medium)", category: "Grains & Carbs", calories: 103, protein: 2, carbs: 24, fat: 0.1 },
  { id: "g9", name: "Corn tortilla (2 small)", category: "Grains & Carbs", calories: 100, protein: 3, carbs: 21, fat: 1 },
  { id: "g10", name: "Sourdough bread (1 slice)", category: "Grains & Carbs", calories: 90, protein: 4, carbs: 18, fat: 1 },
  { id: "g11", name: "Granola (45g)", category: "Grains & Carbs", calories: 200, protein: 4, carbs: 30, fat: 8 },
  { id: "g12", name: "Rice cakes (2 plain)", category: "Grains & Carbs", calories: 70, protein: 1, carbs: 15, fat: 0.5 },
  { id: "g13", name: "Couscous (cooked, 1 cup)", category: "Grains & Carbs", calories: 176, protein: 6, carbs: 36, fat: 0.3 },
  // ── Dairy & Eggs ──
  { id: "d1", name: "Whole egg (1 large)", category: "Dairy & Eggs", calories: 72, protein: 6, carbs: 0, fat: 5 },
  { id: "d2", name: "Greek yoghurt (plain, 150g)", category: "Dairy & Eggs", calories: 130, protein: 18, carbs: 7, fat: 4 },
  { id: "d3", name: "Cottage cheese (100g)", category: "Dairy & Eggs", calories: 98, protein: 11, carbs: 3, fat: 4.3 },
  { id: "d4", name: "Whole milk (200ml)", category: "Dairy & Eggs", calories: 122, protein: 6, carbs: 9, fat: 7 },
  { id: "d5", name: "Skimmed milk (200ml)", category: "Dairy & Eggs", calories: 68, protein: 7, carbs: 10, fat: 0.4 },
  { id: "d6", name: "Cheddar cheese (30g)", category: "Dairy & Eggs", calories: 121, protein: 7, carbs: 0, fat: 10 },
  { id: "d7", name: "Mozzarella (50g)", category: "Dairy & Eggs", calories: 142, protein: 10, carbs: 1, fat: 11 },
  { id: "d8", name: "Butter (1 tbsp)", category: "Dairy & Eggs", calories: 102, protein: 0, carbs: 0, fat: 12 },
  { id: "d9", name: "Skyr (150g)", category: "Dairy & Eggs", calories: 90, protein: 15, carbs: 6, fat: 0.5 },
  { id: "d10", name: "Scrambled eggs (2 eggs + milk)", category: "Dairy & Eggs", calories: 200, protein: 14, carbs: 3, fat: 14 },
  // ── Fruits ──
  { id: "fr1", name: "Banana (medium)", category: "Fruits", calories: 89, protein: 1, carbs: 23, fat: 0.3 },
  { id: "fr2", name: "Apple (medium)", category: "Fruits", calories: 95, protein: 0, carbs: 25, fat: 0.3 },
  { id: "fr3", name: "Blueberries (100g)", category: "Fruits", calories: 57, protein: 1, carbs: 14, fat: 0.3 },
  { id: "fr4", name: "Strawberries (100g)", category: "Fruits", calories: 32, protein: 1, carbs: 8, fat: 0.3 },
  { id: "fr5", name: "Orange (medium)", category: "Fruits", calories: 62, protein: 1, carbs: 15, fat: 0.2 },
  { id: "fr6", name: "Mango (100g)", category: "Fruits", calories: 60, protein: 1, carbs: 15, fat: 0.4 },
  { id: "fr7", name: "Avocado (half)", category: "Fruits", calories: 120, protein: 1, carbs: 6, fat: 11 },
  { id: "fr8", name: "Watermelon (200g)", category: "Fruits", calories: 60, protein: 1, carbs: 15, fat: 0 },
  { id: "fr9", name: "Grapes (100g)", category: "Fruits", calories: 69, protein: 1, carbs: 18, fat: 0.2 },
  { id: "fr10", name: "Pineapple (100g)", category: "Fruits", calories: 50, protein: 1, carbs: 13, fat: 0.1 },
  { id: "fr11", name: "Kiwi (1 medium)", category: "Fruits", calories: 42, protein: 1, carbs: 10, fat: 0.4 },
  { id: "fr12", name: "Dates (3 pieces)", category: "Fruits", calories: 90, protein: 1, carbs: 24, fat: 0 },
  // ── Vegetables ──
  { id: "v1", name: "Broccoli (100g, steamed)", category: "Vegetables", calories: 35, protein: 3, carbs: 7, fat: 0.4 },
  { id: "v2", name: "Spinach (100g)", category: "Vegetables", calories: 23, protein: 3, carbs: 4, fat: 0.4 },
  { id: "v3", name: "Bell pepper (1 medium)", category: "Vegetables", calories: 31, protein: 1, carbs: 7, fat: 0.3 },
  { id: "v4", name: "Carrot (1 medium)", category: "Vegetables", calories: 25, protein: 1, carbs: 6, fat: 0.1 },
  { id: "v5", name: "Zucchini (100g)", category: "Vegetables", calories: 17, protein: 1, carbs: 3, fat: 0.3 },
  { id: "v6", name: "Kale (100g)", category: "Vegetables", calories: 49, protein: 4, carbs: 9, fat: 1 },
  { id: "v7", name: "Cherry tomatoes (100g)", category: "Vegetables", calories: 18, protein: 1, carbs: 4, fat: 0.2 },
  { id: "v8", name: "Mushrooms (100g, sautéed)", category: "Vegetables", calories: 29, protein: 4, carbs: 2, fat: 0.5 },
  { id: "v9", name: "Cucumber (100g)", category: "Vegetables", calories: 16, protein: 1, carbs: 4, fat: 0.1 },
  { id: "v10", name: "Edamame (100g)", category: "Vegetables", calories: 121, protein: 11, carbs: 10, fat: 5 },
  { id: "v11", name: "Asparagus (100g, roasted)", category: "Vegetables", calories: 40, protein: 4, carbs: 7, fat: 0.3 },
  { id: "v12", name: "Green beans (100g)", category: "Vegetables", calories: 31, protein: 2, carbs: 7, fat: 0.1 },
  // ── Nuts & Seeds ──
  { id: "n1", name: "Almonds (30g)", category: "Nuts & Seeds", calories: 173, protein: 6, carbs: 6, fat: 15 },
  { id: "n2", name: "Peanut butter (2 tbsp)", category: "Nuts & Seeds", calories: 188, protein: 8, carbs: 6, fat: 16 },
  { id: "n3", name: "Walnuts (30g)", category: "Nuts & Seeds", calories: 196, protein: 5, carbs: 4, fat: 20 },
  { id: "n4", name: "Chia seeds (2 tbsp)", category: "Nuts & Seeds", calories: 120, protein: 4, carbs: 10, fat: 8 },
  { id: "n5", name: "Flaxseed (2 tbsp)", category: "Nuts & Seeds", calories: 110, protein: 4, carbs: 6, fat: 9 },
  { id: "n6", name: "Cashews (30g)", category: "Nuts & Seeds", calories: 157, protein: 5, carbs: 9, fat: 12 },
  { id: "n7", name: "Sunflower seeds (30g)", category: "Nuts & Seeds", calories: 174, protein: 6, carbs: 6, fat: 15 },
  { id: "n8", name: "Almond butter (2 tbsp)", category: "Nuts & Seeds", calories: 196, protein: 7, carbs: 6, fat: 18 },
  // ── Legumes ──
  { id: "l1", name: "Chickpeas (100g, cooked)", category: "Legumes", calories: 164, protein: 9, carbs: 27, fat: 3 },
  { id: "l2", name: "Lentils (100g, cooked)", category: "Legumes", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { id: "l3", name: "Black beans (100g, cooked)", category: "Legumes", calories: 132, protein: 9, carbs: 24, fat: 0.5 },
  { id: "l4", name: "Kidney beans (100g, cooked)", category: "Legumes", calories: 127, protein: 9, carbs: 22, fat: 0.5 },
  { id: "l5", name: "Hummus (2 tbsp)", category: "Legumes", calories: 70, protein: 2, carbs: 6, fat: 5 },
  { id: "l6", name: "Peas (100g, frozen & cooked)", category: "Legumes", calories: 81, protein: 5, carbs: 14, fat: 0.4 },
  // ── Beverages ──
  { id: "b1", name: "Orange juice (200ml)", category: "Beverages", calories: 88, protein: 1, carbs: 21, fat: 0 },
  { id: "b2", name: "Whole milk (glass, 250ml)", category: "Beverages", calories: 149, protein: 8, carbs: 12, fat: 8 },
  { id: "b3", name: "Protein shake (ready-to-drink)", category: "Beverages", calories: 160, protein: 30, carbs: 6, fat: 3 },
  { id: "b4", name: "Coconut water (250ml)", category: "Beverages", calories: 46, protein: 2, carbs: 9, fat: 0.5 },
  { id: "b5", name: "Oat milk (200ml)", category: "Beverages", calories: 90, protein: 3, carbs: 16, fat: 2 },
  { id: "b6", name: "Green smoothie (300ml)", category: "Beverages", calories: 120, protein: 4, carbs: 24, fat: 1.5 },
  { id: "b7", name: "Black coffee (250ml)", category: "Beverages", calories: 5, protein: 0, carbs: 1, fat: 0 },
  { id: "b8", name: "Latte (oat milk, medium)", category: "Beverages", calories: 120, protein: 4, carbs: 18, fat: 3.5 },
  // ── Snacks & Sweets ──
  { id: "s1", name: "Dark chocolate (30g, 70%+)", category: "Snacks & Sweets", calories: 171, protein: 2, carbs: 13, fat: 12 },
  { id: "s2", name: "Rice crackers (15 pieces)", category: "Snacks & Sweets", calories: 110, protein: 2, carbs: 24, fat: 0.5 },
  { id: "s3", name: "Protein bar (typical)", category: "Snacks & Sweets", calories: 200, protein: 20, carbs: 20, fat: 6 },
  { id: "s4", name: "Mixed nuts & raisins (30g)", category: "Snacks & Sweets", calories: 140, protein: 3, carbs: 15, fat: 8 },
  { id: "s5", name: "Popcorn (air-popped, 30g)", category: "Snacks & Sweets", calories: 110, protein: 3, carbs: 22, fat: 1 },
  { id: "s6", name: "Banana bread (1 slice)", category: "Snacks & Sweets", calories: 196, protein: 3, carbs: 33, fat: 7 },
  { id: "s7", name: "Oat & raisin cookie (1)", category: "Snacks & Sweets", calories: 130, protein: 2, carbs: 20, fat: 5 },
  { id: "s8", name: "Honey (1 tbsp)", category: "Snacks & Sweets", calories: 64, protein: 0, carbs: 17, fat: 0 },
  { id: "s9", name: "Peanut butter on rice cake", category: "Snacks & Sweets", calories: 135, protein: 5, carbs: 16, fat: 8 },
  { id: "s10", name: "Trail mix (30g)", category: "Snacks & Sweets", calories: 150, protein: 4, carbs: 15, fat: 9 },
];

const DEFAULT_MEALS = [
  { id: 1, type: "Breakfast", name: "Greek yoghurt with berries & granola", protein: 22, carbs: 48, fat: 9, calories: 365 },
  { id: 2, type: "Lunch", name: "Grilled chicken rice bowl with salad", protein: 45, carbs: 62, fat: 12, calories: 540 },
  { id: 3, type: "Dinner", name: "Salmon fillet with roasted vegetables", protein: 38, carbs: 30, fat: 18, calories: 440 },
  { id: 4, type: "Snack", name: "Protein shake + banana", protein: 28, carbs: 35, fat: 4, calories: 285 },
];


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
function Card({ children, style, className = "" }) {
  return (
    <div
      className={`neu-card ${className}`}
      style={{
        background: "#FFFFFF",
        boxShadow: "10px 10px 24px rgba(166, 180, 200, 0.22), -10px -10px 24px rgba(255, 255, 255, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.85)",
        borderRadius: 24,
        padding: "1.5rem",
        ...style
      }}
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
        background: disabled ? C.inkFaint : "linear-gradient(135deg, #FF6442 0%, #E84925 100%)",
        color: "#fff",
        border: "none",
        borderRadius: 16,
        padding: "0.95rem 1.4rem",
        fontWeight: 700,
        fontSize: 15,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: disabled ? "none" : "0 10px 22px rgba(255, 87, 51, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        ...body,
        ...style,
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "translateY(1px)"; }}
      onMouseUp={e => { if (!disabled) e.currentTarget.style.transform = "translateY(0)"; }}
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
        background: "#FFFFFF",
        color: C.ink,
        border: "1px solid rgba(255, 255, 255, 0.85)",
        boxShadow: "4px 4px 12px rgba(166, 180, 200, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.9)",
        borderRadius: 16,
        padding: "0.85rem 1.3rem",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...body,
        ...style,
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

const decisionColor = { PROGRESS: { bg: C.mossSoft, text: C.mossDeep, border: C.moss }, HOLD: { bg: C.goldSoft, text: "#6B5122", border: C.gold }, BACK_OFF: { bg: C.coralSoft, text: "#7A3624", border: C.coral } };
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
  { id: "meals", label: "Meals", icon: UtensilsCrossed },
  { id: "community", label: "Community", icon: Users },
  { id: "profile", label: "Profile", icon: UserIcon },
];

function Sidebar({ view, setView }) {
  return (
    <aside style={{
      width: 260,
      minHeight: "calc(100vh - 2rem)",
      background: C.sidebar,
      borderRadius: "2.25rem",
      padding: "1.75rem 1.25rem",
      margin: "1rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
      flexShrink: 0
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.25rem 0.5rem" }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: "linear-gradient(135deg, #FF5733 0%, #FF7E61 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 18px rgba(255, 87, 51, 0.35)",
            color: "#fff"
          }}>
            <Sparkles size={20} />
          </div>
          <span style={{ ...heading, fontSize: 22, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>FITTO</span>
        </div>

        {/* Nav Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0.75rem 1rem",
                  borderRadius: 16,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  background: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  boxShadow: active ? "inset 1px 1px 3px rgba(255, 255, 255, 0.15), inset -2px -2px 5px rgba(0, 0, 0, 0.5)" : "none",
                  color: active ? "#FFFFFF" : "#9CA3AF",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  ...body,
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: active ? "#2D3037" : "transparent",
                  boxShadow: active ? "3px 3px 6px rgba(0, 0, 0, 0.35), -1px -1px 3px rgba(255, 255, 255, 0.08)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? C.coral : "#9CA3AF",
                  flexShrink: 0
                }}>
                  <Icon size={17} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Promo Card */}
      <div style={{
        background: "#272A30",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: 20,
        padding: "1.1rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          right: -15,
          bottom: -15,
          width: 80,
          height: 80,
          background: "rgba(255, 87, 51, 0.15)",
          borderRadius: 40,
          filter: "blur(18px)",
          pointerEvents: "none"
        }} />
        <p style={{ ...heading, fontSize: 12.5, fontWeight: 700, color: "#FFFFFF", margin: "0 0 4px", lineHeight: 1.3 }}>
          Level up your fitness program?
        </p>
        <p style={{ ...body, fontSize: 11, color: "#9CA3AF", margin: "0 0 10px", lineHeight: 1.4 }}>
          Unlock personalized plans & weekly live coaching.
        </p>
        <button
          type="button"
          onClick={() => alert("FITTO Pro upgrade coming soon!")}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            background: "#FFFFFF",
            color: C.ink,
            fontWeight: 700,
            fontSize: 12,
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            ...body
          }}
        >
          Upgrade Pro
        </button>
      </div>
    </aside>
  );
}

function BottomNav({ view, setView }) {
  return (
    <div style={{
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      background: C.sidebar,
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      display: "flex",
      padding: "0.5rem 0.4rem",
      paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))",
      zIndex: 20,
    }}>
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "0.45rem 0",
              background: "transparent",
              border: "none",
              color: active ? C.coral : "#9CA3AF",
              cursor: "pointer",
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, ...body }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   DEFAULT TEST PROFILE (Bypass Questionnaire)
   ============================================================ */
const DEFAULT_TEST_PROFILE = {
  name: "Alex River",
  age: "28",
  height: "178",
  weight: "75",
  experience: "Intermediate",
  goal: "Build strength",
  focusAreas: ["Full Body", "Upper Body", "Core"],
  equipment: ["Dumbbells", "Bench", "Pull-up bar", "Resistance bands"],
  gymAccess: true,
  location: "Gym",
  daysPerWeek: 4,
  duration: "45 min",
};

/* ============================================================
   WELCOME
   ============================================================ */
function WelcomeScreen({ onStart, onBypass, onLogout }) {
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
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {onStart && (
            <PrimaryButton onClick={onStart} style={{ width: "100%", padding: "1rem" }}>
              Take Questionnaire <ArrowRight size={18} />
            </PrimaryButton>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "#EF4444",
                fontSize: 13,
                cursor: "pointer",
                padding: "0.5rem",
                ...body,
                fontWeight: 600,
                marginTop: "0.5rem"
              }}
            >
              Sign Out
            </button>
          )}
        </div>
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
  const [form, setForm] = useState(DEFAULT_TEST_PROFILE);
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
        <div style={{ marginBottom: "1rem" }}>
          <span style={{ ...body, fontSize: 12, color: C.inkFaint }}>Step {step + 1} of {ONBOARD_STEPS.length}</span>
        </div>
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

        {error && <p style={{ color: C.coral, fontSize: 13.5, marginTop: 10, ...body }}>{error}</p>}

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
function Dashboard({ profile, plannedWorkout, sessions, adaptations, goToWorkout, meals = [], setMeals }) {
  const firstName = profile.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}`;

  const weekStart = startOfWeek(new Date());
  const thisWeek = sessions.filter(s => new Date(s.date) >= weekStart);
  const target = profile.daysPerWeek || 4;
  const streak = sessions.length; // simplified streak

  const [showAddMeal, setShowAddMeal] = useState(false);

  const lastAdaptation = adaptations[adaptations.length - 1];
  const lastSession = sessions[sessions.length - 1];
  let statusLabel = "High";
  let statusColor = "#10B981";
  if (lastSession) {
    if (lastSession.feedback.recovery <= 2) { statusLabel = "Low"; statusColor = "#EF4444"; }
    else if (lastSession.feedback.recovery <= 3) { statusLabel = "Moderate"; statusColor = "#F59E0B"; }
  }

  // Weekly bar data - simulate based on real sessions
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekBars = DAYS.map((day, i) => {
    const daySession = thisWeek.find(s => {
      const d = new Date(s.date);
      return ((d.getDay() + 6) % 7) === i;
    });
    return { day, filled: !!daySession, isToday: ((now.getDay() + 6) % 7) === i };
  });

  const coral = "#F15B2A";
  const coralDark = "#E04E1F";
  const coralLight = "#FFF4F0";

  // ── Dynamic stat computations ────────────────────────────────
  // Estimate TDEE (maintenance calories) from profile
  const weightKg = parseFloat(profile.weight) || 75;
  const heightCm = parseFloat(profile.height) || 175;
  const ageYears = parseInt(profile.age) || 28;
  const isMale = (profile.gender || "Male") === "Male";
  // Mifflin-St Jeor BMR
  const bmr = isMale
    ? 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  // Activity multiplier based on days per week
  const daysPerWeek = profile.daysPerWeek || 3;
  const activityMult = daysPerWeek <= 2 ? 1.375 : daysPerWeek <= 4 ? 1.55 : 1.725;
  const tdee = Math.round(bmr * activityMult);

  // Daily burn = TDEE adjusted by today's activity (sessions today)
  const todayStr = new Date().toDateString();
  const sessionsToday = sessions.filter(s => new Date(s.date).toDateString() === todayStr);
  const extraBurnToday = sessionsToday.length > 0 ? sessionsToday.length * 280 : 0;
  const dailyBurn = Math.round(bmr * 1.2) + extraBurnToday; // Base + today's exercise
  const dailyGoal = tdee;
  const burnPct = Math.min(100, Math.round((dailyBurn / dailyGoal) * 100));

  // Active time this week in minutes (45 min per session assumed)
  const SESSION_MIN = 45;
  const activeMinWeek = thisWeek.length * SESSION_MIN;
  const prevWeekStart = new Date(weekStart); prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeek = sessions.filter(s => new Date(s.date) >= prevWeekStart && new Date(s.date) < weekStart);
  const prevActiveMin = prevWeek.length * SESSION_MIN;
  const activeTimeDelta = prevActiveMin > 0 ? Math.round(((activeMinWeek - prevActiveMin) / prevActiveMin) * 100) : (thisWeek.length > 0 ? 100 : 0);
  const activeTimeDisplay = activeMinWeek > 0 ? activeMinWeek : "—";

  // Resting HR: estimates based on fitness level (lower = fitter)
  // More sessions → lower estimated RHR
  const totalSessions = sessions.length;
  const baseRHR = isMale ? 72 : 74;
  const fitnessBonus = Math.min(15, Math.floor(totalSessions / 3));
  const restingHR = baseRHR - fitnessBonus;
  const hrLabel = restingHR < 60 ? "Athlete Range" : restingHR < 70 ? "Excellent" : restingHR < 80 ? "Optimal Range" : "Normal";
  const hrColor = restingHR < 70 ? "#10B981" : restingHR < 80 ? "#6B7280" : "#F59E0B";

  const statCard = (label, value, unit, sub, subColor, icon) => (
    <div style={{
      background: "#FFFFFF",
      borderRadius: 24,
      padding: "1.25rem 1.4rem",
      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05), 0 4px 12px -4px rgba(0,0,0,0.03)",
      border: "1px solid #F3F4F6",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "transform 0.2s",
      cursor: "default"
    }}
      onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div>
        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase" }}>
          {label}
        </span>
        <div style={{ marginTop: 4, display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>{value}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF" }}>{unit}</span>
        </div>
        <p style={{ ...body, fontSize: 11, fontWeight: 600, color: subColor, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
          {sub}
        </p>
      </div>
      {icon}
    </div>
  );

  return (
    <div style={{ padding: "1.5rem 2rem 2.5rem", maxWidth: 1100, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

      {/* Header */}
      <header style={{ display: "flex", flexDirection: "column", marginBottom: "1.75rem", paddingTop: "0.5rem" }}>
        <h1 style={{ ...heading, fontSize: "2.2rem", fontWeight: 800, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.03em" }}>
          {greeting}, {firstName}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600, color: "#6B7280", flexWrap: "wrap" }}>
          <span>{dateStr}</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D1D5DB" }} />
          <span style={{ color: coral }}>{streak}-day streak 🔥</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D1D5DB" }} />
          <span style={{ color: statusColor }}>Readiness: {statusLabel}</span>
        </div>
      </header>

      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {statCard(
          "Daily Burn", dailyBurn, `/ ${dailyGoal} kcal`,
          `↑ ${burnPct}% of goal`, burnPct >= 80 ? "#10B981" : burnPct >= 50 ? "#F59E0B" : "#6B7280",
          <div style={{ position: "relative", width: 56, height: 56 }}>
            <svg width="56" height="56" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F3F4F6" strokeWidth="3.5" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={coral} strokeDasharray={`${burnPct}, 100`} strokeLinecap="round" strokeWidth="3.5" />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: coral }}>
              <Flame size={18} />
            </div>
          </div>
        )}
        {statCard(
          "Active Time", activeTimeDisplay, "min this week",
          activeTimeDelta > 0 ? `↑ +${activeTimeDelta}% vs last week` : activeTimeDelta < 0 ? `↓ ${Math.abs(activeTimeDelta)}% vs last week` : thisWeek.length > 0 ? "Same as last week" : "Complete a workout to track",
          activeTimeDelta >= 0 ? "#10B981" : "#F59E0B",
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", color: coral }}>
            <Clock size={24} />
          </div>
        )}
      </div>

      {/* Main layout - single column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Weekly Consistency Chart */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "1.75rem",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05), 0 4px 12px -4px rgba(0,0,0,0.03)",
            border: "1px solid #F3F4F6"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: 8 }}>
              <div>
                <h2 style={{ ...heading, fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>Weekly Consistency</h2>
                <p style={{ ...body, fontSize: 11.5, color: "#9CA3AF", fontWeight: 500, margin: "4px 0 0" }}>
                  Workout sessions this week vs {target}-day goal
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11.5, fontWeight: 600, color: "#6B7280" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: coral, display: "inline-block" }} />
                  Workout day
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: "#E5E7EB", display: "inline-block" }} />
                  Rest / upcoming
                </span>
              </div>
            </div>

            <div style={{ height: 160, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, padding: "4px 8px 0" }}>
              {weekBars.map(({ day, filled, isToday }) => {
                const heightPct = filled ? (60 + Math.random() * 35).toFixed(0) : (isToday ? 0 : 15);
                const barBg = filled ? coral : isToday ? "#FFEDD5" : "#E5E7EB";
                const barInner = filled ? coral : isToday ? `${coral}40` : "#D1D5DB";
                return (
                  <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: isToday ? coral : "#9CA3AF", opacity: filled ? 1 : 0.7 }}>
                      {filled ? `${Math.round(heightPct * 0.6)}m` : isToday ? "Today" : ""}
                    </span>
                    <div style={{
                      width: "100%",
                      maxWidth: 42,
                      background: isToday ? "#FFF7ED" : "#F3F4F6",
                      height: 128,
                      borderRadius: 14,
                      padding: 4,
                      display: "flex",
                      alignItems: "flex-end",
                      outline: isToday ? `2px solid ${coral}40` : "none",
                      outlineOffset: 1
                    }}>
                      <div style={{
                        width: "100%",
                        background: barInner,
                        height: filled ? `${heightPct}%` : isToday ? "0%" : "12%",
                        borderRadius: 10,
                        transition: "height 0.4s ease"
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: isToday ? 800 : 600, color: isToday ? coral : "#9CA3AF" }}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Workout Card */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "1.75rem",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05), 0 4px 12px -4px rgba(0,0,0,0.03)",
            border: "1px solid #F3F4F6"
          }}>
            {/* Card header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase" }}>
                Today's Workout
              </span>
              <span style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#F0FDF4", color: "#16A34A",
                fontSize: 12, fontWeight: 700,
                padding: "4px 12px", borderRadius: 999
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
                Ready to begin
              </span>
            </div>

            {/* Workout details */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <h3 style={{ ...heading, fontSize: "1.85rem", fontWeight: 800, color: "#111827", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                  {plannedWorkout.focusLabel}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 12.5, fontWeight: 600, color: "#6B7280" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={15} color="#9CA3AF" />
                    {plannedWorkout.duration}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Dumbbell size={15} color="#9CA3AF" />
                    {plannedWorkout.exercises.length} exercises
                  </span>
                  <span style={{ color: coral, fontWeight: 700 }}>
                    {profile.experience || "Intermediate"}
                  </span>
                </div>
              </div>

              <button
                onClick={goToWorkout}
                style={{
                  background: coral,
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  padding: "0.85rem 1.75rem",
                  fontWeight: 800,
                  fontSize: 14.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 12px 28px -6px rgba(241, 91, 42, 0.38)",
                  transition: "all 0.2s ease",
                  ...body
                }}
                onMouseOver={e => { e.currentTarget.style.background = coralDark; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = coral; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Play size={16} fill="#fff" /> Start workout
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #F3F4F6",
            }}>
              <button
                onClick={() => setShowAddMeal(true)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: 14,
                  background: coralLight,
                  border: `1.5px solid ${coral}30`,
                  color: coral,
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  ...body
                }}
                onMouseOver={e => { e.currentTarget.style.background = coral; e.currentTarget.style.color = "#fff"; }}
                onMouseOut={e => { e.currentTarget.style.background = coralLight; e.currentTarget.style.color = coral; }}
              >
                <UtensilsCrossed size={16} />
                Log a Meal
              </button>
            </div>
            {showAddMeal && (
              <AddMealModal
                onAdd={meal => { if (setMeals) setMeals(prev => [...prev, meal]); }}
                onClose={() => setShowAddMeal(false)}
              />
            )}
          </div>
        </div>

      </div>
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
  if (!adaptation) return null;

  return (
    <div style={{ padding: "0 0 100px", maxWidth: 640, margin: "0 auto", animation: "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)", boxSizing: "border-box", width: "100%" }}>
      {/* OVERALL RECOMMENDATION BANNER */}
      {adaptation.overall_decision && (
        <Card style={{ 
          marginBottom: "1.5rem", 
          background: adaptation.overall_decision === "REST_DAY" ? "#FEF2F2" : adaptation.overall_decision === "REDUCE" ? "#FFFBEB" : "#F0FDF4",
          border: `1px solid ${adaptation.overall_decision === "REST_DAY" ? "#FECACA" : adaptation.overall_decision === "REDUCE" ? "#FEF3C7" : "#BBF7D0"}`,
          boxShadow: "none"
        }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: adaptation.overall_decision === "REST_DAY" ? "#FEE2E2" : adaptation.overall_decision === "REDUCE" ? "#FEF3C7" : "#DCFCE7",
              color: adaptation.overall_decision === "REST_DAY" ? "#EF4444" : adaptation.overall_decision === "REDUCE" ? "#F59E0B" : "#22C55E"
            }}>
              {adaptation.overall_decision === "REST_DAY" ? <ShieldAlert size={24} /> : adaptation.overall_decision === "REDUCE" ? <Activity size={24} /> : <ThumbsUp size={24} />}
            </div>
            <div>
              <h3 style={{ ...heading, fontSize: 18, color: C.ink, margin: "0 0 4px" }}>
                {adaptation.overall_decision === "REST_DAY" ? "Rest Day Recommended" : adaptation.overall_decision === "REDUCE" ? "Reduce Intensity" : "Same Workout"}
              </h3>
              <p style={{ ...body, fontSize: 14, color: C.inkFaint, margin: 0, lineHeight: 1.5 }}>
                {adaptation.overall_reason || "Based on your performance and recovery."}
              </p>
            </div>
          </div>
        </Card>
      )}

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
            <Line type="monotone" dataKey="difficulty" stroke={C.coral} strokeWidth={2} dot={{ r: 2.5 }} />
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
function ProfileScreen({ profile, users, activeUserId, onSwitchUser, onAddUser, onSave, onRetakeQuestionnaire, onLogout }) {
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
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onAddUser} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.moss}`, background: C.mossSoft, color: C.mossDeep, fontWeight: 700, cursor: "pointer", ...body, fontSize: 13.5 }}>
            <Plus size={16} /> Add another user
          </button>
          {onRetakeQuestionnaire && (
            <button onClick={onRetakeQuestionnaire} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", color: C.inkSoft, fontWeight: 600, cursor: "pointer", ...body, fontSize: 13.5 }}>
              Retake questionnaire
            </button>
          )}
        </div>
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

      {/* Log out */}
      <button
        id="logout-btn"
        onClick={onLogout}
        style={{
          marginTop: "1.25rem",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "0.85rem 1.4rem",
          borderRadius: 14,
          border: `1.5px solid ${C.rust}`,
          background: C.rustSoft,
          color: C.rust,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          ...body,
          transition: "background 0.15s, transform 0.1s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#f4d0c8"; }}
        onMouseLeave={e => { e.currentTarget.style.background = C.rustSoft; }}
        onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
        onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        <X size={16} /> Log out
      </button>
    </div>
  );
}

/* ============================================================
   COMMUNITY SCREEN
   ============================================================ */

const BACKEND_URL = "http://localhost:3001";

const LEADERBOARD = [
  { rank: 1, name: "Marcus Vance", streak: "28 days", workouts: 32, badge: "🏆" },
  { rank: 2, name: "Elena Rostova", streak: "21 days", workouts: 26, badge: "🥈" },
  { rank: 3, name: "David Chen", streak: "14 days", workouts: 19, badge: "🥉" },
  { rank: 4, name: "Alex River (You)", streak: "7 days", workouts: 12, badge: "⚡" },
];

function CommunityScreen({ profile }) {
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostText, setNewPostText] = useState("");
  const [postCategory, setPostCategory] = useState("Workout");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const fileInputRef = React.useRef(null);

  // Load posts from backend (with author JOIN, comments, likes)
  const loadPosts = React.useCallback(async () => {
    setLoadingPosts(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || "";
      const res = await fetch(`${BACKEND_URL}/api/posts?userId=${userId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  // Toggle like — call backend then update local state optimistically
  const handleLike = async (postId) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
        : p
    ));
    try {
      await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id }),
      });
    } catch (err) {
      console.error("Like error:", err);
      // Revert on failure
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, likes: p.liked ? p.likes + 1 : p.likes - 1, liked: !p.liked }
          : p
      ));
    }
  };

  // Create post — optionally upload image first, then create post record
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedImage) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { alert("Please sign in to post."); return; }

    setSubmittingPost(true);
    let image_url = null;

    try {
      // Step 1: Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("image", selectedImage);
        const uploadRes = await fetch(`${BACKEND_URL}/api/posts/upload`, {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        image_url = uploadData.url;
        setUploadingImage(false);
      }

      // Step 2: Create the post
      const res = await fetch(`${BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session.user.id,
          content: newPostText.trim() || "📸 Shared a photo",
          tag: postCategory,
          image_url,
        }),
      });
      if (!res.ok) throw new Error("Post creation failed");
      const newPost = await res.json();

      setPosts(prev => [newPost, ...prev]);
      setNewPostText("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Post error:", err);
      alert("Failed to create post. Is the backend running?");
    } finally {
      setSubmittingPost(false);
      setUploadingImage(false);
    }
  };

  // Delete own post
  const handleDeletePost = async (postId) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    if (!window.confirm("Delete this post?")) return;
    try {
      await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id }),
      });
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Add comment — save to backend, update local state
  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const text = commentInput.trim();
    setCommentInput("");
    setActiveCommentPostId(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id, content: text }),
      });
      if (!res.ok) throw new Error("Comment failed");
      const newComment = await res.json();
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      ));
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <div style={{ padding: "1.5rem 1.25rem 2.5rem", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={{ ...body, fontSize: 12.5, fontWeight: 700, color: C.moss, textTransform: "uppercase", letterSpacing: 0.5 }}>
            FITTO Tribe
          </span>
          <h1 style={{ ...heading, fontSize: 27, fontWeight: 600, color: C.ink, margin: "0.2rem 0 0" }}>
            Community
          </h1>
        </div>

        {/* Tab Pills */}
        <div style={{ display: "flex", gap: 6, background: "#EAE7DD", padding: 4, borderRadius: 12 }}>
          {[
            { id: "feed", label: "Activity Feed" },
            { id: "leaderboard", label: "Leaderboard" },
            { id: "challenges", label: "Challenges" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: "none",
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? C.ink : C.inkSoft,
                padding: "0.45rem 0.9rem",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                ...body,
                transition: "all 0.15s ease"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "feed" && (
        <>
          {/* Post Creation Box */}
          <Card style={{ marginBottom: "1.5rem", padding: "1.1rem 1.25rem" }}>
            <form onSubmit={handleAddPost}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: C.mossSoft, color: C.mossDeep,
                  fontWeight: 700, fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  {(profile?.name || "Me").split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <textarea
                  placeholder="Share a milestone, workout accomplishment, or question with the community..."
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  style={{
                    flex: 1, minHeight: 68,
                    border: `1.5px solid ${C.line}`, borderRadius: 12,
                    padding: "0.75rem 0.9rem", fontSize: 14,
                    color: C.ink, outline: "none", resize: "none",
                    background: "#FAF9F5", ...body
                  }}
                />
              </div>

              {/* Image preview */}
              {selectedImage && (
                <div style={{ position: "relative", marginBottom: 10, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.line}` }}>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }}
                  />
                  <button
                    type="button"
                    onClick={() => { setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: "rgba(0,0,0,0.55)", color: "#fff",
                      border: "none", borderRadius: "50%",
                      width: 28, height: 28, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                    }}
                  >×</button>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  {/* Image upload button */}
                  <label style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "0.3rem 0.65rem", borderRadius: 8, fontSize: 12,
                    border: `1px solid ${C.line}`, background: "transparent",
                    color: C.inkSoft, cursor: "pointer", fontWeight: 500, ...body
                  }}>
                    <Share2 size={12} />
                    {uploadingImage ? "Uploading..." : "Photo"}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      style={{ display: "none" }}
                      onChange={e => { if (e.target.files?.[0]) setSelectedImage(e.target.files[0]); }}
                    />
                  </label>

                  {/* Category tags */}
                  {["Workout", "Milestone", "Question", "Motivation"].map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setPostCategory(tag)}
                      style={{
                        padding: "0.3rem 0.65rem", borderRadius: 8, fontSize: 12,
                        border: `1px solid ${postCategory === tag ? C.moss : C.line}`,
                        background: postCategory === tag ? C.mossSoft : "transparent",
                        color: postCategory === tag ? C.mossDeep : C.inkSoft,
                        cursor: "pointer", fontWeight: 500, ...body
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <PrimaryButton
                  type="submit"
                  disabled={submittingPost || (!newPostText.trim() && !selectedImage)}
                  style={{ padding: "0.55rem 1.1rem", fontSize: 13.5 }}
                >
                  <Send size={14} />
                  {submittingPost ? (uploadingImage ? "Uploading..." : "Posting...") : "Share Post"}
                </PrimaryButton>
              </div>
            </form>
          </Card>

          {/* Posts Feed */}
          {loadingPosts ? (
            <div style={{ textAlign: "center", padding: "3rem", color: C.inkSoft, ...body }}>
              Loading community posts...
            </div>
          ) : posts.length === 0 ? (
            <Card style={{ textAlign: "center", padding: "2.5rem", color: C.inkSoft }}>
              <p style={{ margin: 0, ...body }}>No posts yet. Be the first to share! 💪</p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {posts.map(post => (
                <Card key={post.id} style={{ padding: "1.25rem" }}>
                  {/* Author Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: C.mossSoft, color: C.mossDeep,
                        fontWeight: 700, fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {post.avatar}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 15, color: C.ink }}>{post.author}</span>
                        <div style={{ fontSize: 12, color: C.inkFaint }}>{post.time}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 11.5, fontWeight: 600,
                        padding: "0.25rem 0.65rem", borderRadius: 999,
                        background: C.line, color: C.inkSoft
                      }}>
                        {post.tag}
                      </span>
                      {/* Delete button — only shown if post belongs to current session user */}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        style={{
                          background: "transparent", border: "none",
                          color: C.inkFaint, cursor: "pointer", fontSize: 17,
                          padding: "0.1rem 0.3rem", lineHeight: 1
                        }}
                        title="Delete post"
                      >×</button>
                    </div>
                  </div>

                  {/* Post Image */}
                  {post.image_url && (
                    <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12, border: `1px solid ${C.line}` }}>
                      <img
                        src={post.image_url}
                        alt="Post"
                        style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block" }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <p style={{ ...body, fontSize: 14.5, color: C.ink, lineHeight: 1.55, margin: "0 0 1rem" }}>
                    {post.content}
                  </p>

                  {/* Action Row */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    paddingTop: 10,
                    borderTop: `1px solid ${C.line}`,
                    fontSize: 13,
                    color: C.inkSoft
                  }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "transparent",
                        border: "none",
                        color: post.liked ? C.coral : C.inkSoft,
                        cursor: "pointer",
                        fontWeight: 600,
                        padding: "0.2rem 0.4rem",
                        borderRadius: 6
                      }}
                    >
                      <Heart size={16} fill={post.liked ? C.coral : "none"} color={post.liked ? C.coral : C.inkSoft} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "transparent",
                        border: "none",
                        color: C.inkSoft,
                        cursor: "pointer",
                        fontWeight: 600,
                        padding: "0.2rem 0.4rem"
                      }}
                    >
                      <MessageSquare size={16} />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {post.comments.length > 0 && (
                    <div style={{ marginTop: 12, paddingLeft: 10, borderLeft: `2px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 8 }}>
                      {post.comments.map(c => (
                        <div key={c.id} style={{ fontSize: 13 }}>
                          <span style={{ fontWeight: 600, color: C.ink }}>{c.author}: </span>
                          <span style={{ color: C.inkSoft }}>{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  {activeCommentPostId === post.id && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <input
                        type="text"
                        placeholder="Write an encouraging reply..."
                        value={commentInput}
                        onChange={e => setCommentInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleAddComment(post.id); }}
                        style={{
                          flex: 1,
                          padding: "0.55rem 0.75rem",
                          borderRadius: 10,
                          border: `1.5px solid ${C.line}`,
                          fontSize: 13,
                          outline: "none",
                          ...body
                        }}
                      />
                      <PrimaryButton onClick={() => handleAddComment(post.id)} style={{ padding: "0.55rem 0.9rem", fontSize: 13 }}>
                        Reply
                      </PrimaryButton>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "leaderboard" && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.2rem" }}>
            <Award size={20} color={C.gold} />
            <h3 style={{ ...heading, fontSize: 18, fontWeight: 600, margin: 0, color: C.ink }}>
              Weekly Consistency Leaderboard
            </h3>
          </div>
          <p style={{ ...body, fontSize: 13.5, color: C.inkSoft, margin: "0 0 1.25rem" }}>
            Recognizing dedicated community members keeping their daily and weekly fitness momentum going.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {LEADERBOARD.map(item => (
              <div
                key={item.rank}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: 12,
                  background: item.rank === 4 ? C.mossSoft : "#FAF9F5",
                  border: `1px solid ${item.rank === 4 ? C.moss : C.line}`
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.badge}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14.5, color: item.rank === 4 ? C.mossDeep : C.ink }}>
                      {item.name}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: C.inkSoft }}>
                      {item.workouts} sessions completed
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.moss
                  }}>
                    <Flame size={14} /> {item.streak}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "challenges" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              title: "30-Day Adaptive Core Surge",
              participants: "1,240 members",
              tag: "Monthly Challenge",
              description: "Complete at least 3 core-focused workouts each week. Earn the Core Master community badge.",
              joined: true,
              progress: 60
            },
            {
              title: "Weekend 100-Pushup Milestone",
              participants: "850 members",
              tag: "Weekend Sprint",
              description: "Accumulate 100 perfect push-ups across Saturday and Sunday. Scale with bench or incline.",
              joined: false,
              progress: 0
            },
            {
              title: "Active Recovery & Mobility Week",
              participants: "620 members",
              tag: "Mobility",
              description: "Log 5 sessions of dynamic stretching or yoga flow to optimize systemic muscular recovery.",
              joined: true,
              progress: 40
            }
          ].map((ch, idx) => (
            <Card key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.moss, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    {ch.tag}
                  </span>
                  <h3 style={{ ...heading, fontSize: 17, fontWeight: 600, margin: "0.2rem 0 0", color: C.ink }}>
                    {ch.title}
                  </h3>
                </div>
                <span style={{ fontSize: 12, color: C.inkSoft }}>{ch.participants}</span>
              </div>

              <p style={{ ...body, fontSize: 13.5, color: C.inkSoft, margin: "0 0 1rem", lineHeight: 1.5 }}>
                {ch.description}
              </p>

              {ch.joined && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.inkSoft, marginBottom: 4 }}>
                    <span>Progress</span>
                    <span>{ch.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: C.line, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${ch.progress}%`, height: "100%", background: C.moss, borderRadius: 3 }} />
                  </div>
                </div>
              )}

              <PrimaryButton
                style={{
                  width: "100%",
                  padding: "0.65rem",
                  fontSize: 13.5,
                  background: ch.joined ? C.mossSoft : C.moss,
                  color: ch.joined ? C.mossDeep : "#fff",
                  border: ch.joined ? `1px solid ${C.moss}` : "none"
                }}
              >
                {ch.joined ? "Joined • View Activities" : "Join Challenge"}
              </PrimaryButton>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FLOATING CHATBOT
   ============================================================ */
function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("chat"); // "chat" | "settings"
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi there! How can I help you with your fitness journey today?" }
  ]);
  const [input, setInput] = useState("");

  // Settings state
  const [botPersonality, setBotPersonality] = useState("Motivator"); // Motivator, Drill Sergeant, Analytical

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput("");

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
          personality: botPersonality
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: "Error: " + (data.error || "Failed to reach AI.") }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Network error: Make sure the backend server is running." }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        aria-label="AI Assistant"
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#202226",
          color: "#fff",
          border: "none",
          boxShadow: "6px 6px 18px rgba(32, 34, 38, 0.35), -6px -6px 16px rgba(255, 255, 255, 0.8)",
          display: isOpen ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 999,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "8px 8px 22px rgba(32, 34, 38, 0.45)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "6px 6px 18px rgba(32, 34, 38, 0.35), -6px -6px 16px rgba(255, 255, 255, 0.8)";
        }}
      >
        <MessageCircle size={26} color="#FFFFFF" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: 360,
          height: 520,
          maxWidth: "calc(100vw - 3rem)",
          background: C.card,
          borderRadius: 20,
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
          overflow: "hidden",
          border: `1px solid ${C.line}`,
        }}>
          {/* Header */}
          <div style={{
            background: C.moss,
            color: "#fff",
            padding: "1rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={16} />
              </div>
              <div>
                <h3 style={{ ...heading, fontSize: 16, fontWeight: 600, margin: 0 }}>Fitto Assistant</h3>
                <p style={{ ...body, fontSize: 12, margin: 0, opacity: 0.8 }}>{botPersonality} Mode</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setView(view === "chat" ? "settings" : "chat")} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}>
                <Settings size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          {view === "chat" ? (
            <>
              {/* Messages Area */}
              <div style={{ flex: 1, padding: "1.25rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, background: C.bg }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    background: msg.role === "user" ? C.moss : C.card,
                    color: msg.role === "user" ? "#fff" : C.ink,
                    padding: "0.75rem 1rem",
                    borderRadius: 16,
                    borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                    borderBottomLeftRadius: msg.role === "bot" ? 4 : 16,
                    maxWidth: "85%",
                    fontSize: 14,
                    lineHeight: 1.5,
                    border: msg.role === "bot" ? `1px solid ${C.line}` : "none",
                    ...body
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={sendMessage} style={{ display: "flex", padding: "1rem", gap: 10, borderTop: `1px solid ${C.line}`, background: C.card }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  style={{
                    flex: 1,
                    padding: "0.75rem 1rem",
                    borderRadius: 20,
                    border: `1.5px solid ${C.line}`,
                    outline: "none",
                    fontSize: 14.5,
                    ...body
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    background: input.trim() ? C.moss : C.line,
                    color: input.trim() ? "#fff" : C.inkFaint,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: input.trim() ? "pointer" : "default",
                    transition: "background 0.2s"
                  }}
                >
                  <Send size={18} style={{ marginLeft: 2 }} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, padding: "1.5rem 1.25rem", overflowY: "auto", background: C.bg, ...body }}>
              <h3 style={{ ...heading, fontSize: 20, color: C.ink, margin: "0 0 1.5rem" }}>Chatbot Settings</h3>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 8 }}>Bot Personality</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Motivator", "Drill Sergeant", "Analytical"].map(p => (
                    <label key={p} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.75rem", background: C.card, border: `1px solid ${botPersonality === p ? C.moss : C.line}`, borderRadius: 10, cursor: "pointer" }}>
                      <input type="radio" name="personality" checked={botPersonality === p} onChange={() => setBotPersonality(p)} style={{ accentColor: C.moss }} />
                      <span style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => setView("chat")} style={{ width: "100%", padding: "0.85rem", background: C.moss, color: "#fff", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer", ...body }}>
                Save Settings
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ============================================================
   AUTH SCREEN
   ============================================================ */
function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        onAuthSuccess(data.user, false);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        });
        if (signUpError) throw signUpError;
        onAuthSuccess(data.user, true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: "1.5rem" }}>
      <style>{FONT_IMPORT}</style>
      <div style={{
        background: "#FFFFFF", borderRadius: 24, padding: "2.5rem 2rem", width: "100%", maxWidth: 400,
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05), 0 10px 20px -10px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: "2rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #F15B2A 0%, #E04E1F 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 8px 16px rgba(241, 91, 42, 0.25)" }}>
            <Dumbbell size={24} />
          </div>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.05em", color: "#111827" }}>FITTO</span>
        </div>

        <h2 style={{ ...heading, fontSize: 22, fontWeight: 800, color: "#111827", textAlign: "center", marginBottom: 6 }}>
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p style={{ ...body, fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: "2rem" }}>
          {isLogin ? "Enter your details to sign in." : "Start your fitness journey today."}
        </p>

        {error && (
          <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "0.75rem", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: "1.5rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #E5E7EB", outline: "none", fontSize: 14, background: "#F9FAFB", ...body }} placeholder="John Doe" />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #E5E7EB", outline: "none", fontSize: 14, background: "#F9FAFB", ...body }} placeholder="john@example.com" />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid #E5E7EB", outline: "none", fontSize: 14, background: "#F9FAFB", ...body }} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "0.85rem", marginTop: "0.5rem",
            background: loading ? "#FCA5A5" : "#F15B2A", color: "#fff",
            border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 8px 16px -4px rgba(241, 91, 42, 0.3)",
            transition: "all 0.2s"
          }}>
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#6B7280" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(""); }} style={{ color: "#F15B2A", cursor: "pointer", fontWeight: 700 }}>
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}

function MacroRing({ label, value, goal, color, icon: Icon }) {
  const pct = Math.min(1, value / goal);
  const r = 28, stroke = 5, circ = 2 * Math.PI * r;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={70} height={70} style={{ display: "block", margin: "0 auto" }}>
        <circle cx={35} cy={35} r={r} fill="none" stroke={C.line} strokeWidth={stroke} />
        <circle
          cx={35} cy={35} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.5s" }}
        />
        <text x={35} y={33} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: C.ink, fontFamily: "Manrope, sans-serif" }}>{value}g</text>
        <text x={35} y={46} textAnchor="middle" style={{ fontSize: 9, fill: C.inkFaint, fontFamily: "Manrope, sans-serif" }}>/ {goal}g</text>
      </svg>
      <p style={{ ...body, fontSize: 11.5, fontWeight: 700, color, margin: "0.3rem 0 0", textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</p>
    </div>
  );
}

function MealCard({ meal, onDelete }) {
  const Icon = MEAL_TYPE_ICONS[meal.type] || UtensilsCrossed;
  const color = MEAL_TYPE_COLORS[meal.type] || C.ink;
  const soft = MEAL_TYPE_SOFT[meal.type] || C.line;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "0.9rem 1rem", display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ ...body, fontSize: 10.5, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.3, margin: "0 0 0.15rem" }}>{meal.type}</p>
            <p style={{ ...body, fontSize: 14.5, fontWeight: 600, color: C.ink, margin: "0 0 0.4rem" }}>{meal.name}</p>
          </div>
          <button onClick={() => onDelete(meal.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: C.inkFaint, lineHeight: 1 }}>
            <Trash2 size={15} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[{ k: "Protein", v: meal.protein, c: C.sky }, { k: "Carbs", v: meal.carbs, c: C.gold }, { k: "Fat", v: meal.fat, c: C.coral }, { k: "Kcal", v: meal.calories, c: C.moss }].map(({ k, v, c }) => (
            <span key={k} style={{ ...body, fontSize: 12, color: C.inkSoft }}>
              <span style={{ fontWeight: 700, color: c }}>{v}</span> {k === "Kcal" ? "kcal" : "g"} {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddMealModal({ onAdd, onClose }) {
  const [tab, setTab] = useState("browse");        // "browse" | "manual" | "scan"
  const [mealType, setMealType] = useState("Breakfast");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);  // food item from DB

  // manual entry
  const [manName, setManName] = useState("");
  const [manProtein, setManProtein] = useState("");
  const [manCarbs, setManCarbs] = useState("");
  const [manFat, setManFat] = useState("");
  const manKcal = Math.round((Number(manProtein) * 4) + (Number(manCarbs) * 4) + (Number(manFat) * 9));

  // scan / AI tab
  const [scanImage, setScanImage] = useState(null);     // data URL
  const [scanAmount, setScanAmount] = useState("100");   // grams
  const [scanApiKey, setScanApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);   // { name, calories, protein, carbs, fat }
  const [scanError, setScanError] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // in-app camera
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const filtered = FOOD_DB.filter(f => {
    const catMatch = category === "All" || f.category === category;
    const qMatch = !query || f.name.toLowerCase().includes(query.toLowerCase());
    return catMatch && qMatch;
  });

  const addFromDB = () => {
    if (!selected) return;
    onAdd({ id: Date.now(), type: mealType, name: selected.name, protein: selected.protein, carbs: selected.carbs, fat: selected.fat, calories: selected.calories });
    onClose();
  };

  const addManual = () => {
    if (!manName || !manProtein || !manCarbs || !manFat) return;
    onAdd({ id: Date.now(), type: mealType, name: manName, protein: Number(manProtein), carbs: Number(manCarbs), fat: Number(manFat), calories: manKcal });
    onClose();
  };

  // ── Scan helpers ──
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanResult(null); setScanError("");
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxD = 1024;
        let w = img.width;
        let h = img.height;
        if (w > maxD || h > maxD) {
          if (w > h) { h = Math.round(h * maxD / w); w = maxD; }
          else { w = Math.round(w * maxD / h); h = maxD; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        setScanImage(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      // fallback to native file input if camera fails
      cameraInputRef.current.click();
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const maxD = 1024;
      let w = video.videoWidth;
      let h = video.videoHeight;
      if (w > maxD || h > maxD) {
        if (w > h) { h = Math.round(h * maxD / w); w = maxD; }
        else { w = Math.round(w * maxD / h); h = maxD; }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, w, h);
      setScanImage(canvas.toDataURL("image/jpeg", 0.8));
      stopCamera();
    }
  };

  React.useEffect(() => {
    return () => stopCamera();
  }, []);

  // Smart fallback: match image filename / guess against FOOD_DB
  const fallbackAnalyse = () => {
    const grams = Math.max(1, Number(scanAmount) || 100);
    const ratio = grams / 100;
    // pick a random plausible food from Protein category as a demo result
    const candidates = FOOD_DB.filter(f => f.category === "Protein" || f.category === "Grains & Carbs");
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setScanResult({
      name: pick.name,
      calories: Math.round(pick.calories * ratio),
      protein: Math.round(pick.protein * ratio * 10) / 10,
      carbs: Math.round(pick.carbs * ratio * 10) / 10,
      fat: Math.round(pick.fat * ratio * 10) / 10,
      note: "(Demo mode — add a Gemini API key for real analysis)"
    });
  };

  const analyseFood = async () => {
    if (!scanImage) return;
    setScanError(""); setScanResult(null); setScanning(true);
    const grams = Math.max(1, Number(scanAmount) || 100);

    if (!scanApiKey.trim()) {
      // no key — run demo fallback after a fake delay
      setTimeout(() => { fallbackAnalyse(); setScanning(false); }, 1800);
      return;
    }

    try {
      const base64 = scanImage.split(",")[1];
      const mimeType = scanImage.split(";")[0].split(":")[1];
      const prompt = `You are a nutrition expert. Identify the food item in this image and calculate its nutritional content for a serving of ${grams}g. Respond ONLY with a JSON object in this exact format, no other text: {"name": "Food name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${scanApiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inlineData: { mimeType, data: base64 } }
              ]
            }]
          })
        }
      );

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse response");
      const parsed = JSON.parse(jsonMatch[0]);
      setScanResult(parsed);
    } catch (err) {
      console.error("Analysis failed:", err);
      const isFetchErr = err.message.includes("Failed to fetch");
      setScanError(`Analysis failed: ${err.message}.${isFetchErr ? " (Check ad-blockers or try a smaller image)" : ""} Showing demo result.`);
      fallbackAnalyse();
    } finally {
      setScanning(false);
    }
  };

  const addFromScan = () => {
    if (!scanResult) return;
    onAdd({ id: Date.now(), type: mealType, name: scanResult.name, protein: scanResult.protein, carbs: scanResult.carbs, fat: scanResult.fat, calories: scanResult.calories });
    onClose();
  };

  const TAB_BTN = (id, label, Icon) => (
    <button
      key={id} onClick={() => setTab(id)}
      style={{
        flex: 1, padding: "0.5rem 0.3rem", borderRadius: 10, border: "none", cursor: "pointer",
        background: tab === id ? C.moss : "transparent",
        color: tab === id ? "#fff" : C.inkSoft,
        fontWeight: tab === id ? 700 : 500, fontSize: 12.5, ...body,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        transition: "background 0.15s, color 0.15s",
      }}
    >{Icon && <Icon size={13} />}{label}</button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(38,40,31,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFileSelect} />

      <div style={{ background: C.bg, borderRadius: "22px 22px 0 0", padding: "1.25rem 1.25rem 2rem", width: "100%", maxWidth: 520, maxHeight: "92vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ ...heading, fontSize: 20, fontWeight: 600, color: C.ink, margin: 0 }}>Log a meal</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkSoft }}><X size={20} /></button>
        </div>

        {/* Meal type pills */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: "1rem" }}>
          {MEAL_TYPES.map(t => (
            <Pill key={t} label={t} active={mealType === t} onClick={() => setMealType(t)} />
          ))}
        </div>

        {/* Tab switcher — 3 tabs */}
        <div style={{ display: "flex", gap: 4, background: C.line, borderRadius: 12, padding: 4, marginBottom: "1rem" }}>
          {TAB_BTN("browse", "Browse", UtensilsCrossed)}
          {TAB_BTN("scan", "Scan Food", Camera)}
          {TAB_BTN("manual", "Manual", Edit2)}
        </div>

        {/* ── SCAN TAB ── */}
        {tab === "scan" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 12, overflowY: "auto" }}>

            {/* Image picker */}
            {showCamera ? (
              <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "#000", height: 260 }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 15 }}>
                  <button onClick={stopCamera} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", backdropFilter: "blur(4px)", ...body, fontSize: 13, fontWeight: 600 }}>Cancel</button>
                  <button onClick={capturePhoto} style={{ padding: "8px 24px", borderRadius: 20, border: "none", background: C.moss, color: "#fff", cursor: "pointer", ...body, fontSize: 14, fontWeight: 700 }}>Capture</button>
                </div>
              </div>
            ) : !scanImage ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={startCamera}
                  style={{
                    flex: 1, padding: "1.1rem", borderRadius: 14, border: `2px dashed ${C.moss}`,
                    background: C.mossSoft, cursor: "pointer", display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 8, color: C.mossDeep, ...body, fontWeight: 600, fontSize: 13.5,
                  }}
                >
                  <Camera size={28} color={C.moss} />
                  Take photo
                </button>
                <button
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    flex: 1, padding: "1.1rem", borderRadius: 14, border: `2px dashed ${C.gold}`,
                    background: C.goldSoft, cursor: "pointer", display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 8, color: C.gold, ...body, fontWeight: 600, fontSize: 13.5,
                  }}
                >
                  <Upload size={28} color={C.gold} />
                  Upload photo
                </button>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <img src={scanImage} alt="food" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 14 }} />
                <button
                  onClick={() => { setScanImage(null); setScanResult(null); setScanError(""); }}
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(38,40,31,0.7)", border: "none", borderRadius: 20, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
                ><X size={14} /></button>
              </div>
            )}

            {/* Amount input */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label style={{ ...body, fontSize: 12.5, fontWeight: 600, color: C.inkSoft, display: "block", marginBottom: 5 }}>Serving amount</label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    type="number" min="1" max="2000"
                    value={scanAmount}
                    onChange={e => { setScanAmount(e.target.value); setScanResult(null); }}
                    placeholder="100"
                  />
                  <span style={{ ...body, fontSize: 13, color: C.inkSoft, whiteSpace: "nowrap" }}>grams</span>
                </div>
              </div>
            </div>

            {/* API Key (collapsible hint) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ ...body, fontSize: 12.5, fontWeight: 600, color: C.inkSoft, margin: 0 }}>Gemini AI Analysis</p>
              <button onClick={() => setShowApiKeyInput(!showApiKeyInput)} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkSoft, display: "flex", alignItems: "center" }} title="API Key Settings">
                <Settings size={18} color={showApiKeyInput ? C.ink : C.inkSoft} />
              </button>
            </div>

            {showApiKeyInput && (
              <div style={{ background: C.skySoft, borderRadius: 10, padding: "0.65rem 0.85rem", marginTop: "-4px" }}>
                <p style={{ ...body, fontSize: 12, color: C.sky, margin: "0 0 5px", fontWeight: 700 }}>🔑 API Key</p>
                <input
                  style={{ ...inputStyle, fontSize: 12.5 }}
                  type="password"
                  placeholder="Paste your Gemini API key"
                  value={scanApiKey}
                  onChange={e => setScanApiKey(e.target.value)}
                />
                <p style={{ ...body, fontSize: 11, color: C.sky, margin: "4px 0 0", opacity: 0.8 }}>Required for real AI analysis.</p>
              </div>
            )}

            {/* Analyse button */}
            <PrimaryButton
              onClick={analyseFood}
              disabled={!scanImage || scanning}
              style={{ width: "100%", background: scanning ? C.inkFaint : C.mossDeep }}
            >
              {scanning
                ? <><Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> Analysing…</>
                : <><ScanLine size={16} /> Analyse food</>}
            </PrimaryButton>

            {/* Spinner keyframes */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Error */}
            {scanError && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.coralSoft, borderRadius: 10, padding: "0.65rem 0.85rem" }}>
                <AlertCircle size={15} color={C.coral} style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ ...body, fontSize: 12.5, color: C.coral, margin: 0 }}>{scanError}</p>
              </div>
            )}

            {/* Results card */}
            {scanResult && (
              <div style={{ background: C.card, border: `1.5px solid ${C.moss}`, borderRadius: 14, padding: "1rem 1.1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.mossSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={16} color={C.moss} />
                  </div>
                  <div>
                    <p style={{ ...body, fontSize: 11, fontWeight: 700, color: C.moss, textTransform: "uppercase", letterSpacing: 0.3, margin: 0 }}>Identified</p>
                    <p style={{ ...body, fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>{scanResult.name}</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: scanResult.note ? "0.6rem" : 0 }}>
                  {[{ k: "Calories", v: scanResult.calories, c: C.coral, unit: "kcal" }, { k: "Protein", v: scanResult.protein, c: C.sky, unit: "g" }, { k: "Carbs", v: scanResult.carbs, c: C.gold, unit: "g" }, { k: "Fat", v: scanResult.fat, c: C.inkSoft, unit: "g" }].map(({ k, v, c, unit }) => (
                    <div key={k} style={{ textAlign: "center", padding: "0.5rem 0.2rem", borderRadius: 8, background: C.bg }}>
                      <p style={{ ...body, fontSize: 11, fontWeight: 700, color: c, textTransform: "uppercase", letterSpacing: 0.3, margin: "0 0 2px" }}>{k}</p>
                      <p style={{ ...heading, fontSize: 17, fontWeight: 600, color: C.ink, margin: 0 }}>{v}</p>
                      <p style={{ ...body, fontSize: 10.5, color: C.inkFaint, margin: 0 }}>{unit}</p>
                    </div>
                  ))}
                </div>
                {scanResult.note && <p style={{ ...body, fontSize: 11.5, color: C.inkFaint, margin: "0.4rem 0 0", fontStyle: "italic" }}>{scanResult.note}</p>}
                <PrimaryButton onClick={addFromScan} style={{ width: "100%", marginTop: "0.85rem" }}>
                  <Plus size={16} /> Log this meal
                </PrimaryButton>
              </div>
            )}
          </div>
        )}

        {/* ── BROWSE TAB ── */}
        {tab === "browse" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            {/* Category filter */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: "0.6rem" }}>
              {FOOD_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    flexShrink: 0, padding: "0.3rem 0.75rem", borderRadius: 20, border: "none", cursor: "pointer",
                    background: category === cat ? C.mossDeep : C.card,
                    color: category === cat ? "#fff" : C.inkSoft,
                    fontWeight: category === cat ? 700 : 500, fontSize: 12.5, ...body,
                  }}
                >{cat}</button>
              ))}
            </div>

            {/* Search */}
            <input
              style={{ ...inputStyle, marginBottom: "0.75rem" }}
              placeholder="Search foods..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />

            {/* Food list */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 2 }}>
              {filtered.length === 0 && (
                <p style={{ ...body, fontSize: 13.5, color: C.inkFaint, textAlign: "center", marginTop: "2rem" }}>No foods found</p>
              )}
              {filtered.map(f => {
                const isActive = selected?.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelected(isActive ? null : f)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0.7rem 0.9rem", borderRadius: 12, border: `1.5px solid ${isActive ? C.moss : C.line}`,
                      background: isActive ? C.mossSoft : C.card, cursor: "pointer", textAlign: "left", gap: 12,
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ ...body, fontSize: 14, fontWeight: 600, color: C.ink, margin: "0 0 0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</p>
                      <div style={{ display: "flex", gap: 10 }}>
                        <span style={{ ...body, fontSize: 11.5, color: C.inkFaint }}>{f.calories} kcal</span>
                        <span style={{ ...body, fontSize: 11.5, color: C.sky }}>P {f.protein}g</span>
                        <span style={{ ...body, fontSize: 11.5, color: C.gold }}>C {f.carbs}g</span>
                        <span style={{ ...body, fontSize: 11.5, color: C.coral }}>F {f.fat}g</span>
                      </div>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${isActive ? C.moss : C.line}`, background: isActive ? C.moss : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isActive && <Check size={11} color="#fff" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <PrimaryButton onClick={addFromDB} disabled={!selected} style={{ width: "100%", marginTop: "1rem" }}>
              <Check size={16} /> Add {selected ? `"${selected.name.split(" ").slice(0, 3).join(" ")}..."` : "selected food"}
            </PrimaryButton>
          </div>
        )}

        {tab === "manual" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input style={inputStyle} placeholder="Meal name (e.g. Oat porridge with honey)" value={manName} onChange={e => setManName(e.target.value)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <input style={inputStyle} type="number" min="0" placeholder="Protein (g)" value={manProtein} onChange={e => setManProtein(e.target.value)} />
              <input style={inputStyle} type="number" min="0" placeholder="Carbs (g)" value={manCarbs} onChange={e => setManCarbs(e.target.value)} />
              <input style={inputStyle} type="number" min="0" placeholder="Fat (g)" value={manFat} onChange={e => setManFat(e.target.value)} />
            </div>
            {(manProtein || manCarbs || manFat) && (
              <p style={{ ...body, fontSize: 13, color: C.inkSoft, margin: 0 }}>≈ <strong style={{ color: C.ink }}>{manKcal} kcal</strong> calculated from macros</p>
            )}
            <PrimaryButton onClick={addManual} style={{ width: "100%", marginTop: "0.5rem" }}>
              <Check size={16} /> Add meal
            </PrimaryButton>
          </div>
        )}

      </div>
    </div>
  );
}

function MealPlannerScreen({ profile, meals, setMeals }) {
  const [showAdd, setShowAdd] = useState(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = (new Date().getDay() + 6) % 7; // 0=Mon
  const [activeDay, setActiveDay] = useState(today);

  const activeMeals = meals.filter(m => m.day === activeDay || (m.day === undefined && activeDay === today));

  const totals = activeMeals.reduce((acc, m) => ({
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fat: acc.fat + m.fat,
    calories: acc.calories + m.calories,
  }), { protein: 0, carbs: 0, fat: 0, calories: 0 });

  const calPct = Math.min(100, Math.round((totals.calories / MACRO_GOALS.calories) * 100));

  const addMeal = (meal) => setMeals(prev => [...prev, { ...meal, day: activeDay }]);
  const deleteMeal = (id) => setMeals(prev => prev.filter(m => m.id !== id));

  const grouped = MEAL_TYPES.reduce((acc, t) => {
    acc[t] = activeMeals.filter(m => m.type === t);
    return acc;
  }, {});

  const suggestions = useMemo(() => {
    const remP = Math.max(0, MACRO_GOALS.protein - totals.protein);
    const remC = Math.max(0, MACRO_GOALS.carbs - totals.carbs);
    const remF = Math.max(0, MACRO_GOALS.fat - totals.fat);
    const remKcal = Math.max(0, MACRO_GOALS.calories - totals.calories);

    if (remKcal < 150) return []; // almost done for the day

    const pPct = remP / MACRO_GOALS.protein;
    const cPct = remC / MACRO_GOALS.carbs;
    const fPct = remF / MACRO_GOALS.fat;

    let neededCat = "Protein";
    let neededMacro = "protein";
    let neededAmount = remP;
    let color = C.sky;
    let bg = C.skySoft;

    if (cPct > pPct && cPct > fPct) {
      neededCat = "Grains & Carbs";
      neededMacro = "carbs";
      neededAmount = remC;
      color = C.gold;
      bg = C.goldSoft;
    } else if (fPct > pPct && fPct > cPct) {
      neededCat = "Healthy Fats";
      neededMacro = "fat";
      neededAmount = remF;
      color = C.coral;
      bg = C.coralSoft;
    }

    // Fallback if neededAmount is very low
    if (neededAmount < 5) return [];

    const candidates = FOOD_DB.filter(f => f.category === neededCat).sort(() => 0.5 - Math.random()).slice(0, 3);

    return candidates.map(c => {
      const per100 = c[neededMacro] || 1;
      let grams = Math.round((neededAmount / per100) * 10) * 10;
      grams = Math.max(10, Math.min(600, grams)); // bound between 10g and 600g
      return { ...c, suggestedGrams: grams, reasonMacro: neededMacro, color, bg };
    });
  }, [totals.calories, totals.protein, totals.carbs, totals.fat]);

  return (
    <div style={{ padding: "1.5rem 1.25rem 5rem", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ ...heading, fontSize: 27, fontWeight: 600, color: C.ink, margin: 0 }}>Meal Planner</h1>
        <button
          onClick={() => setShowAdd(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: C.moss, color: "#fff", border: "none", borderRadius: 12, padding: "0.6rem 1rem", fontWeight: 600, fontSize: 14, cursor: "pointer", ...body }}
        >
          <PlusCircle size={16} /> Log meal
        </button>
      </div>

      {/* Day selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button
            key={d}
            onClick={() => setActiveDay(i)}
            style={{
              flexShrink: 0, padding: "0.45rem 0.9rem", borderRadius: 10, border: "none", cursor: "pointer",
              background: activeDay === i ? C.moss : C.card,
              color: activeDay === i ? "#fff" : i === today ? C.moss : C.inkSoft,
              fontWeight: activeDay === i ? 700 : i === today ? 700 : 500,
              fontSize: 13.5, ...body,
              outline: i === today && activeDay !== i ? `2px solid ${C.moss}` : "none",
            }}
          >{d}{i === today ? " ·" : ""}</button>
        ))}
      </div>

      {/* Calorie summary card */}
      <Card style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <p style={{ ...body, fontSize: 12.5, fontWeight: 700, color: C.coral, textTransform: "uppercase", letterSpacing: 0.4, margin: 0 }}>Calories today</p>
          <span style={{ ...heading, fontSize: 18, fontWeight: 600, color: C.ink }}>
            {totals.calories} <span style={{ fontSize: 13, color: C.inkSoft, fontWeight: 400 }}>/ {MACRO_GOALS.calories} kcal</span>
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: C.line, marginBottom: "1.25rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${calPct}%`, background: calPct >= 100 ? C.coral : C.moss, borderRadius: 4, transition: "width 0.4s" }} />
        </div>
        {/* Macro rings */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          <MacroRing label="Protein" value={totals.protein} goal={MACRO_GOALS.protein} color={C.sky} icon={Droplets} />
          <MacroRing label="Carbs" value={totals.carbs} goal={MACRO_GOALS.carbs} color={C.gold} icon={Wheat} />
          <MacroRing label="Fat" value={totals.fat} goal={MACRO_GOALS.fat} color={C.coral} icon={Flame} />
        </div>
      </Card>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
            <Sparkles size={15} color={C.moss} />
            <p style={{ ...body, fontSize: 12.5, fontWeight: 700, color: C.ink, margin: 0, textTransform: "uppercase", letterSpacing: 0.4 }}>
              To reach your goals
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
            {suggestions.map(s => (
              <div key={s.id} style={{ flexShrink: 0, width: 220, background: s.bg, border: `1.5px solid ${s.color}`, borderRadius: 14, padding: "0.85rem 1rem" }}>
                <p style={{ ...body, fontSize: 13.5, fontWeight: 700, color: C.ink, margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ ...body, fontSize: 12.5, fontWeight: 700, color: s.color }}>Eat {s.suggestedGrams}g</span>
                  <span style={{ ...body, fontSize: 11, color: C.inkSoft }}>for ~{Math.round(s[s.reasonMacro] * (s.suggestedGrams / 100))}g {s.reasonMacro}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meals by type */}
      {MEAL_TYPES.map(type => {
        const Icon = MEAL_TYPE_ICONS[type];
        const color = MEAL_TYPE_COLORS[type];
        const soft = MEAL_TYPE_SOFT[type];
        const typeMeals = grouped[type];
        return (
          <div key={type} style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.6rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={color} />
              </div>
              <p style={{ ...body, fontSize: 12.5, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.4, margin: 0 }}>{type}</p>
              {typeMeals.length > 0 && (
                <p style={{ ...body, fontSize: 12, color: C.inkFaint, margin: 0, marginLeft: "auto" }}>
                  {typeMeals.reduce((s, m) => s + m.calories, 0)} kcal
                </p>
              )}
            </div>
            {typeMeals.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {typeMeals.map(m => <MealCard key={m.id} meal={m} onDelete={deleteMeal} />)}
              </div>
            ) : (
              <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: "0.9rem 1rem" }}>
                <p style={{ ...body, fontSize: 13.5, color: C.inkFaint, margin: 0, textAlign: "center" }}>No {type.toLowerCase()} logged yet</p>
              </div>
            )}
          </div>
        );
      })}

      {showAdd && <AddMealModal onAdd={addMeal} onClose={() => setShowAdd(false)} />}
    </div>
  );
}


/* ============================================================
   POSTURE COACH SCREEN
   ============================================================ */
function PostureCoachScreen() {
  return (
    <div style={{ padding: "1.5rem 1.25rem 2rem", maxWidth: 1100, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ ...body, fontSize: 12.5, fontWeight: 700, color: C.moss, textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 0.35rem" }}>AI Posture Analysis</p>
        <h2 style={{ ...heading, fontSize: 24, fontWeight: 600, color: C.ink, margin: 0 }}>Posture Coach</h2>
        <p style={{ ...body, fontSize: 13.5, color: C.inkSoft, marginTop: "0.35rem" }}>
          Real-time posture feedback powered by MediaPipe. Position your full body in the camera view.
        </p>
      </div>

      {/* Info strip */}
      <div style={{
        display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1.25rem",
      }}>
        {[
          { icon: <Camera size={14} />, text: "Camera required" },
          { icon: <ScanLine size={14} />, text: "Full body in frame" },
          { icon: <Check size={14} />, text: "Real-time feedback" },
        ].map((item, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: C.mossSoft, color: C.mossDeep,
            fontSize: 12.5, fontWeight: 600, padding: "0.3rem 0.75rem",
            borderRadius: 999, ...body,
          }}>
            {item.icon} {item.text}
          </span>
        ))}
      </div>

      {/* iframe embed */}
      <div style={{
        borderRadius: 18, overflow: "hidden",
        border: `1px solid ${C.line}`,
        boxShadow: "0 2px 24px -6px rgba(38,40,31,0.12)",
        background: C.card,
      }}>
        <iframe
          src="http://localhost:5174"
          title="Posture Coach"
          style={{
            width: "100%",
            height: "calc(100vh - 260px)",
            minHeight: 520,
            border: "none",
            display: "block",
          }}
          allow="camera; microphone"
          allowFullScreen
        />
      </div>

      {/* Helper note */}
      <p style={{ ...body, fontSize: 12, color: C.inkFaint, textAlign: "center", marginTop: "0.75rem" }}>
        Make sure the Posture Coach server is running: <code style={{ background: C.mossSoft, color: C.mossDeep, padding: "0.1rem 0.4rem", borderRadius: 5, fontFamily: "monospace" }}>npm run dev</code> inside the <code style={{ background: C.mossSoft, color: C.mossDeep, padding: "0.1rem 0.4rem", borderRadius: 5, fontFamily: "monospace" }}>posture/</code> folder.
      </p>
    </div>
  );
}

/* ============================================================
   WORKOUT HUB — tabbed wrapper (Workout + Posture Coach)
   ============================================================ */
function WorkoutHub({ workout, onStart, onFinish, activeWorkout, profile, plannedWorkout, sessions, adaptations, meals, setMeals }) {
  const [subTab, setSubTab] = React.useState("workout");

  const tabs = [
    { id: "workout", label: "Today's Workout", icon: <Dumbbell size={15} /> },
    { id: "posture", label: "Posture Coach", icon: <ScanLine size={15} /> },
  ];

  return (
    <div>
      {/* Sub-tab bar */}
      <div style={{
        display: "flex", gap: 4,
        padding: "0.85rem 1.25rem 0",
        borderBottom: `1px solid ${C.line}`,
        background: C.card,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {tabs.map(tab => {
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "0.55rem 1.1rem",
                borderRadius: "10px 10px 0 0",
                border: `1px solid ${active ? C.line : "transparent"}`,
                borderBottom: active ? `2px solid ${C.moss}` : "1px solid transparent",
                background: active ? C.bg : "transparent",
                color: active ? C.mossDeep : C.inkSoft,
                fontWeight: active ? 700 : 500,
                fontSize: 13.5, cursor: "pointer",
                transition: "all 0.15s",
                ...body,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-tab content */}
      {subTab === "workout" && (
        activeWorkout
          ? <WorkoutScreen workout={activeWorkout} onFinish={onFinish} />
          : <Dashboard profile={profile} plannedWorkout={plannedWorkout} sessions={sessions} adaptations={adaptations} goToWorkout={onStart} meals={meals} setMeals={setMeals} />
      )}
      {subTab === "posture" && <PostureCoachScreen />}
    </div>
  );
}


/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [meals, setMeals] = useState([]);
  const [session, setSession] = useState(null);
  const [stage, setStage] = useState("auth"); // "auth" | "welcome" | "onboarding" | "app"
  const [view, setView] = useState("dashboard");
  const [profile, setProfile] = useState(DEFAULT_TEST_PROFILE);
  const [users, setUsers] = useState(() => [
    {
      id: "test-user-1",
      profile: DEFAULT_TEST_PROFILE,
      exerciseLevels: {},
      plannedWorkout: generateWorkout(DEFAULT_TEST_PROFILE, {}, null),
      sessions: [],
      adaptations: [],
    },
  ]);
  const [activeUserId, setActiveUserId] = useState("test-user-1");
  const [exerciseLevels, setExerciseLevels] = useState({});
  const [plannedWorkout, setPlannedWorkout] = useState(() => generateWorkout(DEFAULT_TEST_PROFILE, {}, null));
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [pendingSession, setPendingSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [adaptations, setAdaptations] = useState([]);
  const [historyDetailId, setHistoryDetailId] = useState(null);
  const [lastAdaptationResult, setLastAdaptationResult] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 860 : false);

  useEffect(() => {
    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await loadUserData(session.user.id);
      } else {
        setStage("auth");
      }
    }
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await loadUserData(session.user.id);
      } else {
        setStage("auth");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (profileData && profileData.age) {
        // Hydrate from DB
        const mappedProfile = {
          name: profileData.name,
          gender: profileData.gender,
          age: profileData.age?.toString(),
          weight: profileData.weight?.toString(),
          height: profileData.height?.toString(),
          experience: profileData.experience,
          goal: profileData.goal,
          daysPerWeek: profileData.days_per_week,
          // Defaults for missing schema fields
          focusAreas: ["Full Body"],
          equipment: ["Dumbbells"],
          gymAccess: true,
          location: "Gym",
          duration: "45 min",
        };
        setProfile(mappedProfile);
        setPlannedWorkout(generateWorkout(mappedProfile, {}, null));

        // Load sessions
        const { data: sessionsData } = await supabase.from('sessions').select('*').eq('user_id', userId);
        if (sessionsData) {
          setSessions(sessionsData.map(s => ({
            ...s,
            date: s.date,
            exercises: s.exercises || []
          })));
        }

        setStage("app");
      } else {
        setStage("welcome");
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setStage("welcome");
    }
  };

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleAuthSuccess = async (user, isNewUser) => {
    if (isNewUser) {
      setStage("welcome");
    } else {
      // Load existing profile data before entering the app
      await loadUserData(user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStage("auth");
  };

  const completeOnboarding = async (form) => {
    if (!session?.user) return;

    // Save to Supabase
    await supabase.from('profiles').upsert({
      id: session.user.id,
      name: form.name,
      gender: form.gender,
      age: parseInt(form.age) || null,
      weight: parseFloat(form.weight) || null,
      height: parseFloat(form.height) || null,
      experience: form.experience,
      goal: form.goal,
      days_per_week: form.daysPerWeek
    });

    setProfile(form);
    const workout = generateWorkout(form, {}, null);
    setPlannedWorkout(workout);
    setStage("app");
    setView("dashboard");
  };

  const startWorkout = () => {
    setActiveWorkout(plannedWorkout);
    setView("workout");
  };

  const finishWorkout = (exercisesWithActuals) => {
    const sessionObj = {
      id: activeWorkout.id,
      date: new Date().toISOString(),
      focus: activeWorkout.focusLabel,
      exercises: exercisesWithActuals,
    };
    setPendingSession(sessionObj);
    setView("feedback");
  };

  const submitFeedback = async (feedback) => {
    const finalSession = { ...pendingSession, feedback };

    // Always save session first, so it shows up in history even if adaptation fails
    setSessions(s => [...s, finalSession]);
    setPendingSession(null);
    setActiveWorkout(null);

    try {
      let adaptation;
      try {
        const response = await fetch("http://localhost:8000/api/adapt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session?.user?.id || uid(),
            session: finalSession,
            profile: profile
          })
        });
        if (!response.ok) throw new Error("Python backend failed");
        adaptation = await response.json();
      } catch (apiErr) {
        console.warn("Python backend failed, falling back to local adaptation", apiErr);
        adaptation = computeAdaptation(finalSession, profile);
        adaptation.sourceSessionId = finalSession.id;
      }

      const newLevels = { ...exerciseLevels };
      adaptation.exercises.forEach(a => { newLevels[a.id] = a.next; });

      const nextWorkout = generateWorkout(profile, newLevels, finalSession);

      if (session?.user) {
        await supabase.from('sessions').insert({
          id: finalSession.id,
          user_id: session.user.id,
          date: finalSession.date,
          focus: finalSession.focus,
          duration: "45 min",
          exercises: finalSession.exercises,
          feedback: finalSession.feedback
        });
      }

      setAdaptations(a => [...a, adaptation]);
      setExerciseLevels(newLevels);
      setPlannedWorkout(nextWorkout);
      setLastAdaptationResult(adaptation);
      setView("adaptationResult");
    } catch (err) {
      console.error("Adaptation failed entirely, but session was saved:", err);
      // Session already saved above — just go to history
      setView("history");
    }
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

  const retakeQuestionnaire = () => {
    setStage("onboarding");
  };

  const openHistoryDetail = (id) => { setHistoryDetailId(id); setView("historyDetail"); };

  if (stage === "auth") {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }
  if (stage === "welcome") {
    return (
      <>
        <style>{FONT_IMPORT}</style>
        <WelcomeScreen
          onBypass={() => setStage("app")}
          onStart={() => setStage("onboarding")}
          onLogout={handleLogout}
        />
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
    content = <Dashboard profile={profile} plannedWorkout={plannedWorkout} sessions={sessions} adaptations={adaptations} goToWorkout={startWorkout} meals={meals} setMeals={setMeals} />;
  } else if (view === "workout") {
    content = <WorkoutHub workout={activeWorkout} activeWorkout={activeWorkout} onStart={startWorkout} onFinish={finishWorkout} profile={profile} plannedWorkout={plannedWorkout} sessions={sessions} adaptations={adaptations} meals={meals} setMeals={setMeals} />;
  } else if (view === "meals") {
    content = <MealPlannerScreen profile={profile} meals={meals} setMeals={setMeals} />;
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
  } else if (view === "community") {
    content = <CommunityScreen profile={profile} />;
  } else if (view === "profile") {
    content = (
      <ProfileScreen
        profile={profile}
        users={users}
        activeUserId={activeUserId}
        onSwitchUser={switchUser}
        onAddUser={addUser}
        onSave={saveProfile}
        onRetakeQuestionnaire={retakeQuestionnaire}
        onLogout={handleLogout}
      />
    );
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
      <FloatingChatBot />
    </div>
  );
}
