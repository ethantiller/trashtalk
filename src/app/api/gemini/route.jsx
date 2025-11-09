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
    const longitude = formData.get('longitude');
    const latitude = formData.get('latitude');
    let userText = formData.get('userDescription'); // Changed to let, and fixed field name to match frontend

    if (!userText && !huggingfaceText) {
      return NextResponse.json({
        success: false,
        error: 'No text provided'
      }, { status: 400 });
    }

    if (!userText) {
      userText = "";
    }

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are an expert in waste disposal, recycling, and environmental compliance.

User location:
- Latitude: ${latitude}
- Longitude: ${longitude}

Use the location to infer the likely U.S. state and local regulations as best you can.

Information about the item:
- System text (from model): ${huggingfaceText}
- User description: ${userText}

Your job:
1) Decide whether handling or disposing of this item typically:
   - is Profitable (the user can usually earn money from recycling, refunds, scrap value, etc.),
   - is Non-Profitable (the user usually has to pay disposal fees, service charges, etc.), or
   - is Neutral (no common fees or payments either way).

2) Provide an estimated redemption value in U.S. dollars for a typical quantity that a household might dispose of at one time.
   - If it is Profitable, the redemption value must be a positive number (e.g., 5.00).
   - If it is Non-Profitable, the redemption value must be a negative number (e.g., -10.00).
   - If it is Neutral, the redemption value must be 0.
   - If you are unsure, make a reasonable estimate and clearly state that it is approximate in the Details section.

3) Give clear, practical guidance on how the user should dispose of or handle the item safely, tailored to their likely state/jurisdiction.

RESPONSE FORMAT (IMPORTANT):
- Do NOT use markdown.
- Do NOT include bullet points or numbered lists.
- Use exactly these three headings and this structure, in this order:

Cost: <one of: Profitable, Non-Profitable, Neutral>

Redemption Value: <a numeric value in US dollars, with no currency symbol, such as -.1, 0, 2.5, 10>

Details: <one or more short paragraphs of advice>

Details MUST include:
- Any specific disposal or recycling guidance that is typically applicable in the user's region.
- Any important safety precautions (e.g., wear gloves, avoid inhaling fumes, keep away from children/pets).
- Any common transportation requirements (e.g., keep in original container, keep upright, do not mix with other chemicals, take directly to a hazardous waste facility, etc.).
- Any typical state or local law considerations based on the inferred state and county (for example, hazardous waste rules, electronic waste bans from landfills, paint disposal rules, etc.).
- If you are not sure of the exact local laws, clearly say that regulations vary by city/county, suggest checking the local or state government website, and name the likely state and a typical authority (for example “state environmental agency” or “county solid waste department”).
- Briefly explain how you arrived at the estimated redemption value (for example, typical deposit per container or typical disposal fee ranges).

Be concise, practical, and user-friendly.
`;

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      console.error('Invalid response from Gemini:', result);
      return NextResponse.json({
        success: false,
        error: 'No response from AI model'
      }, { status: 500 });
    }

    console.log('\n\n\nGemini response:', result.response.text());
    const response = result.response.text();

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
