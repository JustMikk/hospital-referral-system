# API, Schema, and Access Rules

## 1. Database Schema (Prisma Model)

```prisma
// Enums
enum UserRole {
  SYSTEM_ADMIN
  HOSPITAL_ADMIN
  DOCTOR
  NURSE
}

enum ReferralStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
  COMPLETED
}

enum Priority {
  NORMAL
  URGENT
  EMERGENCY
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum PatientStatus {
  ACTIVE
  INACTIVE
  CRITICAL
  DISCHARGED
}

// Models

model Hospital {
  id          String   @id @default(uuid())
  name        String
  type        String   // General, Specialty, etc.
  location    String
  status      String   // Connected, Pending, Inactive
  specialties String[]
  contactEmail String
  contactPhone String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users       User[]
  patients    Patient[]
  sentReferrals     Referral[] @relation("SentReferrals")
  receivedReferrals Referral[] @relation("ReceivedReferrals")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      UserRole
  hospitalId String
  hospital  Hospital @relation(fields: [hospitalId], references: [id])
  department String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sentReferrals     Referral[] @relation("ReferringDoctor")
  receivedReferrals Referral[] @relation("ReceivingDoctor")
  messagesSent      Message[]  @relation("Sender")
  messagesReceived  Message[]  @relation("Receiver")
  auditLogs         AuditLog[]
  assignedTasks     Task[]
}

model Patient {
  id        String   @id @default(uuid())
  name      String
  age       Int
  gender    Gender
  hospitalId String
  hospital  Hospital @relation(fields: [hospitalId], references: [id])
  status    PatientStatus
  email     String?
  phone     String?
  bloodType String?
  allergies String[]
  chronicConditions String[]
  lastVisit DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  emergencyContact EmergencyContact?
  referrals        Referral[]
  medicalRecords   MedicalRecord[]
}

model EmergencyContact {
  id        String  @id @default(uuid())
  patientId String  @unique
  patient   Patient @relation(fields: [patientId], references: [id])
  name      String
  phone     String
  relationship String
}

model Referral {
  id              String         @id @default(uuid())
  patientId       String
  patient         Patient        @relation(fields: [patientId], references: [id])
  
  fromHospitalId  String
  fromHospital    Hospital       @relation("SentReferrals", fields: [fromHospitalId], references: [id])
  toHospitalId    String
  toHospital      Hospital       @relation("ReceivedReferrals", fields: [toHospitalId], references: [id])
  
  referringDoctorId String
  referringDoctor   User           @relation("ReferringDoctor", fields: [referringDoctorId], references: [id])
  receivingDoctorId String?
  receivingDoctor   User?          @relation("ReceivingDoctor", fields: [receivingDoctorId], references: [id])
  
  status          ReferralStatus @default(DRAFT)
  priority        Priority       @default(NORMAL)
  reason          String
  notes           String?        // Clinical notes
  
  // Emergency Specifics
  emergencyConfirmed Boolean @default(false)
  emergencyReason    String?
  immediateRisks     String?
  
  // Permissions
  shareLabResults Boolean @default(true)
  shareImaging    Boolean @default(false)
  shareNotes      Boolean @default(true)
  emergencyAccess Boolean @default(false)
  
  // Rejection
  rejectionReason String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  timeline        ReferralEvent[]
}

model ReferralEvent {
  id          String   @id @default(uuid())
  referralId  String
  referral    Referral @relation(fields: [referralId], references: [id])
  type        String   // CREATED, SENT, VIEWED, ACCEPTED, REJECTED, COMPLETED, EMERGENCY_FLAG
  actorId     String
  actorName   String   // Snapshot in case user is deleted
  details     String?
  timestamp   DateTime @default(now())
}

model MedicalRecord {
  id        String   @id @default(uuid())
  patientId String
  patient   Patient  @relation(fields: [patientId], references: [id])
  type      String   // Diagnosis, Lab Result, etc.
  title     String
  details   String
  date      DateTime
  doctorId  String
  hospitalId String
}

model Message {
  id          String   @id @default(uuid())
  senderId    String
  sender      User     @relation("Sender", fields: [senderId], references: [id])
  receiverId  String
  receiver    User     @relation("Receiver", fields: [receiverId], references: [id])
  content     String
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Task {
  id          String   @id @default(uuid())
  assigneeId  String
  assignee    User     @relation(fields: [assigneeId], references: [id])
  title       String
  description String?
  priority    Priority
  status      String   // PENDING, COMPLETED
  dueDate     DateTime?
  createdAt   DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String
  resource  String
  details   String?
  ipAddress String?
  timestamp DateTime @default(now())
}
```

