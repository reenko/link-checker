window.addEventListener('load', (event) => {
    const input = document.getElementById('url');
    input && input.addEventListener('input', handleChange, false);

    const form = document.getElementById('form');
    form && form.addEventListener('submit', handleSubmit, false);
});

async function handleSubmit(event) {
    event.preventDefault();

    const button = document.getElementById('submit');
    const buttonLabel = button.value;
    button.setAttribute('disabled', true);
    button.value = 'wait...';
    button.className += ' ';

    await processValidation();

    button.value = buttonLabel;
    button.removeAttribute('disabled');
}

let lastChanged;

function handleChange(event) {
    event.preventDefault();

    const DELAY = 2000;

    lastChanged = Date.now();
    setTimeout(() => {
        const now = Date.now();
        if (now - lastChanged > DELAY - 20) {
            processValidation();
        }
    }, DELAY);
}

// TODO: if user updated  link -> cancel active validation process
async function processValidation() {
    hideAllMsgs();

    const input = document.getElementById('url');

    const link = (input.value || '').trim();
    if (!link) {
        // do nothing

        return null;
    }
    const expression = /^(http[s]?:\/\/)?([-\w\d]+)(\.[-\w\d]+)*(\.([a-zA-Z]{2,5}|[\d]{1,3})){1,2}(\/([-~%\.\(\)\w\d]*\/*)*(#[-\w\d]+)?)?$/;
    const regexp = new RegExp(expression);

    const isValidFormat = regexp.test(link);
    const encodedLink = encodeURIComponent(link);
    const res = isValidFormat ? await callApi('GET', `${API_HOST}/url/headers?link=${encodedLink}`) : null;

    let msg = null;
    if (!isValidFormat || !res || res.error) {
        msg = document.getElementById('msg-invalid');
    } else if (res.headers) {
        msg = document.getElementById('msg-valid');
    } else {
        msg = document.getElementById('msg-not-exists');
    }

    msg.className = '';

    showToast();
}

function showToast(time = 3000) {
    const toast = document.getElementById('toast');

    toast.className = 'toast';
    setTimeout(() => {
        toast.className += ' hidden';
    }, time);
}

function hideAllMsgs() {
    document.getElementById('msg-invalid').className = 'hidden';
    document.getElementById('msg-valid').className = 'hidden';
    document.getElementById('msg-not-exists').className = 'hidden';
}

async function callApi(method, url = '', data = {}) {
    const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await snooze(1000); // just for demo

    const response = await fetch(url, {
        method,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });

    if (method === 'POST' || method === 'PUT') {
        response.body = JSON.stringify(data);
    }

    return response.json();
}