// todo make this global
import React from "react";
import templates from "../constants/templates";

const useConstructor = (hasBeenCalled, setHasBeenCalled, callBack = () => {}) => {
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
}

const handleError = (err, callLocation) => {
  console.log("error in " + callLocation);
  console.log(err);
};

const stringifyConfigValues = (obj, depth) => {
  Object.keys(obj).forEach((key) => {
    obj[key].interval = obj[key].interval.toString();
  });

  return obj;
}

const numerifyConfigValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    obj[key].interval = parseFloat(obj[key].interval);
  });

  return obj;
}

const createFromTemplate = (templateName) => {
  return deepCopy(templates[templateName]);
}

const deepCopy = (obj) => {
  return  JSON.parse(JSON.stringify(obj));
}

const parseBool = (boolStr) => {
  // todo actually some other cases can also be handled
  return boolStr == "true";
}

module.exports = {
  useConstructor,
  handleError,
  stringifyConfigValues,
  numerifyConfigValues,
  createFromTemplate,
  deepCopy,
  parseBool
}
