'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import Image from 'next/image';

export default function UserDashboardClient({ userId, initialItems = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    // Ensure items is always an array
    const [items, setItems] = useState(Array.isArray(initialItems) ? initialItems : []);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const router = useRouter();

    const handleAddItem = () => {
        router.push(`/dashboard/${userId}/newitem`);
    };

    const handleItemClick = (itemHash) => {
        router.push(`/dashboard/${userId}/items/${itemHash}`);
    };

    const handleLogout = async () => {
        deleteCookie('firebaseToken');
        router.push('/login');
    };

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    // Filter and sort items
    const safeItems = Array.isArray(items) ? items : [];
    const filteredItems = safeItems.filter(item =>
        item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemDescription?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'a-z':
                return a.itemName.localeCompare(b.itemName);
            case 'z-a':
                return b.itemName.localeCompare(a.itemName);
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-black">
            {/* Navbar */}
            <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & App Name */}
                        <button
                            onClick={() => router.push(`/dashboard/${userId}`)}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <Image
                                src="/trashtalk.png"
                                alt="App Logo"
                                width={24}
                                height={24}
                            />
                            <span className="text-white font-semibold text-lg hidden sm:block">
                                Your App
                            </span>
                        </button>

                        {/* Profile Avatar with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={handleProfileClick}
                                className="cursor-pointer w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-all hover:ring-2 hover:ring-zinc-500 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            >
                                <Image
                                    src="/user-icon.png"
                                    alt="User Avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-full invert"
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg py-1">
                                    <button
                                        onClick={() => {
                                            router.push(`/dashboard/${userId}/settings`);
                                            setShowProfileMenu(false);
                                        }}
                                        className="cursor-pointer w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                                    >
                                        Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push(`/dashboard/${userId}/profile`);
                                            setShowProfileMenu(false);
                                        }}
                                        className="cursor-pointer w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                                    >
                                        Profile
                                    </button>
                                    <div className="border-t border-zinc-800 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h1 className="text-3xl font-bold text-white">Your Items</h1>

                        {/* Search & Sort */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                            />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent cursor-pointer"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="a-z">A-Z</option>
                                <option value="z-a">Z-A</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Add Item Card */}
                    <button
                        onClick={handleAddItem}
                        className="group bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg p-8 hover:border-zinc-500 hover:bg-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-600 cursor-pointer min-h-[340px] flex flex-col items-center justify-center"
                    >
                        <div className="bg-zinc-800 rounded-lg w-full aspect-video mb-6 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                            <span className="w-20 h-20 flex items-center justify-center text-7xl text-zinc-600 group-hover:text-zinc-500 select-none">
                                +
                            </span>
                        </div>
                        <p className="text-zinc-400 font-medium group-hover:text-zinc-300 text-lg">
                            Add image
                        </p>
                        <p className="text-zinc-600 text-base mt-2">Upload a new item</p>
                    </button>

                    {/* Existing Items */}
                    {sortedItems.map((item) => (
                        <div
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleItemClick(item.itemHash)}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(item.itemHash); }}
                            className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/50 transition-all cursor-pointer text-left focus:outline-none"
                        >
                            {/* Image */}
                            <div className="bg-zinc-800 w-full aspect-video flex items-center justify-center overflow-hidden">
                                {item.itemPhoto ? (
                                    <img
                                        src={item.itemPhoto}
                                        alt={item.itemName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full from-zinc-700 to-zinc-800 flex items-center justify-center">
                                        <svg
                                            className="w-16 h-16 text-zinc-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-white font-semibold text-lg group-hover:text-zinc-200">
                                        {item.itemName}
                                    </h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Menu clicked for item:', item.id);
                                        }}
                                        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-zinc-600 rounded"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-zinc-400 text-sm line-clamp-2">
                                    {item.itemDescription}
                                </p>
                                <p className="text-zinc-600 text-xs mt-3">
                                    {new Date(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {sortedItems.length === 0 && items.length === 0 && (
                    <div className="text-center py-12">
                        <Image
                            src="/inbox.png"
                            alt="No items"
                            width={64}
                            height={64}
                            className="mx-auto mb-4 opacity-70"
                        />
                        <p className="text-zinc-400 text-lg">No items yet</p>
                        <p className="text-zinc-600 text-sm mt-2">
                            Click the "Add image" card to create your first item
                        </p>
                    </div>
                )}

                {/* No Search Results */}
                {sortedItems.length === 0 && items.length > 0 && (
                    <div className="text-center py-12">
                        <svg
                            className="w-16 h-16 text-zinc-700 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <p className="text-zinc-400 text-lg">No items found</p>
                        <p className="text-zinc-600 text-sm mt-2">
                            Try adjusting your search query
                        </p>
                    </div>
                )}
            </main>

            {/* Click outside to close profile menu */}
            {showProfileMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                ></div>
            )}
        </div>
    );
}
