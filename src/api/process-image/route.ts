import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Prepare image data for Google Generative AI
    const prompt = 'what is the current reading give me 5 digits in cubic meter';
    const imagePart = {
      inlineData: {
        data: image.split(',')[1], // Base64 part of the image
        mimeType: 'image/jpeg',
      },
    };

    // Generate content using the AI model
    const result = await model.generateContent([prompt, imagePart]);

    // Return the processed result
    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
