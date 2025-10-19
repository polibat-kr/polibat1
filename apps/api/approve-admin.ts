/**
 * Manual Admin Approval Script
 * Directly approves the admin user in the database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function approveAdmin() {
  try {
    // Update admin user status to APPROVED
    const result = await prisma.member.updateMany({
      where: {
        email: 'admin@polibat.com',
        memberType: 'ADMIN',
      },
      data: {
        status: 'APPROVED',
      },
    });

    console.log('✅ Admin user approved successfully!');
    console.log(`Updated ${result.count} record(s)`);

    // Verify
    const admin = await prisma.member.findFirst({
      where: { email: 'admin@polibat.com' },
      select: {
        memberId: true,
        email: true,
        memberType: true,
        status: true,
      },
    });

    console.log('\nAdmin user details:');
    console.log(admin);
  } catch (error) {
    console.error('❌ Error approving admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

approveAdmin();
