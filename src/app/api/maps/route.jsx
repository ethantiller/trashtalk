import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();

    if (!body.origin || !body.destination) {
        return NextResponse.json({
            success: false,
            error: 'No origin or destination provided'
        }, { status: 400 });
    }

    try {
        let origin = body.origin;
        if (typeof origin === 'object' && origin.latitude && origin.longitude) {
            origin = `${origin.latitude},${origin.longitude}`;
        }

        const params = new URLSearchParams({
            key: process.env.GCP_MAPS_API_KEY,
            origin: origin,
            destination: body.destination,
            mode: 'driving'
        });

        const embedUrl = `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;

        return NextResponse.json({
            success: true,
            embedUrl: embedUrl
        });

    } catch (error) {
        return NextResponse.json(
        {
            success: false,
            error: error.message,
            embedUrl: null,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
}
