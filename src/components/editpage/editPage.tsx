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

import Editor from '@/components/editpage/editor';
import { bookmarkAtom } from '@/jotai/atom';
import { getShoiriAPI } from '@/request/shiori';
import { Bookmark, BookmarkTag } from '@/types/bookmark';

interface EditPageProps {
    defaultBookmark: Bookmark | null;
    onSubmit: any;
}

export default function EditPage(props: EditPageProps) {
    const [bookmarkToEdit, setBookmarkToEdit] = useState(props.defaultBookmark);
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: {
            id: bookmarkToEdit?.id,
            url: bookmarkToEdit?.url,
            title: bookmarkToEdit?.title,
            excerpt: bookmarkToEdit?.excerpt,
            author: bookmarkToEdit?.author,
            public: bookmarkToEdit?.public,
            modified: bookmarkToEdit?.modified,
            imageURL: bookmarkToEdit?.imageURL,
            hasContent: bookmarkToEdit?.hasContent,
            hasArchive: bookmarkToEdit?.hasArchive,
            tags: bookmarkToEdit?.tags?.map((e) => e.name),
        },
    });

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

    const onSubmit = (data: any) => {
        // console.log('submit');
        // console.log(data);
        // let newTags: BookmarkTag[] = data.tags.map((e: any) => {
        //     return { name: e };
        // });

        // let newBookmark: Bookmark = {
        //     id: data?.id,
        //     url: data?.url,
        //     title: data?.title,
        //     excerpt: data?.excerpt,
        //     author: data?.author,
        //     public: data?.public,
        //     modified: data?.modified,
        //     imageURL: data?.imageURL,
        //     hasContent: data?.hasContent,
        //     hasArchive: data?.hasArchive,
        //     tags: newTags,
        // };

        // trigger(newBookmark as any).then((res) => {
        //     setBookmarkToEdit(res);
        //     console.log('trigger', res);
        //     // if (res) {
        //     //     Object.entries(res).forEach(([name, value]: any) =>
        //     //         setValue(name, value),
        //     //     );
        //     // }
        // });

        props.onSubmit(data);
    };

    function setChosenTags(
        choice: MultiValue<{ value: string; label: string }>,
    ): void {
        console.log(choice);
    }

    function isValidUrl(str: string | undefined) {
        if (str == undefined) {
            return false;
        }
        try {
            new URL(str);
            return true;
        } catch (err) {
            return false;
        }
    }

    if (isLoading) {
        return (
            <Box style={{ width: '100%' }}>
                <p>loading {String(isLoading)}</p>
            </Box>
        );
    }

    if (error) {
        return (
            <Box style={{ width: '100%' }}>
                <p>error {String(error)}</p>
            </Box>
        );
    }
    return (
        <Box style={{ width: '100%' }}>
            <p>
                {/* bookmarkToEdit:{bookmarkToEdit?.url}
                {JSON.stringify(bookmarkToEdit)} */}
            </p>
            <Image
                objectFit="cover"
                maxW={{ base: '100%', sm: '200px' }}
                // width={200}
                // height={200}
                src={bookmarkToEdit?.imageURL}
                alt={'default'}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <Input placeholder="title" {...register('title')} />
                </Box>
                <Box>
                    <Input
                        placeholder="url"
                        {...register('url', {
                            required: true,
                            validate: (value, formValues) => isValidUrl(value),
                        })}
                    />
                    {errors?.url?.type === 'required' && (
                        <p>This field is required</p>
                    )}
                </Box>
                <Box>
                    <Controller
                        name="excerpt"
                        control={control}
                        // defaultValue={bookmarkToEdit?.tags.map((e: BookmarkTag) => {
                        //   return { value: e.name, label: e.name };
                        // })}
                        render={({ field: { onChange, value, ref } }) => (
                            <Editor
                                value={value}
                                onChange={(val) => onChange(val)}
                            />
                        )}
                    />
                </Box>

                <Box>
                    <Controller
                        name="tags"
                        control={control}
                        // defaultValue={bookmarkToEdit?.tags.map((e: BookmarkTag) => {
                        //   return { value: e.name, label: e.name };
                        // })}
                        render={({ field: { onChange, value, ref } }) => (
                            <CreatableSelect
                                // value={options.filter(c => value.includes(c.value))}
                                defaultValue={
                                    bookmarkToEdit?.tags
                                        ? bookmarkToEdit.tags.map(
                                              (e: BookmarkTag) => {
                                                  return {
                                                      value: e.name,
                                                      label: e.name,
                                                  };
                                              },
                                          )
                                        : []
                                }
                                onChange={(val) =>
                                    onChange(val.map((c) => c.value))
                                }
                                options={data}
                                isMulti
                                name="bookmarktags"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                // onChange={(choice) => setChosenTags(choice)}
                            />
                        )}
                    />
                </Box>
                <Button type="submit">submit</Button>
            </form>
        </Box>
    );
}
