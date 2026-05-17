import { useEffect, useState } from "react";
import api from "../../../shared/utils/api";

export interface Staff {
    id: string;
    name: string;
}

export function useStaff() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const response = await api.get("/staff");
                setStaff(response.data);
            } catch (err) {
                setError("Failed to fetch staff members");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    return { staff, loading, error }
}