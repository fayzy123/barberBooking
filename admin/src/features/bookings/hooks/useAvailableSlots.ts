import { useEffect, useState } from "react";
import { getBookingErrorMessage } from "../../../shared/utils/bookingErrors";
import api from "../../../shared/utils/api";

export function useAvailableSlots(staffId: string, serviceId: string, date: string, bookAheadDays: number) {
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
        .catch(err => {
            const errorCode = err.response?.data?.error ?? "INVALID_REQUEST"
            setSlotsError(getBookingErrorMessage(errorCode, bookAheadDays))})
        .finally(() => setLoading(false))
    }, [staffId, serviceId, date])

    return { slots, slotsError, loading }
}