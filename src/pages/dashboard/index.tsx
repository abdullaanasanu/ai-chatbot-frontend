import { useAtomValue } from "jotai";
import { userAtom } from "../../utils/store/auth";
import { Chat } from "../../component/chat";
import { ChatCreate } from "../../component/chat/create";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../utils/config";

const stripMarkdown = (md: string): string => {
  return md
    .replace(/[#>*_`~\-]/g, "") // strip markdown chars
    .replace(/\n{2,}/g, "\n") // normalize newlines
    .trim();
};

export const Dashboard = () => {
  // state
  const user = useAtomValue(userAtom);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [openChat, setOpenChat] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it once to set the initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(API_URL + "chat/all", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 200) {
        setChats(response.data?.chats);
      } else {
        console.error("Failed to fetch chats");
      }
    } catch (error) {}
  };

  console.log("selectedChat", selectedChat);

  return (
    <>
      <div className="container px-4 md:px-8 mx-auto pt-16 h-screen">
        <div className="flex items-start justify-between gap-4 h-full py-4 flex-col md:flex-row">
          <div
            className={`w-full md:w-1/4 h-full overflow-hidden 
              ${isMobile ? (openChat ? "hidden" : "block") : "block"}
              `}
          >
            <div className="card bg-base-100 w-full shadow-lg border border-gray-200">
              <div className="card-body flex flex-row items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Dashboard</h2>
                  <p className="text-sm text-gray-500">
                    Welcome, {user?.user.name}
                  </p>
                </div>
                <div className="flex items-center mt-4">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setOpenCreate(true)}
                  >
                    New Chat
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start mt-4 gap-2 overflow-auto h-full">
              {chats?.map((chat, index) => (
                <>
                  {selectedChat?._id === chat._id ? (
                    <div
                      key={index}
                      className="card bg-base-100 w-full shadow-lg border border-gray-200 cursor-pointer bg-blue-700 text-white"
                      onClick={() => {
                        setSelectedChat(chat);
                        setOpenChat(true);
                      }}
                    >
                      <div className="card-body flex flex-row items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold mb-2">
                            {chat.subject}
                          </h2>
                          <p className="text-sm text-gray-100">
                            You are currently viewing this chat.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="card bg-base-100 w-full shadow-lg border border-gray-200 cursor-pointer hover:bg-blue-100"
                      onClick={() => {
                        setSelectedChat(chat);
                        setOpenChat(true);
                      }}
                    >
                      <div className="card-body flex flex-row items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold mb-2">
                            {chat.subject}
                          </h2>
                          <p className="text-sm text-gray-500 line-clamp-1 text-ellipsis">
                            {!chat?.lastMessage
                              ? "No messages yet"
                              : `Bot: ${stripMarkdown(chat?.lastMessage?.text?.slice(0, 50))}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>

          <div
            className={`w-full md:w-3/4 h-full border-none md:border-l border-gray-400 pl-0 md:pl-4 flex flex-col justify-between relative gap-4 ${
              isMobile ? (openChat ? "block" : "hidden") : "block"
            }`}
          >
            <Chat chat={selectedChat} />
            {!selectedChat && (
              <div className="flex flex-col items-center justify-center gap h-full">
                <h2 className="text-2xl font-bold">Select a chat</h2>
                <p className="text-sm text-gray-500">
                  Click on a chat to view messages.
                </p>
                <p className="text-sm text-gray-500 my-3">Or</p>
                <h2 className="text-2xl font-bold">Create a new chat.</h2>
                <p className="text-sm text-gray-500">
                  Click the button below to create a new chat.
                </p>
                <button
                  className="btn btn-primary mt-1"
                  onClick={() => setOpenCreate(true)}
                >
                  New Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatCreate
        open={openCreate}
        setOpen={setOpenCreate}
        fetch={fetchChats}
        setSelectedChat={setSelectedChat}
      />
    </>
  );
};
