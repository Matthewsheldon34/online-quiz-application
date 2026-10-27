const BASE = 'https://online-quiz-application-h4lj.onrender.com/api';

export const api = {
  createQuiz: (title) =>
    fetch(`${BASE}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    }).then(r => r.json()),

  addQuestion: (quizId, question) =>
    fetch(`${BASE}/quizzes/${quizId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question)
    }).then(r => r.json()),

  getQuiz: (quizId) =>
    fetch(`${BASE}/quizzes/${quizId}`).then(r => r.json()),

  submitQuiz: (quizId, answers) =>
    fetch(`${BASE}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    }).then(r => r.json())
};