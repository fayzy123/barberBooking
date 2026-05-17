export function getDatePill(): string {
    const now = new Date();

    const formatted = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZoneName: "short",
    }).formatToParts(now);

    const get = (type: string) => 
        formatted.find((p) => p.type === type) ?.value ?? "";

        const day = get("weekday");
        const date = `${get("day")} ${get("month")} ${get("year")}`;
        const tz = get("timeZoneName");

        return `${day} ${date} · ${tz}`; 
    }

