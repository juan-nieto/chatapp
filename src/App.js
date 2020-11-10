import React from 'react';
import socketClient  from "socket.io-client";
import MessageForm from './MessageForm';

const SERVER = "http://localhost:3000";

function App() {
  var socket = socketClient (SERVER);
  socket.on('connection', () => {
    console.log("I'm connected with the back-end");
  });
  return (
    <MessageForm/>
  );
}

export default App;
