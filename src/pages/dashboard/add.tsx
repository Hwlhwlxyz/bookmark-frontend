import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

import EditPage from '@/components/editpage/editPage';
import { getShoiriAPI } from '@/request/shiori';
import { t } from '@/translation';
import { Bookmark, BookmarkTag } from '@/types/bookmark';

export default function Add() {
    let f = getShoiriAPI();
    const toast = useToast();
    const [updatedData, setUpdatedData] = useState(false);
    const router = useRouter();

    const { mutate } = useSWRConfig();

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
        await f
            .addBookmark(newBookmark as any)
            .then((res) => {
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
                if (!toast.isActive('dashboard-add-failed')) {
                    toast({
                        id: 'dashboard-add-failed',
                        title: t('addFailed'),
                        description: String(errorString),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            });
    };

    return <EditPage defaultBookmark={null} onSubmit={handleSubmit} />;
}
