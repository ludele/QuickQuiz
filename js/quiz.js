var quizData;
var resultDiv = document.getElementById('quizResult');

document.getElementById('loadQuizBtn').addEventListener('click', function () {
    const fileInput = document.getElementById('quizFileInput');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();

        reader.onload = function (e) {
            quizData = JSON.parse(e.target.result);
            // console.log(quizData)
            loadQuiz(quizData);
        };

        reader.readAsText(fileInput.files[0]);
    } else {
        alert("Error, not functional quiz-file");
    }
});

function loadQuiz(quizData) {
    resultDiv.classList.remove("box");
    resultDiv.innerHTML = "";

    const quizContent = document.getElementById('quizContent');

    while (quizContent.firstChild) {
        quizContent.removeChild(quizContent.firstChild);
    }

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
                //const lineBreak = document.createElement('br');
                label.classList.add("box")
                checkbox.type = 'checkbox';
                checkbox.name = `answer${index}`;
                checkbox.value = option;
                label.appendChild(checkbox);
                label.append(option);
                questionElem.appendChild(label);
                //questionElem.appendChild(lineBreak);
            });
        }

        quizContent.appendChild(questionElem);
    });
}

function submitQuiz() {
    let score = 0;

    quizData.questions.forEach((question, index) => {
        if (question.type === 'text') {
            const input = document.querySelector(`textarea[name="answer${index}"]`);
            const correctAnswer = question.correctAnswer?.trim().toLowerCase();
            const trimmedInput = input.value.trim().toLowerCase()

            //console.log(correctAnswer, trimmedInput);

            if (correctAnswer && trimmedInput === correctAnswer) {
                score++;
            }

        } else if (question.type === 'checklist') {
            const selectedOptions = Array.from(document.querySelectorAll(`input[name="answer${index}"]:checked`)).map(input => input.value);
            const correctAnswer = question.correctAnswer.slice().sort();
            const selectedOptionsSorted = selectedOptions.slice().sort();

            if (arraysEqual(selectedOptionsSorted, correctAnswer)) {
                score++;
            }
        }
    });

    if (resultDiv) {
        resultDiv.classList.add("box", "center")
        let percentage = (score / quizData.questions.length) * 100;

        const gradingScale = [
            { threshold: 100, grade: 'S' },  
            { threshold: 95, grade: 'A+' },
            { threshold: 90, grade: 'A' },
            { threshold: 80, grade: 'B' },
            { threshold: 70, grade: 'C' },
            { threshold: 60, grade: 'D' },
            { threshold: 55, grade: 'E' },
            { threshold: 0, grade: 'F' }    
        ];
        for (let i = 0; i < gradingScale.length; i++) {
            if (percentage >= gradingScale[i].threshold) {
                grade = gradingScale[i].grade;
                break; 
            }
        }
        
        resultDiv.textContent = `You scored ${score} out of ${quizData.questions.length} which is ${percentage.toFixed()}% and this gives you ${grade}`;
    } else {
        console.error("Element with ID 'quizResult' not found.");
    }
}


function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}