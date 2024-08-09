'use client'
import { Box, Stack, TextField, Button } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  // Initial message state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi I am your personalized Assistant, How can I help you today!',
    },
  ]);

  // Message state for user input
  const [message, setMessage] = useState("");

  // hover function to be used to send our messages in an array to the backend and return a response:
  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      //adding the users message
      { role: "user", content: message },
      // relaying that users message to the assistant's content
      { role: "assistant", content: '' }
    ])
    //fetching response from api: 
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // JSON response of our messages array 
      //creating new array to update the type as state variables might not update in time
      //converts text to JSON string format and reads the resultant message and decodes it
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      //reads the string and process the contents:
      let result = ''
      return reader.read().then(function processText({ done, value }) {
        // checks if contents has been processed if so return the result
        if (done) {
          return result
        }
        //else decode the Text and processes the value and create Int8Array if value is empty
        const text = decoder.decode(value || new Int8Array(), { stream: true })
        // used to append content to your last message:
        setMessages((messages) => {
          // retrieves all the messages except all the last one: 
          let lastMessage = messages[messages.length - 1]
          //retrieves all your other messages
          let otherMessages = messages.slice(0, messages.length - 1)
          // prints otherMessages with a dictionary containing the last message plus the content data 
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }
  return (
    <Box
      width='100vw'
      height='100vh'
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
    >
      <Stack
        direction='column'
        width='600px'
        height='700px'
        border='1px solid black'
        p={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === "assistant" ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={msg.role === "assistant" ? "primary.main" : "primary.secondary"}
                color="text.primary"
                borderRadius={16}
                border="1px solid black"
                p={3}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack
          direction={"row"}
          spacing={2}>
          <TextField
            variant='outlined'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant='contained'
            onClick={sendMessage}
          >
            Send
          </Button>

        </Stack>
      </Stack>
    </Box>
  );
};