import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    HStack,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputProps,
    InputRightElement,
    Stack,
    Text,
    forwardRef,
    useDisclosure,
    useMergeRefs,
    useToast,
} from '@chakra-ui/react';
import { Atom, useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { preload } from 'swr';

import PasswordField from '@/components/login/passwordField';
import { userSessionAtom } from '@/jotai/atom';
import { apilogin, getBookmarksApiUrl, getShoiriAPI } from '@/request/shiori';
import { t } from '@/translation';

export default function Login() {
    const toast = useToast();
    const [user, setUser] = useAtom(userSessionAtom);
    const router = useRouter();
    let api = getShoiriAPI();
    const inputRef = useRef<{
        username: HTMLInputElement | null;
        password: HTMLInputElement | null;
    }>({ username: null, password: null });

    const handleSubmit = (event: any) => {
        event?.preventDefault();
        // const username = event.target.username.value;
        // const password = event.target.password.value;
        // console.log(`Hello ${username} ${password}!`);
        // console.log(username, password)
        console.log(
            inputRef.current['username']?.value,
            inputRef.current['password']?.value,
        );

        apilogin(
            inputRef.current['username']?.value as string,
            inputRef.current['password']?.value as string,
        )
            .then((response) => {
                // console.log(response)
                let j = response;
                console.log(j);
                // console.log(response.text())
                return j;
            })
            .then(
                async (jsonResponse: {
                    account: object;
                    expires: string;
                    session: string;
                }) => {
                    console.log(jsonResponse);
                    setUser(jsonResponse);
                    let pagenumber = 1;
                    // use preload to prevent redirecting from dashboard to the login page
                    preload(getBookmarksApiUrl(pagenumber), () =>
                        api.getBookmarks(pagenumber).catch(async (e) => {
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
                },
            )
            .then(() => router.push('/dashboard'))
            .catch((e) => {
                console.log('login error:', e);
                if (!toast.isActive('dashboard-needlogin')) {
                    toast({
                        id: 'dashboard-needlogin',
                        title: t('login failed'),
                        description: <div>{String(e.statusText)}</div>,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            });
    };

    function comfirmLogin(e: KeyboardEvent<HTMLInputElement>): void {
        if (e.key == 'Enter') {
            handleSubmit(undefined);
        }
    }

    return (
        <Container
            maxW="lg"
            py={{ base: '12', md: '24' }}
            px={{ base: '0', sm: '8' }}
        >
            <style>
                {'body { background: var(--chakra-colors-gray-300); }'}
            </style>
            <Stack spacing="8">
                <Stack spacing="6">
                    {/* <Logo /> */}
                    <p>logo</p>
                    <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                        <Heading size={{ base: 'xs', md: 'sm' }}>
                            Log in to your account
                        </Heading>
                        {/* <HStack spacing="1" justify="center">
                        <Text color="muted">{"Don't have an account?"}</Text>
                        <Button variant="link" colorScheme="blue">
                            Sign up
                        </Button>
                        </HStack> */}
                    </Stack>
                </Stack>
                <Box
                    py={{ base: '0', sm: '8' }}
                    px={{ base: '4', sm: '10' }}
                    bg={{ base: 'transparent', sm: 'bg-surface' }}
                    boxShadow={{ base: 'none', sm: 'md' }}
                    borderRadius={{ base: 'none', sm: 'xl' }}
                    backgroundColor={'white'}
                >
                    <form>
                        <Stack spacing="6">
                            <Stack spacing="5">
                                <FormControl>
                                    <FormLabel htmlFor="username">
                                        Username
                                    </FormLabel>
                                    <Input
                                        id="username"
                                        type="text"
                                        autoComplete="on"
                                        ref={(el) =>
                                            (inputRef.current['username'] = el)
                                        }
                                    />
                                </FormControl>
                                <PasswordField
                                    onKeyUp={(e) => comfirmLogin(e)}
                                    ref={(el) =>
                                        (inputRef.current['password'] = el)
                                    }
                                />
                            </Stack>
                            <HStack justify="space-between">
                                <Checkbox defaultChecked>Remember me</Checkbox>
                                <Button
                                    variant="link"
                                    colorScheme="blue"
                                    size="sm"
                                >
                                    Forgot password?
                                </Button>
                            </HStack>
                            <Stack spacing="6">
                                <Button
                                    // type="submit"
                                    variant="solid"
                                    colorScheme="blue"
                                    onClick={handleSubmit}
                                >
                                    {t('signin')}
                                </Button>
                                {/* <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or continue with
                </Text>
                <Divider />
              </HStack> */}
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Container>
    );
}
