import api from "../../shared/utils/api";
import { CreateService, UpdateService } from "./service.schema";

export async function createService(data: CreateService) {
    const response = await api.post(`/services`, data)
    return response.data
}

export async function updateService(id: string, data: UpdateService) {
    const response = await api.patch(`/services/${id}`, data)
    return response.data
}

export async function deleteService(id: string) {
    const response = await api.delete(`/services/${id}`)
    return response.data
}