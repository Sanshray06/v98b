import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-t-4 border-red-500">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Site Temporarily Closed
          </h1>

          {/* Message */}
          <div className="space-y-4 text-gray-600 mb-8">
            <p className="text-lg leading-relaxed">
              We regret to inform you that <strong>THE SOCIAL NETWORK</strong> is temporarily unavailable.
            </p>
            
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="font-semibold text-red-800 mb-2">
                Reason for Closure:
              </p>
              <p className="text-red-700">
                Due to non-payment issues with our development team, we have had to temporarily suspend all services until further notice.
              </p>
            </div>

            <p className="text-base">
              We are working diligently to resolve this matter and restore full functionality as soon as possible. We apologize for any inconvenience this may cause.
            </p>
          </div>

          {/* Status Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Current Status
            </h3>
            <ul className="text-yellow-700 space-y-2 text-left">
              <li>• All question submissions are suspended</li>
              <li>• User accounts are temporarily inaccessible</li>
              <li>• Payment processing is disabled</li>
              <li>• Email notifications are paused</li>
            </ul>
          </div>

          {/* Expected Resolution */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-800 mb-3">
              Expected Resolution
            </h3>
            <p className="text-blue-700">
              We anticipate resolving these issues within the next few business days. 
              Please check back soon for updates on our service restoration.
            </p>
          </div>

          

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Thank you for your patience and understanding during this temporary closure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;