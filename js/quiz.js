document.getElementById('loadQuizBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('quizFileInput');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const quizData = JSON.parse(e.target.result);
            console.log(quizData)
            loadQuiz(quizData);
        };
        
        reader.readAsText(fileInput.files[0]);
    } else {
        alert("Error, not functional quiz-file");
    }
});

function loadQuiz(quizData) {
    const quizContent = document.getElementById('quizContent');

    quizData.questions.forEach((q, index) => {
        const questionElem = document.createElement('div');
        questionElem.classList.add("box");
        const questionText = document.createElement('h2');
        questionText.textContent = q.question;
        questionElem.appendChild(questionText);

        if (q.type === 'text') {
            const input = document.createElement('textarea');
            input.type = 'text';
            input.name = `answer${index}`;
            questionElem.appendChild(input);
        } else if (q.type === 'checklist') {
            q.options.forEach(option => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `answer${index}`;
                checkbox.value = option;
                label.appendChild(checkbox);
                label.append(option);
                questionElem.appendChild(label);
            });
        }

        quizContent.appendChild(questionElem);
    });
}

function submitQuiz() {
    let score = 0;
    quizData.questions.forEach((question, index) => {
        if (question.type === 'text') {
            const input = document.querySelector(`input[name="answer${index}"]`);
            if (input.value.trim().toLowerCase() === question.correctAnswer.toLowerCase()) {
                score++;
            }
        } else if (question.type === 'checklist') {
            const selectedOptions = Array.from(document.querySelectorAll(`input[name="answer${index}"]:checked`)).map(input => input.value);
            if (arraysEqual(selectedOptions.sort(), question.correctAnswer.sort())) {
                score++;
            }
        }
    });

    const result = document.getElementById('quizResult');
    result.textContent = `You scored ${score} out of ${quizData.questions.length}`;
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}