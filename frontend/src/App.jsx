import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.REACT_APP_API_URL|| "https://v98b-zhqg.vercel.app/api";

function App() {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [donation, setDonation] = useState('100');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}/questions`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !email.trim() || !donation.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    const questionData = {
      question: question.trim(),
      email: email.trim(),
      donation: parseFloat(donation)
    };

    setPendingQuestion(questionData);
    setShowAdModal(true);
    setLoading(false);
  };

  const handleAdWatched = async () => {
    if (!pendingQuestion) return;

    try {
      const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingQuestion),
      });

      if (response.ok) {
        setQuestion('');
        setEmail('');
        setDonation('100');
        setPendingQuestion(null);
        setShowAdModal(false);
        fetchQuestions();
        alert('Question submitted successfully!');
      } else {
        alert('Error submitting question');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Error submitting question');
    }
  };

  const closeAdModal = () => {
    setShowAdModal(false);
    setPendingQuestion(null);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const questionTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - questionTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return '1d ago';
  };

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="bg-yellow-400 text-center py-8 px-4 text-white">
        <div className="border-2 border-white inline-block px-8 py-4">
          <h1 className="text-3xl md:text-4xl font-bold">THE SOCIAL NETWORK</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className=" p-4 md:p-8 border-white">
        {/* Question Form */}
        <div className="bg-yellow-400 px-6 md:p-12 mb-12 flex justify-center items-center border-white">
          <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Send Question Online Button */}
            <button 
            onClick={handleSubmit}
              disabled={loading}
            className="w-full bg-gray-300 text-gray-700  py-10 px-6 rounded-md text-sm font-bold hover:bg-gray-400 transition-all duration-300 uppercase cursor-pointer disabled:cursor-not-allowed">
              {loading ? 'SENDING...' : 'Send my question online'}
            </button>



            {/* First Set of Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-bold mb-2 text-center uppercase">
                  Indicate your question for receive response
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="HOW MUCH IS A 3-ROOM APARTMENT WORTH"
                  required
                  className="w-full p-4 rounded-md bg-white  text-gray-700 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2 text-center uppercase">
                  Indicate your email for receive response
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="GUYET1@HOTMAIL.FR"
                  required
                  className="w-full p-4  bg-white rounded-md text-gray-700 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2 text-center uppercase">
                  Donations by PayPal that you will give for response
                </label>
                <input
                  type="text"
                  value={`${donation} $`}
                  onChange={(e) => setDonation(e.target.value.replace(' $', ''))}
                  placeholder="100 $"
                  required
                  className="w-full p-4  bg-white rounded-md text-center text-gray-700 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* "in majuscule" text */}
            <div className="text-left">
              <span className="text-red-600 font-bold text-sm">in majuscule</span>
            </div>

            {/* Second Set of Fields (Repeated) */}
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-bold mb-2 text-center uppercase">
                  Indicate your question for receive response
                </label>
                <input
                  type="text"
                  value={question.toUpperCase()}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="HOW MUCH IS A 3-ROOM APARTMENT WORTH"
                  required
                  className="w-full p-4 bg-white rounded-md text-gray-700 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2 text-center uppercase">
                  Indicate your email for receive response
                </label>
                <input
                  type="email"
                  value={email.toUpperCase()}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="GUYET1@HOTMAIL.FR"
                  required
                  className="w-full p-4 bg-white rounded-md text-gray-700 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2 text-center uppercase">
                  Donations by PayPal that you will give for response
                </label>
                <input
                  type="text"
                  value={`${donation} $`}
                  onChange={(e) => setDonation(e.target.value.replace(' $', ''))}
                  placeholder="100 $"
                  required
                  className="w-full p-4 bg-white rounded-md text-center text-gray-700 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            {/* <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-500 text-white py-4 px-8 rounded-full text-base font-bold cursor-pointer transition-all duration-300 hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT QUESTION'}
            </button> */}
          </div>
        </div>

        {/* Recent Questions */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">Recent Questions</h2>
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {questions.map((q, index) => (
              <div key={q._id} className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-l-4 border-yellow-400 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-yellow-400 text-gray-800 py-1 px-3 rounded-full text-sm font-semibold">
                    #{questions.length - index}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatTimeAgo(q.createdAt)}
                  </span>
                </div>
                <p className="mb-4 leading-relaxed text-gray-700">{q.question}</p>
                <p className="mb-4 leading-relaxed text-gray-700 flex items-center gap-2">
                  <span>{q.email}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(q.email)}
                    className="text-blue-500 text-sm hover:underline cursor-pointer"
                    title="Copy email"
                  >
                    Copy
                  </button>
                </p>
                <div className="flex justify-end">
                  <span className="bg-green-500 text-white py-2 px-3 rounded-lg font-semibold text-sm">
                    ${q.donation}
                  </span>
                </div>
                {/* Banner Ad Placeholder */}
                { (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500 italic">Advertisement</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-md w-11/12 text-center shadow-2xl">
            <h3 className="mb-6 text-gray-800 text-xl font-semibold">Watch Ad to Submit Question</h3>
            <div className="my-6">
              <div className="bg-gray-100 p-8 rounded-lg border-2 border-dashed border-gray-300">
                <p className="mb-2 text-gray-600">🎥 Mock Reward Video Ad</p>
                <p className="mb-2 text-gray-600">Watch this ad to submit your question</p>
                <div className="bg-yellow-400 text-gray-800 py-2 px-4 rounded-full text-sm font-semibold inline-block mt-4">
                  Advertisement - 5 seconds
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleAdWatched} 
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white border-none py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                Continue After Ad
              </button>
              <button 
                onClick={closeAdModal} 
                className="flex-1 bg-gray-600 text-white border-none py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:-translate-y-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;