import { getConfig } from "./config";
import { CodeError, ERROR_TEMPLATES, ErrorCode } from "./errors";
import { redirect } from "./redirect";
import "./style.css";

try {
    // Retrieve configuration.
    const config = getConfig();

    // Redirect based on configuration.
    await redirect(config.apiKey, config.channelId);
} catch (e) {
    let template: string;
    if (e instanceof CodeError) {
        // Insert message into DOM
        template = ERROR_TEMPLATES[e.code];
    } else {
        template = ERROR_TEMPLATES[ErrorCode.UNKNOWN];
    }

    // Insert error template into DOM
    document.body.innerHTML = document.body.innerHTML + template;
}
