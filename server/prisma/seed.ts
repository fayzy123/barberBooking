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
    { id: 'staff_001', name: 'Fayzy' },
    { id: 'staff_002', name: 'Marcus' },
    { id: 'staff_003', name: 'Jordan' },
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
    // Past
    { id: 'booking_001', staffId: 'staff_002', serviceId: 'service_001', customerName: 'James Wilson', customerPhone: '07712345678', startTime: new Date('2026-04-02T09:00:00Z'), ref: 'A1B2C3D4', status: 'BOOKED' },
    { id: 'booking_002', staffId: 'staff_002', serviceId: 'service_002', customerName: 'Yusuf Ahmed', customerPhone: '07723456789', startTime: new Date('2026-04-02T09:30:00Z'), ref: 'B2C3D4E5', status: 'CANCELLED' },
    { id: 'booking_003', staffId: 'staff_003', serviceId: 'service_003', customerName: 'Daniel Brown', customerPhone: '07734567890', startTime: new Date('2026-04-02T10:00:00Z'), ref: 'C3D4E5F6', status: 'CANCELLED' },
    { id: 'booking_004', staffId: 'staff_001', serviceId: 'service_004', customerName: 'Omar Farooq', customerPhone: '07745678901', startTime: new Date('2026-04-02T11:00:00Z'), ref: 'D4E5F6G7', status: 'BOOKED' },
    { id: 'booking_005', staffId: 'staff_002', serviceId: 'service_001', customerName: 'Tariq Hassan', customerPhone: '07756789012', startTime: new Date('2026-04-02T13:00:00Z'), ref: 'E5F6G7H8', status: 'BOOKED' },
    { id: 'booking_006', staffId: 'staff_001', serviceId: 'service_003', customerName: 'Ryan Peters', customerPhone: '07767890123', startTime: new Date('2026-04-09T09:00:00Z'), ref: 'F6G7H8I9', status: 'BOOKED' },
    { id: 'booking_007', staffId: 'staff_003', serviceId: 'service_002', customerName: 'Liam Carter', customerPhone: '07778901234', startTime: new Date('2026-04-09T10:00:00Z'), ref: 'G7H8I9J0', status: 'BOOKED' },
    { id: 'booking_008', staffId: 'staff_002', serviceId: 'service_004', customerName: 'Noah Singh', customerPhone: '07789012345', startTime: new Date('2026-04-09T11:00:00Z'), ref: 'H8I9J0K1', status: 'CANCELLED' },
    { id: 'booking_009', staffId: 'staff_001', serviceId: 'service_001', customerName: 'Ethan Clarke', customerPhone: '07790123456', startTime: new Date('2026-04-09T13:00:00Z'), ref: 'I9J0K1L2', status: 'BOOKED' },
    { id: 'booking_010', staffId: 'staff_003', serviceId: 'service_003', customerName: 'Harry Evans', customerPhone: '07701234567', startTime: new Date('2026-04-09T14:00:00Z'), ref: 'J0K1L2M3', status: 'BOOKED' },
    { id: 'booking_011', staffId: 'staff_001', serviceId: 'service_002', customerName: 'Jack Morris', customerPhone: '07712345670', startTime: new Date('2026-04-16T09:00:00Z'), ref: 'K1L2M3N4', status: 'BOOKED' },
    { id: 'booking_012', staffId: 'staff_002', serviceId: 'service_003', customerName: 'George Baker', customerPhone: '07723456701', startTime: new Date('2026-04-16T09:30:00Z'), ref: 'L2M3N4O5', status: 'BOOKED' },
    { id: 'booking_013', staffId: 'staff_003', serviceId: 'service_001', customerName: 'Charlie Hall', customerPhone: '07734567012', startTime: new Date('2026-04-16T10:00:00Z'), ref: 'M3N4O5P6', status: 'CANCELLED' },
    { id: 'booking_014', staffId: 'staff_001', serviceId: 'service_004', customerName: 'Aiden Scott', customerPhone: '07745670123', startTime: new Date('2026-04-16T11:00:00Z'), ref: 'N4O5P6Q7', status: 'BOOKED' },
    { id: 'booking_015', staffId: 'staff_002', serviceId: 'service_001', customerName: 'Mason Turner', customerPhone: '07756701234', startTime: new Date('2026-04-16T13:00:00Z'), ref: 'O5P6Q7R8', status: 'BOOKED' },
    { id: 'booking_016', staffId: 'staff_003', serviceId: 'service_002', customerName: 'Logan White', customerPhone: '07767012345', startTime: new Date('2026-04-16T14:00:00Z'), ref: 'P6Q7R8S9', status: 'BOOKED' },
    // Today
    { id: 'booking_017', staffId: 'staff_001', serviceId: 'service_001', customerName: 'Lucas Green', customerPhone: '07778123456', startTime: new Date('2026-05-19T09:00:00Z'), ref: 'Q7R8S9T0', status: 'BOOKED' },
    { id: 'booking_018', staffId: 'staff_002', serviceId: 'service_003', customerName: 'Oliver King', customerPhone: '07789234567', startTime: new Date('2026-05-19T10:00:00Z'), ref: 'R8S9T0U1', status: 'BOOKED' },
    // Future
    { id: 'booking_019', staffId: 'staff_001', serviceId: 'service_002', customerName: 'Sebastian Adams', customerPhone: '07790345678', startTime: new Date('2026-05-20T10:00:00Z'), ref: 'S9T0U1V2', status: 'BOOKED' },
    { id: 'booking_020', staffId: 'staff_003', serviceId: 'service_004', customerName: 'Elijah Lee', customerPhone: '07701456789', startTime: new Date('2026-05-21T11:00:00Z'), ref: 'T0U1V2W3', status: 'BOOKED' },
  ];

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