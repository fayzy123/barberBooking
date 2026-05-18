import api from "../../shared/utils/api"

interface CreateBookingInput {
    customerName: string;
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