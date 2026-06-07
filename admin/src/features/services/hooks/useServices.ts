import { useEffect, useState } from "react";
import api from "../../../shared/utils/api";
import { Service } from "../service.types";

export function useServices() {
    const [service, setService] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
     const [trigger, setTrigger] = useState(0);

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
    }, [trigger])

    const refetch = () => setTrigger(t => t + 1);

    return { service, loading, error, refetch };
}