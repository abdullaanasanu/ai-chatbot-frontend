import { useAtom } from "jotai";
import { userAtom } from "../../utils/store/auth";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Navbar = () => {
  // state
  const [userData, setUserData] = useAtom(userAtom);

  //   routes
  const navigate = useNavigate();

  const onLogout = () => {
    setUserData(null);
    toast.success("Logout successful!");
    navigate("/");
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">AI Chatbot</a>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src="/avatar.svg" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
              {userData ? (
                <li>
                  <a onClick={onLogout}>Logout</a>
                </li>
              ) : (
                <li>
                  <Link to="/">Login / Register</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
