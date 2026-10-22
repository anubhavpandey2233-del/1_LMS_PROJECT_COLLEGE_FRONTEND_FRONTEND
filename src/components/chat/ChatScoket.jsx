import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { Button, TextField } from "@mui/material";

function Chat() {
  const [totheid, settotheid] = useState("");
  const [msg, setmsg] = useState("");
  const [AllMsg, setAllMsg] = useState([]);
  const [group, setGroup] = useState('');

  const socket = useMemo(() => io("http://localhost:4000"), []);

  socket.on("connect", () => {
    console.log("Server Connected:", socket.id);
  });

  socket.on("welcome", (message) => {
    console.log(message);
  });

  useEffect(() => {
    socket.on("resevier-msg", (message) => {
      console.log("sender's Message : ", message);
      setAllMsg((prev) => [...prev, message]);
    });
  }, []);

  const handleSubmit = () => {
    event.preventDefault();

    socket.emit("userMSG:", { totheid, msg });
  };

  const handleGroupSubmit = () => {
    event.preventDefault();

    socket.emit("Group", group)
  }

  return (
    <div>
      {
        AllMsg.map((m) => 
          <p>{m}</p>
        )
      }

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="totheid"
          placeholder="enter sender id"
          onChange={(event) => settotheid(event.target.value)}
        />
        <br />

        <input
          type="text"
          name="msg"
          placeholder="enter message"
          onChange={(e) => setmsg(e.target.value)}
        />
        <br />
        <input type="submit" />
      </form>

      <form onSubmit={handleGroupSubmit}>
        <input
          type="text"
          name="group"
          placeholder="enter group"
          onChange={(e) => setGroup(e.target.value)}
        />
        <br />
        <input type="submit" />

      </form>
    </div>
  );
}

export default Chat;
