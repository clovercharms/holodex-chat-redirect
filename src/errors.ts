/** Possible error codes. */
export enum ErrorCode {
    UNKNOWN,
    MISSING_CONFIG,
    NO_RESULTS,
    NETWORK,
}

/** Error message template for invalid configuration */
export const ERROR_TEMPLATES: Record<ErrorCode, string> = {
    [ErrorCode.UNKNOWN]: `
<article class="error">
    <h1>Unknown Error</h1>
    <p>An unexpected error has occurred.</p>
</article>
`,
    [ErrorCode.MISSING_CONFIG]: `
<article class="error">
    <h1>Invalid configuration</h1>
    <p>Required parameters missing from URL.</p>
    <p>Please configure these parameters to use the redirect.</p>
</article>
    `,
    [ErrorCode.NO_RESULTS]: `
<article class="error">
    <h1>No streams founds</h1>
    <p>No upcoming streams found to redirect towards.</p>
</article>`,
    [ErrorCode.NETWORK]: `
<article class="error">
    <h1>Error while contacting Holodex API</h1>
    <p>Unable to retrieve latest scheduled and live stream information from the Holodex API.</p>
</article>`,
};

/* Specialized error class with code. */
export class CodeError extends Error {
    /** The code of the error. */
    code: ErrorCode;

    constructor(code: ErrorCode, message?: string | undefined) {
        super(message);
        this.code = code;
    }
}
