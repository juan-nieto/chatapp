import React from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import './styles.css'

class MessageForm extends React.Component {
    state = { enteredMessage: '' }

    handleInput = e => {
        this.setState({ enteredMessage: e.target.value });
    }

    handleSendMessage = () => {
        if (this.state.enteredMessage && this.state.enteredMessage != '') {
            this.props.onMessageSend("id", this.state.enteredMessage);
            this.setState({ enteredMessage: '' });
        }
    }

    render() {
        return (
            <Container className="message-form-container">
                <div className="message-form-form">
                   <input type="text" className="message-form-input" placeholder="Enter message to send"
                        onChange={this.handleInput} value={this.state.enteredMessage}/> 
                   <Button onClick={this.handleSendMessage}>Send</Button>
                </div>
            </Container>
        );
    }

} export default MessageForm;