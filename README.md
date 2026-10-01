# YES BIKE — Motorcycle Leather & Riding Gear E-Commerce

A full-stack MERN e-commerce application for **Yes Bike** (R Khan), a motorcycle leather and riding gear brand. Built with React 18 + Vite + Redux Toolkit on the frontend and Node.js + Express + MongoDB (Mongoose) on the backend, fully configured for single-repository local development and instant Vercel full-stack deployment.

---

## Project Structure

```
yesbike/
├── api/
│   └── index.js              # Vercel Serverless Function entry point
├── client/                   # React + Vite frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks (useAuth)
│   │   ├── layouts/          # Main & Admin layouts
│   │   ├── pages/            # Public & Admin pages
│   │   ├── redux/            # Store & feature slices
│   │   ├── routes/           # Protected & Admin route guards
│   │   ├── services/         # Centralized Axios API instance
│   │   └── utils/            # Currency formatting & helpers
│   ├── index.html
│   ├── package.json
│   └── vite.config.js        # Vite config with dev API proxy
├── server/                   # Express backend application
│   ├── config/               # Database connection with serverless caching
│   ├── controllers/          # Route controller handlers
│   ├── middleware/           # Auth, error, and validation middleware
│   ├── models/               # Mongoose schemas (User, Product, Order, Review)
│   ├── routes/               # API route definitions
│   ├── seed/                 # Database seed script & initial data
│   ├── utils/                # Async handler & token generator
│   ├── app.js                # Express app definition & middleware
│   ├── package.json
│   └── server.js             # Standalone development server entry point
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules for node_modules, build, .env
├── package.json              # Root package orchestrating dev & build scripts
├── vercel.json               # Vercel deployment configuration
└── README.md
```

---

## Prerequisites

- **Node.js**: v18.x or v20.x
- **MongoDB**: Local MongoDB or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## Local Development

### 1. Install Dependencies

Install all dependencies from the root directory:

```bash
npm install
npm run install:all
```

### 2. Configure Environment Variables

Create `.env` in the root (or in `server/`):

```bash
cp .env.example .env
```

Fill in your configuration:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yesbike?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_random_jwt_key
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
VITE_API_URL=/api
```

### 3. Seed Database

Populate initial admin, rider, and 18 motorcycle gear products:

```bash
npm run seed
```

Default credentials created by the seed script:
- **Admin**: `admin@yesbike.co.za` / `admin123`
- **Customer**: `rider@example.com` / `rider123`

*(Change passwords before production use!)*

### 4. Run Both Frontend and Backend

Run full-stack concurrently from the root:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

*(You can also run them independently via `npm run dev:client` and `npm run dev:server`)*

---

## Production Deployment to Vercel

The project is structured for a **single-repository full-stack deployment** on Vercel. Both frontend and backend deploy together from the same Git repository.

### Step 1: Push to GitHub

Initialize and push the repository to GitHub:

```bash
git init
git add .
git commit -m "Initial production-ready setup"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Import into Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** → **Project**.
3. Select your GitHub repository (`yesbike`) and click **Import**.
4. For **Framework Preset**, select **Other** (since `vercel.json` at the root explicitly specifies the build command and output directory).
5. Leave **Root Directory** as `./` (the repository root).
6. In **Environment Variables**, add the required production values:
   - `MONGO_URI`: Your MongoDB Atlas connection string (ensure IP Access `0.0.0.0/0` is allowed in Atlas Network Access).
   - `JWT_SECRET`: A long, cryptographically secure random string.
   - `JWT_EXPIRES_IN`: `30d` (or desired token lifetime).
   - `CLIENT_URL`: *(Optional)* Your production Vercel URL (e.g., `https://your-project.vercel.app`).
   - `NODE_ENV`: `production`
7. Click **Deploy**.

Vercel will install dependencies, build the React frontend into `client/dist`, deploy the Express backend to `/api/index.js`, and route all traffic seamlessly!

---

## Features

- **Storefront**: Home, Catalog with search, multi-category filters, price ranges, sort options, and pagination.
- **Product Details**: Multi-image view, size/color selectors, stock validation, reviews with average rating roll-up, related products.
- **Cart & Wishlist**: Client-side state managed via Redux Toolkit with `localStorage` persistence.
- **Checkout & Orders**: Re-priced server-side (client prices are never trusted), stock decremented atomically, Cash on Delivery support.
- **Authentication**: JWT token bearer auth, bcrypt password hashing, `user` and `admin` roles, profile editing.
- **Admin Dashboard**: Real-time sales metrics, order count, user count, product CRUD with image/category management, order and payment status management, user role management.
- **Responsive Theme**: Premium dark theme designed for mobile through desktop screens.
