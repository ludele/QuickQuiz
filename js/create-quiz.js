document.getElementById("addQuestionBtn").addEventListener("click", addTextQuestion);
document.getElementById("addChecklistBtn").addEventListener("click", addChecklistQuestion);
document.getElementById("exportBtn").addEventListener("click", exportQuizToJSON)

function addTextQuestion() {
    const container = document.createElement('div');
    container.classList.add('question');

    const textarea = document.createElement('textarea');
    textarea.placeholder = "Enter your question here";
    container.appendChild(textarea);

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = 'Correct Answer';
    container.appendChild(answerInput);

    const removeBtn = createRemoveButton();
    container.appendChild(removeBtn);

    document.getElementById('quizContainer').appendChild(container);
}

function addChecklistQuestion() {
    const container = document.createElement('div');
    container.classList.add('checklist');

    const textarea = document.createElement('textarea');
    textarea.placeholder = "Enter your question here";
    container.appendChild(textarea);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options');
    container.appendChild(optionsContainer);

    const addOptionBtn = document.createElement('button');
    addOptionBtn.textContent = "Add Option";
    addOptionBtn.type = "button";
    addOptionBtn.addEventListener('click', () => addOption(optionsContainer));
    container.appendChild(addOptionBtn);

    const removeBtn = createRemoveButton();
    container.appendChild(removeBtn);

    document.getElementById('quizContainer').appendChild(container);
}

function addOption(container) {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option');
    
    const correctCheckbox = document.createElement('input');
    correctCheckbox.type = 'checkbox';
    correctCheckbox.classList.add = "box"
    optionDiv.appendChild(correctCheckbox);

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.placeholder = 'Option';
    optionDiv.appendChild(optionInput);

    //const lineBreak = document.createElement('br');
    //optionDiv.appendChild(lineBreak);

    //const correctLabel = document.createElement('label');
    //correctLabel.textContent = ' Correct';
    //optionDiv.appendChild(correctLabel);

    const removeBtn = createRemoveButton();
    optionDiv.appendChild(removeBtn);

    container.appendChild(optionDiv);
}

function createRemoveButton() {
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => removeBtn.parentNode.remove());
    return removeBtn;
}

function exportQuizToJSON() {
    const quizData = {
        questions: []
    };

    const questionContainers = document.querySelectorAll('.question, .checklist');
    questionContainers.forEach((container, index) => {
        const questionText = container.querySelector('textarea').value;
        const questionType = container.classList.contains('question') ? 'text' : 'checklist';

        const question = {
            type: questionType,
            question: questionText,
            options: [],
            correctAnswer: questionType === 'text' ? container.querySelector('input[type="text"]').value : []
        };

        if (questionType === 'checklist') {
            const options = container.querySelectorAll('.option');
            options.forEach(opt => {
                const optionText = opt.querySelector('input[type="text"]').value;
                const isCorrect = opt.querySelector('input[type="checkbox"]').checked;
                
                question.options.push(optionText);
                if (isCorrect) {
                    question.correctAnswer.push(optionText);
                }
            });
        }

        quizData.questions.push(question);
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quizData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "quiz.json");
    dlAnchorElem.click();
}
