import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { api } from '../Backend/api';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getQuiz(id).then(data => {
      setQuestions(data.questions);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Quiz not found</h2>
          <p className="text-slate-500">The quiz you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const selectOption = (questionId, key) => {
    setAnswers(prev => ({ ...prev, [questionId]: key }));
    setError('');
  };

  const next = async () => {
    if (!answers[current.id]) {
      setError('Please select an answer before continuing.');
      return;
    }
    if (!isLast) {
      setCurrentIndex(i => i + 1);
    } else {
      const result = await api.submitQuiz(id, answers);
      sessionStorage.setItem('quizResult', JSON.stringify(result));
      navigate('/result');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <ProgressBar current={currentIndex + 1} total={questions.length} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <QuestionCard
              question={current}
              selected={answers[current.id]}
              onSelect={selectOption}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="px-6 sm:px-8 pb-2">
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">
              {Object.keys(answers).length} of {questions.length} answered
            </span>
            <button
              onClick={next}
              className={`ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white
                transition-all duration-200 shadow-lg active:scale-95
                ${isLast
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 hover:shadow-emerald-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 hover:shadow-indigo-500/40'
                }`}
            >
              {isLast ? (
                <>
                  Submit
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}