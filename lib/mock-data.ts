// Mock data for the hospital referral system

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  hospital: string;
  lastVisit: string;
  status: "Active" | "Inactive" | "Critical" | "Discharged";
  email: string;
  phone: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  fromHospital: string;
  toHospital: string;
  referringDoctor: string;
  receivingDoctor: string;
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Completed";
  priority: "Normal" | "Urgent" | "Emergency";
  reason: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: "Consultation" | "Follow-up" | "Surgery" | "Lab Test";
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantHospital: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  userRole: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: "Diagnosis" | "Procedure" | "Lab Result" | "Prescription" | "Note";
  title: string;
  doctor: string;
  hospital: string;
  details: string;
}

// Mock Patients
export const patients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    hospital: "Central Medical Center",
    lastVisit: "2026-01-15",
    status: "Active",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    bloodType: "A+",
    allergies: ["Penicillin", "Shellfish"],
    chronicConditions: ["Type 2 Diabetes", "Hypertension"],
    emergencyContact: {
      name: "Mary Smith",
      phone: "+1 (555) 987-6543",
      relationship: "Spouse",
    },
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    hospital: "St. Mary's Hospital",
    lastVisit: "2026-01-17",
    status: "Critical",
    email: "sarah.j@email.com",
    phone: "+1 (555) 234-5678",
    bloodType: "O-",
    allergies: ["Latex"],
    chronicConditions: ["Asthma"],
    emergencyContact: {
      name: "Mike Johnson",
      phone: "+1 (555) 876-5432",
      relationship: "Brother",
    },
  },
  {
    id: "P003",
    name: "Michael Chen",
    age: 58,
    gender: "Male",
    hospital: "City General Hospital",
    lastVisit: "2026-01-10",
    status: "Active",
    email: "m.chen@email.com",
    phone: "+1 (555) 345-6789",
    bloodType: "B+",
    allergies: [],
    chronicConditions: ["Coronary Artery Disease"],
    emergencyContact: {
      name: "Lisa Chen",
      phone: "+1 (555) 765-4321",
      relationship: "Spouse",
    },
  },
  {
    id: "P004",
    name: "Emily Davis",
    age: 28,
    gender: "Female",
    hospital: "Central Medical Center",
    lastVisit: "2026-01-18",
    status: "Active",
    email: "emily.d@email.com",
    phone: "+1 (555) 456-7890",
    bloodType: "AB+",
    allergies: ["Sulfa drugs"],
    chronicConditions: [],
    emergencyContact: {
      name: "Robert Davis",
      phone: "+1 (555) 654-3210",
      relationship: "Father",
    },
  },
  {
    id: "P005",
    name: "Robert Wilson",
    age: 67,
    gender: "Male",
    hospital: "Memorial Hospital",
    lastVisit: "2026-01-12",
    status: "Discharged",
    email: "r.wilson@email.com",
    phone: "+1 (555) 567-8901",
    bloodType: "A-",
    allergies: ["Aspirin", "Ibuprofen"],
    chronicConditions: ["COPD", "Heart Failure"],
    emergencyContact: {
      name: "Patricia Wilson",
      phone: "+1 (555) 543-2109",
      relationship: "Spouse",
    },
  },
  {
    id: "P006",
    name: "Amanda Martinez",
    age: 41,
    gender: "Female",
    hospital: "St. Mary's Hospital",
    lastVisit: "2026-01-16",
    status: "Active",
    email: "a.martinez@email.com",
    phone: "+1 (555) 678-9012",
    bloodType: "O+",
    allergies: [],
    chronicConditions: ["Rheumatoid Arthritis"],
    emergencyContact: {
      name: "Carlos Martinez",
      phone: "+1 (555) 432-1098",
      relationship: "Spouse",
    },
  },
  {
    id: "P007",
    name: "David Thompson",
    age: 52,
    gender: "Male",
    hospital: "City General Hospital",
    lastVisit: "2026-01-14",
    status: "Inactive",
    email: "d.thompson@email.com",
    phone: "+1 (555) 789-0123",
    bloodType: "B-",
    allergies: ["Codeine"],
    chronicConditions: ["Chronic Kidney Disease"],
    emergencyContact: {
      name: "Susan Thompson",
      phone: "+1 (555) 321-0987",
      relationship: "Spouse",
    },
  },
  {
    id: "P008",
    name: "Jennifer Lee",
    age: 35,
    gender: "Female",
    hospital: "Central Medical Center",
    lastVisit: "2026-01-17",
    status: "Critical",
    email: "j.lee@email.com",
    phone: "+1 (555) 890-1234",
    bloodType: "AB-",
    allergies: ["Morphine", "Nuts"],
    chronicConditions: ["Epilepsy"],
    emergencyContact: {
      name: "Kevin Lee",
      phone: "+1 (555) 210-9876",
      relationship: "Spouse",
    },
  },
];

