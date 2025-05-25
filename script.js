
let score = 0;
let correctAnswer = 0;

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

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
    alert(`Oops! The correct answer was ${correctAnswer}. Try the next one!`);
  }

  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('answer').value = '';
  generateQuestion();
}

generateQuestion();
