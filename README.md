<div align="center">

# 🏥 Hospital Referral System

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A modern, full-stack healthcare referral management platform enabling seamless patient transfers between hospitals with real-time tracking, emergency protocols, and comprehensive audit logging.**

[🚀 Getting Started](#-getting-started) •
[✨ Features](#-features) •
[🏗️ Architecture](#️-architecture) •
[📚 Documentation](#-documentation) •
[🤝 Contributing](#-contributing)

---

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/heart-pulse.svg" width="120" alt="Healthcare Icon"/>

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🔐 Authentication & Authorization](#-authentication--authorization)
- [📊 Database Schema](#-database-schema)
- [🌐 API Reference](#-api-reference)
- [🎨 UI Components](#-ui-components)
- [📱 Screenshots](#-screenshots)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🔄 Referral Management
| Feature | Description |
|---------|-------------|
| 📝 **Create Referrals** | Multi-step wizard for creating detailed patient referrals |
| 📥 **Inbox/Outbox** | Separate views for received and sent referrals |
| 🔴 **Priority Levels** | Normal, Urgent, and Emergency referral classification |
| 📊 **Status Tracking** | Real-time status updates (Draft → Sent → Accepted/Rejected → Completed) |
| 📎 **Document Sharing** | Attach and share medical documents with referrals |
| 📜 **Timeline Events** | Complete audit trail of all referral activities |

### 👥 Patient Management
| Feature | Description |
|---------|-------------|
| 🗃️ **Patient Records** | Comprehensive patient profiles with medical history |
| 🩺 **Medical Documents** | Upload and manage lab results, imaging, and notes |
| 🔍 **Smart Search** | Filter patients by status, name, or medical condition |
| 📋 **Chronic Conditions** | Track allergies and chronic conditions |
| 🆘 **Emergency Contacts** | Store emergency contact information |

### 🏨 Hospital Network
| Feature | Description |
|---------|-------------|
| 🌐 **Multi-Hospital** | Support for General, Specialty, Clinic, and Rehabilitation facilities |
| 🔗 **Network Status** | Track hospital connection status (Connected, Pending, Inactive) |
| 🏢 **Departments** | Manage hospital departments and their staff |
| 📍 **Specialties** | Filter hospitals by available specialties |

### 👨‍⚕️ Staff & Administration
| Feature | Description |
|---------|-------------|
| 👤 **Role-Based Access** | System Admin, Hospital Admin, Doctor, Nurse roles |
| 📊 **Analytics Dashboard** | Real-time metrics and insights |
| 📝 **Audit Logs** | Complete activity logging for compliance |
| ✅ **Task Management** | Assign and track tasks across staff |

### 🚨 Emergency Features
| Feature | Description |
|---------|-------------|
| ⚡ **Emergency Referrals** | Fast-track emergency patient transfers |
| 🔓 **Emergency Access** | Break-glass access to patient records |
| 📢 **Priority Alerts** | Visual indicators for urgent cases |

### 💬 Communication
| Feature | Description |
|---------|-------------|
| 📨 **Internal Messaging** | Secure messaging between healthcare providers |
| 🔔 **Notifications** | Real-time alerts for referral updates |
| 📅 **Appointments** | Schedule and manage patient appointments |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ⚛️ **React 19** | UI Library |
| ▲ **Next.js 16** | Full-stack Framework (App Router) |
| 📘 **TypeScript** | Type Safety |
| 🎨 **Tailwind CSS 4** | Styling |
| 🧩 **Radix UI** | Accessible Component Primitives |
| 📊 **Recharts** | Data Visualization |
| 🎭 **Lucide Icons** | Icon Library |

### Backend
| Technology | Purpose |
|------------|---------|
| 🔷 **Next.js Server Actions** | API Layer |
| 🗄️ **Prisma ORM** | Database Access |
| 🐘 **PostgreSQL** | Primary Database |
| 🔐 **Jose (JWT)** | Authentication |
| 🔒 **bcryptjs** | Password Hashing |
| ☁️ **Cloudinary** | File Storage |

### Development
| Technology | Purpose |
|------------|---------|
| 📦 **pnpm** | Package Manager |
| 🔧 **ESLint** | Code Linting |
| 🎯 **Zod** | Schema Validation |
| 🛠️ **tsx** | TypeScript Execution |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
node >= 18.0.0
pnpm >= 8.0.0
postgresql >= 14.0
```

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/JustMikk/hospital-referral-system.git
cd hospital-referral-system
```

### 2️⃣ Install Dependencies

```bash
pnpm install
```

### 3️⃣ Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hospital_referral_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"

# Cloudinary (for document uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4️⃣ Database Setup

```bash
# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Seed the database with sample data
pnpm prisma db seed
```

### 5️⃣ Start Development Server

```bash
pnpm dev
```

🎉 Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React UI  │  │  Auth Context│  │   Server Components    │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
└─────────┼────────────────┼─────────────────────┼─────────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Server Actions│  │ API Routes   │  │    Middleware        │   │
│  │ (app/actions) │  │ (app/api)    │  │    (auth check)      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘   │
└─────────┼────────────────┼───────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PRISMA ORM                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Prisma Client                          │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        POSTGRESQL                                │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────────┐ │
│  │Hospital│ │ User   │ │Patient │ │Referral│ │ Other Tables   │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
hospital-referral-system/
├── 📂 app/                          # Next.js App Router
│   ├── 📂 (auth)/                   # Authentication pages
│   │   ├── login/                   # Login page
│   │   ├── forgot-password/         # Password recovery
│   │   └── contact-hospitals/       # Hospital contact
│   │
│   ├── 📂 (dashboard)/              # Protected dashboard routes
│   │   ├── admin/                   # Admin panel
│   │   ├── audit-logs/              # Audit log viewer
│   │   ├── dashboard/               # Main dashboard
│   │   ├── departments/             # Department management
│   │   ├── emergency-access/        # Emergency access logs
│   │   ├── hospitals/               # Hospital management
│   │   ├── messages/                # Messaging system
│   │   ├── patients/                # Patient management
│   │   ├── records/                 # Medical records
│   │   ├── referrals/               # Referral management
│   │   │   ├── create/              # Create referral wizard
│   │   │   └── [id]/                # Referral details
│   │   ├── settings/                # User settings
│   │   ├── staff/                   # Staff management
│   │   └── tasks/                   # Task management
│   │
│   ├── 📂 actions/                  # Server Actions
│   │   ├── admin.ts                 # Admin operations
│   │   ├── analytics.ts             # Dashboard analytics
│   │   ├── audit-logs.ts            # Audit logging
│   │   ├── departments.ts           # Department CRUD
│   │   ├── documents.ts             # Document management
│   │   ├── hospitals.ts             # Hospital operations
│   │   ├── messages.ts              # Messaging
│   │   ├── patients.ts              # Patient CRUD
│   │   ├── referrals.ts             # Referral operations
│   │   ├── staff.ts                 # Staff management
│   │   └── tasks.ts                 # Task operations
│   │
│   ├── 📂 api/                      # API Routes
│   │   ├── auth/                    # Authentication endpoints
│   │   └── documents/               # Document upload endpoints
│   │
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page (redirects to login)
│
├── 📂 components/                   # React Components
│   ├── 📂 ui/                       # Base UI components (Radix-based)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ...
│   │
│   ├── 📂 medical/                  # Healthcare-specific components
│   │   ├── sidebar.tsx              # Navigation sidebar
│   │   ├── top-bar.tsx              # Top navigation bar
│   │   ├── patient-table.tsx        # Patient list table
│   │   ├── referral-timeline.tsx    # Referral event timeline
│   │   └── ...
│   │
│   └── 📂 dashboard/                # Dashboard widgets
│       ├── patient-activity-chart.tsx
│       ├── recent-referrals.tsx
│       └── todays-appointments.tsx
│
├── 📂 context/                      # React Context
│   └── auth-context.tsx             # Authentication context
│
├── 📂 hooks/                        # Custom React Hooks
│   ├── use-mobile.ts                # Mobile detection
│   └── use-toast.ts                 # Toast notifications
│
├── 📂 lib/                          # Utility libraries
│   ├── auth.ts                      # Authentication helpers
│   ├── auth-edge.ts                 # Edge-compatible auth
│   ├── audit.ts                     # Audit logging utilities
│   ├── cloudinary.ts                # Cloudinary integration
│   ├── prisma.ts                    # Prisma client instance
│   └── utils.ts                     # General utilities
│
├── 📂 prisma/                       # Database
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Database seeding
│
├── 📄 middleware.ts                 # Next.js middleware (auth)
├── 📄 next.config.mjs               # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind configuration
├── 📄 tsconfig.json                 # TypeScript configuration
└── 📄 package.json                  # Dependencies
```

---

## 🔐 Authentication & Authorization

### User Roles

| Role | Icon | Permissions |
|------|------|-------------|
| **System Admin** | 🔑 | Full system access, manage all hospitals, users, and settings |
| **Hospital Admin** | 🏥 | Manage hospital staff, departments, view hospital analytics |
| **Doctor** | 👨‍⚕️ | Create/manage referrals, view patients, access medical records |
| **Nurse** | 👩‍⚕️ | Update patient vitals, manage tasks, limited referral access |

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant M as Middleware
    participant A as Auth API
    participant D as Database

    U->>C: Enter credentials
    C->>A: POST /api/auth/login
    A->>D: Verify credentials
    D-->>A: User data
    A-->>C: JWT token (HTTP-only cookie)
    C->>M: Request protected route
    M->>M: Validate JWT
    M-->>C: Allow/Deny access
```

### Protected Routes

All routes under `/(dashboard)/*` require authentication. The middleware automatically:
- ✅ Validates JWT tokens
- ✅ Checks user roles for route access
- ✅ Redirects unauthenticated users to login

---

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Hospital   │◄──────│    User     │───────│  Message    │
│             │       │             │       │             │
│ - id        │       │ - id        │       │ - id        │
│ - name      │       │ - email     │       │ - senderId  │
│ - type      │       │ - name      │       │ - receiverId│
│ - location  │       │ - role      │       │ - content   │
│ - status    │       │ - hospitalId│       │ - read      │
│ - specialtie│       │ - department│       └─────────────┘
└──────┬──────┘       └──────┬──────┘
       │                     │
       │     ┌───────────────┘
       │     │
       ▼     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Patient    │◄──────│  Referral   │───────│ReferralEvent│
│             │       │             │       │             │
│ - id        │       │ - id        │       │ - id        │
│ - name      │       │ - patientId │       │ - referralId│
│ - age       │       │ - status    │       │ - type      │
│ - gender    │       │ - priority  │       │ - actorName │
│ - status    │       │ - reason    │       │ - details   │
│ - bloodType │       │ - fromHosp  │       │ - timestamp │
│ - allergies │       │ - toHosp    │       └─────────────┘
└──────┬──────┘       └─────────────┘
       │
       ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│MedicalRecord│       │MedicalDoc   │       │ Appointment │
│             │       │             │       │             │
│ - id        │       │ - id        │       │ - id        │
│ - patientId │       │ - patientId │       │ - patientId │
│ - type      │       │ - title     │       │ - doctorId  │
│ - title     │       │ - type      │       │ - time      │
│ - details   │       │ - cloudinary│       │ - type      │
│ - date      │       │ - fileSize  │       │ - status    │
└─────────────┘       └─────────────┘       └─────────────┘
```

### Key Enums

```typescript
// User Roles
enum UserRole {
  SYSTEM_ADMIN    // Full system access
  HOSPITAL_ADMIN  // Hospital management
  DOCTOR          // Clinical access
  NURSE           // Limited clinical access
}

// Referral Status
enum ReferralStatus {
  DRAFT      // ✏️ Not yet submitted
  SENT       // 📤 Awaiting response
  ACCEPTED   // ✅ Referral accepted
  REJECTED   // ❌ Referral declined
  COMPLETED  // ✔️ Transfer complete
}

// Priority Levels
enum Priority {
  NORMAL     // 🟢 Standard processing
  URGENT     // 🟡 Expedited handling
  EMERGENCY  // 🔴 Immediate attention
}
```

---

## 🌐 API Reference

### Server Actions

#### 📋 Patients

| Action | Description |
|--------|-------------|
| `getPatients()` | Fetch all patients for current hospital |
| `getPatientById(id)` | Get patient details with medical history |
| `createPatient(data)` | Register new patient |
| `updatePatient(id, data)` | Update patient information |

#### 🔄 Referrals

| Action | Description |
|--------|-------------|
| `getReferrals(filters)` | Fetch referrals (inbox/sent) |
| `getReferralById(id)` | Get referral with timeline |
| `createReferral(data)` | Create new referral |
| `updateReferralStatus(id, status)` | Accept/Reject referral |

#### 🏥 Hospitals

| Action | Description |
|--------|-------------|
| `getHospitals()` | Fetch all hospitals in network |
| `getHospitalById(id)` | Get hospital details |
| `updateHospitalStatus(id, status)` | Update connection status |

#### 👥 Staff

| Action | Description |
|--------|-------------|
| `getStaff()` | Fetch hospital staff |
| `createStaffMember(data)` | Add new staff |
| `updateStaffMember(id, data)` | Update staff info |

---

## 🎨 UI Components

Built on **Radix UI** primitives with **Tailwind CSS** styling:

### Base Components (`/components/ui/`)

| Component | Description |
|-----------|-------------|
| `Button` | Primary action buttons with variants |
| `Card` | Content containers |
| `Dialog` | Modal dialogs |
| `Form` | Form handling with react-hook-form |
| `Table` | Data tables with sorting |
| `Tabs` | Tabbed navigation |
| `Toast` | Notification toasts |
| `Select` | Dropdown selection |
| `Input` | Text input fields |
| `Badge` | Status badges |

### Medical Components (`/components/medical/`)

| Component | Description |
|-----------|-------------|
| `Sidebar` | Main navigation sidebar |
| `TopBar` | Top navigation with user menu |
| `PatientTable` | Patient listing with search |
| `ReferralTimeline` | Referral event timeline |
| `StatusBadge` | Color-coded status indicators |
| `DocumentList` | Medical document viewer |
| `EmptyState` | Empty data placeholders |

---

## 📱 Screenshots

<div align="center">

### 🖥️ Dashboard
*Real-time overview of referrals, patients, and tasks*

### 📋 Referral Management
*Create, track, and manage patient referrals*

### 👤 Patient Records
*Comprehensive patient profiles and medical history*

### 📊 Analytics
*Hospital performance metrics and insights*

</div>

---

## 🧪 Testing

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

### Test Scenarios

| Test | Description |
|------|-------------|
| 🔐 Auth Flow | Login, logout, session management |
| 📝 Referral CRUD | Create, read, update referral status |
| 👥 Patient Management | Patient creation and updates |
| 🔄 Cross-Hospital | Multi-hospital referral flow |
| 🚨 Emergency | Emergency referral priority |

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
# Build image
docker build -t hospital-referral-system .

# Run container
docker run -p 3000:3000 hospital-referral-system
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://...
JWT_SECRET=production-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🔀 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🔃 Open a Pull Request

### Development Guidelines

- ✅ Follow TypeScript best practices
- ✅ Write meaningful commit messages
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Ensure all tests pass before PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://prisma.io/) - Database ORM
- [Radix UI](https://radix-ui.com/) - UI Primitives
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons

---

<div align="center">

**Made with ❤️ for Healthcare**

[⬆ Back to Top](#-hospital-referral-system)

</div>
