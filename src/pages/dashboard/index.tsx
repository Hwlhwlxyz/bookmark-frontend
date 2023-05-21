import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
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
    const [keywordvalue, setKeywordvalue] = useDebounce(keyword, 500);

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
                    description: (
                        <div>
                            String(error){' '}
                            <Link id="logintoast" className="" href="/login">
                                login
                            </Link>
                        </div>
                    ),
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
            router.push('/login');
        }
    });

    return (
        <Box width={'100%'}>
            <Box>
                <Button as={NextLink} href="/dashboard/add">
                    add
                </Button>
            </Box>
            <InputGroup>
                <InputLeftElement className="InputLeft" pointerEvents="none">
                    {<SearchIcon className="SearchIcon" color="gray.300" />}
                </InputLeftElement>

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
            {/* keywordvalue:{keywordvalue} */}

            {data ? (
                <>
                    <MainBookmarkView
                        bookmarks={data.bookmarks || []}
                        updateTrigger={() => mutate()}
                    />
                    <Pagination
                        className={styles.pagination}
                        selectedClassName={styles.selected}
                        pageNumber={pagenumber || 1}
                        totalPageNumber={data.maxPage}
                        hrefPrefix={null}
                        pageRangeDisplayed={undefined}
                        onClickPage={(p: number) => handleClickPage(p)}
                    />
                </>
            ) : (
                <></>
            )}
            {error && (
                <Box>
                    <p>error {JSON.stringify(error)}</p>
                </Box>
            )}
            {isLoading && <Box>loading</Box>}
            {/* pagination here */}
        </Box>
    );
}
