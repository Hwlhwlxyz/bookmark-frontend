import { Box, Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

import Mainpage from '@/components/mainpage/mainbookmarkview';
import { getShoiriAPI } from '@/request/shiori';
import { t } from '@/translation';

export default function Search() {
    const toast = useToast();
    const router = useRouter();
    let f = getShoiriAPI();
    const { data, error, isLoading, mutate } = useSWR(
        f.getBookmarksApiUrl(1),
        () =>
            f.getBookmarks(1).catch(async (e) => {
                console.log('error', e);
                console.log('error', 'not login');
                let t = await e.text();
                throw t;
            }),
    );

    useEffect(() => {
        if (error) {
            if (!toast.isActive('dashboard-needlogin')) {
                toast({
                    id: 'dashboard-needlogin',
                    title: t('Please login'),
                    description: String(error),
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
            router.push('/login');
        }
    });

    if (isLoading) {
        return (
            <Box>
                <p>loading</p>
            </Box>
        );
    }

    if (error) {
        // if (!toast.isActive('dashboard-needlogin')) {
        //     toast({
        //         id: 'dashboard-needlogin',
        //         title: t('Please login'),
        //         description: String(error),
        //         status: 'error',
        //         duration: 3000,
        //         isClosable: true,
        //     });
        // }
        // toast.close('dashboard-needlogin');
        // router.push('/login');
        console.log(error);
        return (
            <Box>
                <p>
                    error {JSON.stringify(error)}
                    {String(error)}
                </p>
            </Box>
        );
    }
    if (data?.bookmarks == undefined) {
        return (
            <Box>
                <p>{JSON.stringify(data)}</p>
            </Box>
        );
    }
    return (
        <Box width={'100%'}>
            <Box>
                <Button as={NextLink} href="/dashboard/add">
                    add
                </Button>
            </Box>

            <Mainpage
                bookmarks={data.bookmarks || []}
                updateTrigger={() => mutate()}
            />
        </Box>
    );
}
