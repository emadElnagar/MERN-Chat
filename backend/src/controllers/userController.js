// Generate Token
const generateToken = (user) => {
  return JWT.sign({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};
