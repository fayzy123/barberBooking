import { useEffect, useState } from "react";
import { Shop } from "../shop.types";
import api from "../../../shared/utils/api";

export function useShop() {
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        const fetchShopSettings = async () => {
            try {
                setLoading(true)
                const response = await api.get("/shop")
                setShop(response.data)
            } catch (err) {
                setError("Failed to fetch shop settings!")
            } finally {
                setLoading(false);
            }
        };
        fetchShopSettings();
    }, [trigger])

    const refetch = () => setTrigger(t => t + 1);

    return { shop, loading, error, refetch };
}