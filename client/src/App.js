import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import classes from "./App.module.css";
import styles from "./App.module.css";

const socket = io.connect("http://localhost:3001");

function App() {
  console.log("App is run");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const setUsernameHandler = (event) => {
    setUsername(event.target.value);
  };

  const setRoomHandler = (event) => {
    setRoom(event.target.value);
  };

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className={classes.App}>
      {!showChat ? (
        <div className={classes.joinChatContainer}>
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Your Name"
            onChange={setUsernameHandler}
          ></input>

          <input
            type="text"
            placeholder="Room ID"
            onChange={setRoomHandler}
          ></input>
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={room}
          windowClass={classes["chat-window"]}
          headerClass={classes["chat-header"]}
          bodyClass={classes["chat-body"]}
          footerClass={classes["chat-footer"]}
          msg={classes.message}
          msgContent={classes["message-content"]}
          msgMeta={classes["message-footer"]}
          you={styles.you}
          other={styles.other}
          msgContainer={classes["message-container"]}
        ></Chat>
      )}
    </div>
  );
}

export default App;
