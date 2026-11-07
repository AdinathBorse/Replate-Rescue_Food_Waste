<p align="center">
  <img src="docs/logo.png" alt="Replate logo" width="360">
</p>

<p align="center"><b>Order. Save. Waste less.</b></p>

# Replate

Replate is a full-stack food ordering platform for restaurants and bakeries. It has the usual features of a food delivery app (menu, cart, online payment, order tracking) and one extra feature built around a real problem: **Mystery Surplus Bags**. Restaurants can sell their unsold, still-fresh food at a big discount in the evening instead of throwing it away.

It is built with the MERN stack (MongoDB, Express, React, Node.js) and has three parts: a customer app, an admin panel for restaurants, and a REST API.

*MCA Final Year Project by Adinath Borse.*

---

## Contents

- [The problem](#the-problem)
- [Unique feature: Mystery Surplus Bags](#unique-feature-mystery-surplus-bags)
- [SDG goals](#sdg-goals)
- [Sustainability and impact](#sustainability-and-impact)
- [Features](#features)
- [Tech stack](#tech-stack)
- [How an order works](#how-an-order-works)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [API endpoints](#api-endpoints)
- [Security](#security)
- [Known limitations and future scope](#known-limitations-and-future-scope)
- [Screenshots](#screenshots)

---

## The problem

- Small restaurants and bakeries throw away fresh food at closing time because it cannot be sold the next day. The FAO estimates that roughly one third of the food produced for people is lost or wasted.
- Many customers, especially students, find regular delivery prices too high.
- Small vendors do not have a simple, low-cost system to list their menu, take online payments and manage orders.

Replate tries to solve all three together: vendors earn something from food they would have wasted, customers get cheaper meals, and the food is eaten instead of binned.

---

## Unique feature: Mystery Surplus Bags

A Mystery Bag is a surprise box of a restaurant's unsold food, sold at a large discount near closing time. The customer chooses the type of bag (Veg, Non-Veg or Bakery) but not the exact contents, which is why it is called a "mystery" bag.

**How it works**

1. A restaurant admin adds a food item and marks it as a *Mystery Surplus Bag*, with an original price, a discounted price, a diet type, stock and a pick-up window (default 9:00 PM to 11:45 PM).
2. Customers see a dedicated Mystery Bags section on the home page with a countdown timer, diet filters (All, Veg, Non-Veg, Bakery) and a discount badge on every bag.
3. The customer orders and pays like any other item.
4. The restaurant sees the order in its own admin panel and prepares the bag.

**Sample bags** (created by `backend/seedMysteryBags.js`)

| Bag | Offer price | Original price |
|---|---|---|
| The Midnight Baker's Secret Stash | Rs 199 | Rs 650 |
| The Royal Midnight Mystery Feast | Rs 249 | Rs 850 |
| The Emerald Harvest Secret Box | Rs 179 | Rs 580 |

The discount percentage shown on each card is calculated from the original and offer prices.

---

## SDG goals

Replate supports the United Nations Sustainable Development Goals in these ways:

| Goal | How Replate contributes |
|---|---|
| **SDG 12: Responsible Consumption and Production** (primary goal) | Mystery Bags sell unsold fresh food instead of discarding it. This directly supports Target 12.3: halve per-capita global food waste at the retail and consumer level by 2030. |
| **SDG 2: Zero Hunger** | Surplus meals at a large discount make food more affordable for students and low-income users. |
| **SDG 8: Decent Work and Economic Growth** | Small restaurants and bakeries get a digital storefront and extra income from food that would otherwise be a loss. |
| **SDG 9: Industry, Innovation and Infrastructure** | Small vendors get online ordering, digital payments and sales reports without building their own system. |

---

## Sustainability and impact

**Why it works for vendors.** Throwing food away costs a restaurant money. Selling it at a discount turns a loss into some revenue, so reducing waste is also in the vendor's interest. This makes the idea more likely to continue over time than one that depends only on donations.

**How impact is measured.** The admin panel has a Sales Report page that shows the effect of Mystery Bags for each restaurant:

| Measure | How it is calculated |
|---|---|
| Surplus meals rescued | Number of Mystery Bags sold (one bag counts as one meal kept out of the bin) |
| Mystery Bag sales | Sum of price x quantity for Mystery Bag items |
| Customer savings | (original price - offer price) x quantity |
| Bags still in stock | Total remaining stock of active Mystery Bags |

These are simple estimates based on the orders in the system. They do not measure exact weight or the carbon saved.

**Other design choices**
- Everything is digital: online menu, online payment and online reports, with no paper bills.
- Each restaurant only sees and manages its own food and orders, so a small vendor can join without any technical setup.

---

## Features

### Customer app (`food-app`)
- Register and log in (login popup, no page change)
- Browse food by category (eight categories)
- Mystery Bags section with countdown timer, diet filters and discount badges
- Cart saved on the server for logged-in users
- Checkout with delivery address and online payment through Stripe (INR)
- My Orders page with the status of every order
- Responsive layout for mobile and desktop

### Admin panel (`admin`)
- Admin register and log in (registration needs a signup code)
- Add, list and remove your own food items, with image upload
- Mark an item as a Mystery Surplus Bag with price, diet type, stock and time window
- See only the orders for your own food, and update their status (Food Processing, Out for Delivery, Delivered)
- Sales Report for a chosen date range: summary, orders by status, top items, sales by category, Mystery Bag impact and daily sales, with CSV and PDF export

### Backend (`backend`)
- REST API with JWT authentication and role-based access (`user` and `admin`)
- Password hashing with bcrypt
- Image upload with Multer
- Stripe Checkout payments
- MongoDB data storage with Mongoose

---

## Tech stack

| Part | Technology |
|---|---|
| Customer app and admin panel | React 19, Vite, React Router, Axios, React Toastify (admin) |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcrypt, validator |
| Payments | Stripe Checkout |
| File uploads | Multer |

---

## How an order works

A customer can have food from more than one restaurant in the cart. When the order is placed, the server **splits the cart into one order per restaurant**, so each restaurant gets its own order, its own status and its own total. The customer pays once.

```
Customer cart: Pizza (Restaurant A) + Burger (Restaurant B)
        |
        |  one Stripe payment
        v
Order 1 -> Restaurant A only   (Pizza, own status)
Order 2 -> Restaurant B only   (Burger, own status)

My Orders shows both orders with the restaurant name.
```

- Prices are read from the database at the time of ordering, not from the browser.
- A delivery charge of Rs 50 is added for each restaurant order.
- Restaurants only see orders that have been paid.

---

## Project structure

```
Food-Deli-app/
├── backend/
│   ├── config/            database connection
│   ├── controllers/       user, food, cart, order and report logic
│   ├── middleware/        auth.js (JWT) and adminOnly.js (role check)
│   ├── models/            user, food and order schemas
│   ├── routes/            API routes
│   ├── utils/             buildReport.js (report calculations)
│   ├── uploads/           uploaded food images
│   ├── seedMysteryBags.js sample Mystery Bags
│   └── server.js
├── food-app/              customer app (React + Vite)
│   └── src/
│       ├── components/    Navbar, Header, ExploreMenu, FoodDisplay, MysteryBagDisplay, LoginPopup, Footer
│       ├── Context/       StoreContext (cart, token, food list)
│       └── pages/         Home, Cart, PlaceOrder, MyOrders, Verify
├── admin/                 admin panel (React + Vite)
│   └── src/
│       ├── component/     Navbar, Sidebar
│       └── pages/         Login, Add, List, Order, Report
└── docs/                  logo and screenshots
```

---

## Getting started

### What you need
- Node.js (version 18 or newer)
- A MongoDB database (MongoDB Atlas free tier or a local MongoDB)
- A Stripe account in **test mode** (for the secret key)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Food-Deli-app

cd backend  && npm install && cd ..
cd food-app && npm install && cd ..
cd admin    && npm install && cd ..
```

### 2. Set up the backend environment

Create a file `backend/.env` (it is ignored by Git, never commit it):

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
ADMIN_SIGNUP_CODE=choose_a_secret_code
```

`ADMIN_SIGNUP_CODE` is the code a restaurant must enter to create an admin account.

### 3. Add the sample Mystery Bags (optional)

```bash
cd backend
node seedMysteryBags.js
```

The sample bags are shown to customers, but they do not belong to any restaurant, so no admin will see their orders. For bags that belong to a restaurant, add them from the admin panel instead (tick the Mystery Bag option on the Add Item page).

### 4. Run everything

Open three terminals:

```bash
# Terminal 1: backend (http://localhost:4000)
cd backend
npm run server

# Terminal 2: customer app
cd food-app
npm run dev

# Terminal 3: admin panel
cd admin
npm run dev
```

Vite gives the first app it starts the port 5173 and the next one 5174. Start the customer app first so that it runs on `http://localhost:5173` and the admin panel on `http://localhost:5174`.

**Important:** Stripe sends the customer back to the address set as `frontend_url` in `backend/controllers/orderController.js`. Make sure it matches the address where your customer app runs.

### 5. Create the first admin

Open the admin panel, choose **Register here**, enter the restaurant name, email, password and the `ADMIN_SIGNUP_CODE` from your `.env`. Then add a few food items.

### 6. Try the payment

Use the Stripe test card `4242 4242 4242 4242` with any future expiry date and any CVC.

---

## API endpoints

Base URL: `http://localhost:4000/api`. Protected routes need the JWT in the `token` request header.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/user/register` | Public | Register a customer |
| POST | `/user/login` | Public | Log in (customer or admin) |
| POST | `/user/admin/register` | Needs signup code | Register an admin |
| GET | `/food/list` | Public | All foods |
| GET | `/food/mystery-bags` | Public | All Mystery Bags |
| GET | `/food/myfoods` | Admin | Foods added by the logged-in admin |
| POST | `/food/add` | Admin | Add a food item (with image) |
| POST | `/food/remove` | Admin (owner) | Remove a food item |
| POST | `/cart/add` | User | Add to cart |
| POST | `/cart/remove` | User | Remove from cart |
| POST | `/cart/get` | User | Get the saved cart |
| POST | `/order/place` | User | Place order and start Stripe payment |
| POST | `/order/verify` | Public | Confirm or cancel payment |
| POST | `/order/userorders` | User | Orders of the logged-in customer |
| GET | `/order/list` | Admin | Paid orders of the logged-in admin |
| POST | `/order/status` | Admin (owner) | Update an order's status |
| GET | `/report/summary` | Admin | Sales report (`from` and `to` dates optional) |

---

## Security

- Passwords are hashed with bcrypt, and login uses JWT tokens that expire after 7 days.
- Admin routes check the user's role on the server, not only in the interface.
- An admin can only remove their own foods and change the status of their own orders.
- Admin accounts can only be created with the secret signup code.
- The `.env` file is listed in `.gitignore`.

---

## Known limitations and future scope

This is a student project, and these points are not finished yet:

- **Payment verification.** The payment confirmation page currently trusts the browser. It should be replaced by Stripe webhooks, or the server should check the payment session with Stripe.
- **Mystery Bag rules.** The pick-up window is shown with a countdown, and stock is stored, but the server does not yet block orders outside the window or reduce the stock when a bag is sold.
- **Images.** Food images are not compressed, so the customer app is heavy on slow connections. Converting to WebP and lazy loading would help.
- **Not built yet:** delivery partner module, live order tracking, email or SMS notifications, ratings, coupons (the promo code box is only a placeholder) and a super-admin report across all restaurants.

---



---

## Author

Adinath Borse, Project.

This project was made for academic purposes.
