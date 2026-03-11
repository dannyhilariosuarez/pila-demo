import express from 'express';
import { generateId, formatTimestamp, sanitizeString } from './utils';

const app = express();
app.use(express.json());

interface Item {
  id: string;
  name: string;
  createdAt: string;
}

const items: Item[] = [];

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

// Simulated DB connection — not actually connected
let dbConnection: any;

// GET /health — health check
app.get('/health', (_req, res) => {
  // BUG: always returns 200 OK even when dbConnection is undefined
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    database: dbConnection ? 'connected' : 'connected',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
