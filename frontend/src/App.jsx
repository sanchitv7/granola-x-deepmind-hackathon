import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import JobForm from './components/JobForm';
import CandidateSwiper from './components/CandidateSwiper';

function App() {
  const [jobCreated, setJobCreated] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              🤖 AI Recruiter Assistant
            </h1>
            <p className="text-gray-600 mt-1">
              Instant candidate sourcing powered by AI agents
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8">
          {!jobCreated ? (
            <JobForm onJobCreated={() => setJobCreated(true)} />
          ) : (
            <CandidateSwiper />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
            Powered by 4 AI Agents: Sourcing → Matching → Pitch Writing → Outreach
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
