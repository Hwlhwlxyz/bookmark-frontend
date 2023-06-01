import {
    Box,
    Button,
    FormLabel,
    HStack,
    Input,
    Spacer,
    Stack,
    VStack,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

import Bookmarkcard from '@/components/bookmarkcard/bookmarkcard';
import MainBookmarkView from '@/components/mainpage/mainbookmarkview';
import { Pagination } from '@/components/parts/pagination';
import { userSessionAtom } from '@/jotai/atom';
import fetcher from '@/request/fetcher';
import { getBookmarksApiUrl, parseResponse, urlstring } from '@/request/shiori';
import styles from '@/styles/pagination.module.css';
import { BookmarkTag } from '@/types/bookmark';
import { UserSession } from '@/types/user';
import { parseObjFromUrl } from '@/util/util';

interface TagOptionType {
    value: string;
    label: string;
    isDisabled?: boolean | undefined;
}

export default function Search() {
    const router = useRouter();
    console.log(router.query, parseObjFromUrl(String(router.query.tags)));
    const [user, setUser] = useAtom<UserSession>(userSessionAtom);
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            keyword: '',
            tags: [],
            excludedTags: [],
        },
    });
    const [tagOption, setTagOption] = useState();
    const [excludedTagOption, setExcludedTagOption] = useState([]);
    const [pagenumber, setPageNumber] = useState(1);
    const [keywordValue, setKeywordValue] = useDebounce<string>('', 500);
    const [queryobj, setQueryObj] = useState<{
        tags: BookmarkTag[] | null;
        excludedTags: BookmarkTag[] | null;
    }>({
        tags: [],
        excludedTags: null,
    });

    const { data, error, isLoading, mutate } = useSWR(
        user
            ? [
                  getBookmarksApiUrl(
                      pagenumber,
                      keywordValue,
                      queryobj?.tags,
                      queryobj?.excludedTags,
                  ),
                  user?.session,
              ]
            : null,
        ([url, usersession]) =>
            fetcher(url, null, usersession).then((r) => {
                console.log('response:', r);
                return parseResponse(r);
            }),
    );

    const tagswatch = watch(['tags', 'excludedTags']);
    const tagResponse = useSWR(
        [urlstring.tag, user?.session],
        ([url, usersession]) =>
            fetcher(url, null, usersession)
                .then((r) => {
                    console.log('response:', r);
                    return parseResponse(r);
                })
                .then((tags: BookmarkTag[]) => {
                    let value: TagOptionType[] = tags.map((e: BookmarkTag) => {
                        return {
                            value: e.name,
                            label: e.name,
                        };
                    });
                    // setTagOption(
                    //     disableItems(value as any, tagswatch[1]) as any,
                    // );
                    // setExcludedTagOption(
                    //     disableItems(value as any, tagswatch[0]) as any,
                    // );
                    return value;
                }),
    );

    function handleClickPage(p: number) {
        setPageNumber(p);
    }

    const disableItems = (array: TagOptionType[], itemToRemove: string[]) => {
        console.log(array, itemToRemove);
        let newArr = [];
        if (array != null && itemToRemove != null) {
            for (let i = 0; i < array.length; i++) {
                if (itemToRemove.includes(array[i].value)) {
                    newArr.push({ ...array[i], isDisabled: true });
                } else {
                    newArr.push({ ...array[i], isDisabled: false });
                }
            }
            console.log(newArr);
            return newArr;
        }
        return array;
    };

    useEffect(() => {
        if (parseObjFromUrl(String(router.query.tags)) != null) {
            setValue('tags', parseObjFromUrl(String(router.query.tags)));
        }
    }, [router.query.tags]);

    useEffect(() => {
        setTagOption(
            disableItems(tagResponse.data as any, tagswatch[1]) as any,
        );
        setExcludedTagOption(
            disableItems(tagResponse.data as any, tagswatch[0]) as any,
        );
    }, [tagResponse.data]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            mutate();
            console.log(value, name, type);
            if (name != undefined && queryobj != undefined) {
                // let newobj = Object.assign(queryobj, { name: value[name] });
                setQueryObj(value as any);
                // mutate();
            }
            if (name == 'keyword') {
                setKeywordValue(encodeURIComponent(value.keyword || ''));
            }
            if (name == 'excludedTags') {
                console.log('exclude update');
                setTagOption(
                    disableItems(
                        tagResponse.data as any,
                        value.tags as any,
                    ) as any,
                );
            } else if (name == 'tags') {
                console.log('tag update');
                setExcludedTagOption(
                    disableItems(
                        tagResponse.data as any,
                        value.excludedTags as any,
                    ) as any,
                );
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <Box width={'100%'}>
            {/* {JSON.stringify(getValues())} */}
            <Box>
                <Button as={NextLink} href="/dashboard/add">
                    add
                </Button>
            </Box>
            <Stack id="search-panel" spacing={'10px'}>
                <Box>
                    <FormLabel>search by text</FormLabel>
                    <Input defaultValue="" {...register('keyword')} />
                </Box>
                <Box>
                    <FormLabel>search by tags</FormLabel>
                    <Controller
                        name="tags"
                        control={control}
                        // defaultValue={bookmarkToEdit?.tags.map((e: BookmarkTag) => {
                        //   return { value: e.name, label: e.name };
                        // })}
                        defaultValue={parseObjFromUrl(
                            String(router.query.tags),
                        )?.map((e: string) => {
                            return {
                                value: e,
                                label: e,
                            };
                        })}
                        render={({ field: { onChange, value, ref } }) => (
                            <Select
                                placeholder="add tags"
                                ref={ref}
                                value={value?.map((e: string) => {
                                    return { value: e, label: e };
                                })}
                                onChange={(val) => {
                                    let arrval = val.map(
                                        (c: { value: string }) => c.value,
                                    );
                                    onChange(arrval);
                                    console.log('arrval', arrval);
                                    setExcludedTagOption(
                                        disableItems(
                                            tagResponse.data || [],
                                            arrval,
                                        ) as any,
                                    );
                                }}
                                options={tagOption}
                                isMulti
                                name="bookmarktags"
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        )}
                    />
                </Box>
                <Box>
                    <FormLabel>exclude tags</FormLabel>
                    <Controller
                        name="excludedTags"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <Select
                                placeholder="exclude tags"
                                defaultValue={[]}
                                onChange={(val) => {
                                    let arrval = val.map(
                                        (c: { value: string }) => c.value,
                                    );
                                    onChange(arrval);
                                    setTagOption(
                                        disableItems(
                                            tagResponse.data || [],
                                            arrval,
                                        ) as any,
                                    );
                                }}
                                options={excludedTagOption}
                                isMulti
                                name="bookmarktags"
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        )}
                    />
                </Box>
            </Stack>

            <Box marginTop={'10'}>
                {data && (
                    <>
                        <MainBookmarkView
                            bookmarks={data?.bookmarks || []}
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
                )}
            </Box>
        </Box>
    );
}
