import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();

    if (!body.origin || !body.destination) {
        return NextResponse.json({
            success: false,
            error: 'No address provided'
        }, { status: 400 });
    }

    try {
        const response = await fetch(
            'https://www.google.com/maps/embed/v1/directions',
        {
            method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GCP_MAPS_API_KEY,
          'X-Goog-FieldMask': '*',
            },
            body: JSON.stringify({
                origin: body.address,
                destination: body.address,
                mode: 'driving'
            })
        })
    } catch (error) {
        console.error('Route fetching error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}