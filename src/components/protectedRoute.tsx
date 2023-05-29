import { useAtom } from 'jotai';
import { AppContext, AppProps } from 'next/app';
import { Router, useRouter } from 'next/router';
import { ReactNode } from 'react';

import { userSessionAtom } from '@/jotai/atom';
import { isBrowser } from '@/util/util';

// https://azeezatraheem.medium.com/implementing-authentication-redirects-in-next-js-c15907ec82b7
interface pprop {
    router: Router;
    children: any;
}
export default function ProtectedRoute({ router, children }: pprop) {
    const [user, setUser] = useAtom(userSessionAtom);
    let unprotectedRoutes = ['/login'];

    let pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;

    if (isBrowser() && user == null && pathIsProtected) {
        router.push('/login');
    }

    return children;
}
