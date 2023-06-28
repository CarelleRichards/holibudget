
/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  Retrieve and initialise elements for later user  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Storage for tabs
let currentTab, tabs;

// Storage for buttons to navigate tabs
let nextButton, previousButton, resetButton;

// Storage to +/- expense items on results tab
let items, expandButtons, minimiseButtons;

// Storage for step indicator 
let stepIndicator, steps;

function setUp() {

    // Get all tabs from page
    tabs =  document.getElementsByClassName("tab");
    currentTab = 0;

    // Get all buttons from page
    nextButton = document.querySelector("#nextButton");
    previousButton = document.querySelector("#previousButton");
    resetButton = document.querySelector("#resetButton");

    // Get elements to +/- expense items on results tab
    items = document.getElementsByClassName("items");
    expandButtons = document.getElementsByClassName("expand");
    minimiseButtons = document.getElementsByClassName("minimise");

    // Get step indicator from page
    stepIndicator = document.querySelector(".stepIndicator");
    steps = stepIndicator.getElementsByTagName("li");
}

/* * * * * * * * * * * * * * * * *
 *  Go to next or previous tab   *
 * * * * * * * * * * * * * * * * */

// Multi step interface has been adaped from w3schools (n.d.)
// This includes code in nextPrevious() and showTab() functions 

function nextPrevious(number) {

    // If inputs on the current tab are valid
    if (validate()) {

        // Hide the current tab
        tabs[currentTab].style.display = "none";

        // Set the new current tab and show it
        currentTab = currentTab + number;
        showTab();
    }
}

/* * * * * * * * * * * * * * * * * * *
 *  Set up and display current tab   *
 * * * * * * * * * * * * * * * * * * */

function showTab() {
    
    // Show begin button on tab 0
    if (currentTab == 0) {
        previousButton.style.display = "none";
        nextButton.innerHTML = "Begin";
        nextButton.classList.remove("nextButton");
        
    // For tabs 1 to 4, show next and previous buttons 
    } else if (currentTab == 1 || currentTab == 4) {
        previousButton.style.display = "inline";
        nextButton.innerHTML = "Next";
        nextButton.classList.add("nextButton");

    // On tab 5, change next button to calculate
    } else if (currentTab == 5) {
        nextButton.innerHTML = "Calculate";

    // On tab 6, add results and show reset button
    } else if (currentTab == 6) {
        addResults();
        previousButton.style.display = "none";
        nextButton.style.display = "none";
        resetButton.style.display = "inline";
    }

    // Update step indicator if necessary
    updateStepIndicator();

    // Display the current tab
    tabs[currentTab].style.display = "block";
}

/* * * * * * * * * * * * * * * * * * * * * * * * *
 *  Update step indicator based on current tab   *
 * * * * * * * * * * * * * * * * * * * * * * * * */

