import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



export async function POST(request) {
 
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('API key for Gemini is not configured');
        }

        const formData = await request.formData();
        const huggingfaceText = formData.get('huggingfaceText');
        const userText = formData.get('userText');

        if (!userText && !huggingfaceText) {
        return NextResponse.json({
                success: false,
                error: 'No text provided'
            }, { status: 400 });
        }
            
        if (!userText) {userText = "";}
        // if (!huggingfaceText) {huggingfaceText = "";}

        
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const result = await model.generateContent("focusing on disposing of waste properly, given the following information: " + huggingfaceText + " User additional input: " + userText + ". WHEN OUTPUTING A RESPONSE, DO NOT OUTPUT A RESPONSE IN MARKDOWN.");

        if (!result || !result.response) {
                console.error('Invalid response from Gemini:', result);
                return NextResponse.json({
                    success: false,
                    error: 'No response from AI model'
                }, { status: 500 });
            }

        console.log('\n\n\nGemini \n\n\nresponse:', result.response.text());

        const response = result.response.text();


        // if (!response || response.trim().length === 0) {
        //     console.error('Empty response text from Gemini');
        //     return NextResponse.json({
        //         success: false,
        //         error: 'Empty response from AI model'
        //     }, { status: 500 });
        // }

        return NextResponse.json({
                    success: true,
                    answer: response
                });

        } catch (error) {
        console.error('Error in Gemini API route:', error);

        // Handle specific error types
        if (error.message?.includes('API key')) {
            return NextResponse.json({
                success: false,
                error: 'Invalid API key'
            }, { status: 401 });
        }

        if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
            return NextResponse.json({
                success: false,
                error: 'API rate limit exceeded. Please try again later.'
            }, { status: 429 });
        }

        if (error.message?.includes('blocked') || error.message?.includes('safety')) {
            return NextResponse.json({
                success: false,
                error: 'Content was blocked due to safety filters'
            }, { status: 400 });
        }

        // Generic error response
        return NextResponse.json({
            success: false,
            error: 'Failed to generate response',
            details: error.message
        }, { status: 500 });
    }
}