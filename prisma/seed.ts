import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.emergencyAccessLog.deleteMany();
    await prisma.department.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.referralEvent.deleteMany();
    await prisma.referral.deleteMany();
    await prisma.medicalRecord.deleteMany();
    await prisma.session.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
    await prisma.hospital.deleteMany();

    console.log('🧹 Cleared existing data');

    // Create Hospitals
    const centralMedical = await prisma.hospital.create({
        data: {
            name: 'Central Medical Center',
            type: 'GENERAL',
            location: '123 Main Street, Downtown',
            status: 'CONNECTED',
            specialties: ['Internal Medicine', 'Surgery', 'Pediatrics', 'Emergency'],
            contactEmail: 'contact@centralmed.com',
            contactPhone: '+1 (555) 100-1000',
        },
    });

    const heartClinic = await prisma.hospital.create({
        data: {
            name: 'Heart Specialist Clinic',
            type: 'SPECIALTY',
            location: '456 Cardiac Way, Midtown',
            status: 'CONNECTED',
            specialties: ['Cardiology', 'Cardiac Surgery', 'Vascular Medicine'],
            contactEmail: 'info@heartclinic.com',
            contactPhone: '+1 (555) 200-2000',
        },
    });

    const stMarys = await prisma.hospital.create({
        data: {
            name: "St. Mary's Hospital",
            type: 'GENERAL',
            location: '789 Healthcare Blvd, Westside',
            status: 'CONNECTED',
            specialties: ['General Medicine', 'Obstetrics', 'Orthopedics'],
            contactEmail: 'admin@stmarys.com',
            contactPhone: '+1 (555) 300-3000',
        },
    });

    console.log('✅ Created 3 hospitals');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const drWilson = await prisma.user.create({
        data: {
            email: 'emily.wilson@centralmed.com',
            password: hashedPassword,
            name: 'Dr. Emily Wilson',
            role: 'DOCTOR',
            hospitalId: centralMedical.id,
            department: 'Cardiology',
        },
    });

    const drCarter = await prisma.user.create({
        data: {
            email: 'james.carter@heartclinic.com',
            password: hashedPassword,
            name: 'Dr. James Carter',
            role: 'DOCTOR',
            hospitalId: heartClinic.id,
            department: 'Cardiology',
        },
    });

    const nurseMiller = await prisma.user.create({
        data: {
            email: 'jane.miller@centralmed.com',
            password: hashedPassword,
            name: 'Nurse Jane Miller',
            role: 'NURSE',
            hospitalId: centralMedical.id,
            department: 'Emergency',
        },
    });

    const adminDoe = await prisma.user.create({
        data: {
            email: 'admin@centralmed.com',
            password: hashedPassword,
            name: 'John Doe',
            role: 'HOSPITAL_ADMIN',
            hospitalId: centralMedical.id,
            department: 'Administration',
        },
    });

    const systemAdmin = await prisma.user.create({
        data: {
            email: 'admin@system.com',
            password: hashedPassword,
            name: 'System Administrator',
            role: 'SYSTEM_ADMIN',
        },
    });

    console.log('✅ Created 5 users');

    // Create Patients
    const johnSmith = await prisma.patient.create({
        data: {
            name: 'John Smith',
            age: 45,
            gender: 'MALE',
            hospitalId: centralMedical.id,
            status: 'ACTIVE',
            email: 'john.smith@email.com',
            phone: '+1 (555) 123-4567',
            bloodType: 'A+',
            allergies: ['Penicillin', 'Shellfish'],
            chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
            lastVisit: new Date('2026-01-15'),
            emergencyContactName: 'Mary Smith',
            emergencyContactPhone: '+1 (555) 987-6543',
            emergencyContactRelationship: 'Spouse',
        },
    });

    const sarahJohnson = await prisma.patient.create({
        data: {
            name: 'Sarah Johnson',
            age: 32,
            gender: 'FEMALE',
            hospitalId: stMarys.id,
            status: 'CRITICAL',
            email: 'sarah.j@email.com',
            phone: '+1 (555) 234-5678',
            bloodType: 'O-',
            allergies: ['Latex'],
            chronicConditions: ['Asthma'],
            lastVisit: new Date('2026-01-17'),
            emergencyContactName: 'Mike Johnson',
            emergencyContactPhone: '+1 (555) 876-5432',
            emergencyContactRelationship: 'Brother',
        },
    });

    console.log('✅ Created 2 patients');

    // Create a Referral
    const referral = await prisma.referral.create({
        data: {
            patientId: johnSmith.id,
            fromHospitalId: centralMedical.id,
            toHospitalId: heartClinic.id,
            referringDoctorId: drWilson.id,
            receivingDoctorId: drCarter.id,
            department: 'Cardiology',
            status: 'SENT',
            priority: 'NORMAL',
            reason: 'Cardiac evaluation required',
            notes: 'Patient experiencing occasional chest pain. ECG shows minor irregularities.',
            shareLabResults: true,
            shareImaging: false,
            shareNotes: true,
        },
    });

    // Create Referral Timeline Events
    await prisma.referralEvent.create({
        data: {
            referralId: referral.id,
            type: 'CREATED',
            actorId: drWilson.id,
            actorName: 'Dr. Emily Wilson',
            details: 'Referral created',
            timestamp: new Date('2026-01-15T09:30:00'),
        },
    });

    await prisma.referralEvent.create({
        data: {
            referralId: referral.id,
            type: 'SENT',
            actorId: drWilson.id,
            actorName: 'Dr. Emily Wilson',
            details: 'Referral sent to Heart Specialist Clinic',
            timestamp: new Date('2026-01-15T14:20:00'),
        },
    });

    console.log('✅ Created 1 referral with timeline');

    // Create a Task for the nurse
    await prisma.task.create({
        data: {
            assignedToId: nurseMiller.id,
            hospitalId: centralMedical.id,
            patientId: johnSmith.id,
            title: 'Update vitals for John Smith',
            description: 'Check blood pressure, temperature, and heart rate',
            priority: 'NORMAL',
            status: 'PENDING',
            dueDate: new Date('2026-01-21'),
        },
    });

    console.log('✅ Created 1 task');

    // Create Appointments
    await prisma.appointment.createMany({
        data: [
            {
                patientId: johnSmith.id,
                doctorId: drWilson.id,
                hospitalId: centralMedical.id,
                time: new Date(new Date().setHours(9, 0, 0, 0)),
                type: 'Follow-up',
                status: 'SCHEDULED',
            },
            {
                patientId: sarahJohnson.id,
                doctorId: drWilson.id,
                hospitalId: centralMedical.id,
                time: new Date(new Date().setHours(10, 30, 0, 0)),
                type: 'Consultation',
                status: 'SCHEDULED',
            },
            {
                patientId: johnSmith.id,
                doctorId: drWilson.id,
                hospitalId: centralMedical.id,
                time: new Date(new Date().setHours(14, 0, 0, 0)),
                type: 'Lab Test',
                status: 'IN_PROGRESS',
            },
        ],
    });

    console.log('✅ Created 3 appointments');

    // Create Departments
    const emergencyDept = await prisma.department.create({
        data: {
            name: 'Emergency Medicine',
            hospitalId: centralMedical.id,
            headId: nurseMiller.id,
            status: 'ACTIVE',
        },
    });

    const cardiologyDept = await prisma.department.create({
        data: {
            name: 'Cardiology',
            hospitalId: centralMedical.id,
            headId: drWilson.id,
            status: 'ACTIVE',
        },
    });

    await prisma.department.create({
        data: {
            name: 'Pediatrics',
            hospitalId: centralMedical.id,
            status: 'ACTIVE',
        },
    });

    await prisma.department.create({
        data: {
            name: 'Neurology',
            hospitalId: centralMedical.id,
            status: 'INACTIVE',
        },
    });

    console.log('✅ Created 4 departments');

    // Create Emergency Access Logs
    await prisma.emergencyAccessLog.create({
        data: {
            userId: drWilson.id,
            patientId: sarahJohnson.id,
            reason: 'Patient unconscious, unable to consent',
            startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
            status: 'OPEN',
        },
    });

    await prisma.emergencyAccessLog.create({
        data: {
            userId: nurseMiller.id,
            patientId: johnSmith.id,
            reason: 'Urgent medication verification',
            startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000), // 15 mins duration
            status: 'CLOSED',
        },
    });

    console.log('✅ Created 2 emergency access logs');

    // Create Audit Logs for demonstration
    await prisma.auditLog.create({
        data: {
            userId: drWilson.id,
            action: 'CREATE',
            resource: 'MedicalRecord',
            details: 'Created medical record for John Smith',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
        },
    });

    await prisma.auditLog.create({
        data: {
            userId: adminDoe.id,
            action: 'LOGIN',
            resource: 'Session',
            details: 'Login successful',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
    });

    await prisma.auditLog.create({
        data: {
            userId: nurseMiller.id,
            action: 'UPDATE',
            resource: 'Task',
            details: 'Completed task: Update vitals for John Smith',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
        },
    });

    console.log('✅ Created 3 audit logs');

    // Create Messages between staff
    await prisma.message.createMany({
        data: [
            {
                senderId: drWilson.id,
                receiverId: drCarter.id,
                content: "Hi Dr. Carter, I'm referring a patient with cardiac symptoms to your clinic. Could you take a look at the referral?",
                read: true,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            },
            {
                senderId: drCarter.id,
                receiverId: drWilson.id,
                content: "Hello Dr. Wilson! I've received the referral. The patient's ECG results look concerning. I'll schedule them for an appointment this week.",
                read: true,
                createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
            },
            {
                senderId: drWilson.id,
                receiverId: drCarter.id,
                content: "Great, thank you! Please let me know if you need any additional information about the patient's history.",
                read: true,
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            },
            {
                senderId: drCarter.id,
                receiverId: drWilson.id,
                content: "Will do. I noticed the patient has a history of hypertension. Has he been compliant with his medication?",
                read: false,
                createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            },
            {
                senderId: drWilson.id,
                receiverId: nurseMiller.id,
                content: "Nurse Miller, could you please update John Smith's vitals before his follow-up appointment today?",
                read: true,
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
            },
            {
                senderId: nurseMiller.id,
                receiverId: drWilson.id,
                content: "Of course, Dr. Wilson. I'll get that done within the hour and update his chart.",
                read: true,
                createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
            },
            {
                senderId: nurseMiller.id,
                receiverId: drWilson.id,
                content: "Vitals updated! BP is 145/92, slightly elevated. Heart rate is 78 bpm. Temperature normal.",
                read: false,
                createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
            },
        ],
    });

    console.log('✅ Created 7 messages');

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
