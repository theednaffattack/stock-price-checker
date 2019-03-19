const { log } = console;

module.exports = {
  areUnitsValid,
  convertNum,
  convertUnits,
  isValidNumber,
  operatorsPresent
};

const globalImperialUnits = ["mi", "gal", "lbs"];
const globalMetricUnits = ["km", "l", "kg"];
const globalFancyImperialUnits = ["mile", "gallon", "pound"];
const globalFancyMetricUnits = ["kilometer", "liter", "kilogram"];

// distance(mi, km), volume(gal, l), mass(lbs, kg)
const imperialConversions = ["1 / 1.60934", "1 / 3.78541", "1 / 0.453592"];
const metricConversions = ["1 * 1.60934", "1 * 3.78541", "1 * 0.453592"];
// UTILITY FUNCS

function areUnitsValid(units) {
  const baseImperialUnits = ["mi", "gal", "lbs"];
  const fancyImperialUnits = ["mile", "gallon", "pound"];
  const baseMetricUnits = ["km", "l", "kg"];
  const fancyMetricUnits = ["kilometer", "liter", "kilogram"];
  let isItImperial = baseImperialUnits.includes(units.toLowerCase())
    ? "isImperial"
    : "isNotImperial";
  let isItMetric = baseMetricUnits.includes(units.toLowerCase())
    ? "isMetric"
    : "isNotMetric";
  if (isItImperial === "isNotImperial" && isItMetric === "isNotMetric")
    return {
      msg: "Units are invalid",
      value: `${isItImperial}, ${isItMetric}`
    };
  let metricValidUnit =
    baseMetricUnits[baseMetricUnits.indexOf(units.toLowerCase())];
  let fancyValidMetricUnit =
    fancyMetricUnits[baseMetricUnits.indexOf(units.toLowerCase())];

  let imperialValidUnit =
    baseImperialUnits[baseImperialUnits.indexOf(units.toLowerCase())];
  let fancyImperialValidUnit =
    fancyImperialUnits[baseImperialUnits.indexOf(units.toLowerCase())];

  let unitsToUse = metricValidUnit ? metricValidUnit : imperialValidUnit;
  let fancyUnitsToUse = metricValidUnit
    ? fancyValidMetricUnit
    : fancyImperialValidUnit;

  return {
    msg: "Units are valid",
    value: baseMetricUnits.includes(units.toLowerCase())
      ? "isMetric"
      : "isImperial",
    initUnit: units,
    returnUnit: unitsToUse,
    fancyReturnUnit: fancyUnitsToUse
  };
}

// isValidNumber returns an object with a msg: String and value: Number
// if the number is invalid the return value is the original input number
function isValidNumber(num) {
  function isNum(n) {
    let isThisValid =
      !isNaN(eval(n)) === true
        ? { msg: "thisIsValid", value: n }
        : { msg: "thisIsNotValid", value: n };
    return isThisValid;
  }
  //   let validate = num.match(/\d*\.?\d*/);

  let findAnOperator = operatorsPresent(num);
  let splitPos = findAnOperator.pos;
  let numArray = num.split("");
  let firstNum = numArray.slice(0, splitPos).join("");
  let otherNumbers = numArray.slice(splitPos + 1, numArray.length).join("");

  let ogNumberTest = isNum(num);

  let firstTest = isNum(firstNum);
  let otherTest = isNum(otherNumbers);

  // case: invalid operator
  if (findAnOperator.msg === "Invalid input: more than one operator found")
    return { msg: "Invalid number", value: num };

  // case: valid numbers and there's an operator (meaning math is needed)
  if (
    firstTest.msg === "thisIsValid" &&
    otherTest.msg === "thisIsValid" &&
    findAnOperator.msg === "Valid input: See `value` for operator found."
  )
    return {
      msg: "Valid number",
      value: eval(`${firstNum}${findAnOperator.value}${otherNumbers}`)
    };

  // if there's no operator that means it's not possible to
  // have a second number grouping
  // REFACTOR: NOW!!! if there's no operator then there shouold only
  // be a check of firstNum / firstChar if
  if (
    firstTest.msg === "thisIsValid" &&
    otherTest.msg === "thisIsValid" &&
    findAnOperator.msg === "No operators present"
  )
    return { msg: "Valid number", value: num };

  if (ogNumberTest.msg === "thisIsNotValid") return ogNumberTest;
}

