// app/api/chat/route.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        const { messages } = await request.json();

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // or 'gpt-4'
            messages,
        });

        return Response.json({
            response: completion.choices[0].message.content,
        });
    } catch (err) {
        console.error('OpenAI API error:', err);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500,
        });
    }
}
