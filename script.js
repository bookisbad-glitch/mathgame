
let score = 0;
let correctAnswer = 0;
let currentUser = null;
let streakCount = 0;
let timerInterval;
let timeLeft = 10;
let difficulty = "easy";

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

function login() {
  const username = document.getElementById('username').value.trim();
  difficulty = document.getElementById('difficulty').value;
  if (!username) return alert("Username is required.");
  currentUser = username;
  document.getElementById('auth').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  score = 0;
  streakCount = 0;
  updateScore();
  generateQuestion();
  showLeaderboard();
}

function getRange() {
  if (difficulty === "easy") return [1, 10];
  if (difficulty === "medium") return [10, 50];
  return [50, 100];
}

function generateQuestion() {
  const [min, max] = getRange();
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  document.getElementById('question').textContent = `${num1} ${op} ${num2}`;
  correctAnswer = eval(`${num1}${op}${num2}`);
  resetTimer();
}

function submitAnswer() {
  const userAnswer = parseInt(document.getElementById('answer').value);
  const feedback = document.getElementById('feedback');
  clearInterval(timerInterval);

  if (userAnswer === correctAnswer) {
    feedback.textContent = "✅ Correct!";
    correctSound.play();
    score++;
    streakCount++;
  } else {
    feedback.textContent = `❌ Wrong! Correct answer: ${correctAnswer}`;
    wrongSound.play();
    streakCount = 0;
    alert(`Oops! The correct answer was ${correctAnswer}`);
  }

  updateScore();
  updateLeaderboard();
  updateStreakAndBadge();
  generateQuestion();
}

function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

function updateStreakAndBadge() {
  document.getElementById('streak').textContent = streakCount >= 3 ? `🔥 ${streakCount} correct in a row!` : "";
  const badge = document.getElementById('badge');
  if (score >= 50) badge.textContent = "🏅 Gold Badge";
  else if (score >= 20) badge.textContent = "🥈 Silver Badge";
  else if (score >= 10) badge.textContent = "🥉 Bronze Badge";
  else badge.textContent = "";
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

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;
  document.getElementById('timer').textContent = `Time Left: ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      wrongSound.play();
      streakCount = 0;
      alert("⏰ Time's up!");
      updateLeaderboard();
      updateStreakAndBadge();
      generateQuestion();
    }
  }, 1000);
}
