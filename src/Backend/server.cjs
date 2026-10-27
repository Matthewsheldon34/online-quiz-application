const express = require('express');
const app = express();
const db = require('./db.cjs');
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://matthewsheldon34.github.io'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Health check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Create a new quiz
app.post('/api/quizzes', (req, res) => {
  const { title } = req.body;
  const result = db.prepare('INSERT INTO quizzes (title) VALUES (?)').run(title);
  res.status(201).json({ quizId: result.lastInsertRowid });
});

// Add a question to a quiz  ← fixed: /api prefix added
app.post('/api/quizzes/:id/questions', (req, res) => {
  const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;
  db.prepare(`
    INSERT INTO questions
      (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.params.id, question_text, option_a, option_b, option_c, option_d, correct_option);
  res.json({ success: true });
});

// Get quiz + questions (WITHOUT correct answers)
app.get('/api/quizzes/:id', (req, res) => {
  const quiz = db.prepare('SELECT id, title FROM quizzes WHERE id = ?').get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const questions = db.prepare(`
    SELECT id, question_text, option_a, option_b, option_c, option_d
    FROM questions WHERE quiz_id = ?
  `).all(req.params.id);

  res.json({ quiz, questions });
});

// Submit answers → server calculates score
app.post('/api/quizzes/:id/submit', (req, res) => {
  const { answers } = req.body;
  const questions = db.prepare(
    'SELECT id, correct_option FROM questions WHERE quiz_id = ?'
  ).all(req.params.id);

  let correct = 0;
  const review = questions.map(q => {
    const userAnswer = answers[q.id] || null;
    const isCorrect = userAnswer === q.correct_option;
    if (isCorrect) correct++;
    return {
      question_id: q.id,
      selected_option: userAnswer,
      correct_option: q.correct_option,
      isCorrect
    };
  });

  const total = questions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  res.json({ score, correct, total, review });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));