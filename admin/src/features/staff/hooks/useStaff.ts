import { StaffSummary } from "../staff.types";
import { useFetch } from "../../../shared/hooks/useFetch";

export function useStaff() {
    const { data, loading, error, refetch } = useFetch<StaffSummary[]>('/staff', 'Failed to fetch staff members')
    return { staff: data ?? [], loading, error, refetch }
}