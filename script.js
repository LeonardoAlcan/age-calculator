const picker = datepicker('#birthdate', {
    formatter: (input, date, instance) => {
        input.value = date.toLocaleDateString();
    },
    dateSelected: new Date(),
    maxDate: new Date(),
});

const birthdateInput = document.getElementById('birthdate');
const dateMask = IMask(birthdateInput, {
    mask: Date,
    pattern: 'd{/}m{/}Y',
    lazy: false,
    min: new Date(1900, 0, 1),
    max: new Date(),
    overwrite: true,
    autofix: true,
    blocks: {
        d: { mask: IMask.MaskedRange, placeholderChar: '_', from: 1, to: 31, maxLength: 2 },
        m: { mask: IMask.MaskedRange, placeholderChar: '_', from: 1, to: 12, maxLength: 2 },
        Y: { mask: IMask.MaskedRange, placeholderChar: '_', from: 1900, to: new Date().getFullYear(), maxLength: 4 }
    },
    format: function (date) {
        return luxon.DateTime.fromJSDate(date).toFormat('dd/MM/yyyy');
    },
    parse: function (str) {
        const dt = luxon.DateTime.fromFormat(str, 'dd/MM/yyyy');
        return dt.isValid ? dt.toJSDate() : null;
    }
});

const form = document.getElementById('age-form');
const output = document.getElementById('output');
const error = document.getElementById('error');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const birthdateStr = document.getElementById('birthdate').value;
    if (!birthdateStr || birthdateStr.includes('_')) {
        showError('Please enter a complete birthdate in dd/mm/yyyy format');
        return;
    }

    const birthDate = luxon.DateTime.fromFormat(birthdateStr, 'dd/MM/yyyy');
    const now = luxon.DateTime.now();

    if (!birthDate.isValid) {
        showError('Invalid date format.');
        return;
    }

    if (birthDate > now) {
        showError('Birthdate cannot be in the future.');
        return;
    }

    const diff = now.diff(birthDate, ['years', 'months', 'days']).toObject();

    const ageTextEl = document.getElementById('age-text');
    const years = Math.floor(diff.years);
    const months = Math.floor(diff.months);
    const days = Math.floor(diff.days);

    ageTextEl.innerHTML = `You are <strong class="age-display">${years} years, ${months} months and ${days} days old</strong>`;

    output.classList.remove('hidden');
    error.classList.add('hidden');
});

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    output.classList.add('hidden');
}