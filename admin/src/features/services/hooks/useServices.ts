import { useFetch } from "../../../shared/hooks/useFetch";
import { Service } from "../service.types";

export function useServices() {
    const { data, loading, error, refetch } = useFetch<Service[]>('/services', 'Failed to fetch services')
    return { service: data ?? [], loading, error, refetch }
}