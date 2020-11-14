import React, {useEffect} from 'react';
import socketClient  from "socket.io-client";
import MessageForm from './MessageForm';
import {Container, ListGroup, ListGroupItem} from 'react-bootstrap';
import Message from './Message';

const SERVER = "http://localhost:3000";

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
  }
  state = {
    socket: null,
    messages: [],
    currentUsers: [],
    socketId: '',
    username: '',
    color: ''
  }
  
  socket;
  socketId;

  componentDidMount() {
    this.setupSocket();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    console.log("scrolling");
    
      this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      console.log("scrolling");
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

  handleMessageSend = (messageVal, command) => {
    let user = this.socket.id;
    if(command === "nameChange") {
      console.log("Attempting to change username to: " + messageVal);
      this.socket.emit('username-change-request', {messageVal, user});
    } else if (command === "colorChange") {
      console.log("Attempting to change color change to: " + messageVal);
      this.setState({color: messageVal});
    } else {
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
    let userColor = this.state.color;
    let colorStyle;
    if(userColor === '') {
      colorStyle = { color: "#000000" };
    } else {
      colorStyle = { color: "#" + userColor};
    }
    return (
      <Container id="chat-container"> 
        <div id="messages-container">
          {(userColor === '')
          ? <h6 id="display-username"> Your username is: {user}</h6>
          :<h6 id="display-username" style={colorStyle}> Your username is: {user}</h6>
          }
          <ListGroup>
            {messages.map(message => (
              (message.username === sockId || message.username === sockId)
              ? <ListGroupItem><b> <Message color={colorStyle} timestamp={message.time} username={message.username} text={message.text}/> </b> </ListGroupItem>
              : <ListGroupItem><Message color={colorStyle} timestamp={message.time} username={message.username} text={message.text}/> </ListGroupItem>        
            ))}
            <div ref={this.messagesEndRef}/>
          </ListGroup>
          <MessageForm onMessageSend={this.handleMessageSend}/>
        </div>
        <div id="active-users-container">
          <h6 id="online-users-title"> Online users: </h6>
            <ListGroup className="active-users-list">
              {activeUsers.map(client => (
                (client.name === '') 
                ? <ListGroupItem className="active-users-list-item"><div>{client.id}<br/></div> </ListGroupItem>
                : <ListGroupItem className="active-users-list-item"><div>{client.name}<br/></div> </ListGroupItem>
              ))}
            </ListGroup>
        </div>     
      </Container>
    );
  }
} export default App;
