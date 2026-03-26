# REALTA — Mumbai Commercial Real Estate Platform

Full-stack Next.js 14 real estate platform styled like 99acres/MagicBricks.

## Tech Stack
- **Next.js 14** (App Router)
- **PostgreSQL** + **Prisma ORM**
- **NextAuth.js** (JWT authentication)
- **Leaflet.js** (interactive maps)
- **Plus Jakarta Sans** (Google Fonts)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Setup database
```bash
npm run db:push     # Create tables
npm run db:seed     # Seed with Mumbai commercial properties
```

### 4. Start development
```bash
npm run dev
# Open http://localhost:3000
```

## Login Credentials (after seeding)
| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@realty.com   | admin123  |
| Buyer | john@example.com   | john123   |
| Agent | priya@realty.com   | priya123  |

## Pages
- `/`              — Homepage with search, featured properties
- `/listings`      — All properties with filters + map view
- `/property/[id]` — Property detail with EMI calculator
- `/admin`         — Admin dashboard (admin only)
- `/login`         — Login / Register

## API Routes
| Method | Route                    | Description         |
|--------|--------------------------|---------------------|
| GET    | /api/properties          | List with filters   |
| POST   | /api/properties          | Add property (admin)|
| GET    | /api/properties/:id      | Single property     |
| PUT    | /api/properties/:id      | Update (admin)      |
| DELETE | /api/properties/:id      | Delete (admin)      |
| POST   | /api/inquiries           | Send inquiry        |
| GET    | /api/inquiries           | List inquiries      |
| POST   | /api/register            | Register user       |
| GET    | /api/admin/stats         | Dashboard stats     |

## Import Your Scraped Data
Place `housing_data.json` in the root folder and run:
```bash
npm run db:seed
```

The seed script auto-detects and imports your JSON file.
