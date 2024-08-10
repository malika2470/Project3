import { useState } from 'react';
const nodemailer = require('nodemailer');
require('dotenv').config();

const keywords = ["login", "account", "password", "support", "billing", "error", "help", "refund"];

const [count, setCount] = useState(0);
const [startTime, setStartTime] = useState(Date.now());
const [isComplex, setIsComplex] = useState(false);
const [msgs, setMsgs] = useState([]);
const [showHuman, setShowHuman] = useState(false);

const sendEmail = async (email, ticketId) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Ticket Created - ID: ${ticketId}`,
        text: `A ticket with ID: ${ticketId} has been created. Our team will contact you soon.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent.');
    } catch (error) {
        console.error('Email error:', error);
    }
};

const handleMsg = (msg) => {
    if (isSameTopic(msg)) {
        setCount(count + 1);
    } else {
        setCount(0);
        setStartTime(Date.now());
    }

    if (count > 2 || (Date.now() - startTime) > 180000) {
        setIsComplex(true);
    }

    processMsg(msg);

    if (isComplex) {
        handleComplex();
    }
};

const isSameTopic = (msg) => {
    const content = msg.toLowerCase();
    return keywords.some(keyword => content.includes(keyword));
};

const genTicketId = () => {
    return Math.floor(Math.random() * 1000000).toString();
}

const handleComplex = async () => {
    const ticketId = genTicketId();
    const ticketResponse = { id: ticketId };

    setMsgs((prevMsgs) => [
        ...prevMsgs,
        { role: 'assistant', content: `This issue may need human help. Ticket (ID: ${ticketResponse.id}) created. Want to chat with a human agent?` },
    ]);

    await sendEmail(process.env.EMAIL_USER, ticketResponse.id);
    setShowHuman(true);
};

const processMsg = (msg) => {
    const normalizedMsg = msg.trim().toLowerCase();

    if (normalizedMsg.includes('help')) {
        setMsgs((prevMsgs) => [
            ...prevMsgs,
            { role: 'assistant', content: 'It seems like you need help. How can I assist you further?' },
        ]);
    } else if (normalizedMsg.includes('status')) {
        setMsgs((prevMsgs) => [
            ...prevMsgs,
            { role: 'assistant', content: 'Let me check the status for you...' },
        ]);
    } else {
        setMsgs((prevMsgs) => [
            ...prevMsgs,
            { role: 'assistant', content: 'I’m not sure I understand. Can you please clarify?' },
        ]);
    }
};
