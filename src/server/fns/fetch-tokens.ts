import { createServerFn } from "@tanstack/react-start";
import { getServerSession } from "../../server/session";
import { StorageKeys } from "@kinde-oss/kinde-auth-react/utils";

export const fetchTokens = createServerFn().handler(async () => {
    const session = getServerSession();
    const items = await session.getItems(StorageKeys.accessToken, StorageKeys.idToken, StorageKeys.refreshToken);
    return items as Record<StorageKeys, string>;
})