// Mock Referrals
export const referrals: Referral[] = [
  {
    id: "R001",
    patientId: "P001",
    patientName: "John Smith",
    fromHospital: "Central Medical Center",
    toHospital: "Heart Specialist Clinic",
    referringDoctor: "Dr. Emily Wilson",
    receivingDoctor: "Dr. James Carter",
    status: "Sent",
    priority: "Normal",
    reason: "Cardiac evaluation required",
    notes: "Patient experiencing occasional chest pain. ECG shows minor irregularities.",
    createdAt: "2026-01-15T09:30:00",
    updatedAt: "2026-01-15T14:20:00",
  },
  {
    id: "R002",
    patientId: "P002",
    patientName: "Sarah Johnson",
    fromHospital: "St. Mary's Hospital",
    toHospital: "Central Medical Center",
    referringDoctor: "Dr. Michael Brown",
    receivingDoctor: "Dr. Emily Wilson",
    status: "Accepted",
    priority: "Emergency",
    reason: "Severe respiratory distress",
    notes: "Patient requires immediate ICU admission and respiratory support.",
    createdAt: "2026-01-17T02:15:00",
    updatedAt: "2026-01-17T02:45:00",
  },
  {
    id: "R003",
    patientId: "P003",
    patientName: "Michael Chen",
    fromHospital: "City General Hospital",
    toHospital: "Cardiac Surgery Center",
    referringDoctor: "Dr. Sarah Lee",
    receivingDoctor: "Dr. Robert Martinez",
    status: "Completed",
    priority: "Urgent",
    reason: "Coronary artery bypass surgery",
    notes: "Pre-operative assessment complete. Surgery scheduled.",
    createdAt: "2026-01-08T11:00:00",
    updatedAt: "2026-01-10T16:30:00",
  },
  {
    id: "R004",
    patientId: "P005",
    patientName: "Robert Wilson",
    fromHospital: "Memorial Hospital",
    toHospital: "Pulmonary Rehabilitation Center",
    referringDoctor: "Dr. Amanda Chen",
    receivingDoctor: "Dr. William Taylor",
    status: "Draft",
    priority: "Normal",
    reason: "Post-hospitalization rehabilitation",
    notes: "Patient ready for discharge. Needs pulmonary rehab program.",
    createdAt: "2026-01-18T10:00:00",
    updatedAt: "2026-01-18T10:00:00",
  },
  {
    id: "R005",
    patientId: "P008",
    patientName: "Jennifer Lee",
    fromHospital: "Central Medical Center",
    toHospital: "Neurology Specialist Clinic",
    referringDoctor: "Dr. Emily Wilson",
    receivingDoctor: "Dr. Patricia Anderson",
    status: "Rejected",
    priority: "Urgent",
    reason: "Increased seizure frequency",
    notes: "Specialist unavailable. Redirected to alternative facility.",
    createdAt: "2026-01-16T08:45:00",
    updatedAt: "2026-01-16T15:30:00",
  },
];

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: "A001",
    patientName: "John Smith",
    time: "09:00 AM",
    type: "Follow-up",
    status: "Scheduled",
  },
  {
    id: "A002",
    patientName: "Emily Davis",
    time: "10:30 AM",
    type: "Consultation",
    status: "Scheduled",
  },
  {
    id: "A003",
    patientName: "Michael Chen",
    time: "11:00 AM",
    type: "Lab Test",
    status: "In Progress",
  },
  {
    id: "A004",
    patientName: "Amanda Martinez",
    time: "02:00 PM",
    type: "Follow-up",
    status: "Scheduled",
  },
  {
    id: "A005",
    patientName: "Sarah Johnson",
    time: "03:30 PM",
    type: "Surgery",
    status: "Scheduled",
  },
];

