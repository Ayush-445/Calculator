const input = document.getElementById('inputBox');
const buttons = document.querySelectorAll('.calculator button');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const HISTORY_KEY = 'calculatorHistory';
const MAX_HISTORY_ITEMS = 15;

let string = '';
let history = loadHistory();

renderHistory();

Array.from(buttons).forEach((button) => {
    button.addEventListener('click', (e) => {
        const value = e.target.innerHTML;

        try {
            if (value === '=') {
                if (string !== '') {
                    const expression = string;
                    const result = eval(string);
                    string = String(result);
                    input.value = string;
                    addHistoryItem(`${expression} = ${result}`);
                }
            } else if (value === 'AC') {
                string = '';
                input.value = string;
            } else if (value === 'DEL') {
                string = string.substring(0, string.length - 1);
                input.value = string;
            } else {
                string += value;
                input.value = string;
            }
        } catch (err) {
            string = '';
            input.value = 'Syntax Error';
            setTimeout(() => {
                input.value = '';
            }, 1000);
        }
    });
});

historyList.addEventListener('click', (e) => {
    const item = e.target.closest('li');
    if (!item) {
        return;
    }

    const expression = item.dataset.expression;
    if (!expression) {
        return;
    }

    string = expression;
    input.value = string;
});

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    saveHistory();
    renderHistory();
});

function addHistoryItem(entry) {
    history.unshift(entry);
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    saveHistory();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';

    if (history.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'emptyHistory';
        emptyItem.textContent = 'No history yet';
        historyList.appendChild(emptyItem);
        return;
    }

    history.forEach((entry) => {
        const item = document.createElement('li');
        item.textContent = entry;
        item.dataset.expression = entry.split('=')[0].trim();
        historyList.appendChild(item);
    });
}

function saveHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadHistory() {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (!storedHistory) {
        return [];
    }

    try {
        const parsed = JSON.parse(storedHistory);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        return [];
    }
}
