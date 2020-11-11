import React from 'react';
import './styles.css'

class Message extends React.Component {
    render() {
        return (
            <div className='message'>
                <div>
                    {this.props.senderName}: 
                    <span>{this.props.text}</span>
                </div>
            </div>
        )
    }

} export default Message;