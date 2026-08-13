import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export const useCheckoutStates = () => {
    return useQueryStates({
        success: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
        cancel: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
        session_id: parseAsString.withOptions({ clearOnDefault: true }),
    })
}