// local
function operatorsPresent(initialNum) {
  const operators = ["*", "/", "-", "+"];
  let firstChar = initialNum.split("").slice(0, 1);

  let findOperators = initialNum
    .split("")
    .filter(char => operators.includes(char));

  // if findOperators is empty there are no operators
  if (findOperators.length === 0)
    return { msg: "No operators present", value: null, ogValue: initialNum };
  // if findOperators is length 1 it's valid
  // pos is position of the FIRST instance found
  if (findOperators.length === 1)
    return {
      msg: "Valid input: See `value` for operator found.",
      value: findOperators[0],
      pos: initialNum.split("").indexOf(findOperators[0]),
      ogValue: initialNum
    };
  // if findOperators is greater than length 1 it's invalid
  // pos is position of the FIRST instance found
  // value is the FIRST instance found
  if (findOperators.length > 1)
    return {
      msg: "Invalid input: more than one operator found",
      value: findOperators[0],
      pos: initialNum.split("").indexOf(findOperators[0]),
      ogValue: initialNum
    };
  // I basically NEVER want the line below to actually run
  // should it throw instead?
  return {
    msg: "Error: unexpected entry. See `value` for original input.",
    value: initialNum
  };
}

function convertUnits(val) {
  let { msg, value, initUnit, returnUnit, fancyReturnUnit } = val;

  if (value === "isImperial") {
    let imperialIndex = globalImperialUnits.indexOf(returnUnit.toLowerCase());
    let metricEquivalent = globalMetricUnits[imperialIndex];
    let fancyMetricEquivalent = globalFancyMetricUnits[imperialIndex];

    const returnObj = {
      initUnit: returnUnit,
      returnUnit: metricEquivalent,
      text: fancyMetricEquivalent
    };
    return returnObj;
  }
  if (value === "isMetric") {
    let metricIndex = globalMetricUnits.indexOf(returnUnit.toLowerCase());
    let imperialEquivalent = globalImperialUnits[metricIndex];
    let fancyImperialEquivalent = globalFancyImperialUnits[metricIndex];

    const returnObj = {
      initUnit: returnUnit,
      returnUnit: imperialEquivalent,
      text: fancyImperialEquivalent
    };
    return returnObj;
  }
}

function convertNum(val1, val2) {
  let { value: numValue } = val1;
  let { value: unitValue, initUnit, unitText } = val2;
  //   let { msg: msg2, value: unitValue, initUnit, returnUnit, fancyReturnUnit } = val2;
  // 1st arg numValid.value
  // 2nd arg unitValid.value

  if (unitValue === "isImperial") {
    let imperialIndex = globalImperialUnits.indexOf(initUnit.toLowerCase());

    let metricConversion = metricConverter(numValue, imperialIndex);

    let fancyMetricEquivalent = globalFancyMetricUnits[imperialIndex];
    const returnObj = {
      initNum: numValue,
      returnNum: metricConversion,
      fancyUnit: fancyMetricEquivalent,
      initUnit
    };
    return returnObj;
  }

  if (unitValue === "isMetric") {
    let metricIndex = globalMetricUnits.indexOf(initUnit.toLowerCase());

    let imperialConversion = imperialConverter(numValue, metricIndex);
    let fancyImperialEquivalent = globalFancyImperialUnits[metricIndex];
    const returnObj = {
      initNum: numValue,
      returnNum: imperialConversion,
      fancyUnit: fancyImperialEquivalent,
      initUnit
    };
    return returnObj;
  }
  // I need this to be unreachable
  return { numValue, unitValue };
}

function imperialConverter(numValue, scaleIndex) {
  let getMath = imperialConversions[scaleIndex];

  // restrict the return to five decimal places
  let mathResult = Math.floor(eval(getMath) * eval(numValue) * 100000) / 100000;

  return mathResult;
}

function metricConverter(numValue, scaleIndex) {
  let getMath = metricConversions[scaleIndex];

  // restrict the return to five decimal places
  let mathResult = Math.floor(eval(getMath) * eval(numValue) * 100000) / 100000;

  return mathResult;
}
