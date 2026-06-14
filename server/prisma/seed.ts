import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import bcrypt from 'bcryptjs';
import { prisma } from '../src/db/prisma';

async function main() {
  // 1. Shop
  await prisma.shop.upsert({
    where: { id: 'shop_001' },
    update: {},
    create: {
      id: 'shop_001',
      name: "Fayzy's Cuts",
      updatedAt: new Date(),
    },
  });

  // 2. Services
  const services = [
    { id: 'service_001', name: 'Haircut', durationMinutes: 15 },
    { id: 'service_002', name: 'Haircut + Beard', durationMinutes: 30 },
    { id: 'service_003', name: 'Skin Fade', durationMinutes: 45 },
    { id: 'service_004', name: 'Hot Towel Shave', durationMinutes: 60 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: {
        ...service,
        shopId: 'shop_001',
        updatedAt: new Date(),
      },
    });
  }

  // 3. Staff
const staff = [
    { id: 'staff_001', firstName: 'Fayzy', lastName: 'Khan' },
    { id: 'staff_002', firstName: 'Marcus', lastName: 'Brown' },
    { id: 'staff_003', firstName: 'Jordan', lastName: 'Charles' },
];

  for (const member of staff) {
    await prisma.staff.upsert({
      where: { id: member.id },
      update: {},
      create: {
        ...member,
        shopId: 'shop_001',
        updatedAt: new Date(),
      },
    });
  }

  // 4. Admin
  const hash = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD!, 12);
  await prisma.admin.upsert({
    where: { email: 'admin@fayzhan.co.uk' },
    update: {},
    create: {
      id: 'admin_001',
      email: 'admin@fayzhan.co.uk',
      passwordHash: hash,
      role: 'ADMIN',
      shopId: 'shop_001',
      updatedAt: new Date(),
    },
  });

  // 5. Bookings
  const bookings = [
    // ── June 2 (Monday) ──────────────────────────────────────────
    // staff_001 back to back: 09:00 haircut(15m) then 09:30 haircut+beard(30m)
    { id: 'booking_001', staffId: 'staff_001', serviceId: 'service_001', customerFirstName: 'James', customerLastName: 'Wilson', customerPhone: '07712345678', startTime: new Date('2026-06-02T09:00:00.000Z'), ref: 'A1B2C3D4', status: 'BOOKED' },
    { id: 'booking_002', staffId: 'staff_001', serviceId: 'service_002', customerFirstName: 'Yusuf', customerLastName: 'Ahmed', customerPhone: '07723456789', startTime: new Date('2026-06-02T09:30:00.000Z'), ref: 'B2C3D4E5', status: 'BOOKED' },
    // staff_002 has booking at same time as booking_001 for reassign conflict test
    { id: 'booking_003', staffId: 'staff_002', serviceId: 'service_001', customerFirstName: 'Daniel', customerLastName: 'Brown', customerPhone: '07734567890', startTime: new Date('2026-06-02T09:00:00.000Z'), ref: 'C3D4E5F6', status: 'BOOKED' },
    // staff_002 back to back: 11:00 skin fade(45m) then 12:00 hot towel(60m)
    { id: 'booking_004', staffId: 'staff_002', serviceId: 'service_003', customerFirstName: 'Omar', customerLastName: 'Farooq', customerPhone: '07745678901', startTime: new Date('2026-06-02T11:00:00.000Z'), ref: 'D4E5F6G7', status: 'BOOKED' },
    { id: 'booking_005', staffId: 'staff_002', serviceId: 'service_004', customerFirstName: 'Tariq', customerLastName: 'Hassan', customerPhone: '07756789012', startTime: new Date('2026-06-02T12:00:00.000Z'), ref: 'E5F6G7H8', status: 'BOOKED' },

    // ── June 3 (Tuesday) ─────────────────────────────────────────
    // staff_001 has bookings at 09:00 and 09:15 (back to back with no gap)
    { id: 'booking_006', staffId: 'staff_001', serviceId: 'service_001', customerFirstName: 'Ryan', customerLastName: 'Peters', customerPhone: '07767890123', startTime: new Date('2026-06-03T09:00:00.000Z'), ref: 'F6G7H8I9', status: 'BOOKED' },
    { id: 'booking_007', staffId: 'staff_001', serviceId: 'service_002', customerFirstName: 'Liam', customerLastName: 'Carter', customerPhone: '07778901234', startTime: new Date('2026-06-03T09:15:00.000Z'), ref: 'G7H8I9J0', status: 'BOOKED' },
    // staff_003 works Saturday - booking for overlap test
    { id: 'booking_008', staffId: 'staff_002', serviceId: 'service_001', customerFirstName: 'Noah', customerLastName: 'Singh', customerPhone: '07789012345', startTime: new Date('2026-06-03T09:00:00.000Z'), ref: 'H8I9J0K1', status: 'CANCELLED', cancelReason: 'Customer requested cancellation', cancelledAt: new Date('2026-06-03T08:00:00.000Z') },

    // ── June 4 (Wednesday) ───────────────────────────────────────
    { id: 'booking_009', staffId: 'staff_001', serviceId: 'service_003', customerFirstName: 'Ethan', customerLastName: 'Clarke', customerPhone: '07790123456', startTime: new Date('2026-06-04T10:00:00.000Z'), ref: 'I9J0K1L2', status: 'BOOKED' },
    { id: 'booking_010', staffId: 'staff_002', serviceId: 'service_002', customerFirstName: 'Harry', customerLastName: 'Evans', customerPhone: '07701234567', startTime: new Date('2026-06-04T10:00:00.000Z'), ref: 'J0K1L2M3', status: 'BOOKED' },

    // ── June 5 (Thursday) ────────────────────────────────────────
    { id: 'booking_011', staffId: 'staff_001', serviceId: 'service_002', customerFirstName: 'Jack', customerLastName: 'Morris', customerPhone: '07712345670', startTime: new Date('2026-06-05T09:00:00.000Z'), ref: 'K1L2M3N4', status: 'BOOKED' },
    { id: 'booking_012', staffId: 'staff_001', serviceId: 'service_001', customerFirstName: 'George', customerLastName: 'Baker', customerPhone: '07723456701', startTime: new Date('2026-06-05T09:30:00.000Z'), ref: 'L2M3N4O5', status: 'BOOKED' },
    { id: 'booking_013', staffId: 'staff_002', serviceId: 'service_003', customerFirstName: 'Charlie', customerLastName: 'Hall', customerPhone: '07734567012', startTime: new Date('2026-06-05T14:00:00.000Z'), ref: 'M3N4O5P6', status: 'CANCELLED', cancelReason: 'No show', cancelledAt: new Date('2026-06-05T15:00:00.000Z') },

    // ── June 6 (Friday) ──────────────────────────────────────────
    { id: 'booking_014', staffId: 'staff_001', serviceId: 'service_004', customerFirstName: 'Aiden', customerLastName: 'Scott', customerPhone: '07745670123', startTime: new Date('2026-06-06T10:00:00.000Z'), ref: 'N4O5P6Q7', status: 'BOOKED' },
    { id: 'booking_015', staffId: 'staff_002', serviceId: 'service_001', customerFirstName: 'Mason', customerLastName: 'Turner', customerPhone: '07756701234', startTime: new Date('2026-06-06T10:00:00.000Z'), ref: 'O5P6Q7R8', status: 'BOOKED' },

    // ── June 7 (Saturday) - only staff_003 works ─────────────────
    { id: 'booking_016', staffId: 'staff_003', serviceId: 'service_001', customerFirstName: 'Logan', customerLastName: 'White', customerPhone: '07767012345', startTime: new Date('2026-06-07T10:00:00.000Z'), ref: 'P6Q7R8S9', status: 'BOOKED' },
    { id: 'booking_017', staffId: 'staff_003', serviceId: 'service_002', customerFirstName: 'Lucas', customerLastName: 'Green', customerPhone: '07778123456', startTime: new Date('2026-06-07T11:00:00.000Z'), ref: 'Q7R8S9T0', status: 'BOOKED' },

    // ── June 9 (Monday) ──────────────────────────────────────────
    { id: 'booking_018', staffId: 'staff_001', serviceId: 'service_001', customerFirstName: 'Oliver', customerLastName: 'King', customerPhone: '07789234567', startTime: new Date('2026-06-09T09:00:00.000Z'), ref: 'R8S9T0U1', status: 'BOOKED' },
    { id: 'booking_019', staffId: 'staff_002', serviceId: 'service_002', customerFirstName: 'Sebastian', customerLastName: 'Adams', customerPhone: '07790345678', startTime: new Date('2026-06-09T09:00:00.000Z'), ref: 'S9T0U1V2', status: 'BOOKED' },

    // ── June 10 (Tuesday) ────────────────────────────────────────
    { id: 'booking_020', staffId: 'staff_001', serviceId: 'service_003', customerFirstName: 'Elijah', customerLastName: 'Lee', customerPhone: '07701456789', startTime: new Date('2026-06-10T11:00:00.000Z'), ref: 'T0U1V2W3', status: 'BOOKED' },
    { id: 'booking_021', staffId: 'staff_002', serviceId: 'service_001', customerFirstName: 'Aaron', customerLastName: 'Khan', customerPhone: '07712356789', startTime: new Date('2026-06-10T11:00:00.000Z'), ref: 'U1V2W3X4', status: 'BOOKED' },

    // ── June 11 (Wednesday) ──────────────────────────────────────
    { id: 'booking_022', staffId: 'staff_001', serviceId: 'service_002', customerFirstName: 'Zain', customerLastName: 'Malik', customerPhone: '07723467890', startTime: new Date('2026-06-11T09:00:00.000Z'), ref: 'V2W3X4Y5', status: 'BOOKED' },
    { id: 'booking_023', staffId: 'staff_001', serviceId: 'service_001', customerFirstName: 'Kai', customerLastName: 'Robinson', customerPhone: '07734578901', startTime: new Date('2026-06-11T09:30:00.000Z'), ref: 'W3X4Y5Z6', status: 'BOOKED' },

    // ── June 12 (Thursday) ───────────────────────────────────────
    { id: 'booking_024', staffId: 'staff_002', serviceId: 'service_004', customerFirstName: 'Tyler', customerLastName: 'Brooks', customerPhone: '07745689012', startTime: new Date('2026-06-12T14:00:00.000Z'), ref: 'X4Y5Z6A7', status: 'BOOKED' },
    { id: 'booking_025', staffId: 'staff_003', serviceId: 'service_001', customerFirstName: 'Finn', customerLastName: 'Murphy', customerPhone: '07756790123', startTime: new Date('2026-06-13T10:00:00.000Z'), ref: 'Y5Z6A7B8', status: 'BOOKED' },

    // ── June 16 (Monday) - future bookings ───────────────────────
    { id: 'booking_026', staffId: 'staff_001', serviceId: 'service_001', customerFirstName: 'Marcus', customerLastName: 'Reid', customerPhone: '07712341234', startTime: new Date('2026-06-16T09:00:00.000Z'), ref: 'Z6A7B8C9', status: 'BOOKED' },
    { id: 'booking_027', staffId: 'staff_002', serviceId: 'service_002', customerFirstName: 'Nathan', customerLastName: 'Cole', customerPhone: '07723452345', startTime: new Date('2026-06-16T10:00:00.000Z'), ref: 'A7B8C9D0', status: 'BOOKED' },

    // ── June 17 (Tuesday) ────────────────────────────────────────
    { id: 'booking_028', staffId: 'staff_001', serviceId: 'service_002', customerFirstName: 'Dylan', customerLastName: 'Shaw', customerPhone: '07734563456', startTime: new Date('2026-06-17T10:00:00.000Z'), ref: 'B8C9D0E1', status: 'BOOKED' },
    { id: 'booking_029', staffId: 'staff_002', serviceId: 'service_003', customerFirstName: 'Leo', customerLastName: 'Fox', customerPhone: '07745674567', startTime: new Date('2026-06-17T10:00:00.000Z'), ref: 'C9D0E1F2', status: 'BOOKED' },

    // ── June 30 (Tuesday) ────────────────────────────────────────
    { id: 'booking_030', staffId: 'staff_001', serviceId: 'service_001', customerFirstName: 'Adam', customerLastName: 'West', customerPhone: '07756785678', startTime: new Date('2026-06-30T09:00:00.000Z'), ref: 'D0E1F2G3', status: 'BOOKED' },
]

  for (const booking of bookings) {
    const service = await prisma.service.findUnique({ where: { id: booking.serviceId } });
    const endTime = new Date(booking.startTime.getTime() + service!.durationMinutes * 60 * 1000);

    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {},
      create: {
        ...booking,
        shopId: 'shop_001',
        endTime,
        status: booking.status as 'BOOKED' | 'CANCELLED',
        updatedAt: new Date(),
      },
    });
  }

  console.log('Seed complete ✅');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());