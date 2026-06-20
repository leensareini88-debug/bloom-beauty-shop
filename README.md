# Bloom Beauty

A full-stack e-commerce beauty shop built with Node.js, Express.js, MongoDB Atlas and vanilla JavaScript.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Auth:** JWT, bcryptjs

## Features

- User registration and login with JWT authentication
- Product listings with search, filtering and category pages
- Shopping cart and wishlist with localStorage persistence
- Order processing and order history
- Product reviews and star ratings
- Live search with dropdown suggestions
- Quick view modal, shade selector and bundle builder
- Skin type quiz with personalized product recommendations
- Before/after transformation slider
- Beauty tips flip cards
- Stock urgency badges and back in stock notifications
- Responsive design

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### Installation

1. Clone the repo
   ```
   git clone https://github.com/leensareini88-debug/bloom-beauty-shop.git
   cd bloom-beauty-shop
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Seed the database
   ```
   node server/seed.js
   ```

5. Start the server
   ```
   npm run dev
   ```

6. Visit http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| GET | /api/products/new | Get newest products |
| GET | /api/products/sale | Get sale products |
| POST | /api/orders | Create order |
| GET | /api/orders/myorders | Get user orders |
| POST | /api/reviews/:productId | Add review |
| GET | /api/reviews/:productId | Get product reviews |

## Project Structure

```
public/          Frontend HTML, CSS, JS files
server/
  controllers/   Route logic
  middleware/    Auth middleware
  models/        Mongoose schemas
  routes/        API routes
  seed.js        Database seeder
  server.js      Entry point
```
