import { useEffect, useState } from "react";
import { Staff } from "../staff.types";
import api from "../../../shared/utils/api";

export function useStaffById(id : string) {
    const [staff, setStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);
    
    const refetch = () => setTrigger(t => t + 1);

    useEffect(() => {
        if (!id) return;

        const fetchStaffById = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/staff/${id}`)
                setStaff(response.data);
            } catch (err) {
                setError("Failed to fetch staff member!")
            } finally {
                setLoading(false);
            }
        };
        fetchStaffById();
    },[id, trigger]);

    return { staff, loading, error, refetch };  
}