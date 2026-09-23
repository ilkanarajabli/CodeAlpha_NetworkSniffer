// ===== QUIZ DATA =====
// Each question has text, answer options, and the index of the correct one
const quizQuestions = [
    {
        question: "You receive an email from 'support@paypa1.com' asking you to verify your account. What should you do?",
        options: [
            "Click the link immediately to avoid losing access",
            "Check the sender's address carefully and go to the official site directly",
            "Reply with your password to confirm your identity",
            "Forward it to a friend to ask what to do"
        ],
        correctIndex: 1
    },
    {
        question: "Which of these is a common sign of a phishing email?",
        options: [
            "A personalized greeting with your full name",
            "No spelling or grammar mistakes",
            "Urgent language demanding immediate action",
            "An email from a known, verified contact"
        ],
        correctIndex: 2
    },
    {
        question: "What does Two-Factor Authentication (2FA) help protect against?",
        options: [
            "Slow internet speed",
            "Unauthorized access even if your password is stolen",
            "Viruses on your computer",
            "Spam folder overflow"
        ],
        correctIndex: 1
    },
    {
        question: "A message says 'Your account will be suspended in 1 hour, click here now!' This is an example of:",
        options: [
            "A normal notification",
            "Social engineering using urgency",
            "A software update",
            "A billing confirmation"
        ],
        correctIndex: 1
    },
    {
        question: "What is the safest way to check if a link is legitimate?",
        options: [
            "Click it and see what happens",
            "Hover over it to preview the actual URL before clicking",
            "Ask the sender by replying to the same email",
            "Copy it into a search engine"
        ],
        correctIndex: 1
    }
];

// ===== STATE =====
let currentQuestionIndex = 0;
let score = 0;

// ===== RENDER A QUESTION =====
function renderQuestion() {
    const container = document.getElementById("quiz-container");
    const q = quizQuestions[currentQuestionIndex];

    let optionsHTML = "";
    q.options.forEach((option, index) => {
        optionsHTML += `<button class="quiz-option" onclick="checkAnswer(${index})">${option}</button>`;
    });

    container.innerHTML = `
        <p class="quiz-progress">Question ${currentQuestionIndex + 1} of ${quizQuestions.length}</p>
        <p class="quiz-question">${q.question}</p>
        <div class="quiz-options">${optionsHTML}</div>
        <p id="quiz-feedback"></p>
    `;
}

// ===== CHECK ANSWER =====
function checkAnswer(selectedIndex) {
    const q = quizQuestions[currentQuestionIndex];
    const feedback = document.getElementById("quiz-feedback");
    const buttons = document.querySelectorAll(".quiz-option");

    // disable all buttons after answering
    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === q.correctIndex) {
        score++;
        feedback.textContent = "✅ Correct!";
        feedback.style.color = "green";
        buttons[selectedIndex].style.backgroundColor = "#c8e6c9";
    } else {
        feedback.textContent = "❌ Incorrect. The correct answer is highlighted.";
        feedback.style.color = "red";
        buttons[selectedIndex].style.backgroundColor = "#ffcdd2";
        buttons[q.correctIndex].style.backgroundColor = "#c8e6c9";
    }

    // show "Next" button
    setTimeout(() => {
        const container = document.getElementById("quiz-container");
        const nextBtn = document.createElement("button");
        nextBtn.textContent = currentQuestionIndex < quizQuestions.length - 1 ? "Next Question →" : "See Results";
        nextBtn.className = "quiz-next-btn";
        nextBtn.onclick = goToNext;
        container.appendChild(nextBtn);
    }, 300);
}

// ===== GO TO NEXT QUESTION OR SHOW RESULTS =====
function goToNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

// ===== SHOW FINAL RESULTS =====
function showResults() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = `
        <p class="quiz-result">You scored ${score} out of ${quizQuestions.length}!</p>
        <button class="quiz-next-btn" onclick="restartQuiz()">Try Again</button>
    `;
}

// ===== RESTART QUIZ =====
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    renderQuestion();
}

// ===== START QUIZ ON PAGE LOAD =====
document.addEventListener("DOMContentLoaded", renderQuestion);