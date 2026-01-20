import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

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
            assigneeId: nurseMiller.id,
            title: 'Update vitals for John Smith',
            description: 'Check blood pressure, temperature, and heart rate',
            priority: 'NORMAL',
            status: 'PENDING',
            dueDate: new Date('2026-01-21'),
        },
    });

    console.log('✅ Created 1 task');

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
