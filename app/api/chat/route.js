import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { detectLanguage, translateText } from '../../../lib/translation';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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

    // Generate a response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: translatedMessage }],
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

