import { useEffect, useState } from "react";
import { fetchTokens } from "../server/fns/fetch-tokens";
import { getClientSession } from "./store";

export const useSessionSync = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchTokens().then(async (data) => {
            await getClientSession().setItems(data);
        }).finally(() => {
            setLoading(false);
        });
    }, []);
    return { loading };
}