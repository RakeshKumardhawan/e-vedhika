export function checkAdLimit(limit) {
    if (!limit) return true; // unlimited
    const today = new Date().toDateString();
    let data = JSON.parse(localStorage.getItem("adStats") || "{}");
    if (data.date !== today) {
        data = { date: today, count: 0 };
    }
    return data.count < limit;
}
export function recordAdImpression() {
    const today = new Date().toDateString();
    let data = JSON.parse(localStorage.getItem("adStats") || "{}");
    if (data.date !== today) {
        data = { date: today, count: 1 };
    } else {
        data.count += 1;
    }
    localStorage.setItem("adStats", JSON.stringify(data));
}
