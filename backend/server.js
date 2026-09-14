const http = require("node:http");
const { randomUUID } = require("node:crypto");

const PORT = Number(process.env.PORT) || 3001;
const sessions = [];
const users = [];

const exercises = [
  { id: "pushup", name: "Push-ups", tags: ["upper"], equipment: "none", type: "reps" },
  { id: "squat", name: "Bodyweight squats", tags: ["lower"], equipment: "none", type: "reps" },
  { id: "plank", name: "Plank hold", tags: ["core"], equipment: "none", type: "duration" },
  { id: "burpee", name: "Burpees", tags: ["fullbody", "cardio"], equipment: "none", type: "reps" },
  { id: "dbgoblet", name: "Dumbbell goblet squat", tags: ["lower"], equipment: "dumbbells", type: "reps" },
  { id: "dbrow", name: "Dumbbell bent-over row", tags: ["upper"], equipment: "dumbbells", type: "reps" },
  { id: "kbswing", name: "Kettlebell swing", tags: ["fullbody", "cardio"], equipment: "kettlebell", type: "reps" },
];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => { body += chunk; });
    request.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Request body must be valid JSON"));
      }
    });
    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    });
    return response.end();
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    return sendJson(response, 200, { ok: true, service: "fitto-api", timestamp: new Date().toISOString() });
  }

  if (request.method === "GET" && url.pathname === "/api/users") {
    return sendJson(response, 200, { users });
  }

  if (request.method === "POST" && url.pathname === "/api/users") {
    try {
      const payload = await readJson(request);
      if (!payload || !payload.name || typeof payload.name !== "string") {
        return sendJson(response, 400, { error: "A user must include a name" });
      }
      const user = { id: randomUUID(), name: payload.name.trim(), profile: payload.profile || null };
      users.push(user);
      return sendJson(response, 201, user);
    } catch (error) {
      return sendJson(response, 400, { error: error.message });
    }
  }

  if (request.method === "GET" && url.pathname === "/api/exercises") {
    const equipment = url.searchParams.get("equipment");
    const result = equipment ? exercises.filter(ex => ex.equipment === "none" || ex.equipment === equipment) : exercises;
    return sendJson(response, 200, { exercises: result });
  }

  if (request.method === "GET" && url.pathname === "/api/sessions") {
    return sendJson(response, 200, { sessions });
  }

  if (request.method === "POST" && url.pathname === "/api/sessions") {
    try {
      const payload = await readJson(request);
      if (!payload || !Array.isArray(payload.exercises)) {
        return sendJson(response, 400, { error: "A session must include an exercises array" });
      }
      const session = {
        ...payload,
        id: payload.id || randomUUID(),
        date: payload.date || new Date().toISOString(),
      };
      sessions.push(session);
      return sendJson(response, 201, session);
    } catch (error) {
      return sendJson(response, 400, { error: error.message });
    }
  }

  const sessionMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)$/);
  if (request.method === "DELETE" && sessionMatch) {
    const index = sessions.findIndex(session => session.id === sessionMatch[1]);
    if (index === -1) return sendJson(response, 404, { error: "Session not found" });
    sessions.splice(index, 1);
    return sendJson(response, 200, { ok: true });
  }

  return sendJson(response, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Fitto API listening at http://localhost:${PORT}`);
});
