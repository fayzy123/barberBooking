import api from "../../shared/utils/api";
import { EditShop } from "./shop.schema";

export async function updateShop(data: EditShop) {
    const response = await api.patch(`/shop`, data)
    return response.data
}