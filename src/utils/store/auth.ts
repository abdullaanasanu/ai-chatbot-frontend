import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage<null | {
  token: string;
  user: any;
}>("authUser", null);
