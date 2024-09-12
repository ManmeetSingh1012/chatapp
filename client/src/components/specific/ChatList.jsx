import { Stack } from "@mui/material";
import React, {useEffect}from "react";
import ChatItem from "../shared/ChatItem";
import { useSelector } from "react-redux";
import { getSocket } from "../../socket";
import { CHAT_JOINED,CHAT_LEAVED } from "../../constants/events";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  const socket = getSocket();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id});

    return () => {
      socket.emit(CHAT_LEAVED, { userId: user._id});
    };
  }, []);
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"}>
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );

        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
            members = { members}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
