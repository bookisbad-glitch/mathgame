let score = 0;
let correctAnswer = 0;
let currentUser = null;
let streakCount = 0;
let timerInterval;
let timeLeft = 10;
let difficulty = "easy";
let mode = "endless";

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

function playSound(sound) {
  if (document.getElementById('soundToggle').checked) {
    sound.play();
  }
}

function login() {
  const username = document.getElementById('username').value.trim();
  difficulty = document.getElementById('difficulty').value;
  mode = document.getElementById('mode').value;
  if (!username) return alert("Username is required.");
  currentUser = username;
  document.getElementById('auth').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  score = 0;
  streakCount = 0;
  updateScore();
  generateQuestion();
  showLeaderboard();
  updateStats();

  if (mode === "timed") {
    document.getElementById("progressBar").style.display = "inline-block";
    let time = 0;
    let bar = document.getElementById("progressBar");
    bar.value = 0;
    let interval = setInterval(() => {
      bar.value = ++time;
      if (time >= 60) {
        clearInterval(interval);
        alert("⏰ Time's up! Final score: " + score);
        location.reload();
      }
    }, 1000);
  } else {
    document.getElementById("progressBar").style.display = "none";
  }
}

function getRange() {
  if (difficulty === "easy") return [1, 10];
  if (difficulty === "medium") return [10, 50];
  return [50, 100];
}

function getOperations() {
  const ops = [];
  if (document.getElementById('add').checked) ops.push('+');
  if (document.getElementById('sub').checked) ops.push('-');
  if (document.getElementById('mul').checked) ops.push('*');
  return ops.length ? ops : ['+'];
}

function generateQuestion() {
  const [min, max] = getRange();
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  const ops = getOperations();
  const op = ops[Math.floor(Math.random() * ops.length)];
  document.getElementById('question').textContent = `${num1} ${op} ${num2}`;
  correctAnswer = eval(`${num1}${op}${num2}`);
  resetTimer();
}

function submitAnswer() {
  const userAnswer = Number(document.getElementById('answer').value);
  document.getElementById('answer').value = '';
  const feedback = document.getElementById('feedback');
  clearInterval(timerInterval);

  let stats = JSON.parse(localStorage.getItem("stats_" + currentUser)) || {
    games: 0, questions: 0, bestStreak: 0
  };
  stats.questions++;

  if (userAnswer === correctAnswer) {
    feedback.textContent = "✅ Correct!";
    playSound(correctSound);
    score++;
    streakCount++;
    if (streakCount > stats.bestStreak) stats.bestStreak = streakCount;
  } else {
    feedback.textContent = `❌ Wrong! Correct answer: ${correctAnswer}`;
    playSound(wrongSound);
    streakCount = 0;
    if (mode === "sudden") {
      alert("❌ Game Over! You made one mistake.");
      localStorage.setItem("stats_" + currentUser, JSON.stringify(stats));
      location.reload();
      return;
    } else {
      alert(`Oops! The correct answer was ${correctAnswer}`);
    }
  }

  localStorage.setItem("stats_" + currentUser, JSON.stringify(stats));
  updateScore();
  updateLeaderboard();
  updateStreakAndBadge();
  generateQuestion();
  showStats();
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
      playSound(wrongSound);
      streakCount = 0;
      alert("⏰ Time's up!");
      updateLeaderboard();
      updateStreakAndBadge();
      generateQuestion();
    }
  }, 1000);
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
  let found = leaderboard.find(entry => entry.name === currentUser);
  if (!found || score > found.score) {
    leaderboard = leaderboard.filter(entry => entry.name !== currentUser);
    leaderboard.push({ name: currentUser, score });
  }
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

function updateStats() {
  let stats = JSON.parse(localStorage.getItem("stats_" + currentUser)) || {
    games: 0, questions: 0, bestStreak: 0
  };
  stats.games++;
  localStorage.setItem("stats_" + currentUser, JSON.stringify(stats));
  showStats();
}

function showStats() {
  let stats = JSON.parse(localStorage.getItem("stats_" + currentUser)) || {
    games: 0, questions: 0, bestStreak: 0
  };
  document.getElementById("stats").textContent =
    `📊 Games: ${stats.games} | Best Streak: ${stats.bestStreak}`;
}
