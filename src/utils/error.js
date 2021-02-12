

const handleError = (err, callLocation) => {
  console.log("error in " + callLocation);
  console.log(err);
};

module.exports = {
  handleError
}

