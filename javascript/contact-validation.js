
/**
 * Validates input fields.
 * @param {string} name - Name input.
 * @param {string} email - Email input.
 * @param {string} phone - Phone input.
 * @param {string} [prefix=''] - Prefix for input field IDs.
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function validateInput(name, email, phone, prefix = '') {
    resetErrorMessages(prefix);
    let isValid = true;
    const fields = [
        { name: 'name', value: name, validate: isValidName, emptyMsg: 'Please enter a name.', invalidMsg: 'Please enter a valid name without numbers.' },
        { name: 'email', value: email, validate: isValidEmail, emptyMsg: 'Please enter an email address.', invalidMsg: 'Please enter a valid email address.' },
        { name: 'phone', value: phone, validate: isValidPhone, emptyMsg: 'Please enter a phone number.', invalidMsg: 'Please enter a valid phone number.' }
    ];
    fields.forEach(field => {
        const errorId = `${prefix}${field.name}-error`;
        if (field.value.trim() === '') {
            displayErrorMessage(errorId, field.emptyMsg);
            isValid = false;
        } else if (!field.validate(field.value)) {
            displayErrorMessage(errorId, field.invalidMsg);
            isValid = false;
        }
    });
    return isValid;
}

/**
 * Validates a name input.
 * @param {string} name - The name to validate.
 * @returns {boolean} True if valid, otherwise false.
 */
function isValidName(name) {
    const re = /^[a-zA-ZÀ-ÿ\-\'\s]+$/;
    return re.test(name);
}

/**
 * Validates an email input.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if valid, otherwise false.
 */
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validates a phone number input.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} True if valid, otherwise false.
 */
function isValidPhone(phone) {
    const re = /^[\d\s+\-()]+$/;
    return re.test(phone);
}

/**
 * Displays an error message for a specific input field.
 * @param {string} elementId - The ID of the error message element.
 * @param {string} message - The error message to display.
 */
function displayErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Resets all error messages.
 * @param {string} [prefix=''] - Prefix for error message IDs.
 */
function resetErrorMessages(prefix = '') {
    const errorElements = document.querySelectorAll(`.error-message[id^="${prefix}"]`);
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

/**
 * Adds event listeners to input fields to clear error messages.
 * @param {string[]} fields - The input field IDs.
 * @param {string} [prefix=''] - Prefix for input field IDs.
 */
function addInputEventListeners(fields, prefix = '') {
    fields.forEach(field => {
        const input = document.getElementById(`${prefix}${field}`);
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${prefix}${field}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
    });
}