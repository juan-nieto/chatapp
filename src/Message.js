import React from 'react';
import './styles.css'

class Message extends React.Component {
    render() {
        return (
            <div className='message'>
                <div>
                    <span className="message-span">{this.props.timestamp}</span>
                    <span className="message-span">{this.props.username}:</span> 
                    <span className="message-span">{this.props.text}</span>
                </div>
            </div>
        )
    }

} export default Message;