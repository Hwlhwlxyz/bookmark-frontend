import { Bookmark } from '@/types/bookmark';

import fetcher from './fetcher';

let api: shioriAPI;

function parseResponse(res: Response) {
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

    getBookmarks() {
        return fetcher(this.baseUrl + '/bookmarks', {
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
        return api;
    }
    let baseUrl = 'http://localhost:8080';
    if (process.env.NEXT_PUBLIC_SHIORI_HOST) {
        baseUrl = process.env.NEXT_PUBLIC_SHIORI_HOST;
    }
    api = new shioriAPI(baseUrl);
    return api;
}
