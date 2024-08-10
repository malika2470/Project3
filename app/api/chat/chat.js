import { OpenAI } from 'openai';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Process the incoming request
    const data = await req.json();

    // Generate a random ticket ID
    const ticketId = Math.floor(Math.random() * 1000000).toString();

    // Example of sending an email
    await sendMail('user-email@example.com', ticketId);

    res.status(200).json({ message: 'Request processed successfully', ticketId });
}

const sendMail = async (email, ticketId) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,
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
