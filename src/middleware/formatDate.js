const formatDateMiddleware = (req, res, next) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).toISOString();
  };

  if (req.body.date) {
    req.body.date = formatDate(req.body.date);
  }
  next();
};

module.exports = formatDateMiddleware;
