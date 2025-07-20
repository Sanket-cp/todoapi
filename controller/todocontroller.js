const Todo = require('../models/todo.js');
const asyncHandler = require('express-async-handler');

const getTodos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = { user: req.user._id };

  if (req.query.completed) {
    filter.completed = req.query.completed === 'true';
  }
  if (req.query.search) {
    filter.title = { $regex: req.query.search, $options: 'i' };
  }

  const todos = await Todo.find(filter).limit(limit).skip(skip);
  res.json(todos);
});

const createTodo = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const todo = await Todo.create({ title, user: req.user._id });
  res.status(201).json(todo);
});

const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo || todo.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Todo not found or unauthorized');
  }
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo || todo.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Todo not found or unauthorized');
  }
  await Todo.deleteOne({ _id: req.params.id });
  res.json({ message: 'Todo removed' });
});

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
