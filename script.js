let score = 0;
let correctAnswer = 0;
let currentUser = null;

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

function login() {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert("Username is required.");
  currentUser = username;

  document.getElementById('auth').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  score = 0;
  updateScore();
  generateQuestion();
  showLeaderboard();
}

function generateQuestion() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  document.getElementById('question').textContent = `${num1} ${op} ${num2}`;
  correctAnswer = eval(`${num1}${op}${num2}`);
}

function submitAnswer() {
  const userAnswer = parseInt(document.getElementById('answer').value);
  const feedback = document.getElementById('feedback');

  if (userAnswer === correctAnswer) {
    feedback.textContent = "✅ Correct!";
    correctSound.play();
    score++;
  } else {
    feedback.textContent = `❌ Wrong! Correct answer: ${correctAnswer}`;
    wrongSound.play();
    alert(`Oops! The correct answer was ${correctAnswer}`);
  }

  updateScore();
  updateLeaderboard();
  generateQuestion();
}

function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

function updateLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard = leaderboard.filter(entry => entry.name !== currentUser);
  leaderboard.push({ name: currentUser, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  showLeaderboard();
}

function showLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  document.getElementById('leaderboard').innerHTML = leaderboard.map(entry =>
    `<li>${entry.name}: ${entry.score}</li>`).join('');
}
