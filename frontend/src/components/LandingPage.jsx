export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-neo-green p-4 md:p-8 font-mono flex flex-col items-center justify-center gap-8">
      {/* Hero */}
      <div className="bg-neo-yellow border-4 border-black shadow-neo p-8 md:p-12 max-w-3xl w-full text-center">
        <span className="text-6xl">👺</span>
        <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter mt-4">
          JOB_GOBLIN
        </h1>
        <p className="text-xl md:text-2xl font-bold text-black mt-4">
          A multi-agent AI recruiting platform.
          <br />
          Our minions scour the web. You take the credit.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <div className="bg-white border-4 border-black shadow-neo p-6 md:p-8 max-w-3xl w-full">
        <h2 className="text-2xl font-black uppercase mb-6 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
          {[
            { icon: '🔍', label: 'Sourcing Agent', desc: 'Generates 25 candidates' },
            { icon: '🎯', label: 'Matching Agent', desc: 'Ranks with 0-100 scores' },
            { icon: '✍️', label: 'Pitch Writer', desc: 'Personalized emails' },
            { icon: '📤', label: 'Outreach Agent', desc: 'Sends the email' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-neo-pink border-3 border-black shadow-neo p-4 text-center min-w-[140px]">
                <div className="text-3xl">{step.icon}</div>
                <div className="font-black text-sm mt-1">{step.label}</div>
                <div className="text-xs mt-1">{step.desc}</div>
              </div>
              {i < 3 && <span className="text-2xl font-black hidden md:block">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
        {['FastAPI', 'Google Gemini', 'React', 'Tailwind CSS', 'SQLite'].map((tech) => (
          <span
            key={tech}
            className="bg-neo-blue border-3 border-black shadow-neo px-4 py-2 font-black text-sm uppercase"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onEnter}
        className="bg-neo-yellow border-4 border-black shadow-neo px-12 py-4 text-2xl font-black uppercase tracking-tight hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
      >
        Enter the App →
      </button>

      {/* Footer */}
      <p className="text-sm font-bold text-black/60">
        Built for Granola × DeepMind Hackathon
      </p>
    </div>
  );
}