// Mock Conversations
export const conversations: Conversation[] = [
  {
    id: "C001",
    participantId: "D002",
    participantName: "Dr. James Carter",
    participantRole: "Cardiologist",
    participantHospital: "Heart Specialist Clinic",
    lastMessage: "The patient's ECG results look concerning. Can we discuss?",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    messages: [
      {
        id: "M001",
        senderId: "D001",
        senderName: "You",
        content: "Hi Dr. Carter, I'm referring a patient with cardiac symptoms.",
        timestamp: "09:15 AM",
        read: true,
      },
      {
        id: "M002",
        senderId: "D002",
        senderName: "Dr. James Carter",
        content: "Thank you for the referral. I've reviewed the initial notes.",
        timestamp: "09:45 AM",
        read: true,
      },
      {
        id: "M003",
        senderId: "D002",
        senderName: "Dr. James Carter",
        content: "The patient's ECG results look concerning. Can we discuss?",
        timestamp: "10:30 AM",
        read: false,
      },
    ],
  },
  {
    id: "C002",
    participantId: "D003",
    participantName: "Dr. Sarah Lee",
    participantRole: "General Surgeon",
    participantHospital: "City General Hospital",
    lastMessage: "Surgery scheduled for tomorrow at 8 AM.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "M004",
        senderId: "D003",
        senderName: "Dr. Sarah Lee",
        content: "Good morning! Regarding the Chen case...",
        timestamp: "Yesterday 08:00 AM",
        read: true,
      },
      {
        id: "M005",
        senderId: "D001",
        senderName: "You",
        content: "Yes, all pre-op tests are complete.",
        timestamp: "Yesterday 08:30 AM",
        read: true,
      },
      {
        id: "M006",
        senderId: "D003",
        senderName: "Dr. Sarah Lee",
        content: "Surgery scheduled for tomorrow at 8 AM.",
        timestamp: "Yesterday 04:00 PM",
        read: true,
      },
    ],
  },
  {
    id: "C003",
    participantId: "D004",
    participantName: "Dr. Patricia Anderson",
    participantRole: "Neurologist",
    participantHospital: "Neurology Specialist Clinic",
    lastMessage: "I apologize, but I won't be able to accept this referral.",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    messages: [
      {
        id: "M007",
        senderId: "D001",
        senderName: "You",
        content: "Urgent referral for Jennifer Lee - increased seizure activity.",
        timestamp: "2 days ago 08:45 AM",
        read: true,
      },
      {
        id: "M008",
        senderId: "D004",
        senderName: "Dr. Patricia Anderson",
        content: "I apologize, but I won't be able to accept this referral.",
        timestamp: "2 days ago 03:30 PM",
        read: true,
      },
    ],
  },
];

// Mock Audit Logs
export const auditLogs: AuditLogEntry[] = [
  {
    id: "AL001",
    action: "Patient Record Viewed",
    user: "Dr. Emily Wilson",
    userRole: "Physician",
    timestamp: "2026-01-18 10:30:15",
    details: "Viewed patient record: John Smith (P001)",
    ipAddress: "192.168.1.100",
  },
  {
    id: "AL002",
    action: "Referral Created",
    user: "Dr. Emily Wilson",
    userRole: "Physician",
    timestamp: "2026-01-18 10:00:00",
    details: "Created referral R004 for Robert Wilson",
    ipAddress: "192.168.1.100",
  },
  {
    id: "AL003",
    action: "Patient Record Updated",
    user: "Nurse Jane Miller",
    userRole: "Nurse",
    timestamp: "2026-01-18 09:45:22",
    details: "Updated vitals for patient: Sarah Johnson (P002)",
    ipAddress: "192.168.1.105",
  },
  {
    id: "AL004",
    action: "Referral Status Changed",
    user: "Dr. James Carter",
    userRole: "Physician",
    timestamp: "2026-01-17 14:20:00",
    details: "Referral R001 status changed from Draft to Sent",
    ipAddress: "192.168.2.50",
  },
  {
    id: "AL005",
    action: "Login Successful",
    user: "Admin John Doe",
    userRole: "Administrator",
    timestamp: "2026-01-18 08:00:00",
    details: "User logged in successfully",
    ipAddress: "192.168.1.1",
  },
];

