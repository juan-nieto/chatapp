import React from 'react';
import {Button} from 'react-bootstrap';
import './styles.css'

/**
 * This class contains the logic and UI to retrieve the message input
 * the user would like to send, and delivers it to App.js to send to the server.
 */
class MessageForm extends React.Component {
    state = { enteredMessage: '' }

    handleInput = e => {
        this.setState({ enteredMessage: e.target.value });
    }

    checkForCommand = (input) => {
        let command = '';
        console.log("Checking for command");
        if(input.startsWith("/name <")) {
            if(input.endsWith(">")) {
                command += 'nameChange';
            }
        } else if(input.startsWith("/color ")) {
            console.log("command starts with color");
            //command must be in form "/color ffffff"
            if(input.length === 13) {
                console.log("color command correct length");
                let color = input.substring(7);
                var hexRegEx = new RegExp('^[0-9A-Fa-f]+$');
                if(hexRegEx.test(color)) {
                    command += 'colorChange';
                } else {
                    alert("Invalid color, must be in form RRGGBB with valid hex values only");
                }
            }
        }
        return command;
    }

    handleSendMessage = () => {
        if (this.state.enteredMessage && this.state.enteredMessage != '') {
            let input = this.state.enteredMessage.trim();
            var command = this.checkForCommand(input);
            if(command === "nameChange") {
                console.log("attempting to change username");
                let desiredUsername = input.substring(
                    (input.indexOf("<") + 1),
                    (input.indexOf(">"))
                );
                this.props.onMessageSend(desiredUsername, command);
            } else if(command === "colorChange"){
                let color = input.substring(7);
                this.props.onMessageSend(color, command);
            } else {
                this.props.onMessageSend(this.state.enteredMessage, command);
            }
            
            this.setState({ enteredMessage: '' });
        }
    }

    handleEnterPress = (event) => {
        if(event.keyCode === 13) {
            this.handleSendMessage();
        }
    }

    render() {
        return (       
                <div className="message-form-form">
                   <input type="text" className="message-form-input" placeholder="Enter message to send"
                        onChange={this.handleInput} value={this.state.enteredMessage} onKeyDown={this.handleEnterPress}/> 
                   <Button onClick={this.handleSendMessage} className="message-form-button">Send</Button>
                </div>
        );
    }

} export default MessageForm;