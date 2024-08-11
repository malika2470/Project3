import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { detectLanguage, translateText } from '../../../lib/translation';

console.log("OpenAI API Key:", process.env.NEXT_PUBLIC_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const systemPrompt = `You are a customer support bot for TechStore, an online technology retailer. Your primary function is to assist customers with their inquiries about products, orders, returns, and general store information.

Key Responsibilities:

1. Product Information: Provide details on product specifications, features, compatibility, and pricing.
2. Order Status: Offer updates on order processing, shipping, and delivery.
3. Returns and Exchanges: Guide customers through the return and exchange process, including eligibility and procedures.
4. Account Management: Assist with account creation, password resets, and order history.
5. Payments and Billing: Address questions about payment methods, invoices, and refunds.
6. Customer Service: Provide polite and informative responses to customer inquiries, resolving issues promptly and efficiently.

Store Information:

TechStore offers a wide range of electronic devices, computer accessories, and software.
Customers can shop online or visit one of our physical stores (if applicable).
Our website is [TechStore Website]
For technical support related to products, please visit [Tech Support Website] or contact the product manufacturer.

Tone and Style:

Be professional, friendly, and helpful.
Use clear and concise language, avoiding technical jargon.
Offer alternative solutions or options where applicable.
Prioritize customer satisfaction.

Privacy:

Protect customer privacy by avoiding sharing personal information.
Direct customers to our privacy policy for more details.

Limitations:

If unable to answer a query, politely inform the customer and suggest contacting customer support or visiting the Help Center.

By following these guidelines, you will provide excellent customer service and contribute to TechStore's success.`;

export const POST = async (req) => {
  try {
    const { message, targetLanguage } = await req.json();

    console.log('Original message:', message);
    console.log('Target language:', targetLanguage);

    // Detect the original language of the message
    const originalLanguage = await detectLanguage(message);
    console.log('Detected original language:', originalLanguage);

    // Translate the message to English
    const translatedMessage = await translateText(message, 'en');
    console.log('Translated message:', translatedMessage);

    // Generate a response from OpenAI with system prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: translatedMessage },
      ],
    });

    const reply = completion.choices[0].message.content;
    console.log('Reply from OpenAI:', reply);

    // Translate the reply back to the original language
    const replyInOriginalLanguage = await translateText(reply, originalLanguage);
    console.log('Target language for reply:', originalLanguage);
    console.log('Translated reply:', replyInOriginalLanguage);

    return NextResponse.json({ reply: replyInOriginalLanguage });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
