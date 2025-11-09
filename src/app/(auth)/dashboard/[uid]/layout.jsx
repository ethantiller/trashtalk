export const metadata = {
    metadataBase: new URL(
        typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://trashtalkers.tech'
    ),
    title: "Dashboard | TrashTalkers.tech",
    description:
        "Upload items to your TrashTalkers dashboard and view them later to see recycling information.",
    keywords: [
        "dashboard",
        "user profile",
        "recycling stats",
        "TrashTalkers",
        "recycling",
        "eco-friendly",
        "waste management",
        "sustainability",
        "recycling locations",
        "green living",
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
        title: "Dashboard | TrashTalkers.tech",
        description:
            "Upload items and view them later to see recycling information on your TrashTalkers dashboard.",
        url: "https://trashtalkers.tech/dashboard",
        siteName: "TrashTalkers.tech",
        images: [
            {
                url: "/trashtalk-og.png",
                width: 1200,
                height: 630,
                alt: "TrashTalkers Dashboard",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Dashboard | TrashTalkers.tech",
        description:
            "Upload items and view them later to see recycling information on your TrashTalkers dashboard.",
        images: ["/trashtalk-og.png"],
        creator: "@TrashTalkersApp",
    },
};
import { getAdminAuth } from "@/app/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserLayout({ children, params }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseToken")?.value;

    if (!token) {
        redirect("/login");
    }

    let decodedToken;
    try {
    decodedToken = await getAdminAuth().verifyIdToken(token);
    } catch (err) {
        redirect("/login");
    }

    const { uid: requestedUid } = await params;
    const loggedInUid = decodedToken.uid;

    if (requestedUid && loggedInUid && requestedUid !== loggedInUid) {
        redirect(`/dashboard/${loggedInUid}`);
    }

    return <>{children}</>;
}