// Mock Medical Records for a patient
export const medicalRecords: MedicalRecord[] = [
  {
    id: "MR001",
    date: "2026-01-15",
    type: "Diagnosis",
    title: "Hypertension - Stage 2",
    doctor: "Dr. Emily Wilson",
    hospital: "Central Medical Center",
    details: "Blood pressure consistently above 140/90. Started on Lisinopril 10mg daily.",
  },
  {
    id: "MR002",
    date: "2026-01-10",
    type: "Lab Result",
    title: "Comprehensive Metabolic Panel",
    doctor: "Dr. Emily Wilson",
    hospital: "Central Medical Center",
    details: "Glucose: 126 mg/dL (elevated), Creatinine: 1.1 mg/dL, all other values normal.",
  },
  {
    id: "MR003",
    date: "2026-01-05",
    type: "Prescription",
    title: "Metformin 500mg",
    doctor: "Dr. Emily Wilson",
    hospital: "Central Medical Center",
    details: "Take twice daily with meals. Monitor blood glucose levels.",
  },
  {
    id: "MR004",
    date: "2025-12-20",
    type: "Procedure",
    title: "Electrocardiogram (ECG)",
    doctor: "Dr. Emily Wilson",
    hospital: "Central Medical Center",
    details: "Minor ST elevation noted. Recommend follow-up with cardiologist.",
  },
  {
    id: "MR005",
    date: "2025-12-15",
    type: "Note",
    title: "Follow-up Visit Notes",
    doctor: "Dr. Emily Wilson",
    hospital: "Central Medical Center",
    details: "Patient reports occasional dizziness. Blood pressure management discussed.",
  },
];

// Mock Hospitals
export interface Hospital {
  id: string;
  name: string;
  type: "General" | "Specialty" | "Clinic" | "Rehabilitation";
  location: string;
  status: "Connected" | "Pending" | "Inactive";
  specialties: string[];
  contactEmail: string;
  contactPhone: string;
}

export const hospitals: Hospital[] = [
  {
    id: "H001",
    name: "Central Medical Center",
    type: "General",
    location: "123 Main Street, Downtown",
    status: "Connected",
    specialties: ["Internal Medicine", "Surgery", "Pediatrics", "Emergency"],
    contactEmail: "contact@centralmed.com",
    contactPhone: "+1 (555) 100-1000",
  },
  {
    id: "H002",
    name: "Heart Specialist Clinic",
    type: "Specialty",
    location: "456 Cardiac Way, Midtown",
    status: "Connected",
    specialties: ["Cardiology", "Cardiac Surgery", "Vascular Medicine"],
    contactEmail: "info@heartclinic.com",
    contactPhone: "+1 (555) 200-2000",
  },
  {
    id: "H003",
    name: "St. Mary's Hospital",
    type: "General",
    location: "789 Healthcare Blvd, Westside",
    status: "Connected",
    specialties: ["General Medicine", "Obstetrics", "Orthopedics"],
    contactEmail: "admin@stmarys.com",
    contactPhone: "+1 (555) 300-3000",
  },
  {
    id: "H004",
    name: "City General Hospital",
    type: "General",
    location: "321 Hospital Drive, Eastside",
    status: "Pending",
    specialties: ["Emergency Medicine", "Trauma", "General Surgery"],
    contactEmail: "contact@citygeneral.com",
    contactPhone: "+1 (555) 400-4000",
  },
  {
    id: "H005",
    name: "Neurology Specialist Clinic",
    type: "Specialty",
    location: "555 Brain Health Ave, Uptown",
    status: "Connected",
    specialties: ["Neurology", "Neurosurgery", "Epilepsy Care"],
    contactEmail: "info@neuroclinic.com",
    contactPhone: "+1 (555) 500-5000",
  },
  {
    id: "H006",
    name: "Pulmonary Rehabilitation Center",
    type: "Rehabilitation",
    location: "888 Wellness Road, Suburbs",
    status: "Inactive",
    specialties: ["Pulmonary Rehab", "Respiratory Therapy"],
    contactEmail: "intake@pulmorehab.com",
    contactPhone: "+1 (555) 600-6000",
  },
  {
    id: "H007",
    name: "Memorial Hospital",
    type: "General",
    location: "999 Memorial Lane, Northside",
    status: "Connected",
    specialties: ["Oncology", "Palliative Care", "Internal Medicine"],
    contactEmail: "admin@memorial.com",
    contactPhone: "+1 (555) 700-7000",
  },
  {
    id: "H008",
    name: "Cardiac Surgery Center",
    type: "Specialty",
    location: "222 Heart Health Blvd, Medical District",
    status: "Pending",
    specialties: ["Cardiac Surgery", "Heart Transplant", "LVAD Program"],
    contactEmail: "referrals@cardiacsurgery.com",
    contactPhone: "+1 (555) 800-8000",
  },
];

