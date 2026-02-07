import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import JobForm from './components/JobForm';
import CandidateSwiper from './components/CandidateSwiper';

function App() {
  const [jobCreated, setJobCreated] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-neo-green p-4 md:p-8 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <header className="bg-neo-yellow border-4 border-black shadow-neo p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👺</span>
              <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">
                JOB_GOBLIN
              </h1>
            </div>
            <p className="text-xl font-bold text-black mt-2">
              Our minions scour the web. You take the credit.
            </p>
          </header>

          {/* Main Content */}
          <main className="min-h-0">
            {!jobCreated ? (
              <JobForm onJobCreated={() => setJobCreated(true)} />
            ) : (
              <CandidateSwiper />
            )}
          </main>

          {/* Footer */}
          <footer className="bg-neo-blue border-4 border-black shadow-neo p-4 text-center">
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