const Type = {
    FILE: 1,
    FOLDER: 2,
}

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

    const result = isValidFormat ? await mockApi(encodedLink) : null;

    if (!isValidFormat || !result || !result.is_exists) {
        showMessage('msg-invalid')
    } else if (result.type_id === Type.FILE) {
        showMessage('msg-file');
    } else if (result.type_id === Type.FOLDER) {
        showMessage('msg-folder');
    } else {
        alert('Oops');
    }

    showToast();
}

function showToast(time = 3000) {
    const toast = document.getElementById('toast');

    toast.className = 'toast';
    setTimeout(() => {
        toast.className += ' hidden';
    }, time);
}

function showMessage(id) {
    const form = document.getElementById('form');
    if (form && form.firstElementChild) {
        form.firstElementChild.style.minHeight = '129px';
    }

    document.getElementById(id).className = '';
}

function hideAllMsgs() {
    document.getElementById('msg-invalid').className = 'hidden';
    document.getElementById('msg-file').className = 'hidden';
    document.getElementById('msg-folder').className = 'hidden';
}

async function mockApi(url = '') {
    const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await snooze(1000); // just for demo

    const hashCode = url.hashCode();

    if (hashCode % 2 === 0) {
        return {
            is_exists: true,
            type_id: Type.FILE,
        }
    }

    if (hashCode % 3 === 0 || hashCode % 5 === 0) {
        return {
            is_exists: true,
            type_id: Type.FOLDER,
        }
    }

    return {
        is_exists: false,
    }
}

String.prototype.hashCode = function () {
    let h;
    for (let i = 0; i < this.length; i++)
        h = Math.imul(31, h) + this.charCodeAt(i) | 0;

    return h;
}
