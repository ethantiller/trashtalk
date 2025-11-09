import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const textQuery = formData.get('textQuery');
    const latitude = parseFloat(formData.get('latitude'));
    const longitude = parseFloat(formData.get('longitude'));
    const radius = parseInt(formData.get('radius'), 10) || 5000;
    const pageSize = parseInt(formData.get('pageSize'), 10) || 5;

    if (!textQuery || isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid required parameters',
          places: [],
        },
        { status: 400 }
      );
    }

    if (!process.env.GCP_MAPS_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'API configuration error',
          places: [],
        },
        { status: 500 }
      );
    }

    const requestBody = {
      textQuery,
      pageSize,
      locationBias: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius,
        },
      },
    };

    const response = await fetch(
      'https://places.googleapis.com/v1/places:searchText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GCP_MAPS_API_KEY,
          'X-Goog-FieldMask': '*',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Google Places API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const placesResponse = await response.json();

    const mappedPlaces = (placesResponse.places || [])
      .slice(0, 5)
      .map((place) => ({
        name: place.displayName?.text || '',
        latitude: place.location?.latitude || null,
        longitude: place.location?.longitude || null,
        address: place.formattedAddress || '',
      }));

    return NextResponse.json({
      success: true,
      places: mappedPlaces,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        places: [],
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
