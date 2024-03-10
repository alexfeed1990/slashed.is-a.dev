function goto(page) {
    // Get all of the tags with the data-page attribute
    document.querySelectorAll('[data-page]').forEach(obj => {
        // Make the page hidden if it already isn't.
        if (!obj.classList.contains('hidden')) obj.classList.add('hidden');       
    })

    // At this point all the pages are hidden. Take the one we requested and show it.
    document.querySelector(`#${page}`).classList.remove('hidden');
}

function copyFallback(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copy(text) {
    if (!navigator.clipboard) {
        copyFallback(text);
        return;
    }

    navigator.clipboard.writeText(text).then(function () {
        console.log('Copying to clipboard was successful!');
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}

function show(id) { document.getElementById(id).show(); }
function hide(id) { document.getElementById(id).close(); }
function setText(id, text) { document.getElementById(id).innerText = text; }

function setHrColor() {
    document.querySelectorAll('hr').forEach(element => {
        element.setAttribute('color', getComputedStyle(document.documentElement).getPropertyValue('--text-color'));
    })
}

document.addEventListener("DOMContentLoaded", e => {
    setHrColor();
})