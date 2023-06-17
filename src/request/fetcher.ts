function updateOptions(options: any, session: string | null) {
    const update = { ...options };
    update.mode = 'cors';
    update.headers = {
        ...update.headers,
        "Content-Type": "application/json",
        'Accept': 'application/json'
    }
    if (session != null) {
        update.headers = {
            ...update.headers,
            'X-Session-Id': session,
        };
    }
    else if (localStorage.UserSessionInfo && localStorage.UserSessionInfo.session) {
        update.headers = {
            ...update.headers,
            'X-Session-Id': `${JSON.parse(localStorage.UserSessionInfo).session}`,
        };
    }
    console.log("updatoptions:", update)
    return update;
}

export default function fetcher(url: string, options: any, session: string | null = null) {
    console.log('fetcher:', url, options, session)
    return fetch(url, updateOptions(options, session));
}