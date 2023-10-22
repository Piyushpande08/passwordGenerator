const inputSlider = document.querySelector("[ data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDispaly = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+-={[]}|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey

// set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}



function setIndicator(color) {
  indicator.style.width = "50px";
  indicator.style.height = "50px";
  indicator.style.borderRadius = "50px";
  indicator.style.backgroundColor = color;
  //  shadow
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDispaly.value);
    copyMsg.innerText = "copied";
    setTimeout(() => {
      copyMsg.innerText = "";
    }, 250);
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //   To make copy span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDispaly.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";

  //   if (upperCaseCheck.checked) {
  //     password += generateUpperCase();
  //   }
  //   if (lowerCaseCheck.checked) {
  //     password += generateLowerCase();
  //   }
  //   if (numberCheck.checked) {
  //     password += generateRandomNumber();
  //   }
  //   if (symbolsCheck.checked) {
  //     password += generateSymbol();
  //   }

  let funcArr = [];

  if (upperCaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowerCaseCheck.checked) funcArr.push(generateLowerCase);

  if (numberCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //   compulsory addition

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  // remaining addition

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //   Shuffle password

  password = shufflePassword(Array.from(password));

  //   show in UI
  passwordDispaly.value = password;
  // calculate strength

  calcStrength();
});
