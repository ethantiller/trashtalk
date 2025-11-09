# TrashTalkers.tech

A modern waste classification and recycling platform that helps users identify, classify, and properly dispose of their waste items through AI-powered image recognition and location-based recycling recommendations.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=flat&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-12.5.0-orange?style=flat&logo=firebase)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-Ready-blue?style=flat&logo=google-cloud)
![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat)
[![Build & Deploy](https://github.com/ethantiller/trashtalk/actions/workflows/build-and-deploy.yaml/badge.svg?branch=main)](https://github.com/ethantiller/TrashTalkers.tech/actions/workflows/build-and-deploy.yaml)

## Features

- **AI-Powered Classification** - Upload images of waste items and get instant AI classification using Hugging Face models
- **Location-Based Recommendations** - Find nearby recycling centers based on your location and item type
- **Redemption Value Estimation** - Get estimated redemption value for recyclable items in your area
- **Interactive Maps** - View directions to recycling locations with embedded Google Maps
- **Personal Dashboard** - Track your recycling history and manage uploaded items
- **Secure Authentication** - Firebase authentication with email/password and Google sign-in

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **Custom Fonts** - Zalando Sans SemiExpanded

### Backend & Services
- **Firebase** - Authentication and Firestore database
- **Firebase Admin SDK** - Server-side authentication verification
- **Google Gemini AI** - Advanced waste disposal guidance
- **Hugging Face** - Image classification model
- **Google Maps API** - Location services and directions
- **Google Places API** - Recycling center discovery

### DevOps
- **Docker** - Containerized deployment
- **Google Cloud Run** - Serverless hosting
- **GitHub Actions** - CI/CD pipeline
- **Artifact Registry** - Container image storage

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Google Cloud Platform project with the following APIs enabled:
  - Maps JavaScript API
  - Places API (New)
  - Maps Embed API
- Hugging Face API access
- Google Gemini API key

```
trashtalk/
├── src/
│   └── app/
│       ├── (auth)/              # Protected routes
│       │   └── dashboard/       # User dashboard & item pages
│       ├── (public)/            # Public routes (login, signup)
│       ├── api/                 # API routes
│       │   ├── classification/  # Image classification
│       │   ├── gemini/         # AI disposal guidance
│       │   ├── maps/           # Google Maps integration
│       │   └── places/         # Location search
│       ├── components/         # React components
│       ├── lib/                # Utilities & Firebase config
│       │   ├── firebase.js
│       │   ├── firebaseAdmin.js
│       │   └── firebaseFunctions/
│       ├── globals.css
│       ├── layout.jsx
│       └── page.jsx            # Landing page
├── public/                     # Static assets
├── .github/workflows/          # CI/CD configuration
├── Dockerfile
├── next.config.mjs
├── package.json
└── README.md
```

## Key Components

### Authentication Flow
- `(auth)/layout.jsx` - Protected route wrapper
- `(public)/login/page.jsx` - Login page
- `(public)/signup/page.jsx` - Registration page

### Core Features
- `components/NewItemClient.jsx` - Image upload & classification
- `components/UserDashboardClient.jsx` - Item management dashboard
- `components/ItemClientPage.jsx` - Detailed item view with maps

### API Routes
- `api/classification/route.jsx` - Hugging Face image classification
- `api/gemini/route.jsx` - AI-powered disposal guidance
- `api/places/route.jsx` - Google Places search
- `api/maps/route.jsx` - Google Maps directions

## Security

- Server-side token verification using Firebase Admin SDK
- Protected routes with middleware
- Secure cookie-based session management
- Environment variables for sensitive data
- CORS and security headers configured

## Deployment

The project includes a complete CI/CD pipeline using GitHub Actions:

1. **Automated Docker builds** on push to `main`
2. **Artifact Registry** storage
3. **Cloud Run** deployment with automatic scaling
4. **Secret management** through Google Cloud Secret Manager

See `.github/workflows/build-and-deploy.yaml` for details.

## Authors

- **Ethan Tiller** - [GitHub](https://github.com/ethantiller)
- **Maxwell Blevins** - [GitHub](https://github.com/MaxwellABlevins)
- **Nathan McClorey** - [GitHub](https://github.com/KnowWonNose)

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Hugging Face](https://huggingface.co/) - AI models
- [Google Cloud](https://cloud.google.com/) - Cloud infrastructure
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

Made with ♻️ by the TrashTalkers team

