export interface Booking {
  id: string;
  shopId: string;
  staffId: string;
  serviceId: string;
  ref: string;
  status: "BOOKED" | "CANCELLED";
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  Service: {
    name: string;
    duraionMinutes: number;
  };
  Staff: {
    name: string;
  };
}

export interface Filters {
  date: string;
  status: string;
  staffId: string;
}
