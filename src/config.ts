/** URL Search param name mapping for configuration parameters. */
const SEARCH_PARAMS = {
    API_KEY: "apiKey",
    CHANNEL_ID: "channelId",
} as const;

/** Error message template for invalid configuration */
const ERROR_TEMPLATE = `
<article>
    <h1>Invalid configuration</h1>
    <p>Required parameters "${SEARCH_PARAMS.API_KEY}" or "${SEARCH_PARAMS.CHANNEL_ID}" missing from URL.</p>
    <p>Please configure these parameters to use the redirect.</p>
</article>
`;

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
        // Insert error message into document body.
        document.body.innerHTML = document.body.innerHTML + ERROR_TEMPLATE;
        throw new Error("Missing configuration parameters.");
    }

    return {
        apiKey: params.get(SEARCH_PARAMS.API_KEY)!,
        channelId: params.get(SEARCH_PARAMS.CHANNEL_ID)!,
    } as ConfigParameters;
}
