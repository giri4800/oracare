import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import * as firebaseFirestore from 'firebase/firestore';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAnalyses();
  }, [currentUser]);

  const fetchAnalyses = async () => {
    try {
      const analysesRef = firebaseFirestore.collection(db, 'analyses');
      const q = firebaseFirestore.query(
        analysesRef,
        firebaseFirestore.where('userId', '==', currentUser.uid),
        firebaseFirestore.orderBy('timestamp', 'desc')
      );

      const querySnapshot = await firebaseFirestore.getDocs(q);
      const analysesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleDateString()
      }));

      setAnalyses(analysesData);
    } catch (error) {
      setError('Failed to fetch analysis history');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (analysisId) => {
    try {
      await firebaseFirestore.deleteDoc(firebaseFirestore.doc(db, 'analyses', analysisId));
      setAnalyses(analyses.filter(analysis => analysis.id !== analysisId));
    } catch (error) {
      setError('Failed to delete analysis');
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">Analysis History</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No analysis history found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={analysis.imageUrl}
                  alt="Analysis"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-600">
                      {analysis.timestamp}
                    </div>
                    <button
                      onClick={() => deleteAnalysis(analysis.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Summary:</strong> {analysis.result.summary}</p>
                    <p><strong>Confidence:</strong> {analysis.result.confidence}%</p>
                    <div className="mt-2">
                      <strong>Recommendations:</strong>
                      <p className="text-gray-600">{analysis.result.recommendations}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 