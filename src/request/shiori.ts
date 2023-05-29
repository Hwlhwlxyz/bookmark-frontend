import { Bookmark, BookmarkTag } from '@/types/bookmark';

import fetcher from './fetcher';

let api: shioriAPI;
let baseUrl = ''; //http://localhost:8080
if (process.env.NEXT_PUBLIC_SHIORI_HOST) {
    baseUrl = process.env.NEXT_PUBLIC_SHIORI_HOST;
}
let baseAPIUrl = baseUrl + '/api'
export function parseResponse(res: Response): Response | Promise<string | Object | any> {
    const contentType = res.headers.get('content-type')!;
    console.log('contentType', contentType);
    if (res.ok) {
        if (contentType.startsWith('application/json')) { return res.json(); }
        else if (contentType.startsWith('text/plain')) { return res.text(); }
        else { return res; }
    }
    else {
        throw res;
        return res;
    }
    return res;
}

interface LoginQueryType {
    username: string; password: string
}
interface BookmarkQueryType {
    page: number; keyword: string | null; tags: any[] | null; excludedTags: any[] | null
}
interface BookmarkEditType {
    id: string,
    url: string,
    title: string,
    excerpt: string,
    // "author": "AUTHOR",
    // public: 1,
    // "modified": "2019-09-22 00:00:00",
    imageURL: string,
    // "hasContent": false,
    // "hasArchive": false,
    tags: BookmarkTag[],
    createArchive: false,
}
interface TagQueryType {
    id: number; name: string
}

export const urlstring = {
    login: baseAPIUrl + '/login',
    bookmark: baseAPIUrl + '/bookmarks',
    tag: baseAPIUrl + '/tags'
}

export function getBookmarksApiUrl(page: number, keyword: string | null = null, tags: any[] | null = null, excludedTags: any[] | null = null) {
    let queryObject: any = {};
    if (keyword != null) {
        queryObject['keyword'] = keyword;
    }
    if (page != null) {
        queryObject['page'] = page;
    }
    if (tags != null) {
        queryObject['tags'] = tags.join(',');
    }
    if (excludedTags != null) {
        queryObject['exclude'] = excludedTags.join(',');
    }
    return baseAPIUrl + '/bookmarks?' + new URLSearchParams(queryObject);
}

export function apilogin(username: string, password: string) {
    let data = {
        username: username,
        password: password,
        remember: true,
        owner: true,
    };
    return fetcher(baseAPIUrl + '/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => parseResponse(res));
}

class shioriAPI {
    baseUrl: string;
    constructor(baseUrl: string | undefined) {
        this.baseUrl = baseUrl + '/api';
    }

    login(username: string, password: string) {
        let data = {
            username: username,
            password: password,
            remember: true,
            owner: true,
        };
        return fetcher(this.baseUrl + '/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => parseResponse(res));
    }

    getBookmarksApiUrl(page: number, keyword: string | null = null, tags: any[] | null = null, excludedTags: any[] | null = null) {
        let queryObject: any = {};
        if (keyword != null) {
            queryObject['keyword'] = keyword;
        }
        if (page != null) {
            queryObject['page'] = page;
        }
        if (tags != null) {
            queryObject['tags'] = tags.join(',');
        }
        if (excludedTags != null) {
            queryObject['exclude'] = excludedTags.join(',');
        }
        return this.baseUrl + '/bookmarks?' + new URLSearchParams(queryObject);
    }

    // var url = new URL("api/bookmarks", document.baseURI);
    // 		url.search = new URLSearchParams({
    // 			keyword: keyword,
    // 			tags: tags.join(","),
    // 			exclude: excludedTags.join(","),
    // 			page: this.page
    // 		});
    // https://github.com/go-shiori/shiori/issues/173
    // https://github.com/go-shiori/shiori/blob/f6f3faf1300f3ad95dfd3dcaaeb82467a1955492/internal/webserver/handler-api.go#L162
    getBookmarks(page: number, keyword: string | null = null, tags: any[] | null = null, excludedTags: any[] | null = null) {
        return fetcher(this.getBookmarksApiUrl(page, keyword, tags, excludedTags), {
            method: 'GET',
        }).then(res => parseResponse(res));
    }

    addBookmark0(url: string, tags: any, title: any, excerpt: any) {
        let data = {
            url: url,
            createArchive: false,
            public: 1,
            tags: tags,
            title: title,
            excerpt: excerpt,
        };
        return fetcher(this.baseUrl + '/bookmarks', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    getAddBookmarkUrl() {
        return this.baseUrl + '/bookmarks';
    }

    addBookmark(bookmark: Bookmark) {
        let data = {
            url: bookmark.url,
            createArchive: false,
            public: 1,
            tags: bookmark.tags,
            title: bookmark.title,
            excerpt: bookmark.excerpt,
        };
        return fetcher(this.baseUrl + '/bookmarks', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => parseResponse(res));
    }

    editBookmarks0(
        id: number,
        url: string,
        tags: any,
        title: any,
        excerpt: any,
        imageURL: string,
    ) {
        let data = {
            id: id,
            url: url,
            title: title,
            excerpt: excerpt,
            // "author": "AUTHOR",
            public: 1,
            // "modified": "2019-09-22 00:00:00",
            imageURL: imageURL,
            // "hasContent": false,
            // "hasArchive": false,
            tags: tags,
            createArchive: false,
        };
        return fetcher(this.baseUrl + '/bookmarks', {
            method: 'PUT',
            body: JSON.stringify(data),
        }).then(res => parseResponse(res));
    }

    editBookmarks(bm: Bookmark) {
        let data = {
            id: bm.id,
            url: bm.url,
            title: bm.title,
            excerpt: bm.excerpt,
            // "author": "AUTHOR",
            public: 1,
            // "modified": "2019-09-22 00:00:00",
            imageURL: bm.imageURL,
            // "hasContent": false,
            // "hasArchive": false,
            tags: bm.tags,
            createArchive: false,
        };
        return fetcher(this.baseUrl + '/bookmarks', {
            method: 'PUT',
            body: JSON.stringify(data),
        }).then(res => parseResponse(res));
    }

    deleteBookmarks(idArray: any[]) {
        let data = idArray;
        return fetcher(this.baseUrl + '/bookmarks', {
            method: 'DELETE',
            body: JSON.stringify(data),
        }).then(res => parseResponse(res));
    }

    getTagsUrl() {
        return this.baseUrl + '/tags';
    }

    getTags() {
        return fetcher(this.baseUrl + '/tags', {
            method: 'GET',
        }).then(res => parseResponse(res));
    }

    renameTag(id: number, name: string) {
        let data = {
            id: id,
            name: name,
        };
        return fetcher(this.baseUrl + '/tags', {
            method: 'PUT',
            body: JSON.stringify(data),
        }).then(res => parseResponse(res));
    }
}

export function getShoiriAPI() {
    console.log(process.env.SHIORI_HOST)
    if (api) {
        console.log("return old api")
        return api;
    }
    let baseUrl = ''; //http://localhost:8080
    if (process.env.NEXT_PUBLIC_SHIORI_HOST) {
        baseUrl = process.env.NEXT_PUBLIC_SHIORI_HOST;
    }
    api = new shioriAPI(baseUrl);
    return api;
}
