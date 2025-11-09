'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUploadPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  const [placesResponse, setPlacesResponse] = useState([]);

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const processFile = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    setImage(null);
    setPreview(null);
    setPredictions([]);
    setSelectedPrediction('');
    setInput('');
    setGeminiResponse('');
  };

  const classifyImage = async () => {
    if (!image) return;

    setIsLoading(true);
    setPredictions([]);
    setSelectedPrediction('');

    try {
      const formData = new FormData();
      formData.append('image', image);

      const res = await fetch('/api/classification', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      if (data.success && Array.isArray(data.wastePredictions)) {
        setPredictions(data.wastePredictions);
        // Auto-select the first (highest confidence) prediction
        if (data.wastePredictions.length > 0) {
          setSelectedPrediction(data.wastePredictions[0].label);
        }
      } else {
        alert(`Error: ${data.error || 'Classification failed'}`);
      }
    } catch (err) {
      console.error('Classification error:', err);
      alert(`Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const submitToGemini = async () => {
    if (!input.trim() || !selectedPrediction) return;

    setIsLoading(true);

    // Get user location
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const geminiFormData = new FormData();
          const placesFormData = new FormData();
          geminiFormData.append('huggingfaceText', selectedPrediction);
          geminiFormData.append('userDescription', input);
          placesFormData.append('textQuery', `${selectedPrediction} recycling center`);
          placesFormData.append('latitude', position.coords.latitude);
          placesFormData.append('longitude', position.coords.longitude);

          const res = await fetch('/api/gemini', {
            method: 'POST',
            body: geminiFormData,
          });

          const resp = await fetch('/api/places', {
            method: 'POST',
            body: placesFormData,
          });

          let geminiResp, placesResp;
          // Handle Gemini response
          const geminiContentType = res.headers.get('content-type') || '';
          if (geminiContentType.includes('application/json')) {
            geminiResp = await res.json();
          } else {
            const text = await res.text();
            console.error('Gemini non-JSON response:', text);
            geminiResp = { answer: text };
          }
          // Handle Places response
          const placesContentType = resp.headers.get('content-type') || '';
          if (placesContentType.includes('application/json')) {
            placesResp = await resp.json();
          } else {
            const text = await resp.text();
            console.error('Places non-JSON response:', text);
            placesResp = { places: [] };
          }

          console.log('Gemini response:', geminiResp);
          console.log('Places response:', placesResp);
          setGeminiResponse(geminiResp.answer || 'No response');
          setPlacesResponse(placesResp.places || []);

          alert('Submission successful!');
        } catch (err) {
          console.error('Gemini error:', err);
          alert(`Failed: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        alert('Location access is required to submit. Please allow location access and try again.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/trashtalk.png"
                alt="App Logo"
                width={24}
                height={24}
              />
              <span className="text-white font-semibold text-lg">
                Trash Talk
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Upload Image</h2>
              <p className="text-zinc-400 text-sm">
                Upload an image to classify waste type
              </p>
            </div>

            {!preview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  isDragging
                    ? 'border-zinc-500 bg-zinc-800'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <div className="space-y-4">
                  <div className="text-zinc-400">
                    <p className="font-medium text-white mb-1">
                      Drag and drop your image here
                    </p>
                    <p className="text-sm">or click to browse</p>
                    <p className="text-xs mt-2 text-zinc-500">JPEG, PNG, WebP supported</p>
                  </div>

                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="inline-block bg-white text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors cursor-pointer">
                      Select File
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                    width={800}
                    height={600}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Image
                      src={preview}
                      alt="Thumbnail"
                      className="w-10 h-10 rounded object-cover"
                      width={40}
                      height={40}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{image?.name}</p>
                      {image && (
                        <p className="text-xs text-zinc-500">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleRemove}
                    className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <button
                  onClick={classifyImage}
                  disabled={isLoading}
                  className="cursor-pointer w-full bg-white text-black text-sm font-medium py-2.5 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Classify Image'}
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Classification Results</h2>
              <p className="text-zinc-400 text-sm">
                Select the correct classification
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 min-h-[200px]">
              {predictions.length > 0 ? (
                <div className="space-y-3">
                  {predictions.map((prediction, index) => (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all ${
                        selectedPrediction === prediction.label
                          ? 'bg-zinc-800 border-white'
                          : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="prediction"
                          value={prediction.label}
                          checked={selectedPrediction === prediction.label}
                          onChange={(e) => setSelectedPrediction(e.target.value)}
                          className="w-4 h-4 text-white bg-zinc-800 border-zinc-600 focus:ring-2 focus:ring-zinc-500"
                        />
                        <span className="text-sm font-medium text-white">
                          {prediction.label}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400">
                        {(prediction.score * 100).toFixed(1)}%
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  Upload and classify an image to see results...
                </p>
              )}
            </div>

            {predictions.length > 0 && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Add a description"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && submitToGemini()}
                />
                <button
                  onClick={submitToGemini}
                  disabled={!input.trim() || !selectedPrediction || isLoading}
                  className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
