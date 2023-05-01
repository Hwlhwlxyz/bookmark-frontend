import { Box, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import useSWR from 'swr';

import Mainpage from '@/components/mainpage/mainpage';
import { getShoiriAPI } from '@/request/shiori';

export default function Index() {
    let f = getShoiriAPI();
    const { data, error, isLoading, mutate } = useSWR(
        '/api/getBookmarks/',
        () =>
            f.getBookmarks().catch(async (e) => {
                console.log('error', e);
                console.log('error', 'not login');
                let t = await e.text();
                throw t;
            }),
    );
    if (isLoading) {
        return (
            <Box>
                <p>loading</p>
            </Box>
        );
    }
    if (error) {
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
            {/* <p>{'isLoading:' + JSON.stringify(isLoading)}</p>
            <p>{'error:' + String(error)}</p>
            <p>{'data:' + JSON.stringify(data)}</p> */}
        </Box>
    );
}
