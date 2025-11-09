import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const textQuery = formData.get('textQuery');
    const latitude = parseFloat(formData.get('latitude'));
    const longitude = parseFloat(formData.get('longitude'));
    const radius = parseInt(formData.get('radius'), 10) || 5000;
    const pageSize = parseInt(formData.get('pageSize'), 10) || 5;

    console.log('Places API request:', {
      textQuery,
      latitude,
      longitude,
      radius,
      pageSize,
    });

    // Basic validation before calling Google
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
      console.error('GCP_MAPS_API_KEY not configured');
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

    console.log(
      'Sending to Google Places API:',
      JSON.stringify(requestBody, null, 2)
    );

    const response = await fetch(
      'https://places.googleapis.com/v1/places:searchText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GCP_MAPS_API_KEY,
          // Start with * to confirm wiring; later you can narrow to a specific mask.
          // Example narrower mask: 'places.displayName,places.formattedAddress,places.location,places.id,places.types'
          'X-Goog-FieldMask': '*',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API error details:');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Response Body:', errorText);

      throw new Error(
        `Google Places API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const placesResponse = await response.json();
    console.log(
      'Places API success. Found',
      placesResponse.places?.length || 0,
      'places'
    );

    return NextResponse.json({
      success: true,
      places: placesResponse.places || [],
    });
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        places: [],
        stack: process.env.NODE_ENV === 'production' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
