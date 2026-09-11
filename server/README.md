# Inventory / Stock Tracker

A full-stack inventory management system built for [LLI ASSESSMENT EXAM].
Users log in, manage a product catalog (CRUD), and view a live stock summary report.

## Tech Stack

- **Frontend:** React (Vite) + Ant Design
- **Backend:** Node.js + Express.js
- **Database:** Microsoft SQL Server (MSSQL)
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing
- **API style:** RESTful JSON API

## Features

- Login with JWT-based authentication (protected routes on both frontend and API)
- Create, read, update, and delete products (SKU, name, category, quantity, reorder level, unit price)
- Search products by SKU or name
- Low-stock indicator (visually flagged when quantity falls to or below reorder level)
- Report page: total items, total units, total inventory value, low-stock count, and a per-category breakdown

## Project Structure
inventory-tracker/
├── server/          # Express API
│   ├── db/
│   │   └── schema.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── reports.js
│   ├── db.js
│   ├── server.js
│   └── .env.example
└── client/          # React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductForm.jsx
    │   │   └── Report.jsx
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AppLayout.jsx
    │   ├── api.js
    │   └── App.jsx
    └── .env.example
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- SQL Server Express + SQL Server Management Studio (SSMS)
- SQL Server configured for **Mixed Mode Authentication**, with the **TCP/IP protocol enabled** (see Challenges section — this trips up a lot of default installs)

### 1. Clone the repository

```bash
git clone https://github.com/Tyron-19/inventory-tracker.git
cd inventory-tracker
```

### 2. Database setup

1. Open SSMS and connect to your local SQL Server instance.
2. Create a new database, e.g. `InventoryTrackerDB`.
3. Open `server/db/schema.sql` and run it against that database to create the `Users` and `Products` tables.
4. Create at least one login user. Since passwords are stored as bcrypt hashes (never plain text), generate a hash first:

```bash
   node -e "console.log(require('bcryptjs').hashSync('yourPassword123', 10))"
```

   Copy the printed hash, then run this in SSMS (swap in your own username and the hash you just generated):

```sql
   INSERT INTO Users (Username, PasswordHash, Role)
   VALUES ('admin', '<paste-hash-here>', 'admin');
```

### 3. Backend setup

```bash
cd server
npm install
copy .env.example .env
```

Edit `server/.env` and fill in your actual SQL Server credentials and a JWT secret:

DB_SERVER=localhost
DB_PORT=1433
DB_NAME=InventoryTrackerDB
DB_USER=sa
DB_PASSWORD=thisissa
PORT=4000
JWT_SECRET=7ee52025586c48a4779551ad8a5b722310e06cfc3dbce7c442aa33c1e9ce4230

Generate a random JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the API:

```bash
npx nodemon server.js
```

You should see `Connected to MSSQL` and `API running on port 4000` in the console.

### 4. Frontend setup

Open a new terminal:

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`) in your browser.

## Testing the App

1. Log in with the username/password you inserted into the `Users` table.
2. On the **Products** page, click **Add product** to create an item, use **Edit** to update it, and **Delete** to remove it. Products with quantity at or below their reorder level are flagged in the stock column.
3. Click **Report** in the nav bar to see aggregated totals and the per-category breakdown update live as products change.
4. The API can also be tested directly with Postman: obtain a token via `POST /api/auth/login`, then pass it as `Authorization: Bearer <token>` on all `/api/products` and `/api/reports` requests.

## API Endpoints

| Method | Endpoint              | Description                | Auth required |
|--------|------------------------|-----------------------------|----------------|
| POST   | /api/auth/login        | Log in, returns JWT         | No             |
| GET    | /api/products           | List products (supports `?search=`) | Yes |
| GET    | /api/products/:id       | Get a single product        | Yes            |
| POST   | /api/products           | Create a product            | Yes            |
| PUT    | /api/products/:id       | Update a product            | Yes            |
| DELETE | /api/products/:id       | Delete a product            | Yes            |
| GET    | /api/reports/summary    | Aggregated stock report     | Yes            |

## Challenges Encountered During Development

- **SQL Server TCP/IP not enabled by default:** SSMS could connect fine using its default local protocol, but Node's `mssql` driver only connects over TCP/IP, which SQL Server Express has disabled out of the box. Fixed by enabling TCP/IP in SQL Server Configuration Manager and setting a static port (1433) instead of relying on dynamic port + SQL Server Browser resolution.
- **Postman token management:** Manually copy-pasting the JWT into every request was error-prone. Solved by using a Postman environment variable (`{{token}}`) auto-populated via a Post-response script on the login request (`pm.environment.set("token", pm.response.json().token)`), then referencing `{{token}}` as a Bearer token on all protected requests.
- **JSX syntax errors during frontend build-out:** Vite's parser is strict about exact JSX structure; a small mismatched tag or bracket produced a full parse failure with only a line/column number to go on, requiring careful line-by-line review of the affected component.
- **Environment-specific setup:** Since `.env` files (containing DB credentials and the JWT secret) are correctly excluded from version control, `.env.example` files were added so the project is reproducible by anyone cloning the repo.

## Author

Tyron Dimla