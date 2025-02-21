import axios from 'axios';
import { atom, selector } from 'recoil';

export type Commit = {
    id: string
    commitMessage: string
    commitAuthorName: string
    commitAuthorAvtar: string
    commitDate: string
    summary: string
}


export const selectedCommitIdState = atom<string | null>({
    key: 'selectedCommitIdState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
  });

// export const coursesAtom = atom<Commit[]>({
//   key: 'coursesAtom',
//   default: coursesSelector,
// });