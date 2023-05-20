import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

import MainBookmarkView from '@/components/mainpage/mainbookmarkview';
import { Pagination } from '@/components/parts/pagination';
import { getShoiriAPI } from '@/request/shiori';
import styles from '@/styles/pagination.module.css';
import { t } from '@/translation';

export default function Index() {
    const [pagenumber, setPagenumber] = useState(1);
    const [totalPageNumber, setTotalPageNumber] = useState(1);
    const [keyword, setKeyword] = useState<string>('');
    const [keywordvalue, setKeywordvalue] = useDebounce(keyword, 1000);

    const toast = useToast();
    const router = useRouter();
    let f = getShoiriAPI();
    const { data, error, isLoading, mutate } = useSWR(
        f.getBookmarksApiUrl(
            pagenumber,
            keywordvalue.length > 0 ? keywordvalue : null,
        ),
        () =>
            f
                .getBookmarks(
                    pagenumber,
                    keywordvalue.length > 0 ? keywordvalue : null,
                )
                .catch(async (e) => {
                    console.log('error', e);
                    console.log('error', 'not login');
                    if (e.text) {
                        let t = await e.text();
                        throw t;
                    } else {
                        throw e.statusText;
                    }
                }),
    );

    function handleChangeKeyword(e: ChangeEvent<HTMLInputElement>) {
        setKeyword(e.target.value);
        mutate();
    }
    function handleClickPage(p: number) {
        setPagenumber(p);
    }

    useEffect(() => {
        if (error) {
            console.log('error', error);
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
        }
    });

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
                <p>error {JSON.stringify(error)}</p>
            </Box>
        );
    } else if (isLoading) {
        return (
            <Box>
                <p>loading</p>
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
            <InputGroup>
                <InputLeftElement
                    className="InputLeft"
                    pointerEvents="none"
                    children={
                        <SearchIcon className="SearchIcon" color="gray.300" />
                    }
                />
                <Input
                    key="keywordsearch"
                    autoFocus
                    className="Input"
                    variant="outline"
                    // size="xs"
                    placeholder={``}
                    value={keyword}
                    onChange={(e) => handleChangeKeyword(e)}
                />
            </InputGroup>
            keywordvalue:{keywordvalue}
            <MainBookmarkView
                bookmarks={data.bookmarks || []}
                updateTrigger={() => mutate()}
            />
            {/* pagination here */}
            <Pagination
                className={styles.pagination}
                selectedClassName={styles.selected}
                pageNumber={pagenumber || 1}
                totalPageNumber={data.maxPage}
                hrefPrefix={null}
                pageRangeDisplayed={undefined}
                onClickPage={(p: number) => handleClickPage(p)}
            />
        </Box>
    );
}
