const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory data stores
const users = []; // {id, username, password}
const menuItems = []; // {id, name, price}
const orders = []; // {id, customerName, items: [menuItemIds], status, total}

let nextUserId = 1;
let nextItemId = 1;
let nextOrderId = 1;

// Utility functions
function authenticate(username, password) {
  return users.find(u => u.username === username && u.password === password);
}

// Routes
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const user = { id: nextUserId++, username, password };
  users.push(user);
  res.json({ id: user.id, username: user.username });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = authenticate(username, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Logged in', user: { id: user.id, username: user.username } });
});

app.post('/menu', (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'Name and price required' });
  }
  const item = { id: nextItemId++, name, price };
  menuItems.push(item);
  res.json(item);
});

app.put('/menu/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = menuItems.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Menu item not found' });
  const { name, price } = req.body;
  if (name) item.name = name;
  if (price != null) item.price = price;
  res.json(item);
});

app.get('/menu', (req, res) => {
  res.json(menuItems);
});

// Endpoint to receive order requests from backend
app.post('/orders', async (req, res) => {
  const { customerName, items } = req.body; // items are menu item IDs
  if (!customerName || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid order format' });
  }
  const orderItems = items.map(id => menuItems.find(i => i.id === id)).filter(Boolean);
  const total = orderItems.reduce((sum, i) => sum + i.price, 0);
  const order = {
    id: nextOrderId++,
    customerName,
    items: orderItems,
    status: 'preparing',
    total,
  };
  orders.push(order);

  // Notify backend the order has been received and is being prepared
  try {
    await axios.post('https://backend-grab.onrender.com/api/orders/status', {
      orderId: order.id,
      status: 'preparing',
    });
  } catch (err) {
    console.error('Failed to notify backend:', err.message);
  }
  res.json(order);
});

app.put('/orders/:id/status', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status required' });
  order.status = status;

  try {
    await axios.post('https://backend-grab.onrender.com/api/orders/status', {
      orderId: order.id,
      status,
    });
  } catch (err) {
    console.error('Failed to notify backend:', err.message);
  }

  res.json(order);
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

// Simple analytics endpoint
app.get('/analytics', (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  res.json({ totalOrders, totalRevenue });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

