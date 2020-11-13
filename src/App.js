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
    currentUsers: [],
    socketId: '',
    username: ''
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
      let id = socket.id;
      this.setState({socketId: id});
    });
    this.socket = socket;
    socket.on('message', this.displayMessage);
    socket.on('connected-clients', this.retrieveConnectedClients);
    socket.on('username-change-fail', this.handleFailedNameChange);
    socket.on('username-change-success', this.handleSuccessNameChange)
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

    this.setState(state => { 
      const messages = state.messages.concat(messageObj);
      return {
        messages
      };
    });
  }

  retrieveConnectedClients = (clientList) => {
    console.log("Retrieved clients from server: "); 
    clientList.forEach(client => {
      console.log("Client: " + client);
    });
    this.setState({currentUsers: clientList});
  }

  handleMessageSend = (messageVal, changeUsernameFlag) => {
    let user = this.socket.id;
    if(changeUsernameFlag) {
      console.log("Attempting to change username to: " + messageVal);
      this.socket.emit('username-change-request', {messageVal, user});
    } else {
      console.log("Attempting to send message: " + messageVal);
      this.socket.emit('send-message', {messageVal, user});
    }
  }

  handleFailedNameChange = () => {
    alert("Could not update username");
  }

  handleSuccessNameChange = (name) => {
    this.setState({username: name});
  }

  render() {
    let messages = this.state.messages;
    let user = "";
    let username = this.state.username;
    if(username === "") {
      user += this.state.socketId;
    } else {
      user += username;
    }
    let sockId = this.state.socketId;
    let activeUsers = this.state.currentUsers;
    return (
      <Container id="chat-container"> 
        <div id="messages-container">
          <h6> Your username is: {user}</h6>
          {messages.map(message => (
            (message.username === sockId || message.username === sockId)
            ? <b> <Message timestamp={message.time} username={message.username} text={message.text}/> </b>
            : <Message timestamp={message.time} username={message.username} text={message.text}/>        
          ))}
          <MessageForm onMessageSend={this.handleMessageSend}/>
        </div>
        <div id="active-users-container">
          <h6> Online users: </h6>
            {activeUsers.map(client => (
              (client.name === '') 
              ? <div>{client.id}<br/></div>
              : <div>{client.name}<br/></div>
            ))}
        </div>     
      </Container>
    );
  }
} export default App;
