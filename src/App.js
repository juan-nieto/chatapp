import React from 'react';
import socketClient  from "socket.io-client";
import MessageForm from './MessageForm';
import {Container} from 'react-bootstrap';
import Message from './Message';

const SERVER = "http://localhost:3000";

class App extends React.Component {
  state = {
    socket: null,
    messages: [],
    socketId: ''
  }
  socket;
  socketId;

  componentDidMount() {
    this.setupSocket();
  }
  
  setupSocket = () => {
    var socket = socketClient (SERVER);
    socket.on('connection', () => {
      console.log("I'm connected with the back-end");
      socket.emit('first-connection', "test");
      let id = socket.id;
      this.setState({socketId: id});
    });
    this.socket = socket;
    socket.on('message', this.displayMessage);
    
  };


  displayMessage = (message) => {
    console.log("Displaying message received: " +  message.message.messageVal
     + " with timestamp: " + message.d);
     let timestamp = message.d.split(' ').join('');
    let messageObj = {
      time: timestamp,
      username: message.message.user,
      text: message.message.messageVal
    } 
    //let completeMessage = message.d + " " + message.message.user + ": " + message.message.messageVal;

    this.setState(state => { 
      const messages = state.messages.concat(messageObj);
      return {
        messages
      };
    });
  }

  handleMessageSend = (messageVal) => {
    console.log("Attempting to send message: " + messageVal);
    let user = this.socket.id;
    this.socket.emit('send-message', {messageVal, user});
  }

  render() {
    let messages = this.state.messages;
    let user = this.state.socketId;
    return (
      <Container id="chat-container">
        <span> Your username is: {user}</span>
        {messages.map(message => (
          <Message timestamp={message.time}
            username={message.username}
            text={message.text}/>
        ))}
        <MessageForm onMessageSend={this.handleMessageSend}/>
      </Container>
    );
  }
} export default App;
