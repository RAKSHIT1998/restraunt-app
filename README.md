# Restaurant App

This is a simple Node.js/Express server for restaurants to manage orders.

## Features
- User signup and login
- Add and edit menu items
- Receive orders from the main backend
- Update order status
- Simple analytics (total orders and revenue)

The app communicates with the main backend at `https://backend-grab.onrender.com` to update order status.

## Usage

```
npm install
npm start
```

This starts the server on port 3000.

### API Endpoints
- `POST /signup` – register a new user
- `POST /login` – login a user
- `POST /menu` – add a menu item
- `PUT /menu/:id` – edit a menu item
- `GET /menu` – list menu items
- `POST /orders` – create an order (called by the main backend)
- `PUT /orders/:id/status` – update order status
- `GET /orders` – list orders
- `GET /analytics` – show order count and revenue
```
