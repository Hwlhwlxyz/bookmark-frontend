function updateOptions(options: any) {
    const update = { ...options };
    update.mode = 'cors';
    update.headers = {
        ...update.headers,
        "Content-Type": "application/json",
        'Accept': 'application/json'
    }
    if (localStorage.XSessionId) {
        update.headers = {
            ...update.headers,
            'X-Session-Id': `${localStorage.XSessionId}`,
        };
    }
    return update;
}

export default function fetcher(url: string, options: any) {
    return fetch(url, updateOptions(options));
}