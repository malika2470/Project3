import { Content } from "next/font/google";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
// system prompt for users
const systemPrompt = `Welcome to our ChatBot application using NextJS and OpenAI`
// creating the API request 
export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.json();
    //created whenever the completion of openai is done reading the message:
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: systemPrompt,
            },
            //unpacking all the rest of your data
            ...data,
        ],
        model: "gpt-4o-mini",
        stream: true,
    });
    //display output of the contents of the stream
    const stream = new ReadableStream({
        // how the stream will start:
        async start(controller) {
            //encoding the text
            const encoder = new TextEncoder();
            try {
                //open AI sends message through chunks and awaiting those messages
                for await (const chunks of completion) {
                    // for each message chunk will retrieve the content
                    const content = chunks.choices[0]?.delta?.content
                    // if the content exists
                    if (content) {
                        //encode the content
                        const text = encoder.encode(content)
                        //send it to our controller
                        controller.enqueue(text)
                    }
                }
                //catch any errors in the process of controller starting and display
            } catch (error) {
                controller.error(err)
            }
            //closing the stream once done
            finally {
                controller.close()
            }
        }
    }
    )
    //returning the response stream:
    return new NextResponse(stream)
}