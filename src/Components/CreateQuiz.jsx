// pages/CreateQuiz.jsx
import { useState } from 'react';
import { api } from '../Backend/api';
import { useNavigate } from 'react-router';
const emptyQuestion = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: 'A',
};

export default function CreateQuiz() {
    const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [quizId, setQuizId] = useState(null);
  const [question, setQuestion] = useState(emptyQuestion);
  const [added, setAdded] = useState([]);
  const [error, setError] = useState('');

  const startQuiz = async () => {
    if (!title.trim()) {
      setError('Please enter a quiz title.');
      return;
    }
    setError('');
    const { quizId } = await api.createQuiz(title);
    setQuizId(quizId);
  };

  const updateField = (field, value) =>
    setQuestion(prev => ({ ...prev, [field]: value }));

  const addQuestion = async () => {
    if (!question.question_text.trim()) {
      setError('Question text is required.');
      return;
    }
    setError('');
    await api.addQuestion(quizId, question);
    setAdded(prev => [...prev, question.question_text]);
    setQuestion(emptyQuestion);
  };

  /* ---------- Step 1: Title ---------- */
  if (!quizId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Create a Quiz
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Give your quiz a title to get started
            </p>
          </div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Quiz title
          </label>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && startQuiz()}
            placeholder="e.g. JavaScript Fundamentals"
            autoFocus
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800
              placeholder:text-slate-400 outline-none transition-colors
              focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

          {error && (
            <p className="mt-3 text-sm text-rose-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}

          <button
            onClick={startQuiz}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
              font-semibold text-white bg-indigo-600 hover:bg-indigo-700
              shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
          >
            Start Adding Questions
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Step 2: Questions ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Add Questions
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Build your quiz — add as many questions as you like
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Question
          </label>
          <textarea
            value={question.question_text}
            onChange={e => { updateField('question_text', e.target.value); setError(''); }}
            placeholder="What is the capital of France?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800
              placeholder:text-slate-400 outline-none transition-colors resize-none
              focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

          {/* Options grid */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Options
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['a', 'b', 'c', 'd'].map(opt => {
                const key = opt.toUpperCase();
                const isCorrect = question.correct_option === key;
                return (
                  <div key={opt} className="relative">
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg
                        flex items-center justify-center text-xs font-bold pointer-events-none
                        transition-colors
                        ${isCorrect ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {key}
                    </span>
                    <input
                      value={question[`option_${opt}`]}
                      onChange={e => updateField(`option_${opt}`, e.target.value)}
                      placeholder={`Option ${key}`}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white text-slate-800
                        placeholder:text-slate-400 outline-none transition-colors
                        focus:ring-4 focus:ring-indigo-100
                        ${isCorrect ? 'border-indigo-400' : 'border-slate-200 focus:border-indigo-500'}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Correct option selector */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correct answer
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['A', 'B', 'C', 'D'].map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => updateField('correct_option', k)}
                  className={`py-2.5 rounded-xl font-semibold text-sm border-2 transition-all active:scale-95
                    ${question.correct_option === k
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-rose-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}

          <button
            onClick={addQuestion}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
              font-semibold text-white bg-indigo-600 hover:bg-indigo-700
              shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>

        {/* Added list */}
        {added.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm uppercase tracking-wider font-semibold text-slate-400">
                Added Questions
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                {added.length}
              </span>
            </div>
            <ul className="space-y-2">
              {added.map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white
                    flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-snug">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Finish button */}
        <button
          onClick={() => navigate(`/quiz/${quizId}`)}
          disabled={added.length === 0}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
            font-semibold text-white shadow-lg transition-all
            ${added.length === 0
              ? 'bg-slate-300 shadow-none cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 active:scale-95'
            }`}
        >
          Finish & Preview Quiz
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}