function generateQuote() {
    if (document.getElementById('quote-container')) { // fetches quote for quote html element, only on home page
        const quote = document.getElementById('quote')
        fetch('https://zenquotes.io/api/random')
            .then((result) => result.json())
            .then((resultJson) => {
                quote.textContent += `'${resultJson[0].q}' - ${resultJson[0].a}`;
            });
    }
};

const commands = { // adds the universal three audio commands regardless of the user's current page

    'hello': () => { alert('Hello world!'); },

    'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
    },

    'navigate to *page': (page) => {
        if (page === 'home') {
            window.location.href = 'home.html';
        } else if (page === 'stocks') {
            window.location.href = 'stocks.html';
        } else if (page === 'dogs') {
            window.location.href = 'dogs.html';
        }
    },
};

function startListen() {
    console.log('function called');
    if (annyang) {
        annyang.addCommands(commands);
        annyang.setLanguage('en-US');
        annyang.start();
        console.log('Annyang is running.');
        sessionStorage.setItem('isListening', 'true');
    }
}

function stopListen() {
    if (annyang) {
        annyang.abort();
        console.log('Annyang has been stopped.');
    }
}

window.onload = function () {
    generateQuote();
};