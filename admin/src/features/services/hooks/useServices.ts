import { useEffect, useState } from "react";
import api from "../../../shared/utils/api";

export interface Service {
    id: string;
    name: string;
    durationMinutes: number;
}

export function useServices() {
    const [service, setService] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await api.get("/services")
                setService(response.data);
            } catch (err) {
                setError("Failed to fetch the services")
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [])

    return { service, loading, error };
}