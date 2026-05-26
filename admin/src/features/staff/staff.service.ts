import api from "../../shared/utils/api";
import { Shift } from "./staff.types";

export async function createStaff(name: string, active: boolean) {
    const response = await api.post(`/staff/`, { name, active })
    return response.data
}

export async function updateStaff(id: string, name: string, active: boolean) {
    const response = await api.patch(`/staff/${id}`, { name, active })
    return response.data;
}

export async function updateShifts(id: string, shifts: Shift[]) {
    const response = await api.patch(`/staff/${id}/shifts`, { shifts })
    return response.data
}