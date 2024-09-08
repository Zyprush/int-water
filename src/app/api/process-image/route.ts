// pages/api/process-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: NextRequest) {
  try {
    let base64Image: string;
    let mimeType: string;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // Handle form-data (from camera capture)
      const formData = await req.formData();
      const file = formData.get('image') as Blob | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      base64Image = buffer.toString('base64');
      mimeType = file.type;
    } else if (contentType.includes('application/json')) {
      // Handle JSON body (from file upload)
      const { image } = await req.json();
      const matches = image.match(/^data:(.+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
      }

      mimeType = matches[1];
      base64Image = matches[2];
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }

    const prompt = 'what is the current reading give me 5 digit and in qubic meter';
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to process image', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}