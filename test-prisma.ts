import { prisma } from "./lib/prisma";

async function test() {
    try {
        const count = await prisma.appointment.count();
        console.log("Appointment count:", count);
    } catch (error) {
        console.error("Error accessing prisma.appointment:", error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
