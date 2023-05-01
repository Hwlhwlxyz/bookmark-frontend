import {
    Box,
    Button,
    Image,
    Input,
    Tag,
    TagCloseButton,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import EditPage from '@/components/editpage/editPage';
import Editor from '@/components/editpage/editor';
import { bookmarkAtom } from '@/jotai/atom';
import { getShoiriAPI } from '@/request/shiori';
import { Bookmark, BookmarkTag } from '@/types/bookmark';

export default function Edit() {
    const [bookmarkToEdit, setBookmarkToEdit] = useAtom(bookmarkAtom);

    let f = getShoiriAPI();
    const { data, error, isLoading } = useSWR('/api/tags', () =>
        f
            .getTags()
            .then((j) => {
                console.log(j, typeof j);
                let tagnames = j.map((e: BookmarkTag) => {
                    return { value: e.name, label: e.name };
                });
                return tagnames;
            })
            .catch((e) => {
                console.log(e);
                console.log('error', 'not login');
                throw e;
            }),
    );
    const { trigger } = useSWRMutation(
        '/api/user',
        async (_url: string, params) => {
            console.log('params', params);
            const res = await f.editBookmarks(params.arg as Bookmark);
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
            setBookmarkToEdit(res);
            console.log('trigger', res);
            // if (res) {
            //     Object.entries(res).forEach(([name, value]: any) =>
            //         setValue(name, value),
            //     );
            // }
        });
    };

    return (
        <EditPage defaultBookmark={bookmarkToEdit} onSubmit={handleSubmit} />
    );
}
