import { ChakraProvider, Link } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import Layout from '@/components/layout/layout';
import ProtectedRoute from '@/components/protectedRoute';
import '@/styles/globals.css';
import { t } from '@/translation';

export default function App({ Component, pageProps, router }: AppProps) {
    const toast = useToast();
    return (
        <ChakraProvider>
            <SWRConfig
                value={{
                    onError: (error, key) => {
                        if (error.status !== 403 && error.status !== 404) {
                            {
                                console.log('error', error);
                                if (!toast.isActive('dashboard-needlogin')) {
                                    toast({
                                        id: 'dashboard-needlogin',
                                        title: t('Please login'),
                                        description: (
                                            <div>
                                                {String(error)}
                                                <Link
                                                    id="logintoast"
                                                    className=""
                                                    href="/login"
                                                >
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
                        }
                    },
                }}
            >
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SWRConfig>
        </ChakraProvider>
    );
}
