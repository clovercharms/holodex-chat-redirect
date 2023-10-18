/**  Type of video status from Holodex */
type Status = "upcoming" | "live";

/** Type of video from the Holodex API. */
interface Video {
    id: string;
    title: string;
    type: string;
    topic_id: string;
    published_at: string;
    available_at: string;
    duration: number;
    status: Status;
    start_scheduled: string;
    start_actual: string;
    live_viewers: number;
    channel: {
        id: string;
        name: string;
        org: string;
        suborg: string;
        type: string;
        photo: string;
        english_name: string;
    };
}

/** Error message template for failed redirect */
const ERROR_TEMPLATE = (error: unknown) => `
<article>
    <h1>Error while contacting Holodex API</h1>
    <p>Unable to retrieve latest scheduled and live stream information from the Holodex API.</p>
    <p>The following error occurred:</p>
    <pre>${JSON.stringify(error, Object.getOwnPropertyNames(error), 4)}</pre>
</article>
`;

/**
 * Retrieves the latest (scheduled) streams based on the given
 * parameters.
 * @param apiKey The Holodex API key to use.
 * @param channelId The channel ID of which to search with.
 * @returns The latest (scheduled) streams.
 */
async function getVideos(apiKey: string, channelId: string) {
    // The search parameters to use.
    const params = new URLSearchParams({
        channel_id: channelId,
        type: "stream",
        status: ["upcoming", "live"].join(","),
        include: "live_info",
        max_upcoming_hours: "24",
    });

    const videos = (await fetch(
        `${import.meta.env.VITE_HOLODEX_API_URL}/live?${params.toString()}`,
        {
            headers: {
                "X-APIKEY": apiKey,
                "Content-Type": "application/json",
            },
        }
    ).then(response => response.json())) as Video[];

    // Empty results are considered an error.
    if (videos.length === 0) throw new Error("No results");

    return videos;
}

/**
 * Retrieves the latest (scheduled) streams and redirects based on the earliest
 * stream available.
 * @param apiKey The Holodex API key to use.
 * @param channelId The channel ID of which to search with.
 */
export async function redirect(apiKey: string, channelId: string) {
    try {
        // Retrieve latest (archived) streams.
        const videos = await getVideos(apiKey, channelId);

        // Check to see if live stream exists.
        const liveStream = videos.find(v => v.status === "live");
        if (liveStream) {
            // Redirect to live stream chat.
            window.location.href =
                import.meta.env.VITE_YOUTUBE_POPOUT_CHAT_URL + liveStream.id;
            return;
        }

        // Sort scheduled streams descending.
        const sortedVideos = videos.sort(
            (a, b) =>
                new Date(a.start_scheduled).getTime() -
                new Date(b.start_scheduled).getTime()
        );

        // Redirect to earliest scheduled stream chat.
        window.location.href =
            import.meta.env.VITE_YOUTUBE_POPOUT_CHAT_URL + sortedVideos[0].id;
    } catch (error) {
        // Insert error message into document body.
        document.body.innerHTML =
            document.body.innerHTML + ERROR_TEMPLATE(error);
        throw error;
    }
}
