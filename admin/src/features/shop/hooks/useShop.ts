import { useFetch } from "../../../shared/hooks/useFetch";
import { Shop } from "../shop.types";

export function useShop() {
    const { data, loading, error, refetch } = useFetch<Shop>('/shop', "Failed to fetch shop settings")
    return { shop: data, loading, error, refetch }
}