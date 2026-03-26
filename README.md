# 🏠 REALTA - Real Estate Platform

A modern, full-featured real estate platform built with Next.js 14, featuring user authentication, property management, admin dashboard, and agent tools.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![React](https://img.shields.io/badge/React-18.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.0-orange)

---

## ✨ Features

### 🏢 Property Management
- **Property Listings** — Browse, search, and filter properties
- **Property Details** — Comprehensive property information with images
- **Property Addition** — Agents can add new listings
- **Image Gallery** — Dynamic property image display with fallbacks

### 👥 User Management
- **Role-Based Access** — Buyer, Agent, and Admin roles
- **Authentication** — Secure login/registration with NextAuth.js
- **Profile Management** — User profiles and preferences

### 🛡️ Admin Dashboard
- **Platform Statistics** — Total properties, users, and inquiries
- **User Management** — View and manage all users
- **Property Oversight** — Monitor and delete listings
- **Inquiry Management** — Handle property inquiries

### 🏢 Agent Features
- **Dashboard** — Manage personal listings and inquiries
- **Advertising Plans** — Premium subscription plans for visibility
- **Lead Management** — Track property inquiries

### 💰 Advertising System
- **Tiered Plans** — Basic, Professional, and Enterprise plans
- **Subscription Management** — Role-based access control
- **Payment Integration** — Ready for payment gateway integration

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL |
| Authentication | NextAuth.js with Credentials Provider |
| Maps | Leaflet.js (interactive maps) |
| Fonts | Plus Jakarta Sans (Google Fonts) |
| Styling | Inline CSS with responsive design |
| Deployment | Vercel / Netlify ready |

---

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

---

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/RealEstatePlatform.git
cd RealEstatePlatform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/real_estate_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the database (optional)
```bash
npx prisma db seed
```

### 6. Start the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Login Credentials (after seeding)

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@realty.com  | admin123  |
| Buyer | john@example.com  | john123   |
| Agent | priya@realty.com  | priya123  |

---

## 📁 Project Structure

```
RealEstatePlatform/
├── app/                        # Next.js App Router
│   ├── admin/                  # Admin dashboard
│   ├── agent-dashboard/        # Agent dashboard
│   ├── advertise/              # Advertising plans
│   ├── api/                    # API routes
│   │   ├── admin/              # Admin API endpoints
│   │   ├── auth/               # Authentication
│   │   ├── properties/         # Property management
│   │   └── register/           # User registration
│   ├── listings/               # Property listings page
│   ├── login/                  # Login page
│   └── property/               # Individual property pages
├── components/                 # React components
│   ├── Navbar.js               # Navigation component
│   ├── PropertyCard.js         # Property listing card
│   ├── PropertyImages.js       # Image gallery component
│   └── ...
├── lib/                        # Utility libraries
│   ├── prisma.js               # Database client
│   └── constants.js            # App constants
├── prisma/                     # Database schema
│   └── schema.prisma           # Prisma schema
├── public/                     # Static assets
├── scripts/                    # Utility scripts
└── package.json                # Dependencies
```

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with search and featured properties |
| `/listings` | All properties with filters + map view |
| `/property/[id]` | Property detail with EMI calculator |
| `/admin` | Admin dashboard (admin only) |
| `/login` | Login / Register |

---

## 🔌 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/properties` | List with filters |
| POST | `/api/properties` | Add property (admin) |
| GET | `/api/properties/:id` | Single property |
| PUT | `/api/properties/:id` | Update (admin) |
| DELETE | `/api/properties/:id` | Delete (admin) |
| POST | `/api/inquiries` | Send inquiry |
| GET | `/api/inquiries` | List inquiries |
| POST | `/api/register` | Register user |
| GET | `/api/admin/stats` | Dashboard stats |

---

## 🔐 User Roles & Permissions

### 👤 Buyer (Default)
- Browse and search properties
- View property details
- Contact agents via inquiry form
- Save favourite properties

### 🏢 Agent (`@realty.com` emails)
- All buyer permissions
- Add new property listings
- Manage personal listings
- Access agent dashboard
- Subscribe to advertising plans

### 👑 Admin
- All agent permissions
- Access admin dashboard
- View platform statistics
- Manage all users and properties
- Delete inappropriate content

---

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("buyer") // buyer | agent | admin
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Property Model
```prisma
model Property {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  location    String
  bedrooms    Int?
  bathrooms   Int?
  area        Float?
  type        String   // residential | commercial
  status      String   @default("available")
  images      String[] // Array of image URLs
  agentId     String
  agent       User     @relation(fields: [agentId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Inquiry Model
```prisma
model Inquiry {
  id         String   @id @default(cuid())
  name       String
  email      String
  phone      String?
  message    String
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  createdAt  DateTime @default(now())
}
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma Studio |
| `npx prisma generate` | Generate Prisma client |

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm run start`
3. Configure reverse proxy (nginx / apache)

---

## 📦 Import Your Scraped Data

Place `housing_data.json` in the root folder and run:
```bash
npm run db:seed
```
The seed script auto-detects and imports your JSON file.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email [neha_chinnam@srmap.edu.in](mailto:neha_chinnam@srmap.edu.in) or open an issue in this repository.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)
- Database ORM by [Prisma](https://prisma.io/)
- UI components inspired by modern real estate platforms like 99acres / MagicBricks

---

**Made with ❤️ by Neha Chinnam**
