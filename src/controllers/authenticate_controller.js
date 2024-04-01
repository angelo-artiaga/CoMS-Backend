const createSession = (req, res) => {
  res.sendStatus(200);
};

const destroySession = (req, res) => {
  req.session.destroy();
  res.json({ message: "user logged out!" });
};

export { createSession, destroySession };
