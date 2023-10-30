import { CodeError, ErrorCode } from "./errors";

/** URL Search param name mapping for configuration parameters. */
const SEARCH_PARAMS = {
    API_KEY: "apiKey",
    CHANNEL_ID: "channelId",
} as const;

// Collect configuration.
const params = new URLSearchParams(window.location.search);

/** Configuration parameter values. */
export type ConfigParameters = Record<
    (typeof SEARCH_PARAMS)[keyof typeof SEARCH_PARAMS],
    string
>;

/**
 * Checks whether or not a search parameter value is valid.
 * @param name The name of the seach parameter.
 * @returns Whether or not the search parameter is valid.
 */
function checkValidParam(name: string) {
    return params.has(name) && params.get(name)?.length !== 0;
}

/**
 * Tries to retrieve configuration parameters.
 * @returns The filled in configuration parameters.
 */
export function getConfig() {
    if (
        ![SEARCH_PARAMS.API_KEY, SEARCH_PARAMS.CHANNEL_ID].every(
            checkValidParam
        )
    ) {
        throw new CodeError(
            ErrorCode.MISSING_CONFIG,
            "Missing configuration parameters."
        );
    }

    return {
        apiKey: params.get(SEARCH_PARAMS.API_KEY)!,
        channelId: params.get(SEARCH_PARAMS.CHANNEL_ID)!,
    } as ConfigParameters;
}
