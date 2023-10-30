import { CodeError, ErrorCode } from "./errors";

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

    let videos: Video[];
    try {
        videos = (await fetch(
            `${import.meta.env.VITE_HOLODEX_API_URL}/live?${params.toString()}`,
            {
                headers: {
                    "X-APIKEY": apiKey,
                    "Content-Type": "application/json",
                },
            }
        ).then(response => response.json())) as Video[];
    } catch (e) {
        throw new CodeError(ErrorCode.NETWORK, "Network error occurred");
    }

    // Empty results are considered an error.
    if (videos.length === 0)
        throw new CodeError(ErrorCode.NO_RESULTS, "No results");

    return videos;
}

/**
 * Retrieves the latest (scheduled) streams and redirects based on the earliest
 * stream available.
 * @param apiKey The Holodex API key to use.
 * @param channelId The channel ID of which to search with.
 */
export async function redirect(apiKey: string, channelId: string) {
    // Retrieve latest (scheduled) streams.
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
}
