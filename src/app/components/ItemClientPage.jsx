"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ItemClientPage({ item, uid }) {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [activeLocationIndex, setActiveLocationIndex] = useState(null);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const router = useRouter();

  const handleLocationClick = async (address, index) => {
    if (!address) return;
    setIsLoadingMap(true);
    setActiveLocationIndex(index);
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
    } catch (error) {
    } finally {
      setIsLoadingMap(false);
    }
  };

  const handleBackClick = () => {
    setIsNavigatingBack(true);
    router.push(`/dashboard/${uid}`);
  };

  useEffect(() => {
    if (item?.recyclingLocations && item.recyclingLocations.length > 0) {
      const firstLocation = item.recyclingLocations[0];
      if (firstLocation?.address) {
        handleLocationClick(firstLocation.address, 0);
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
    <div className="min-h-screen bg-black text-zinc-100">
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <main className="px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-screen lg:overflow-hidden">

          {/* Left Column */}
          <div className="flex flex-col lg:h-full lg:overflow-hidden">
            <div className="flex items-center mb-5">
              <button
                onClick={handleBackClick}
                disabled={isNavigatingBack}
                className="cursor-pointer flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigatingBack ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
              <h1 className="text-2xl sm:text-4xl font-bold flex-1 text-center">
                {item.itemName?.charAt(0).toUpperCase() + item.itemName?.slice(1)} Recycling
              </h1>
            </div>

            {item.itemPhoto && (
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-lg overflow-hidden border border-zinc-800 mb-5 flex items-center justify-center bg-zinc-950">
                <img
                  src={item.itemPhoto}
                  alt={item.itemName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mb-6 flex flex-col">
              <p className="text-zinc-400 mb-3 text-sm">Recycling Details:</p>
              <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-lg max-h-[200px] lg:max-h-[280px] overflow-y-auto custom-scrollbar">
                <p className="text-sm text-zinc-300">{item.itemDescription}</p>
              </div>
            </div>

            <div className={`border ${redemptionBorder} rounded-lg p-4 mb-5`}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm text-zinc-400 mb-1">Estimated Redemption Value</p>
                  <p className={`text-3xl font-bold ${redemptionText}`}>${redemptionValue.toFixed(2)}</p>
                  <p className="text-xs text-zinc-500 mt-1">per can in Ohio</p>
                </div>
                <div className="flex flex-row gap-6 items-start">
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
              <p className="text-xs text-zinc-500 mt-1 mb-8 lg:mb-0">
                {createdAtDate.toLocaleString()}
              </p>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 lg:h-full lg:overflow-hidden">
            <div className="h-[400px] lg:h-[60%] bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative">
              {isLoadingMap && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-10">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-zinc-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm text-zinc-400">Loading directions...</p>
                  </div>
                </div>
              )}
              {embedUrl && !isLoadingMap ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : !isLoadingMap ? (
                <p className="text-zinc-500">Click a location to see directions</p>
              ) : null}
            </div>

            {Array.isArray(item.recyclingLocations) && item.recyclingLocations.length > 0 && (
              <section className="flex flex-col pb-8 lg:pb-0 lg:h-[40%] lg:overflow-hidden">
                <h2 className="text-xl font-semibold mb-3">Recycling Locations</h2>
                <div className="space-y-3 lg:overflow-y-auto pr-2 custom-scrollbar">
                  {item.recyclingLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleLocationClick(loc.address, idx)}
                      className={`border rounded-lg p-3 cursor-pointer transition-all relative ${
                        activeLocationIndex === idx && !isLoadingMap
                          ? 'border-zinc-600 bg-zinc-800/80'
                          : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60'
                      } ${isLoadingMap && activeLocationIndex === idx ? 'opacity-60' : ''}`}
                    >
                      {isLoadingMap && activeLocationIndex === idx && (
                        <div className="absolute right-3 top-3">
                          <svg className="animate-spin h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                      <p className="font-medium">{loc.name}</p>
                      <p className="text-sm text-zinc-400">{loc.address}</p>
                      <p className="text-xs text-zinc-500 py-1">Coords: {loc.lat.toFixed(2)}, {loc.long.toFixed(2)} </p>
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
