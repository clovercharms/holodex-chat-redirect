import { getConfig } from "./config";
import { redirect } from "./redirect";
import "./style.css";

// Retrieve configuration.
const config = getConfig();

// Redirect based on configuration.
redirect(config.apiKey, config.channelId);
