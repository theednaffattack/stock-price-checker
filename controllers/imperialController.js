const { log } = console;
const {
  areUnitsValid,
  convertNum,
  convertUnits,
  isValidNumber,
  operatorsPresent
} = require("./utils/imperialUtils");

module.exports = { getImperialController };

async function getImperialController(req, res) {
  console.log("SERVER SIDE");
  let { input } = req.query;
  var matches = /[A-Z]/i.exec(input);

  const charIndex = matches.index;

  let startNumber = 0;

  const firstChar = input.slice(0, 1);

  const getStarterNums = input.slice(0, charIndex);

  const initNumbers = !isNaN(input.slice(0, startNumber))
    ? input.slice(0, startNumber)
    : 1;

  const initUnits = input.slice(charIndex, input.length);

  startNumber = charIndex === 0 ? 1 : initNumbers;

  //   log("startNumber " + startNumber);
  let isFirstCharNum = !isNaN(firstChar)
    ? { msg: "thisIsValid", value: firstChar }
    : { msg: "thisIsNotValid", value: 0 };
  let unitValid = areUnitsValid(initUnits);

  if (
    isFirstCharNum.msg === "thisIsNotValid" &&
    unitValid.msg === "Units are valid" &&
    firstChar === "."
  ) {
    let { initUnit, returnUnit, text: unitText } = convertUnits(unitValid);

    let { fancyUnit, initNum = 1, returnNum, text: numText } = convertNum(
      { value: getStarterNums },
      { value: unitValid.value, initUnit, unitText }
    );
    return res.status(200).send({
      initNum: getStarterNums, // always in this case
      initUnit: initUnits,
      // BACK
      returnNum,
      returnUnit,
      string: `${initNum} ${initUnit} converts to ${returnNum} ${
        returnNum + 0 < 1 ? fancyUnit : "hello"
      }`
    });
  }

  // if a converasion is submitted with no number
  if (
    isFirstCharNum.msg === "thisIsNotValid" &&
    unitValid.msg === "Units are valid"
  ) {
    let { initUnit, returnUnit, text: unitText } = convertUnits(unitValid);

    let { fancyUnit, initNum = 1, returnNum, text: numText } = convertNum(
      { value: 1 },
      { value: unitValid.value, initUnit, unitText }
    );
    return res.status(200).send({
      initNum: 1, // always in this case
      initUnit: initUnits,
      // BACK
      returnNum,
      returnUnit,
      string: `${initNum} ${initUnit} converts to ${returnNum} ${
        returnNum + 0 < 1 ? fancyUnit : "hello"
      }`
    });
  }

  // let numValid = isValidNumber(firstChar);
  let numValid = isValidNumber(getStarterNums);
  // if the number is invalid return: 'invalid number
  if (numValid.msg === "Invalid number" && unitValid.msg === "Units are valid")
    return res.status(200).send("invalid number");

  // if the units are invalid return: 'invalid unit'
  if (numValid.msg === "Valid number" && unitValid.msg === "Units are invalid")
    return res.status(200).send("invalid unit");

  // if both are invalid return: 'invalid number and unit'
  if (
    numValid.msg === "Invalid number" &&
    unitValid.msg === "Units are invalid"
  )
    return res.status(200).send("invalid number and unit");

  // if everyting was formatted correctly
  if (numValid.msg === "Valid number" && unitValid.msg === "Units are valid") {
    let findOperators = operatorsPresent(getStarterNums);
    let starterSetValid = isValidNumber(getStarterNums);
    let firstCharValid = isValidNumber(firstChar);

    if (
      findOperators.msg === "Valid input: See `value` for operator found." ||
      findOperators.msg === "No operators present"
    ) {
      let { initUnit, returnUnit, text: unitText } = convertUnits(unitValid);
      let { fancyUnit, initNum, returnNum, text: numText } = convertNum(
        { value: findOperators.ogValue },
        { value: unitValid.value, initUnit, unitText }
      );
      return res.status(200).send({
        initNum, // always in this case
        initUnit: unitValid.initUnit,
        // BACK
        returnNum,
        returnUnit,
        string: `${initNum} ${initUnit} converts to ${returnNum} ${
          returnNum + 0 < 1 ? fancyUnit : fancyUnit + "s"
        }`
      });
    }
    if (findOperators.msg !== "Valid input: See `value` for operator found.") {
      return res.send("invalid number");
    }
  }
}
