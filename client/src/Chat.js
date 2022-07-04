import React, { useEffect, useState } from "react";
import key from "weak-key";
import ScrollToBotton from "react-scroll-to-bottom";

export default function Chat({
  socket,
  username,
  room,
  windowClass,
  headerClass,
  bodyClass,
  footerClass,
  msg,
  msgContent,
  msgMeta,
  you,
  other,
  msgContainer,
}) {
  console.log(you, other);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const setCurrentMessageHandler = (event) => {
    setCurrentMessage(event.target.value);
  };

  const enterHandler = (event) => {
    event.key === "Enter" && sendMessage();
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        key: room + username + currentMessage,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className={windowClass}>
      <div className={headerClass}>
        <p>Live Chat</p>
      </div>
      <div className={bodyClass}>
        <ScrollToBotton className={msgContainer}>
          {messageList.map((messageContent) => {
            return (
              <div
                key={messageContent.key}
                className={msg}
                id={username === messageContent.author ? you : other}
              >
                <div>
                  <div className={msgContent}>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className={msgMeta}>
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBotton>
      </div>
      <div className={footerClass}>
        <input
          type="text"
          value={currentMessage}
          placholder="Hi..."
          onChange={setCurrentMessageHandler}
          onKeyPress={enterHandler}
        ></input>
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
