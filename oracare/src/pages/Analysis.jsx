import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { storage, db } from '../services/firebase';
import * as firebaseStorage from 'firebase/storage';
import * as firebaseFirestore from 'firebase/firestore';
import Webcam from 'react-webcam';

export default function Analysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const webcamRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError('');
      } else {
        setError('Please select an image file');
      }
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
          setSelectedFile(file);
          setPreviewUrl(imageSrc);
          setShowCamera(false);
        });
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError('Please select or capture an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload image to Firebase Storage
      const storageRef = firebaseStorage.ref(storage, `analysis/${currentUser.uid}/${Date.now()}_${selectedFile.name}`);
      const snapshot = await firebaseStorage.uploadBytes(storageRef, selectedFile);
      const imageUrl = await firebaseStorage.getDownloadURL(snapshot.ref);

      // Call Anthropic API for analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);

      // Store result in Firestore
      await firebaseFirestore.addDoc(firebaseFirestore.collection(db, 'analyses'), {
        userId: currentUser.uid,
        imageUrl,
        result: result,
        timestamp: firebaseFirestore.serverTimestamp(),
      });

    } catch (error) {
      setError('Failed to analyze image. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Oral Health Analysis</h2>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                {!showCamera ? (
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setShowCamera(true)}
                        className="btn btn-secondary"
                      >
                        Use Camera
                      </button>
                      <label className="btn btn-primary">
                        Upload Image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>

                    {previewUrl && (
                      <div className="mt-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg"
                    />
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={captureImage}
                        className="btn btn-primary"
                      >
                        Capture
                      </button>
                      <button
                        onClick={() => setShowCamera(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {selectedFile && !analysisResult && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={analyzeImage}
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Image'}
                    </button>
                  </div>
                )}

                {analysisResult && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Analysis Results</h3>
                    <div className="space-y-2">
                      <p><strong>Summary:</strong> {analysisResult.summary}</p>
                      <p><strong>Confidence Score:</strong> {analysisResult.confidence}%</p>
                      <p><strong>Recommendations:</strong> {analysisResult.recommendations}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}