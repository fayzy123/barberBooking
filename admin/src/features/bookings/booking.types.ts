export interface Booking {
  id: string;
  shopId: string;
  staffId: string;
  serviceId: string;
  ref: string;
  status: "BOOKED" | "CANCELLED";
  startTime: string;
  endTime: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  Service: {
    name: string;
    durationMinutes: number;
  };
  Staff: {
    firstName: string;
    lastName: string;
  };
}

export interface Filters {
  date: string;
  status: string;
  staffId: string;
}
