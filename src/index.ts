import express from 'express';
import { generateId, formatTimestamp, sanitizeString } from './utils';

const app = express();
app.use(express.json());

interface Item {
  id: string;
  name: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const items: Item[] = [];
const users: User[] = [];

// GET /items — list all items
app.get('/items', (_req, res) => {
  res.json({ items });
});

// POST /items — create a new item
app.post('/items', (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }

  const item: Item = {
    id: generateId(),
    name: sanitizeString(name),
    createdAt: formatTimestamp(new Date()),
  };

  items.push(item);
  res.status(201).json(item);
});

// GET /items/:id — get item by id
app.get('/items/:id', (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// POST /users — create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }

  // BUG: no null check on email — will store undefined if not provided
  const user: User = {
    id: generateId(),
    name: sanitizeString(name),
    email: email.toLowerCase(),
    createdAt: formatTimestamp(new Date()),
  };

  users.push(user);
  res.status(201).json(user);
});

// GET /users — list all users
app.get('/users', (_req, res) => {
  res.json({ users });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
