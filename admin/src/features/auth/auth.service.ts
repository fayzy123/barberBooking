import api from "../../shared/utils/api"


export interface LoginCredentials {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    admin: {
        id: string
        email: string
        role: string
    }
}

export async function loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    return response.data
} 