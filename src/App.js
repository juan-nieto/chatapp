import React from 'react';
import socketClient  from "socket.io-client";
import MessageForm from './MessageForm';
import {Container} from 'react-bootstrap';

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
    console.log("Displaying message received: " +  message.message.messageVal
     + " with timestamp: " + message.d);
    let timestampedMessage = message.d + ": " + message.message.messageVal;
    this.setState({ message: timestampedMessage });
  }

  handleMessageSend = (username, messageVal) => {
    console.log("Attempting to send message: " + messageVal);
    this.socket.emit('send-message', {messageVal, username});
  }

  render() {
    let message = this.state.message;
    return (
      <Container id="chat-container">
        {message}
        <MessageForm onMessageSend={this.handleMessageSend}/>
      </Container>
    );
  }
} export default App;