// Dashboard metrics
export const dashboardMetrics = {
  totalPatients: 1247,
  activeReferrals: 23,
  pendingReviews: 8,
  emergencyAlerts: 3,
};

// Current user (mock logged-in user)
export const currentUser = {
  id: "D001",
  name: "Dr. Emily Wilson",
  role: "Physician" as const,
  email: "emily.wilson@centralmed.com",
  hospital: "Central Medical Center",
  avatar: undefined,
};

// Mock Staff
export interface Staff {
  id: string;
  name: string;
  email: string;
  role: "Doctor" | "Nurse" | "Admin" | "Lab Tech";
  department: string;
  status: "Active" | "Inactive";
  lastActive: string;
  avatar?: string;
}

export const staff: Staff[] = [
  {
    id: "S001",
    name: "Dr. Emily Wilson",
    email: "emily.wilson@centralmed.com",
    role: "Doctor",
    department: "Cardiology",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "S002",
    name: "Nurse Jane Miller",
    email: "jane.miller@centralmed.com",
    role: "Nurse",
    department: "Emergency",
    status: "Active",
    lastActive: "10 mins ago",
  },
  {
    id: "S003",
    name: "Admin John Doe",
    email: "john.doe@centralmed.com",
    role: "Admin",
    department: "Administration",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: "S004",
    name: "Dr. Michael Brown",
    email: "m.brown@centralmed.com",
    role: "Doctor",
    department: "Pediatrics",
    status: "Inactive",
    lastActive: "2 days ago",
  },
];

// Mock Roles & Permissions
export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Role {
  id: string;
  name: string;
  usersCount: number;
  permissions: Permission[];
}

export const roles: Role[] = [
  {
    id: "ROLE_ADMIN",
    name: "Hospital Admin",
    usersCount: 3,
    permissions: [
      { id: "PERM_USERS_MANAGE", name: "Manage Users", description: "Invite and manage staff accounts", enabled: true },
      { id: "PERM_HOSPITAL_MANAGE", name: "Manage Hospital", description: "Edit hospital profile and settings", enabled: true },
      { id: "PERM_AUDIT_VIEW", name: "View Audit Logs", description: "Access system audit logs", enabled: true },
    ],
  },
  {
    id: "ROLE_DOCTOR",
    name: "Doctor",
    usersCount: 15,
    permissions: [
      { id: "PERM_PATIENT_VIEW", name: "View Patients", description: "View patient records", enabled: true },
      { id: "PERM_PATIENT_EDIT", name: "Edit Patients", description: "Update patient medical records", enabled: true },
      { id: "PERM_REFERRAL_CREATE", name: "Create Referrals", description: "Create new patient referrals", enabled: true },
    ],
  },
  {
    id: "ROLE_NURSE",
    name: "Nurse",
    usersCount: 42,
    permissions: [
      { id: "PERM_PATIENT_VIEW", name: "View Patients", description: "View patient records", enabled: true },
      { id: "PERM_VITALS_UPDATE", name: "Update Vitals", description: "Update patient vitals and notes", enabled: true },
    ],
  },
];
