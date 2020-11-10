import React, {useRef} from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import './styles.css'

class MessageForm extends React.Component {

    render() {
        return (
            <Container className="message-form-container">
                <Form className="message-form-form">
                   <Form.Control type="text" className="message-form-input" placeholder="Enter message to send"></Form.Control> 
                   <Button type="submit">Send</Button>
                </Form>
            </Container>
        );
    }

} export default MessageForm;