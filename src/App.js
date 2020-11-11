import React from 'react';
import socketClient  from "socket.io-client";
import MessageForm from './MessageForm';

const SERVER = "http://localhost:3000";

class App extends React.Component {
  state = {
    socket: null,
    message: ''
  }
  socket;

  componentDidMount() {
    this.setupSocket();
  }
  
  setupSocket = () => {
    var socket = socketClient (SERVER);
    socket.on('connection', () => {
      console.log("I'm connected with the back-end");
      socket.emit('first-connection', "test");
    });
    socket.on('message', this.displayMessage);
    this.socket = socket;
  };


  displayMessage = (message) => {
    console.log("Displaying message received: " +  message.messageVal);
    this.setState({ message: message.messageVal });
  }

  handleMessageSend = (username, messageVal) => {
    console.log("Attempting to send message: " + messageVal);
    this.socket.emit('send-message', {messageVal, username});
  }

  render() {
    let message = this.state.message;
    return (
      <div>
      {message}
      <MessageForm onMessageSend={this.handleMessageSend}/>
      </div>
    );
  }
} export default App;
