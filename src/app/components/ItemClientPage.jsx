"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ItemClientPage({ item, uid }) {
  const [embedUrl, setEmbedUrl] = useState(null);
  const router = useRouter();

  const handleLocationClick = async (address) => {
    if (!address) return;
    try {
      const response = await fetch('/api/maps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: item.userLocation,
          destination: address
        })
      });
      const data = await response.json();
      if (data.success && data.embedUrl) {
        setEmbedUrl(data.embedUrl);
      }
    } catch (error) { }
  };

  useEffect(() => {
    if (item?.recyclingLocations && item.recyclingLocations.length > 0) {
      const firstLocation = item.recyclingLocations[0];
      if (firstLocation?.address) {
        handleLocationClick(firstLocation.address);
      }
    }
  }, []);

  if (!item) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400 text-lg">Item not found.</p>
      </div>
    );
  }

  const createdAtDate = item.createdAt ? new Date(item.createdAt) : null;

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #09090b;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #27272a;
      border-radius: 10px;
      border: 2px solid #09090b;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #3f3f46;
    }
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #27272a #09090b;
    }
  `;

  let redemptionValue = item.redemptionValue || 0;
  if (typeof item.redemptionValue === 'number') {
    redemptionValue = item.redemptionValue;
  }
  let redemptionBorder = 'border-green-800/50';
  let redemptionText = 'text-green-400';
  if (redemptionValue < 0) {
    redemptionBorder = 'border-red-800/70';
    redemptionText = 'text-red-400';
  } else if (redemptionValue === 0) {
    redemptionBorder = 'border-zinc-700';
    redemptionText = 'text-zinc-400';
  }

  return (
    <div className="h-screen bg-black text-zinc-100 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <main className="h-full px-4 py-8 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex items-center mb-5">
              <button
                onClick={() => router.push(`/dashboard/${uid}`)}
                className="cursr-pointer flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-4xl font-bold flex-1 text-center">
                {item.itemName?.charAt(0).toUpperCase() + item.itemName?.slice(1)} Recycling
              </h1>
            </div>

            {item.itemPhoto && (
              <div className="w-full min-h-[200px] h-[300px] sm:h-[400px] lg:h-[450px] rounded-lg overflow-hidden border border-zinc-800 mb-5 flex items-center justify-center bg-zinc-950">
                <img
                  src={item.itemPhoto}
                  alt={item.itemName}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              </div>
            )}

            <div className="mb-6 min-h-[120px] max-h-70 sm:max-h-80 flex flex-col">
              <p className="text-zinc-400 mb-3 text-sm">Recycling Details:</p>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-lg overflow-y-auto custom-scrollbar">
                <p className="text-sm text-zinc-300">{item.itemDescription}</p>
              </div>
            </div>

            <div className={`from-green-900/30 to-emerald-900/20 border ${redemptionBorder} rounded-lg p-4 mb-5`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col items-start sm:items-start sm:w-1/2">
                  <p className="text-sm text-zinc-400 mb-1">Estimated Redemption Value</p>
                  <p className={`text-3xl font-bold ${redemptionText}`}>${redemptionValue.toFixed(2)}</p>
                  <p className="text-xs text-zinc-500 mt-1">per can in Ohio</p>
                </div>
                <div className="flex flex-row sm:flex-col gap-6 sm:gap-2 sm:w-1/2 items-start sm:items-end">
                  <div>
                    <p className="text-sm text-zinc-400">Result</p>
                    <p className={`text-lg font-semibold ${
                      item.itemWinOrLose === "Profitable"
                        ? "text-green-400"
                        : item.itemWinOrLose === "Neutral"
                          ? "text-zinc-400"
                          : "text-red-400"
                    }`}>
                      {item.itemWinOrLose}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Confidence</p>
                    <p className="text-lg font-semibold text-zinc-300">{(item.confidenceRating * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
            {createdAtDate && (
              <p className="text-xs text-zinc-500 mt-1">
                {createdAtDate.toLocaleString()}
              </p>
            )}
          </div>

          <div className="h-full flex flex-col gap-6 overflow-hidden">
            <div className="h-[60%] bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <p className="text-zinc-500">Click a location to see directions</p>
              )}
            </div>

            {Array.isArray(item.recyclingLocations) && item.recyclingLocations.length > 0 && (
              <section className="h-[40%] flex flex-col overflow-hidden">
                <h2 className="text-xl font-semibold mb-3">Recycling Locations</h2>
                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                  {item.recyclingLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleLocationClick(loc.address)}
                      className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/60 cursor-pointer hover:bg-zinc-800/60 transition-colors"
                    >
                      <p className="font-medium">{loc.name}</p>
                      <p className="text-sm text-zinc-400">{loc.address}</p>
                      <p className="text-xs text-zinc-500 mt-1"> Distance: {loc.distanceFromAddress?.toFixed?.(2)} km </p>
                      <p className="text-xs text-zinc-500">Coords: {loc.lat}, {loc.long} </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
