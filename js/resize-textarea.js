const textAreas = document.getElementsByTagName('textarea');

function resizeTextarea(textarea) {
    textarea.style.height = 'auto'; 
    textarea.style.height = `${textarea.scrollHeight}px`; 
}

Array.from(textAreas).forEach(textarea => {
    resizeTextarea(textarea);
    textarea.addEventListener('input', function() {
        resizeTextarea(this);
    });
});


document.body.addEventListener('input', function(event) {
    if (event.target.tagName === 'TEXTAREA') {
        resizeTextarea(event.target);
    }
});

document.querySelectorAll('textarea').forEach(resizeTextarea);
