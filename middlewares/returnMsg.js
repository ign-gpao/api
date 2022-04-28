module.exports = function returnMsg(req, res) {
  if (req.error) {
    res.status(req.error.code).json(req.error);
  } else {
    res.status(200).json(req.result);
  }
};
