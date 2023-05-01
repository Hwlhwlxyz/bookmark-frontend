import { atom } from 'jotai';

import { Bookmark } from '@/types/bookmark';

export const bookmarkAtom = atom<Bookmark | null>(null);