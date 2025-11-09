import { NextResponse } from 'next/server';

export async function POST(request) {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
        return NextResponse.json({
            success: false,
            error: 'No image provided'
        }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();

    try {
        const response = await fetch(
            'https://vqf0lxlyfzvpmi4y.us-east-1.aws.endpoints.huggingface.cloud',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': image.type || 'image/jpeg',
                },
                body: arrayBuffer,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API error (${response.status}): ${errorText || response.statusText}`);
        }

        const predictions = await response.json();

        return NextResponse.json({
            success: true,
            wastePredictions: predictions
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
