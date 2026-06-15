import { useEffect, useState } from "react";
import api from "../../../shared/utils/api";

export function useAvailableSlots(staffId: string, serviceId: string, date: string) {
    const [slots, setSlots] = useState<string[]>([]);
    const [slotsError, setSlotsError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!staffId || !serviceId || !date) return

        setLoading(true)
        setSlotsError(null)
        setSlots([])

        api.get('/bookings/available-slots', {
            params: { staffId, serviceId, date }
        })
        .then(res => setSlots(res.data.slots))
        .catch(err => setSlotsError(err.response?.data?.error ?? 'Something went wrong'))
        .finally(() => setLoading(false))
    }, [staffId, serviceId, date])

    return { slots, slotsError, loading }
}