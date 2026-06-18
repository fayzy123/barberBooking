import { useFetch } from "../../../shared/hooks/useFetch";
import { Staff } from "../staff.types";

export function useStaffById(id : string) {
    const { data, loading, error, refetch } = useFetch<Staff>(id ? `/staff/${id}` : '', 'Failed to fetch staff member')
    return { staff: data, loading, error, refetch }
}