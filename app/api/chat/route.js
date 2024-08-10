import { Content } from "next/font/google";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

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

By following these guidelines, you will provide excellent customer service and contribute to TechStore's success.`

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