import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Function to clean text from markdown and special characters
function cleanFormattedText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/`(.*?)`/g, '$1')       // Remove code blocks
    .replace(/#{1,6}\s/g, '')        // Remove headers
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/^\s*[-*+]\s/gm, '')    // Remove bullet points
    .replace(/^\s*\d+\.\s/gm, '')    // Remove numbered lists
    .trim();
}

export async function POST(request) {
  try {
    const { document, instructions, temperature } = await request.json();
    
    if (!document || !instructions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: temperature || 0.7,
      }
    });

    const prompt = `Act as a legal expert. Modify this document following these instructions:
    ${instructions}

    Original Document:
    ${document}

    Important: Provide the enhanced document in plain text format without any markdown or special formatting.

    Enhanced Document:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanedText = cleanFormattedText(response.text());

    return NextResponse.json({ 
      enhanced: cleanedText
    });

  } catch (error) {
    console.error('Document enhancement error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to enhance document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}