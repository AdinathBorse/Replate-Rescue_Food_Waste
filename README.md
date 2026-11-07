# 🍕 FoodDell - Food Delivery App

A full-stack food delivery application built with **React**, **Node.js**, **Express**, and **MongoDB**. This project includes a customer-facing app, admin dashboard, and backend server with payment integration using Stripe.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [File Uploads](#file-uploads)
- [Contributing](#contributing)

---

## ✨ Features

### Customer App (food-app)
- 🔐 User authentication (Login/Sign up)
- 🍔 Browse and search food items
- 🛒 Shopping cart functionality
- 📦 Place and track orders
- 💳 Secure payment with Stripe
- 📱 Responsive design with Vite + React

### Admin Dashboard (admin)
- 👨‍💼 Admin authentication
- 📝 Add/Edit/Delete food items
- 📊 View all orders
- ✅ Manage order status
- 📤 Upload food images
- 📱 React + Vite frontend

### Backend Server (backend)
- 🔒 JWT authentication
- 👤 User management
- 🍽️ Food management
- 🛍️ Cart operations
- 📦 Order processing
- 💳 Stripe payment integration
- 📤 File upload handling with Multer

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Router v7** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

---

## 📂 Project Structure

```
foodDell-app/
├── admin/                    # Admin dashboard
│   ├── src/
│   │   ├── pages/           # Admin pages (Add, List, Orders)
│   │   ├── components/      # Navbar, Sidebar
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
│
├── food-app/                # Customer application
│   ├── src/
│   │   ├── pages/           # Home, Cart, Orders, PlaceOrder
│   │   ├── components/      # Navbar, Header, FoodDisplay, etc.
│   │   ├── Context/         # StoreContext (state management)
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js + Express server
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/             # Mongoose schemas
│   ├── controllers/        # Route handlers
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── uploads/            # Food images directory
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env                # Environment variables (git ignored)
│
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download Community Edition](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Stripe Account** - [Create Account](https://stripe.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AdinathBorse/Food-Delivery-App.git
cd foodDell-app
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend (Food App)
```bash
cd ../food-app
npm install
```

#### Admin Dashboard
```bash
cd ../admin
npm install
```

---

## ⚙️ Configuration

### Backend Environment Setup

Create a `.env` file in the `backend` folder:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/foodDell

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Admin registration code (choose a private value)
ADMIN_SIGNUP_CODE=your_private_admin_signup_code

# Server Port
PORT=4000

# Stripe API Keys
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Frontend URLs
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

Use the value of `ADMIN_SIGNUP_CODE` in the admin registration form. After registering,
assign existing foods to that admin from the repository root with:

```bash
node backend/assignLegacyFoods.js admin@example.com
```

### Frontend Configuration (if needed)

Update the API base URL in your frontend context/config files:

```javascript
// In food-app/src/Context/StoreContext.jsx or similar
const API_URL = 'http://localhost:4000/api';
```

---

## ▶️ Running the Application

### Option 1: Run Everything Separately

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run server
```
Server will run on `http://localhost:4000`

**Terminal 2 - Customer App:**
```bash
cd food-app
npm run dev
```
App will run on `http://localhost:5173`

**Terminal 3 - Admin Dashboard:**
```bash
cd admin
npm run dev
```
Admin will run on `http://localhost:5174`

### Option 2: Run from Root Directory

If you want to use npm scripts from root, create a root `package.json`:

```bash
npm install --save-dev concurrently
```

Then add scripts to root `package.json`:
```json
"scripts": {
  "dev": "concurrently \"cd backend && npm run server\" \"cd food-app && npm run dev\" \"cd admin && npm run dev\""
}
```

---

## 🔌 API Endpoints

### User Routes (`/api/user`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)

### Food Routes (`/api/food`)
- `GET /list` - Get all food items
- `POST /add` - Add new food (admin only)
- `POST /remove` - Remove food (admin only)

### Cart Routes (`/api/cart`)
- `POST /add` - Add item to cart
- `POST /remove` - Remove item from cart
- `POST /get` - Get cart items (protected)

### Order Routes (`/api/order`)
- `POST /place` - Place new order
- `POST /verify` - Verify Stripe payment
- `GET /userorders` - Get user's orders (protected)
- `GET /list` - Get all orders (admin only)
- `POST /status` - Update order status (admin only)

---

## 📤 File Uploads

Food images are stored in the `backend/uploads/` directory. When adding food items:

1. Select an image file
2. The backend processes it with Multer
3. Image is saved to `uploads/` folder
4. Image path is stored in MongoDB

---

## 🔐 Security Notes

⚠️ **Important:**
- Never commit `.env` file to Git (already in `.gitignore`)
- Always use HTTPS in production
- Keep JWT_SECRET secure and strong
- Use environment variables for all sensitive data
- Validate all user inputs on backend
- Enable CORS only for trusted domains

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running:
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution:** Change PORT in `.env` or kill process using the port

### CORS Issues
**Solution:** Update `backend/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
```

---

## 📝 Available Scripts

### Backend
```bash
npm run server        # Start server with Nodemon
```

### Food App & Admin
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint (admin only)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Adinath Borse**

- GitHub: [@AdinathBorse](https://github.com/AdinathBorse)
- Repository: [Food-Delivery-App](https://github.com/AdinathBorse/Food-Delivery-App)

---

## 📞 Support

If you encounter any issues or have questions, please:
- Create an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

---

## 🙏 Acknowledgments

- React and Vite communities
- MongoDB and Mongoose documentation
- Stripe for payment processing
- Express.js framework

---

**Happy Coding! 🚀**
