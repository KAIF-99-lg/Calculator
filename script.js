const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');
let currentExpression = '';
let lastResult = '';

// Function to update display with proper formatting
function updateDisplay(value) {
    display.textContent = value;
    // Handle overflow
    if (display.textContent.length > 12) {
        display.style.fontSize = '25px';
    } else {
        display.style.fontSize = '40px';
    }
}

// Function to calculate result
function calculateResult() {
    // Step 1: Handle empty expression
    if (currentExpression === '') {
        updateDisplay('0');
        return;
    }

    // Step 2: Try to calculate
    try {
        // Convert calculator symbols to JavaScript math symbols
        let mathExpression = currentExpression;
        mathExpression = mathExpression.replace(/×/g, '*');  // Change × to *
        mathExpression = mathExpression.replace(/÷/g, '/');  // Change ÷ to /
        
        // Calculate the result
        let answer = eval(mathExpression);
        
        // Make the result look nice
        if (Number.isInteger(answer)) {
            // If it's a whole number, keep it as is
            updateDisplay(answer);
        } else {
            // If it's a decimal, limit to 8 decimal places
            answer = answer.toFixed(8);
            // Remove trailing zeros after decimal
            answer = parseFloat(answer);
            updateDisplay(answer);
        }
        
        // Save the result for next calculation
        currentExpression = answer.toString();
        
    } catch (error) {
        // If anything goes wrong, show error
        updateDisplay('Error');
        currentExpression = '';
    }
}

// Handle button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        switch(value) {
            case 'AC':
                currentExpression = '';
                updateDisplay('0');
                break;
            
            case '=':
                calculateResult();
                break;
            
            default:
                if (currentExpression === '0' && !isNaN(value)) {
                    currentExpression = value;
                } else {
                    currentExpression += value;
                }
                updateDisplay(currentExpression);
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const validKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
        '+', '-', '*', '/', '(', ')', '.', 'Enter', 'Escape'
    ];
    
    if (validKeys.includes(key)) {
        event.preventDefault();
        
        switch(key) {
            case 'Enter':
                document.querySelector('.equals').click();
                break;
            
            case 'Escape':
                document.querySelector('.special').click();
                break;
            
            case '*':
                buttons.forEach(btn => {
                    if (btn.textContent === '×') btn.click();
                });
                break;
            
            case '/':
                buttons.forEach(btn => {
                    if (btn.textContent === '÷') btn.click();
                });
                break;
            
            default:
                buttons.forEach(btn => {
                    if (btn.textContent === key) btn.click();
                });
        }
    }
});

// Add error handling for window errors
window.onerror = function() {
    updateDisplay('Error');
    currentExpression = '';
    return true;
};