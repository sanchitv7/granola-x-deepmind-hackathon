import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import JobForm from './components/JobForm';
import CandidateSwiper from './components/CandidateSwiper';

function App() {
  const [jobCreated, setJobCreated] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-neo-green p-4 font-mono">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="bg-neo-yellow border-4 border-black shadow-neo p-6 mb-8 transform -rotate-1">
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">
              🤖 AI RECRUITER
            </h1>
            <p className="text-xl font-bold text-black mt-2">
              Sourcing. Matching. Outreach. ALL AGENTIC.
            </p>
          </header>

          {/* Main Content */}
          <main>
            {!jobCreated ? (
              <JobForm onJobCreated={() => setJobCreated(true)} />
            ) : (
              <CandidateSwiper />
            )}
          </main>

          {/* Footer */}
          <footer className="bg-neo-blue border-4 border-black shadow-neo p-4 mt-12 text-center transform rotate-1">
            <p className="font-bold text-black uppercase">
              Powered by 4 AI Agents: Sourcing → Matching → Pitch Writing → Outreach
            </p>
          </footer>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;