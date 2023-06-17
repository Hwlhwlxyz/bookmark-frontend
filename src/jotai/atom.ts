import { atom } from 'jotai';

import { Bookmark } from '@/types/bookmark';
import { UserSession } from '@/types/user';

export const bookmarkAtom = atom<Bookmark | null>(null);

const atomWithLocalStorage = (key: string, initialValue: any) => {
    const getInitialValue = () => {
        let item = null;
        if (typeof window !== "undefined" && localStorage != undefined) {
            item = localStorage.getItem(key)
        }
        if (item !== null) {
            let returnValue = '';
            try {
                returnValue = JSON.parse(item);
            }
            catch (e) {
                console.log('atomwithlocalstorage error', e);
                return '';
            }
            return returnValue;
        }
        return initialValue
    }
    const baseAtom = atom(getInitialValue())
    const derivedAtom = atom(
        (get) => get(baseAtom),
        (get, set, update) => {
            const nextValue =
                typeof update === 'function' ? update(get(baseAtom)) : update
            set(baseAtom, nextValue)
            if (typeof window !== "undefined" && localStorage != undefined) {
                localStorage.setItem(key, JSON.stringify(nextValue))
            }
        }
    )
    return derivedAtom
}

export const userSessionAtom = atomWithLocalStorage('UserSessionInfo', null)