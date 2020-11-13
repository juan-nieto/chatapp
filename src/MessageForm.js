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

    handleSendMessage = () => {
        if (this.state.enteredMessage && this.state.enteredMessage != '') {
            let attemptedNameChange = false;
            let desiredUsername = '';
            let input = this.state.enteredMessage.trim();
            if(input.startsWith("/name <")) {
                if(input.endsWith(">")) {
                    console.log("attempting to change username");
                    attemptedNameChange = true;
                    desiredUsername += input.substring(
                        (input.indexOf("<") + 1),
                        (input.indexOf(">"))
                    );
                }
            }
            if(attemptedNameChange) {
                this.props.onMessageSend(desiredUsername, attemptedNameChange);
            } else {
                this.props.onMessageSend(this.state.enteredMessage, attemptedNameChange);
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