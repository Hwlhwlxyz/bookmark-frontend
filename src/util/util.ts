
export function isSessionError(err: any) {
    switch (err.toString().replace(/\(\d+\)/g, "").trim().toLowerCase()) {
        case "session is not exist":
        case "session has been expired":
            return true
        default:
            return false;
    }
}

export function isBrowser() {
    return (typeof window != "undefined");
}

export function parseObjToUrl(obj: Object) {
    return window.btoa(JSON.stringify(obj));
}

export function parseObjFromUrl(urlstr: string) {
    let jsonstr;
    try {
        jsonstr = window.atob(urlstr)
        return JSON.parse(jsonstr);
    }
    catch (e) {
        console.log('parse error', jsonstr)
    }
    return null;
}