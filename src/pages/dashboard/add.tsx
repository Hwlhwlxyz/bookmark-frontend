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
    useToast,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

import AutocompleteTags from '@/components/editpage/autocompletetag';
import EditPage from '@/components/editpage/editPage';
import Editor from '@/components/editpage/editor';
import { bookmarkAtom } from '@/jotai/atom';
import { getShoiriAPI } from '@/request/shiori';
import { t } from '@/translation';
import { Bookmark, BookmarkTag } from '@/types/bookmark';

export default function Add() {
    let f = getShoiriAPI();
    const toast = useToast();
    const [updatedData, setUpdatedData] = useState(false);
    const router = useRouter();

    const { mutate } = useSWRConfig();
    const { trigger } = useSWRMutation(
        f.getAddBookmarkUrl(),
        async (_url: string, params) => {
            console.log('params', params);
            const res = await f.addBookmark(params.arg as Bookmark);
            return res;
        },
        {},
    );

    const handleSubmit = async (data: any) => {
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

        console.log(newBookmark);
        await trigger(newBookmark as any)
            .then((res) => {
                setUpdatedData(true);
                console.log('trigger', res);
                if (!toast.isActive('dashboard-add-success')) {
                    toast({
                        id: 'dashboard-add-success',
                        title: t('addSuccessfully'),
                        description: String('success'),
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            })
            .then(async () => {
                console.log('mutate', f.getBookmarksApiUrl(1));
                let r = await mutate(f.getBookmarksApiUrl(1));
                console.log('mutate, r:', r);
            })
            .catch(async (err: Response) => {
                let errorString = await err.text();
                if (!toast.isActive('dashboard-add-faile')) {
                    toast({
                        id: 'dashboard-add-faile',
                        title: t('addFailed'),
                        description: String(errorString),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            });
    };

    // useEffect(() => {
    //     const warningText =
    //         'You have unsaved changes - are you sure you wish to leave this page?';
    //     const handleWindowClose = (e: BeforeUnloadEvent) => {
    //         if (!updatedData) return;
    //         e.preventDefault();
    //         return (e.returnValue = warningText);
    //     };
    //     const handleBrowseAway = () => {
    //         if (!updatedData) return;
    //         if (window.confirm(warningText)) return;
    //         router.events.emit('routeChangeError');
    //         throw 'routeChange aborted.';
    //     };
    //     window.addEventListener('beforeunload', handleWindowClose);
    //     router.events.on('routeChangeStart', handleBrowseAway);
    //     return () => {
    //         window.removeEventListener('beforeunload', handleWindowClose);
    //         router.events.off('routeChangeStart', handleBrowseAway);
    //     };
    // }, [updatedData]);

    return <EditPage defaultBookmark={null} onSubmit={handleSubmit} />;
}
