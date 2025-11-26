// User signup validation middleware
export const signupValidation = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!firstName || !lastName) {
    return res
      .status(401)
      .json({ message: "First name and last name are required" });
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  if (!password) {
    return res.status(401).json({ message: "Password is required" });
  }

  if (firstName.length < 3 || firstName.length > 15) {
    return res
      .status(401)
      .json({ message: "First name must be between 3 and 15 characters" });
  }

  if (lastName.length < 3 || lastName.length > 15) {
    return res
      .status(401)
      .json({ message: "Last name must be between 3 and 15 characters" });
  }

  if (password.length < 6) {
    return res
      .status(401)
      .json({ message: "Password must be at least 6 characters long" });
  }

  next();
};
