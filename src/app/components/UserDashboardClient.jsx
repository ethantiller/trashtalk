'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import Image from 'next/image';
import { deleteItemFromUser } from '../lib/firebaseFunctions/firebaseDB/firebaseDBHelpers';

export default function UserDashboardClient({ userId, initialItems = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [items, setItems] = useState(Array.isArray(initialItems) ? initialItems : []);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [deletingItemId, setDeletingItemId] = useState(null);
    const router = useRouter();

    const handleAddItem = () => router.push(`/dashboard/${userId}/newitem`);
    const handleItemClick = (itemHash) => router.push(`/dashboard/${userId}/items/${itemHash}`);
    const handleLogout = async () => {
        deleteCookie('firebaseToken');
        router.push('/login');
    };

    const handleDeleteItem = async (e, itemHash, itemId) => {
        e.stopPropagation();
        setDeletingItemId(itemId);
        try {
            await deleteItemFromUser(userId, itemHash);
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
        } finally {
            setDeletingItemId(null);
        }
    };

    const safeItems = Array.isArray(items) ? items : [];
    const filteredItems = safeItems.filter(item =>
        item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemDescription?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
            case 'a-z': return a.itemName.localeCompare(b.itemName);
            case 'z-a': return b.itemName.localeCompare(a.itemName);
            default: return 0;
        }
    });

    return (
        <div className="min-h-screen bg-black" style={{ fontFamily: "'Zalando Sans SemiExpanded', sans-serif" }}>
            <nav className="border-b border-zinc-800/50 backdrop-blur-xl bg-black/50 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
                    <button
                        onClick={() => window.open('https://github.com/ethantiller/trashtalk', '_blank')}
                        className="cursor-pointer flex items-center gap-2 hover:opacity-70 transition-opacity"
                    >
                        <span className="text-white font-bold text-lg">TrashTalkers.tech</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="cursor-pointer w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center"
                        >
                            <span className="text-white font-semibold">TT</span>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-zinc-800 transition-colors"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-white">Your Items</h1>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 w-40"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="a-z">A-Z</option>
                            <option value="z-a">Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {/* Add Item Card */}
                    <button
                        onClick={handleAddItem}
                        className="cursor-pointer group bg-zinc-900/50 border border-dashed border-zinc-800 rounded-lg p-4 hover:border-zinc-700 hover:bg-zinc-900 transition-all min-h-[200px] flex flex-col items-center justify-center"
                    >
                        <div className="bg-zinc-800/50 rounded-lg w-full aspect-video mb-3 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                            <span className="text-4xl text-zinc-600 group-hover:text-zinc-500">+</span>
                        </div>
                        <p className="text-zinc-500 text-xs group-hover:text-zinc-400">Add image</p>
                    </button>

                    {/* Existing Items */}
                    {sortedItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item.itemHash)}
                            className="group bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer relative"
                        >
                            {/* Delete Button */}
                            <button
                                onClick={(e) => handleDeleteItem(e, item.itemHash, item.id)}
                                disabled={deletingItemId === item.id}
                                className="cursor-pointer absolute top-2 right-2 z-10 w-7 h-7 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete item"
                            >
                                {deletingItemId === item.id ? (
                                    <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </button>
                            <div className="bg-zinc-800/50 w-full aspect-video flex items-center justify-center overflow-hidden">
                                {item.itemPhoto ? (
                                    <img src={item.itemPhoto} alt={item.itemName} className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="text-white font-medium text-sm truncate mb-1">{item.itemName}</h3>
                                <p className="text-zinc-500 text-xs line-clamp-2 mb-2">{item.itemDescription}</p>
                                <p className="text-zinc-600 text-xs">
                                    {new Date(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {sortedItems.length === 0 && items.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-zinc-400 text-sm">No items yet</p>
                        <p className="text-zinc-600 text-xs mt-1">Click "Add image" to get started</p>
                    </div>
                )}

                {/* No Search Results */}
                {sortedItems.length === 0 && items.length > 0 && (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-zinc-400 text-sm">No items found</p>
                        <p className="text-zinc-600 text-xs mt-1">Try a different search</p>
                    </div>
                )}
            </main>

            {/* Click outside to close menu */}
            {showProfileMenu && <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>}
        </div>
    );
}
