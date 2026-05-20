import api from "../../shared/utils/api";
import { AvailabilitySlot } from "./staff.types";

export async function createStaff(name: string, active: boolean) {
    const response = await api.post(`/staff/`, { name, active })
    return response.data
}

export async function updateStaff(id: string, name: string, active: boolean) {
    const response = await api.patch(`/staff/${id}`, { name, active })
    return response.data;
}

export async function updateAvailability(id: string, availability: AvailabilitySlot[]) {
    const response = await api.patch(`/staff/${id}/availability`, { availability })
    return response.data
}