function updateStepIndicator() {

    // Show step indicator on tabs 2 to 5
    if (currentTab > 1 && currentTab < 6) {
        stepIndicator.style.display = "flex";

        // Ensure active class is set on the current step only
        for (var step of steps) {
            step.classList.remove("active");
        }
        steps[currentTab - 2].classList.add("active");

    // Hide step indicator on all other tabs
    } else {
        stepIndicator.style.display = "none";
    }
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *  Caclulate and add values to results tab  *
 * * * * * * * * * * * * * * * * * * * * * * */

function addResults() {

    // Get all the inputs
    const inputs = document.getElementsByTagName("input");
    
    // Convert all the inputs to a number and save to array
    const inputsAsNum = [];
    for (let i = 0; i < inputs.length; i++) {
        inputsAsNum.push(Number(inputs[i].value));
    }

    // Perform calculations
    const preparation = inputsAsNum[1] + inputsAsNum[2] + inputsAsNum[3];
    const essentials = inputsAsNum[4] + inputsAsNum[5] + inputsAsNum[6];
    const entertainment = inputsAsNum[7] + inputsAsNum[8] + inputsAsNum[9];
    const total = preparation + essentials + entertainment;
    const average = total / 9;
    const net = inputsAsNum[0] - total;

    // Convert results to money value add to page
    document.querySelector("#preparationResult").innerHTML = moneyValue(preparation);
    document.querySelector("#flightsResult").innerHTML = moneyValue(inputsAsNum[1]);
    document.querySelector("#vaccinationsResult").innerHTML = moneyValue(inputsAsNum[2]);
    document.querySelector("#insuranceResult").innerHTML = moneyValue(inputsAsNum[3]);    
    document.querySelector("#essentialsResult").innerHTML = moneyValue(essentials);
    document.querySelector("#accommodationResult").innerHTML = moneyValue(inputsAsNum[4]);
    document.querySelector("#transportResult").innerHTML = moneyValue(inputsAsNum[5]);
    document.querySelector("#foodResult").innerHTML = moneyValue(inputsAsNum[6]);    
    document.querySelector("#entertainmentResult").innerHTML = moneyValue(entertainment);
    document.querySelector("#activitiesResult").innerHTML = moneyValue(inputsAsNum[7]);
    document.querySelector("#shoppingResult").innerHTML = moneyValue(inputsAsNum[8]);
    document.querySelector("#nightlifeResult").innerHTML = moneyValue(inputsAsNum[9]);    
    document.querySelector("#total").innerHTML = moneyValue(total);
    document.querySelector("#average").innerHTML = moneyValue(average);

    // Get elements for net 
    const netElement = document.querySelector("#net");
    const netImage = document.querySelector("#netImage");

    // Depending if net is +/-, set image and format money text
    if (net < 0) {
        netElement.classList.add("negative");
        netElement.innerHTML = "-" + moneyValue(net).replace("-", "");
        netImage.src = "images/negativeGraph.png"; // kmgdesignid (2022)
        netImage.alt = "Graphic illustration of a negative graph";
    } else {
        netElement.classList.add("positive");
        netElement.innerHTML = "+" + moneyValue(net);
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  Takes a number and converts it to a money string   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function moneyValue(number) {

    // Round given number to two decimals, using technique from STechies (2022)
    const rounded = (Math.round((number + Number.EPSILON) * 100) / 100).toFixed(2);

    // Convert rounded number to money string and return it
    const moneyValue = "$" + rounded.toString();
    return moneyValue;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  Validates inputs on current tab and show errors  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Accept numbers with up to two decimals
const regex = new RegExp(/^\d+(\.\d{1,2})?$/);

function validate() {

    // Get inputs and error messages from current tab
    const currentInputs = tabs[currentTab].getElementsByTagName("input");
    const errorMessages = tabs[currentTab].getElementsByClassName("errorMessage");

    // Loop all inputs from current tab
    let valid = true;
    for (let i = 0; i < currentInputs.length; i++) {
        
        // Reset error messages
        errorMessages[i].innerText = "";
        errorMessages[i].style.display = "none";

        // Set valid to false if input is empty and show error
        if (currentInputs[i].value == "") {
            errorMessages[i].innerText = "Cannot be empty";
            errorMessages[i].style.display = "block";
            valid = false;

        // Set valid to false if input isn't monetary and show error
        } else if (!regex.test(currentInputs[i].value)) {
            errorMessages[i].innerText = "Must be a monetary value";
            errorMessages[i].style.display = "block";
            valid = false;
        } 
    }
    return valid; 
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * 
 *  Toggles display of items for a given expense   *
 * * * * * * * * * * * * * * * * * * * * * * * * * */

function toggleItems(expenseNumber) {

    // If items are visible, hide them and show expand button
    if (items[expenseNumber].style.display == "table-row-group") {
        minimiseButtons[expenseNumber].style.display = "none";
        items[expenseNumber].style.display = "none";
        expandButtons[expenseNumber].style.display = "block";

    // Otherwise, show items and minimise button
    } else {
        expandButtons[expenseNumber].style.display = "none";
        minimiseButtons[expenseNumber].style.display = "block";
        items[expenseNumber].style.display = "table-row-group";
    }
}