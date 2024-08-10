import React, { useState } from 'react';
import { Box, Stack, TextField, Button } from '@mui/material';

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const sendMessage = async () => {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
        });

        const data = await response.json();
        setMessages([...messages, { role: 'user', content: message }, { role: 'assistant', content: data.message }]);
        setMessage('');
    };

    return (
        <Box>
            {/* Chat UI Code Here */}
            <TextField value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button onClick={sendMessage}>Send</Button>
        </Box>
    );
};

export default ChatComponent;
