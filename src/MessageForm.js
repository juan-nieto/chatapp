import React from 'react';
import {Container, Button} from 'react-bootstrap';
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
            this.props.onMessageSend(this.state.enteredMessage);
            this.setState({ enteredMessage: '' });
        }
    }

    render() {
        return (       
                <div className="message-form-form">
                   <input type="text" className="message-form-input" placeholder="Enter message to send"
                        onChange={this.handleInput} value={this.state.enteredMessage}/> 
                   <Button onClick={this.handleSendMessage} className="message-form-button">Send</Button>
                </div>
        );
    }

} export default MessageForm;