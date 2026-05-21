import { useEffect, useState } from "react";
import api from "../../../shared/utils/api";
import { StaffSummary } from "../staff.types";

export function useStaff() {
    const [staff, setStaff] = useState<StaffSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

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
    }, [trigger]);

    const refetch = () => setTrigger(t => t + 1);

    return { staff, loading, error, refetch }
}