## 2. API Endpoints (Next.js Server Actions / Route Handlers)

### Authentication
*   `POST /api/auth/login`
*   `POST /api/auth/logout`
*   `GET /api/auth/me`

### Patients
*   `GET /api/patients` (Filter by hospital, name)
*   `GET /api/patients/:id`
*   `POST /api/patients` (Doctor only)
*   `PATCH /api/patients/:id` (Doctor/Nurse)
*   `GET /api/patients/:id/records`

### Referrals
*   `GET /api/referrals` (Filter by type: incoming/outgoing, status, priority)
*   `POST /api/referrals` (Create - Doctor only)
*   `GET /api/referrals/:id`
*   `PATCH /api/referrals/:id/status` (Accept/Reject - Doctor only)
*   `POST /api/referrals/:id/events` (Log event)
*   `PATCH /api/referrals/:id/nurse-actions` (Update vitals/notes - Nurse only)

### Messages
*   `GET /api/messages`
*   `POST /api/messages`
*   `PATCH /api/messages/:id/read`

### Tasks
*   `GET /api/tasks` (My tasks)
*   `POST /api/tasks`
*   `PATCH /api/tasks/:id`

### Admin / Analytics
*   `GET /api/admin/analytics` (System/Hospital Admin only)
*   `GET /api/admin/audit-logs`
*   `GET /api/admin/users`

## 3. Role-Based Access Control (RBAC) Matrix

| Feature | System Admin | Hospital Admin | Doctor | Nurse |
| :--- | :---: | :---: | :---: | :---: |
| **Login/Logout** | ✅ | ✅ | ✅ | ✅ |
| **View Own Profile** | ✅ | ✅ | ✅ | ✅ |
| **Manage All Hospitals** | ✅ | ❌ | ❌ | ❌ |
| **Manage Own Hospital** | ❌ | ✅ | ❌ | ❌ |
| **View Analytics** | ✅ | ✅ | ❌ | ❌ |
| **View Audit Logs** | ✅ | ✅ | ❌ | ❌ |
| **Create Referral** | ❌ | ❌ | ✅ | ❌ |
| **Accept/Reject Referral** | ❌ | ❌ | ✅ | ❌ |
| **View Referral Details** | ❌ | ✅ (Own Hosp) | ✅ | ✅ (Read-only) |
| **Nurse Actions (Vitals)** | ❌ | ❌ | ❌ | ✅ |
| **View Patients** | ❌ | ❌ | ✅ | ✅ |
| **Edit Patient Medical** | ❌ | ❌ | ✅ | ❌ |
| **Edit Patient Vitals** | ❌ | ❌ | ✅ | ✅ |
| **Messaging** | ❌ | ❌ | ✅ | ✅ |

## 4. Special Logic Rules

1.  **Emergency Referrals:**
    *   Must trigger immediate notification (mocked via console/log for now).
    *   Bypass standard sorting (always top).
    *   Require explicit confirmation flag.

2.  **Data Privacy:**
    *   Referral `share*` flags must be respected. If `shareImaging` is false, the receiving doctor cannot fetch imaging records via the referral context.
    *   `emergencyAccess` override allows viewing restricted records but MUST generate a high-priority Audit Log.

3.  **Referral State Machine:**
    *   Draft -> Sent
    *   Sent -> Accepted | Rejected
    *   Accepted -> Completed
    *   *Immutable History:* Once a status changes, a `ReferralEvent` is created.
