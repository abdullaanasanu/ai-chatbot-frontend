import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../../utils/config";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../utils/store/auth";

export const ChatCreate = ({
  open,
  setOpen,
  fetch,
  setSelectedChat,
}: {
  open: boolean;
  setOpen: any;
  fetch: any;
  setSelectedChat: any;
}) => {
  const user = useAtomValue(userAtom);

  const createChat = async (e: any) => {
    e.preventDefault();

    try {
      const subject = e.target.subject.value;

      // Call login API
      const response = await axios.post(
        API_URL + "chat/create",
        {
          subject,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        // Handle successful login
        console.log("response", response.data);
        setOpen(false);
        toast.success("Chat created successfully!");
        fetch();
        setSelectedChat(response.data?.chat);
        e.target.reset(); // Reset the form
      } else {
        // Handle error
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      // Handle error
      console.error("Create chat error:", error);
      toast.error("Failed to create chat. Please try again.");
    }
  };

  return (
    <>
      <dialog className="modal" open={open}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create a new chat</h3>
          <form method="dialog" onSubmit={createChat}>
            <fieldset className="fieldset w-full mt-2">
              <label className="label">Subject</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Subject"
                name="subject"
                required
              />
            </fieldset>
            <div className="modal-action">
              <button className="btn btn-primary">Create</button>
              <button
                className="btn"
                type="button"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};
