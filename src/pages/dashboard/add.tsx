import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    Image,
    Input,
    Tag,
    TagCloseButton,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import AutocompleteTags from '@/components/editpage/autocompletetag';
import EditPage from '@/components/editpage/editPage';
import Editor from '@/components/editpage/editor';
import { bookmarkAtom } from '@/jotai/atom';
import { getShoiriAPI } from '@/request/shiori';
import { Bookmark, BookmarkTag } from '@/types/bookmark';

export default function Add() {
    let f = getShoiriAPI();

    const { trigger } = useSWRMutation(
        '/api/user',
        async (_url: string, params) => {
            console.log('params', params);
            const res = await f.addBookmark(params.arg as Bookmark);
            return res;
        },
        {},
    );

    const handleSubmit = (data: any) => {
        console.log('submit');
        console.log(data);
        let newTags: BookmarkTag[] = [];
        if (data.tags != null) {
            newTags = data.tags.map((e: any) => {
                return { name: e };
            });
        }

        let newBookmark: Bookmark = {
            id: data?.id,
            url: data?.url,
            title: data?.title,
            excerpt: data?.excerpt,
            author: data?.author,
            public: data?.public,
            modified: data?.modified,
            imageURL: data?.imageURL,
            hasContent: data?.hasContent,
            hasArchive: data?.hasArchive,
            tags: newTags,
        };

        trigger(newBookmark as any).then((res) => {
            console.log('trigger', res);
            // if (res) {
            //     Object.entries(res).forEach(([name, value]: any) =>
            //         setValue(name, value),
            //     );
            // }
        });
    };

    return <EditPage defaultBookmark={null} onSubmit={handleSubmit} />;
}
