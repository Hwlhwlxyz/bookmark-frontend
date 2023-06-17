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
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

import MainBookmarkView from '@/components/mainpage/mainbookmarkview';
import { Pagination } from '@/components/parts/pagination';
import { userSessionAtom } from '@/jotai/atom';
import fetcher from '@/request/fetcher';
import { getBookmarksApiUrl, parseResponse } from '@/request/shiori';
import styles from '@/styles/pagination.module.css';
import { t } from '@/translation';
import { UserSession } from '@/types/user';

export default function Index() {
    const [pagenumber, setPagenumber] = useState(1);
    const [totalPageNumber, setTotalPageNumber] = useState(1);
    const [keyword, setKeyword] = useState<string>('');
    const [keywordvalue, setKeywordvalue] = useDebounce(keyword, 500);
    const [user, setUser] = useAtom<UserSession>(userSessionAtom);

    const { data, error, isLoading, mutate } = useSWR(
        [getBookmarksApiUrl(pagenumber, keywordvalue), user?.session],
        ([url, usersession]) =>
            fetcher(url, null, usersession).then((r) => {
                console.log('response:', r);
                return parseResponse(r);
            }),
    );

    function handleChangeKeyword(e: ChangeEvent<HTMLInputElement>) {
        setKeyword(e.target.value);
        mutate();
    }
    function handleClickPage(p: number) {
        setPagenumber(p);
    }

    // useEffect(() => {
    //     if (error || !user || user.session == 'logout') {
    //         console.log('error', error);
    //         error.text().then((responseText: any) => {
    //             console.log(responseText);
    //             if (!toast.isActive('dashboard-needlogin')) {
    //                 toast({
    //                     id: 'dashboard-needlogin',
    //                     title: t('Please login'),
    //                     description: (
    //                         <div>
    //                             {responseText}
    //                             {/* <Link id="logintoast" className="" href="/login">
    //                                 login
    //                             </Link> */}
    //                         </div>
    //                     ),
    //                     status: 'error',
    //                     duration: 3000,
    //                     isClosable: true,
    //                 });
    //             }
    //         });

    //         router.push('/login');
    //     }
    // });

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
            <Button as={NextLink} href="/dashboard/search">
                advanced search
            </Button>
            <Box>
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
                    <div>loading isLoading:{isLoading}</div>
                )}
            </Box>

            {error && (
                <Box>
                    <p>error {JSON.stringify(error)}</p>
                </Box>
            )}

            {/* pagination here */}
        </Box>
    );
}
