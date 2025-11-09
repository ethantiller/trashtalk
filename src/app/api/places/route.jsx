import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();

    if (!body.textQuery || !body.latitude || !body.longitude) {
        return NextResponse.json({
            success: false,
            error: 'Missing required parameters: textQuery, latitude, longitude'
        }, { status: 400 });
    }

    if (!process.env.GCP_MAPS_API_KEY) {
            console.error('GCP_MAPS_API_KEY not configured');
            return NextResponse.json({
                success: false,
                error: 'API configuration error'
            }, { status: 500 });
        }

    const { textQuery, latitude, longitude, radius = 5000, pageSize = 5, rankPreference = "RELEVANCE" } = body;
    try {
    const response = await fetch(
        'https://places.googleapis.com/v1/places:searchText',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.GCP_MAPS_API_KEY,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.id,places.types'
            },
            body: JSON.stringify({
                textQuery: textQuery,
                pageSize: pageSize,
                rankPreference: rankPreference,
                locationBias: {
                    circle: {
                        radius: radius,
                        center: {
                            latitude: latitude,
                            longitude: longitude
                        }
                    }
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
    }

    const placesResponse = await response.json();
    console.log('Places API result:', placesResponse);

    return NextResponse.json({
        success: true,
        places: placesResponse
    });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}