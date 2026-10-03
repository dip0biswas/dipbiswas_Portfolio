import React, { useEffect, useState } from 'react';

function Achievements({ data, page = false }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const apiBase = process.env.REACT_APP_API_URL
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '');

  const assetUrl = (url) => {
    if (!url || !url.startsWith('/api/')) return url;
    return `${apiBase}${url}`;
  };

  useEffect(() => {
    if (!selectedAchievement) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedAchievement(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedAchievement]);

  if (!data) return null;

  return (
    <>
      <main className={page ? 'min-h-screen bg-[#f7f5f1]' : 'bg-white py-5'}>
        <section className="max-w-7xl mx-auto px-4 pt-10 md:pt-14 pb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-semibold mb-3">Certificates & achievements</p>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900">Achievements</h1>
          <p className="mt-3 text-sm text-gray-600">A visual collection of certificates, awards, and accomplishments.</p>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {data.map((achievement) => {
              const imageUrl = assetUrl(achievement.image);
              const isPdf = /\.pdf(?:$|\?)/i.test(achievement.image || '');
              return (
                <button
                  key={achievement.id}
                  type="button"
                  onClick={() => setSelectedAchievement(achievement)}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-[0_10px_25px_rgba(17,17,17,0.06)] hover:-translate-y-1 transition"
                >
                  <div className="h-64 bg-[#f0f0f2] overflow-hidden flex items-center justify-center">
                    {imageUrl && isPdf ? (
                      <iframe src={`${imageUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`} title={achievement.title} className="pointer-events-none h-full w-full bg-white" />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt={achievement.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-5xl text-gray-300">★</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">{achievement.type || 'Achievement'} · {achievement.year}</p>
                    <h2 className="font-black text-gray-900 leading-tight">{achievement.title}</h2>
                    {achievement.description && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{achievement.description}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedAchievement(null)}>
          <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white md:grid-cols-[1.25fr_0.75fr]" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedAchievement(null)} className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-gray-900 text-white" aria-label="Close achievement details">×</button>
            <div className="min-h-[360px] bg-[#f0f0f2] p-4 md:p-6 flex items-center justify-center">
              {selectedAchievement.image && /\.pdf(?:$|\?)/i.test(selectedAchievement.image) ? (
                <iframe src={assetUrl(selectedAchievement.image)} title={selectedAchievement.title} className="h-[70vh] w-full bg-white" />
              ) : selectedAchievement.image ? (
                <img src={assetUrl(selectedAchievement.image)} alt={selectedAchievement.title} className="max-h-[70vh] max-w-full object-contain" />
              ) : <p className="text-gray-500">No certificate image uploaded.</p>}
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">{selectedAchievement.type || 'Achievement'}</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">{selectedAchievement.title}</h2>
              <p className="mt-4 text-sm text-gray-600"><strong>Year:</strong> {selectedAchievement.year || 'Not specified'}</p>
              {selectedAchievement.description && <p className="mt-4 text-sm text-gray-600 whitespace-pre-line">{selectedAchievement.description}</p>}
              {selectedAchievement.image && <a href={assetUrl(selectedAchievement.image)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">Open full certificate</a>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Achievements;
