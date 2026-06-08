import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const PORT = 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, "data", "todos.json");

// Middleware
app.use(cors());
app.use(express.json());


// Read Todos
async function readTodos() {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}


// Write Todos
async function writeTodos(todos) {
  await fs.writeFile(
    dataFile,
    JSON.stringify(todos, null, 2)
  );
}


// GET All Todos
app.get("/api/todos", async (req, res) => {
  const todos = await readTodos();
  res.status(200).json(todos);
});


// POST Todo
app.post("/api/todos", async (req, res) => {
  const todos = await readTodos();

  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
    reminder: req.body.reminder || null,
    notified: false
  };

  todos.push(newTodo);

  await writeTodos(todos);

  res.status(201).json(newTodo);
});


// UPDATE Todo
app.patch("/api/todos/:id", async (req, res) => {
  const todos = await readTodos();

  const index = todos.findIndex(
    (t) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Todo Not Found"
    });
  }

  todos[index] = {
    ...todos[index],
    ...req.body
  };

  await writeTodos(todos);

  res.json(todos[index]);
});


// DELETE Todo
app.delete("/api/todos/:id", async (req, res) => {
  const todos = await readTodos();

  const filteredTodos = todos.filter(
    (t) => t.id !== Number(req.params.id)
  );

  if (filteredTodos.length === todos.length) {
    return res.status(404).json({
      message: "Todo Not Found"
    });
  }

  await writeTodos(filteredTodos);

  res.json({
    message: "Todo Deleted Successfully"
  });
});


// Server Start
app.listen(PORT, () => {
  console.log(
    `Server Running On http://localhost:${PORT}`
  );
});