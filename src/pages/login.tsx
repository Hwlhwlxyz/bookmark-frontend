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
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import PasswordField from '@/components/login/passwordField';
import { getShoiriAPI } from '@/request/shiori';
import { t } from '@/translation';

export default function Login() {
    let api = getShoiriAPI();
    const inputRef = useRef<{
        username: HTMLInputElement | null;
        password: HTMLInputElement | null;
    }>({ username: null, password: null });

    const handleSubmit = (event: any) => {
        event.preventDefault();
        // const username = event.target.username.value;
        // const password = event.target.password.value;
        // console.log(`Hello ${username} ${password}!`);
        // console.log(username, password)
        console.log(
            inputRef.current['username']?.value,
            inputRef.current['password']?.value,
        );

        api.login(
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
                (jsonResponse: {
                    account: object;
                    expires: string;
                    session: string;
                }) => {
                    console.log(jsonResponse);
                    localStorage.setItem(
                        'accountInfo',
                        JSON.stringify(jsonResponse),
                    );
                    localStorage.setItem('XSessionId', jsonResponse.session);
                },
            );
        // event.target.reset();
    };

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
                                        type="username"
                                        ref={(el) =>
                                            (inputRef.current['username'] = el)
                                        }
                                    />
                                </FormControl>
                                <PasswordField
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
                                    Sign in {t('signin')}
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
