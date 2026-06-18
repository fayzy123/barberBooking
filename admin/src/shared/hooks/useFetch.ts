import { useEffect, useState } from "react";
import api from "../utils/api";

export function useFetch<T>(url: string, errorMessage: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!url) return
        const fetchData = async () => {
            try { 
                setLoading(true)
                const response = await api.get(url);
                setData(response.data)
            } catch (err) {
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [url, error, trigger])

    const refetch = () => setTrigger(t => t + 1);

    return { data, loading, error, refetch}
}