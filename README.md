# 🏠 REALTA - Real Estate Platform

A modern, full-featured real estate platform built with **Next.js 14 App Router**, featuring AI-powered assistance, interactive maps, role-based dashboards, and real-time property analytics.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![React](https://img.shields.io/badge/React-18.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![NextAuth.js](https://img.shields.io/badge/Auth-NextAuth.js-orange)

---

## ✨ Features

### 🏢 Property Management

* **900+ Property Listings** — Search, filter, and explore properties dynamically
* **Advanced Filtering** — City, type, price range, keyword search
* **Property Comparison** — Compare up to 4 properties side-by-side
* **Saved Listings** — Bookmark favorite properties

### 🤖 AI-Powered Assistance

* **Domain-Specific Chatbot** — Built using Google Gemini API
* **Smart Guidance** — Helps users navigate listings, filters, and platform features

### 🗺️ Location Intelligence

* **Google Maps Integration** — Real-time price markers with interactive popups
* **Street View & Satellite View** — Immersive property exploration

### 👥 User & Role Management

* **Role-Based Access** — Buyer, Agent, Admin
* **Secure Authentication** — JWT-based sessions using NextAuth.js
* **Protected Dashboards** — Personalized user experiences

### 🛡️ Admin & Agent Dashboards

* **Admin Panel** — Platform stats, user management, property moderation
* **Agent Dashboard** — Manage listings, handle inquiries, respond to users

### 💬 Inquiry & Review System

* **Contact Agent Workflow** — Mock payment + inquiry system
* **Reviews & Ratings** — User feedback on properties

### 💰 Financial Tools

* **EMI Calculator** — Real-time loan estimation
* **Pricing Insights** — Price comparisons across properties

---

## 🚀 Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend        | Next.js API Routes                              |
| Database       | MongoDB Atlas                                   |
| ODM            | Mongoose                                        |
| Authentication | NextAuth.js (JWT)                               |
| AI             | Google Gemini API                               |
| Maps           | Google Maps JavaScript API                      |
| Deployment     | Vercel                                          |

---

## 📋 Prerequisites

* Node.js 18+
* MongoDB Atlas account
* Google Maps API key
* Gemini API key

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

Edit `.env`:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key
GEMINI_API_KEY=your_gemini_key
```

### 4. Run the development server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Default Credentials (after seeding)

| Role  | Email                                       | Password |
| ----- | ------------------------------------------- | -------- |
| Admin | [admin@realty.com](mailto:admin@realty.com) | admin123 |
| Buyer | [john@example.com](mailto:john@example.com) | john123  |
| Agent | [priya@realty.com](mailto:priya@realty.com) | priya123 |

---

## 📁 Project Structure

```
RealEstatePlatform/
├── app/
│   ├── api/                # API routes
│   ├── listings/           # Property listings
│   ├── property/[id]/      # Property detail page
│   ├── dashboard/          # Buyer dashboard
│   ├── agent-dashboard/    # Agent dashboard
│   ├── admin/              # Admin dashboard
├── components/             # UI components
├── models/                 # Mongoose schemas
├── lib/                    # Utilities (DB connection, context)
├── scripts/                # Data seeding scripts
```

---

## 🔌 API Routes

| Method | Route                  | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/api/properties`      | Fetch properties with filters |
| POST   | `/api/properties`      | Add property (agent/admin)    |
| GET    | `/api/properties/[id]` | Get property details          |
| DELETE | `/api/properties/[id]` | Delete property (admin)       |
| POST   | `/api/inquiries`       | Submit inquiry                |
| GET    | `/api/inquiries`       | Fetch inquiries               |
| POST   | `/api/reviews`         | Add review                    |
| GET    | `/api/reviews`         | Fetch reviews                 |
| POST   | `/api/chat`            | AI chatbot interaction        |

---

## 🔐 User Roles

### 👤 Buyer

* Browse properties
* Save & compare listings
* Contact agents

### 🏢 Agent

* Add/manage listings
* Respond to inquiries
* Access agent dashboard

### 👑 Admin

* Manage users & properties
* View analytics
* Moderate platform activity

---

## 🧠 Key Highlights

* Scalable architecture handling **900+ listings**
* AI chatbot with **domain-restricted responses**
* Real-time map visualization with **price markers**
* Secure authentication with **role-based routing**
* Modular API design with clean separation of concerns

---

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically

---

## 🙏 Acknowledgments

* Built with Next.js & React
* MongoDB Atlas for scalable data storage
* Google Maps for geospatial visualization
* Gemini API for AI-powered assistance

---

**Made with ❤️ by Neha Chinnam**


