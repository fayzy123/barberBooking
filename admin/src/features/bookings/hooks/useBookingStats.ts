import { Booking } from "../booking.types";

export function useBookingStats(bookings: Booking[]) {
    const today = new Date().toISOString().split("T")[0];
    const todayFormatted = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const now = new Date().toISOString();

    const totalToday = bookings.filter((b) => b.startTime.split("T")[0] === today).length;
    const confirmed = bookings.filter((b) => b.status === "BOOKED").length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
    
    const nextAppointment = bookings
      .filter((b) => b.startTime > now && b.status === "BOOKED")
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0] ?? null;

      const nextAppointmentTime = nextAppointment ?   
          new Date(nextAppointment.startTime).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }): null;

    return { totalToday, confirmed, cancelled, nextAppointment, todayFormatted, nextAppointmentTime };
}