const CandidateCard = ({ candidate, match }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-neo-green';
    if (score >= 60) return 'bg-neo-yellow';
    return 'bg-neo-pink';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Weak Match';
  };

  return (
    <div className="bg-white border-4 border-black shadow-neo max-w-5xl w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Column: Profile Info */}
      <div className="flex-1 p-5 border-b-4 md:border-b-0 md:border-r-4 border-black">
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="text-3xl font-black text-black uppercase tracking-tight leading-none mb-3">{candidate.name}</h2>
          <div className="inline-block bg-black text-neo-yellow px-3 py-1.5 font-bold uppercase text-sm mb-3">
            {candidate.current_role} @ {candidate.current_company}
          </div>

          <div className="flex gap-2 mb-3">
            <div className="bg-neo-blue/20 border-2 border-black px-3 py-1 font-black text-xs uppercase">
              📅 {candidate.years_experience} YRS
            </div>
            <div className="bg-neo-pink/20 border-2 border-black px-3 py-1 font-black text-xs uppercase">
              📍 {candidate.location}
            </div>
          </div>

          {/* Social Links */}
          {(candidate.linkedin_url || candidate.company_website) && (
            <div className="flex gap-2">
              {candidate.linkedin_url && (
                <a
                  href={candidate.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-3 border-black bg-neo-blue px-3 py-1.5 shadow-neo hover:border-blue-700 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all font-black text-xs uppercase"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LINKEDIN
                </a>
              )}
              {candidate.company_website && (
                <a
                  href={candidate.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-3 border-black bg-white px-3 py-1.5 shadow-neo hover:border-gray-600 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all font-black text-xs uppercase"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  WEBSITE
                </a>
              )}
            </div>
          )}
        </div>

        {/* Skills and Summary Sections */}
        <div className="space-y-4">
          <section>
            <h3 className="font-black text-black mb-2 uppercase text-sm italic tracking-wide border-b-2 border-black inline-block">Technical Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {candidate.skills.map((skill, idx) => (
                <span key={idx} className="bg-white border-2 border-black px-2 py-1 font-bold text-xs uppercase hover:bg-neo-yellow transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-black text-black mb-2 uppercase text-sm italic tracking-wide border-b-2 border-black inline-block">Professional Summary</h3>
            <p className="font-bold text-black leading-relaxed text-xs mt-2 line-clamp-3">
              {candidate.linkedin_summary}
            </p>
          </section>
        </div>
      </div>

      {/* Right Column: AI Insights */}
      <div className="w-full md:w-72 bg-neo-green/5 p-5 flex flex-col gap-4">
        {/* Match Score */}
        <div className="text-center">
          <div className="font-black text-sm uppercase mb-2 tracking-wide">Match Intelligence</div>
          <div className={`${getScoreColor(match.score)} border-4 border-black text-black py-3 font-black text-4xl shadow-neo relative inline-block w-full max-w-[100px]`}>
            {match.score}
            <span className="absolute -top-2.5 -right-2.5 bg-black text-white text-[10px] px-1.5 py-0.5 border-2 border-white">FIT</span>
          </div>
          <p className="text-xs font-black text-black mt-2 uppercase tracking-wide">{getScoreLabel(match.score)}</p>
        </div>

        {/* Highlights */}
        <section>
          <h3 className="font-black text-black mb-2 uppercase text-sm tracking-wide">Agent Highlights</h3>
          <ul className="space-y-2">
            {match.key_highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2 group">
                <span className="bg-neo-green border-2 border-black px-1 font-black text-xs leading-tight mt-0.5 shrink-0">✓</span>
                <span className="font-bold text-black text-xs leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Assessment */}
        <section className="mt-auto">
          <div className="bg-white border-2 border-black p-3 shadow-neo-hover">
            <h4 className="font-black text-sm uppercase mb-2 opacity-60">Assessment</h4>
            <p className="font-bold text-black text-xs leading-relaxed italic line-clamp-3">"{match.fit_reasoning}"</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CandidateCard;