import "./globals.css";

export const metadata = {
  metadataBase: new URL(
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://trashtalkers.tech'
  ),
  title: "TrashTalkers.tech | Recycle Smarter",
  description:
    "TrashTalkers.tech helps you identify recyclable items and find nearby recycling locations. Know where it goes and make a difference!",
  keywords: [
    "recycling",
    "trash",
    "waste management",
    "sustainability",
    "environment",
    "recyclable items",
    "recycling locations",
    "eco-friendly",
    "green living",
    "waste reduction",
    "TrashTalkers",
    "recycle app",
    "zero waste"
  ],
  icons: {
    icon: [
      { url: "/trashtalk.png", type: "image/png" },
    ],
    apple: [
      { url: "/trashtalk.png", type: "image/png" },
    ]
  },
  openGraph: {
    title: "TrashTalkers.tech | Recycle Smarter",
    description:
      "Identify recyclable items and find recycling locations near you with TrashTalkers.tech. Know where it goes!",
    url: "https://trashtalkers.tech",
    siteName: "TrashTalkers.tech",
    images: [
      {
        url: "/trashtalk-og.png",
        width: 1200,
        height: 630,
        alt: "TrashTalkers - Recycle Smarter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrashTalkers.tech | Recycle Smarter",
    description:
      "Identify recyclable items and find recycling locations near you with TrashTalkers.tech. Know where it goes!",
    images: ["/trashtalk-og.png"],
    creator: "@TrashTalkersApp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
