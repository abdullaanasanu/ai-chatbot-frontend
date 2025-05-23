import { useAtom } from "jotai";
import { userAtom } from "../../utils/store/auth";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../../utils/config";
import socket from "../../utils/socket";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

export const Chat = ({ chat }: { chat: any }) => {
  // state
  const [userData, setUserData] = useAtom(userAtom);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);

  // ref
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Chat ID:", chat?._id);
    if (chat?._id && socket) {
      fetchMessages();

      socket.on("chat:message", (data: any) => {
        console.log("New message received:", data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
      });

      //   on typing
      socket.on("chat:typing", (data: any) => {
        console.log("Typing event received:", data);
        setTyping(true);
      });

      //   on stop typing
      socket.on("chat:stop-typing", (data: any) => {
        console.log("Stop typing event received:", data);
        setTyping(false);
      });

      return () => {
        socket.off("chat:message");
        socket.off("chat:typing");
        socket.off("chat:stop-typing");
      };
    }
  }, [chat?._id, socket]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  //  fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL + "chat/" + chat._id, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });
      if (response.status === 200) {
        // Handle successful response
        console.log("Chat messages:", response.data);
        setMessages(response.data?.messages || []);
      }
    } catch (error) {
      // Handle error
      console.error("Error fetching chat messages:", error);
    } finally {
      setLoading(false);
    }
  };

  //   send message
  const sendMessage = async (e: any) => {
    e.preventDefault();

    try {
      const message = e.target.message.value;

      // emit message
      socket.emit("chat:message", {
        chatId: chat._id,
        message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          sender: "user",
          createdAt: new Date().toISOString(),
        },
      ]);

      // clear input
      e.target.message.value = "";
    } catch (error) {
      // Handle error
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (chat === null) {
    return <></>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loading loading-dots loading-xl text-accent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="card bg-base-100 w-full shadow-md border border-gray-200 absolute top-0 left-0 md:left-4 right-0 z-40">
        <div className="card-body flex flex-col items-start">
          <h2 className="text-2xl font-bold">Chat Information</h2>
          <p className="text-sm text-gray-500">Subject: Test</p>
        </div>
      </div>
      {/* Chat listing */}
      <div className="pb-28 pt-32 overflow-y-scroll h-full" ref={chatRef}>
        <div className="flex flex-col justify-end gap-4 ">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${
                message.sender === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-header">
                {message.sender === "user" ? "You" : "AI Bot"}
                <time className="text-xs opacity-50">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <div className="chat-bubble">
                <Markdown>{message.text}</Markdown>
              </div>
            </div>
          ))}
          {typing && (
            <div className="chat chat-start">
              <div className="chat-header">AI Bot</div>
              <div className="chat-bubble flex items-end gap-1">
                Typing
                <div className="loading loading-dots loading-xs text-neutral"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="card bg-base-100 w-full shadow-lg border border-gray-200 absolute bottom-0 left-0 md:left-4 right-0">
        <form
          className="card-body flex flex-row items-start"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            className="input input-primary w-full"
            placeholder="Message"
            name="message"
            required
          />
          <button className="btn btn-primary ml-2">Send</button>
        </form>
      </div>
    </>
  );
};
