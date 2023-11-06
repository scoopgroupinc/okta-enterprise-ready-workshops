import { Router } from 'express';
import OpenAI from 'openai';

export const openaiRoute = Router();

const openai = new OpenAI({
  //   organization: process.env.VITE_OPENAI_API_ORG,
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

openaiRoute.post('/', async (request, response) => {
  const { chats } = request.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content:
            'You are a life coach and psychologist. You can help with mental health and life coaching. You will help people gain self awareness and self confidence.',
        },
        ...chats,
      ],
    });

    response.json({
      output: chatCompletion.choices[0].message,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status); // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code); // e.g. 'invalid_api_key'
      console.error(error.type); // e.g. 'invalid_request_error'
    } else {
      // Non-API error
      console.log(error);
    }
  }
});
