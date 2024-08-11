'use client'
import { Box, Stack, TextField, Button, AppBar, Toolbar, IconButton, Typography, Modal } from '@mui/material';
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi I am your personalized Assistant, How can I help you today!',
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, targetLanguage: 'en' }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);

      setMessages((messages) => [
        ...messages.slice(0, messages.length - 1),
        { role: 'assistant', content: data.reply }
      ]);
    } else {
      console.error('Error:', response.statusText);
    }
  };

  // Feedback Form
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#2d2d2d"
    >
      <Stack
        direction="column"
        width="600px"
        height="700px"
        borderRadius={4}
        bgcolor="white"
        boxShadow="0 4px 12px rgba(0,0,0,0.5)"
        p={2}
        spacing={3}
      >
        <AppBar position="static" sx={{ bgcolor: "#000000" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              TechStore Chatbot
            </Typography>
            <Button color="inherit">Login</Button>
            <Button color="inherit" onClick={handleOpen}>Close</Button>
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
              backgroundColor: "#dddddd",
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
        <Stack direction="row" spacing={2}>
          <TextField
            label="Enter your message"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{ bgcolor: '#1e1e1e', '&:hover': { bgcolor: '#2d2d2d' } }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
      <Modal
        open={open}
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
                    sx={{ color: value <= rating ? '#ff5722' : '#ccc' }}
                  />
                </IconButton>
              ))}
            </Stack>
            <Button variant="contained" onClick={handleClose} sx={{ bgcolor: '#1e1e1e', '&:hover': { bgcolor: '#2d2d2d' } }}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}


