import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
// import Image from "next/image";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Flex,
    Heading,
    IconButton,
    Image,
    Stack,
    Text,
} from '@chakra-ui/react';
import Link from 'next/link';

import { BookmarkTag } from '@/types/bookmark';
import { parseObjToUrl } from '@/util/util';

interface BookmarkProps {
    imgSrc: string;
    imgAlt: string | null;
    title: string | null;
    link: string;
    text: string;
    tags: BookmarkTag[];
    onClickEdit: any;
    onClickDelete: any;
}

export default function Bookmarkcard(props: BookmarkProps) {
    function handleClickEdit(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ): void {
        if (props.onClickEdit) {
            props.onClickEdit();
        }
    }

    function handleClickDelete(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ): void {
        if (props.onClickEdit) {
            props.onClickDelete();
        }
    }

    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            width={'100%'}
            //   height={'150px'}
            overflow="hidden"
            variant="outline"
        >
            <Image
                objectFit="cover"
                maxW={{ base: '100%', sm: '200px' }}
                // width={200}
                // height={200}
                src={props.imgSrc}
                alt={props.imgAlt || 'default'}
            />

            <Stack width={'100%'}>
                <CardBody>
                    <Heading size="md">
                        <Link href={props.link || 'undefined'}>
                            {props.title || props.link}
                        </Link>
                    </Heading>

                    <Text>{props.text}</Text>
                </CardBody>

                <CardFooter
                    style={{ margin: '0 0 0 0', padding: '0 20px 0 20px' }}
                >
                    {/* <Button size="sm" variant="solid" colorScheme="blue">
            tag
          </Button> */}
                    <Box width={'100%'}>
                        <Flex width={'100%'} flexWrap={'wrap'}>
                            {props.tags &&
                                props.tags.map((t) => {
                                    return (
                                        <Link
                                            key={props.link + t.name}
                                            href={
                                                '/dashboard/search?tags=' +
                                                parseObjToUrl([t.name])
                                            }
                                        >
                                            <Button
                                                type="button"
                                                key={t.id}
                                                size="sm"
                                                variant="solid"
                                                colorScheme="blue"
                                            >
                                                {t.name}
                                            </Button>
                                        </Link>
                                    );
                                })}
                        </Flex>

                        <Flex style={{ width: '100%' }}>
                            <IconButton
                                variant="outline"
                                style={{ marginLeft: 'auto' }}
                                colorScheme="green"
                                aria-label="edit"
                                onClick={handleClickEdit}
                                icon={<EditIcon />}
                            />

                            <IconButton
                                variant="outline"
                                colorScheme="red"
                                aria-label="edit"
                                onClick={handleClickDelete}
                                icon={<DeleteIcon />}
                            />
                        </Flex>
                    </Box>
                </CardFooter>
            </Stack>
        </Card>
    );
}
