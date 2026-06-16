import api from "../../shared/utils/api"
import { UpdateBooking } from "./booking.schema";

interface CreateBookingInput {
    customerFirstName: string;
    customerLastName: string;
    customerPhone: string;
    serviceId: string;
    staffId: string;
    startTime: string;
}

export async function cancelBooking(id: string, cancelReason?: string) {
    const response = await api.patch(`/bookings/${id}/cancel`, { cancelReason })
    return response.data
}

export async function reassignBooking(id: string, staffId: string) {
    const response = await api.patch(`/bookings/${id}/reassign`, { staffId })
    return response.data
}

export async function createBooking(data: CreateBookingInput) {
    const response = await api.post(`/bookings/`, data)
    return response.data
}

export async function updateBooking(id: string, input: UpdateBooking) {
    const response = await api.patch(`/bookings/${id}`, input)
    return response.data
}