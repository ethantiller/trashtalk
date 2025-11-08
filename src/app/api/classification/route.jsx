import { pipeline } from '@huggingface/transformers';
import { NextResponse} from 'next/server';

let classification = null;

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
    const huggingFaceRequest = Buffer.from(arrayBuffer);

    try {
        if (!classification) {
            classification = await pipeline('image-classification', 'watersplash/waste-classification');
        }

        const response = await classification(huggingFaceRequest);

        return NextResponse.json({
            success: true,
            wastePredictions: response
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Classification failed'
        }, { status: 500 });
    }

}
