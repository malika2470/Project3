'use client'
import { Box, Stack, TextField, Button, AppBar, Toolbar, IconButton, Typography, Modal } from '@mui/material';
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { firestore } from "@/firebase";
import { getDoc, addDoc } from "firebase/firestore";
import { collection, doc } from "firebase/firestore";


export default function Home() {
  // Initial message state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi I am your personalized Assistant! How can I help you today?',
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

  //Feedback Form
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleOpen = () => setFeedbackOpen(true);

  const handleClose = async () => {
    // Save the rating to Firestore
    if (rating > 0) {
      try {
        await addDoc(collection(firestore, "feedback"), {
          rating: rating,
          timestamp: new Date()
        });
        console.log("Rating saved successfully");
      } catch (error) {
        console.error("Error saving rating: ", error);
      }
    }

    setFeedbackOpen(false);
    setRating(0); // Reset rating after submission
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    //border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  };

  return (
    <Box
      width='100vw'
      height='100vh'
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#2d2d2d" //"1e1e1e""background.default"
    >
      <Stack
        direction='column'
        width='600px'
        height='700px'
        borderRadius={4}
        bgcolor="white"//"#2d2d2d"
        boxShadow="0 4px 12px rgba(0,0,0,0.5)"
        p={2}
        spacing={3}
      >
        <AppBar position="static" sx={{ bgcolor: "#000000" }}>
          <Toolbar>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              TechStore Chatbot
            </Typography>
            <Button color="inherit" onClick={() => navigate('/signin')}>Login</Button>
            <Button color="inherit" onClick={handleOpen}>Close</Button> {/* Close button triggers feedback dialog */}

          </Toolbar>
        </AppBar>

        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          padding="0 10px 0 0"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#dddddd", // Matching scrollbar color
              borderRadius: "8px",

            },
          }}

        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === "assistant" ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={msg.role === "assistant" ? "primary.main" : "primary.secondary"}
                color={msg.role === "assistant" ? "white" : "text.primary"}
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
            label="Enter your message"
            variant='outlined'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant='contained'
            onClick={sendMessage}
            disabled={message == ''}
            //sx={{ bgcolor: "1e1e1e" }}
            sx={{ bgcolor: '#1e1e1e', '&:hover': { bgcolor: '#2d2d2d' } }}
          >
            Send
          </Button>

        </Stack>
      </Stack>
      <Modal
        open={feedbackOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" align='center'>
            Rate your experience with our Chatbot
          </Typography>
          <Stack width="100%" direction="column" spacing={3}>
            <Stack direction="row" spacing={1} mt={2} justifyContent="center">
              {[1, 2, 3, 4, 5].map((value) => (
                <IconButton key={value} onClick={() => handleRating(value)}>
                  <StarIcon
                    sx={{ color: value <= rating ? '#ff5722' : '#ccc' }} // Highlight stars based on rating
                  />
                </IconButton>
              ))}
            </Stack>
            <Button variant="contained" onClick={() => { handleClose() }} disabled={rating === 0} sx={{ bgcolor: '#1e1e1e', '&:hover': { bgcolor: '#2d2d2d' } }}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};