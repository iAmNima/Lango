import { useState } from 'react';

const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

export default function App() {
  const [nativeLang, setNativeLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [plan, setPlan] = useState('');
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePlan = async () => {
    setLoading(true);
    setPlan('');
    setCards([]);
    setCurrentCard(0);
    setError('');
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful language tutor.' },
            {
              role: 'user',
              content: `Create a ${level.toLowerCase()} ${targetLang} learning plan for someone who knows ${nativeLang}.`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || 'No plan generated.';
      setPlan(text);
      const stepCards = text.split(/\n+/).filter((l) => l.trim().length);
      setCards(stepCards);
    } catch {
      setError('Failed to fetch plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Lango</h1>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">I speak</label>
          <select
            className="w-full border p-2 rounded"
            value={nativeLang}
            onChange={(e) => setNativeLang(e.target.value)}
          >
            <option value="" disabled>
              Select language
            </option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">I want to learn</label>
          <select
            className="w-full border p-2 rounded"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="" disabled>
              Select language
            </option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Level</label>
          <select
            className="w-full border p-2 rounded"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          onClick={generatePlan}
          disabled={loading || !nativeLang || !targetLang}
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {cards.length > 0 && (
          <div className="mt-4">
            <div className="border rounded p-4 shadow min-h-[100px] mb-4">
              {cards[currentCard]}
            </div>
            <div className="flex items-center justify-between text-sm">
              <button
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setCurrentCard((c) => c - 1)}
                disabled={currentCard === 0}
              >
                Previous
              </button>
              <span>
                {currentCard + 1} / {cards.length}
              </span>
              <button
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setCurrentCard((c) => c + 1)}
                disabled={currentCard === cards.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
