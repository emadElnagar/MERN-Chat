// User signup validation middleware
export const signupValidation = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const fNamehasNumbers = /\d/.test(firstName);
  const lNamehasNumbers = /\d/.test(lastName);

  if (
    !firstName ||
    firstName.trim() === "" ||
    !lastName ||
    !lastName.trim() === ""
  ) {
    return res
      .status(401)
      .json({ message: "First name and last name are required" });
  }

  if (fNamehasNumbers) {
    return res
      .status(401)
      .json({ message: "First name should not contain numbers" });
  }

  if (lNamehasNumbers) {
    return res
      .status(401)
      .json({ message: "Last name should not contain numbers" });
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

export const ChangePasswordValidation = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(401)
      .json({ message: "Old password and new password are required" });
  }
  if (newPassword.length < 6) {
    return res
      .status(401)
      .json({ message: "New password must be at least 6 characters long" });
  }
};
