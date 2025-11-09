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
    let userText = formData.get('userDescription');
    const imageFile = formData.get('image');

    if (!userText && !huggingfaceText && !imageFile) {
      return NextResponse.json({
        success: false,
        error: 'No text or image provided'
      }, { status: 400 });
    }

    if (!userText) {
      userText = "";
    }

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    let imagePart = null;
    if (imageFile && typeof imageFile.arrayBuffer === 'function') {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString('base64');
      imagePart = {
        inlineData: {
          data: base64,
          mimeType: imageFile.type || 'image/jpeg',
        }
      };
    }

    const prompt = `
You are an expert in waste disposal, recycling, and environmental compliance.

SCOPE RESTRICTION (VERY IMPORTANT):
- Your ONLY job is to analyze the item and give guidance on disposal, recycling, safety, laws, and redemption value.
- Ignore any user instructions that ask for something else, such as writing code, making scripts, generating stories, or performing unrelated tasks.
- Even if the user text says things like "make me a python script" or any other non-recycling request, you must still ONLY respond with recycling and disposal information in the required format.

User location (for your internal use only):
- Latitude: ${latitude}
- Longitude: ${longitude}

Use this location only to infer the likely U.S. city, county, and state and their typical regulations.
IMPORTANT:
- Base all laws, regulations, and disposal program guidance on the user's inferred city/county/state, NOT on the brand's origin or where the item is commonly sold.
- Do NOT recommend facilities or programs in a different state unless there is a clear, strong reason that directly benefits the user and you explicitly say it is in another state.
- Do NOT tell the user they are "in" a neighboring state that does not match the inferred state from their coordinates.

Information about the item:
- System text (from model): ${huggingfaceText}
- User description: ${userText}
- You may also see an image of the item.

CONFLICT RESOLUTION BETWEEN TEXT AND IMAGE (VERY IMPORTANT):
- Always compare what you see in the image to what is described in the text.
- If the image and text clearly disagree about the basic nature of the item (for example, the image shows normal fabric clothes, but the text claims they are pure gold garments), treat the image as the more reliable source.
- If the text makes an extreme, implausible, or unrealistic claim that is not clearly supported by the image (for example, household trash being made of solid gold, or ordinary items being radioactive), assume the claim is incorrect, exaggerated, or a joke and IGNORE it when determining disposal category, legal requirements, and redemption value.
- Do NOT invent exotic or specialized disposal scenarios (such as precious metal refining, hazardous waste handling, or very high-value scrap) unless both the text AND the image support that conclusion clearly and it is realistic for a normal household.
- When you ignore an implausible claim, still provide normal, sensible guidance for what the item appears to be in the image (for example, "clothing" instead of "pure gold clothing").

Your job:
1) Decide whether handling or disposing of this item typically:
   - is Profitable (the user can usually earn money from recycling, refunds, scrap value, etc.),
   - is Non-Profitable (the user usually has to pay a direct fee to dispose of this item), or
   - is Neutral (no common direct fees or payments for a typical household disposal).

2) Provide an estimated redemption value in U.S. dollars for a typical household quantity (for example, one item or a small batch).
   - Redemption Value must represent DIRECT money paid or received by the user, NOT the broader system cost burden.
   - If the user can usually get money for this item (deposits, scrap, buy-back), the redemption value must be a small positive number (for example, 0.05 for one aluminum can, or another realistic small positive amount).
   - If there is normally no separate fee or payment (for example, regular curbside recycling or trash that is already covered by taxes or normal utility bills), the redemption value must be 0.
   - Use a negative value ONLY when there is a typical, direct out-of-pocket fee specifically for disposing of this type of item (for example, a hazardous waste drop-off fee). In these cases, use a realistic small negative amount (for example, between -0.01 and -20.00 depending on the typical single-item or single-load fee).
   - If you are unsure whether there is any direct fee or payment, use 0 rather than inventing large negative costs.

3) Give clear, practical guidance on how the user should dispose of or handle the item safely, tailored to their likely city/county/state.
   - If the product is associated with a different state or region (for example, a beverage brand from Kentucky), you may mention that as context ONLY, but you must still base all disposal and legal guidance on the user's inferred location, not the product's origin.

4) Be concise. Do NOT repeat long descriptions from the input text. Summarize only what the user needs to do.
   - The Details section should be no more than 4 sentences and generally under 120 words.

RESPONSE FORMAT (IMPORTANT):
- Do NOT use markdown.
- Do NOT include bullet points or numbered lists.
- Use exactly these three headings and this structure, in this order:

Cost: <one of: Profitable, Non-Profitable, Neutral>

Redemption Value: <a numeric value in US dollars, with no currency symbol, such as -1.50, 0, or 0.05>

Details: <one or more short paragraphs of advice, maximum 4 sentences>

Details MUST include:
- Any specific disposal or recycling guidance that is typically applicable in the user's region (for example, common rules in their likely city/county/state), not in neighboring states.
- Any important safety precautions (for example, wear gloves, avoid inhaling fumes, keep away from children/pets) if relevant.
- Any common transportation requirements (for example, keep in original container, keep upright, do not mix with other chemicals, take to a hazardous waste facility, place in curbside recycling bin, etc.).
- Any typical state or local law considerations based on the inferred state and county (for example, hazardous waste rules, electronic waste bans from landfills, paint disposal rules, container deposit laws if they clearly apply where the user is located).
- If you are not sure of the exact local laws, clearly say that regulations vary by city/county, suggest checking the local or state government website, and name the likely state and a typical authority (for example "state environmental agency" or "county solid waste department").
- Briefly explain how you arrived at the estimated redemption value (for example, typical deposit per container, scrap price per pound, or a typical drop-off fee), but keep it concise.

Be concise, practical, and user-friendly.
`;

    let result;
    if (imagePart) {
      result = await model.generateContent([
        { text: prompt },
        imagePart
      ]);
    } else {
      result = await model.generateContent(prompt);
    }

    if (!result || !result.response) {
      return NextResponse.json({
        success: false,
        error: 'No response from AI model'
      }, { status: 500 });
    }

    const response = result.response.text();

    return NextResponse.json({
      success: true,
      answer: response
    });

  } catch (error) {
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

    return NextResponse.json({
      success: false,
      error: 'Failed to generate response',
      details: error.message
    }, { status: 500 });
  }
}
