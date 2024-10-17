const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./databas");
const { ObjectId } = require("mongodb");

const getCollection = async () => {
  const client = await getConnectedClient();
  const collection = client.db("todosdb").collection("todos");
  return collection;
};

// GET /todos
router.get("/todos", async (req, res) => {
  try {
    const collection = await getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error 😶‍🌫️" });
  }
});

// POST /todos
router.post("/todos", async (req, res) => {
  const collection = await getCollection();
  let { todo } = req.body;

  if (!todo) {
    res.status(400).json({ message: "No todo found 🤥" });
  }

  todo = typeof todo === "string" ? todo : JSON.stringify(todo);

  const newTodo = await collection.insertOne({ todo, status: false });

  res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
  const collection = await getCollection();
  const _id = new ObjectId(req.params.id);

  const deleteTodo = await collection.deleteOne({ _id });
  res.status(200).json(deleteTodo);
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
  console.log("PUT request received for ID:", req.params.id);
  const collection = await getCollection();
  const _id = new ObjectId(req.params.id);
  const { status } = req.body;

  if (typeof status !== "boolean") {
    return res.status(400).json({ message: "Status must be a boolean 🤥" });
  }

  const updateTodo = await collection.updateOne(
    { _id },
    { $set: { status: !status } }
  );

  res.status(200).json(updateTodo);
});

module.exports = router;
