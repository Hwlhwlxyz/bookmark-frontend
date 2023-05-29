import { Button, useDisclosure } from '@chakra-ui/react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { bookmarkAtom } from '@/jotai/atom';
import { getShoiriAPI } from '@/request/shiori';
import { Bookmark } from '@/types/bookmark';

import Bookmarkcard from '../bookmarkcard/bookmarkcard';

// main page to display bookmarks
export default function MainBookmarkView(props: {
    bookmarks: Bookmark[];
    updateTrigger: any;
}) {
    let f = getShoiriAPI();
    const [bookmarkToEdit, setBookmarkToEdit] = useAtom(bookmarkAtom);
    const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(
        null,
    );

    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    function handleClickEdit(b: Bookmark) {
        console.log('set:', b);
        setBookmarkToEdit(b);
        router.push('/dashboard/edit');
    }

    function handleClickDelete(b: Bookmark) {
        setBookmarkToDelete(b);
        onOpen();
    }

    useEffect(() => {
        console.log('view rerender');
    });

    function handleClickDeleteConfirm() {
        if (bookmarkToDelete) {
            f.deleteBookmarks([bookmarkToDelete.id])
                .then((res) => {
                    console.log('props.updateTrigger', props.updateTrigger);
                    if (props.updateTrigger) {
                        props.updateTrigger();
                    }
                    return res;
                })
                .catch(async (e) => {
                    console.log('error', e);
                    console.log('error', 'not login');
                    let t = await e.text();
                    console.log(t);
                    if (props.updateTrigger) {
                        props.updateTrigger();
                    }
                    throw t;
                });
            onClose();
        }
    }

    return (
        <div id="container" style={{ width: '100%' }}>
            {props.bookmarks &&
                props.bookmarks.map((e: Bookmark) => {
                    let bookmark = e;
                    return (
                        <Bookmarkcard
                            key={e.url}
                            imgSrc={e.imageURL}
                            imgAlt={e.imageURL}
                            title={e.title}
                            link={e.url}
                            text={e.excerpt}
                            tags={e.tags}
                            onClickEdit={() => handleClickEdit(bookmark)}
                            onClickDelete={() => handleClickDelete(bookmark)}
                        />
                    );
                })}
            {/* <Bookmarkcard
                imgSrc="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                imgAlt="sofa"
                title={'sofa1'}
                link={'https://google.com'}
                text={'test 1'}
                tags={[
                    { id: -2, name: 'tag1' },
                    { id: -1, name: 'tag2' },
                ]}
                onClickEdit={undefined}
                onClickDelete={undefined}
            /> */}

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {`Are you sure? You can't undo this action afterwards.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleClickDeleteConfirm}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
}
