import React from 'react';

interface ChatMessage {
    message: string;
}

interface ChatBoxProps {
    chats: ChatMessage[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ chats }) => {
    return (
        <div className="chat-box">
            {chats.map((chat, index) => (
                <div key={index} className="chat-message">
                    <img src="src/assets/Matt_walker.png" alt="Matthew Walker" className="profile-pic" />
                    <div className="message-content">
                        <strong>Dr. Matthew Walker:</strong> {chat.message}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatBox;
