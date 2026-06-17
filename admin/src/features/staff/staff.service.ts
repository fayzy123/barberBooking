import api from "../../shared/utils/api";
import { Shift } from "./staff.types";

export async function createStaff(firstName: string, lastName: string, active: boolean) {
    const response = await api.post(`/staff/`, { firstName, lastName, active })
    return response.data
}

export async function updateStaff(id: string, firstName: string, lastName: string, active: boolean) {
    const response = await api.patch(`/staff/${id}`, { firstName, lastName, active })
    return response.data
}

export async function deleteStaff(id: string) {
    const response = await api.delete(`/staff/${id}`)
    return response.data
}

export async function updateShifts(id: string, shifts: Omit<Shift, 'id' | 'staffId'>[]) {
    const response = await api.patch(`/staff/${id}/shifts`, { shifts })
    return response.data
}