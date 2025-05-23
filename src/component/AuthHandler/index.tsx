import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";
import { userAtom } from "../../utils/store/auth";

export default function AuthHandler({ children }: { children: JSX.Element }) {
  const user = useAtomValue(userAtom);

  return user ? children : <Navigate to="/" />;
}
