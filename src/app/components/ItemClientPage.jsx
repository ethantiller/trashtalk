"use client";

export default function ItemClientPage({ item }) {
  if (!item) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-400 text-lg">Item not found.</p>
      </div>
    );
  }

  // createdAt is always an ISO string or missing
  const createdAtDate = item.createdAt ? new Date(item.createdAt) : null;

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{item.itemName}</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Hash: <span className="font-mono">{item.itemHash}</span>
        </p>

        {/* Image */}
        {item.itemPhoto && (
          <div className="mb-6 rounded-lg overflow-hidden border border-zinc-800">
            <img
              src={item.itemPhoto}
              alt={item.itemName}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Basic info */}
        <section className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">Details</h2>
          <p className="text-zinc-300">{item.itemDescription}</p>
          <p className="text-sm text-zinc-400">
            Result:{" "}
            <span className={item.itemWinOrLose === "win" ? "text-green-400" : "text-red-400"}>
              {item.itemWinOrLose}
            </span>
          </p>
          {createdAtDate && (
            <p className="text-sm text-zinc-500">
              Created: {createdAtDate.toLocaleString()}
            </p>
          )}
          <p className="text-sm text-zinc-500">
            Confidence rating: <span className="font-medium">{item.confidenceRating}</span>
          </p>
        </section>

        {/* Recycling locations */}
        {Array.isArray(item.recyclingLocations) && item.recyclingLocations.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Recycling Locations</h2>
            <ul className="space-y-3">
              {item.recyclingLocations.map((loc, idx) => (
                <li
                  key={idx}
                  className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/60"
                >
                  <p className="font-medium">{loc.name || ''}</p>
                  <p className="text-sm text-zinc-400">{loc.address || ''}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Distance: {typeof loc.distanceFromAddress === 'number' ? loc.distanceFromAddress.toFixed(2) : ''} km
                  </p>
                  <p className="text-xs text-zinc-500">
                    Coords: {loc.lat ?? ''}, {loc.long ?? ''}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Debug / raw data (optional) */}
        {/* <pre className="mt-8 text-xs text-zinc-400 bg-zinc-900 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(item, null, 2)}
        </pre> */}
      </main>
    </div>
  );
}
