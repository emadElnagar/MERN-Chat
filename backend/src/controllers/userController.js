import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Generate Token
const generateToken = (user) => {
  return JWT.sign({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    role: user.role
  }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// User register
export const userRegister = async (req, res) => {
  const takenUserName = await User.findOne({ userName: req.body.userName });
  if (takenUserName) {
    res.status(401).json({
      message: 'This user name have already taken, please try another one'
    });
  }
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: await bcrypt.hash(req.body.password, 10),
  });
  const token = generateToken(user);
  user.save().then(user => {
    res.status(200).json({
      token
    });
  }).catch(error => {
    res.status(201).json({
      message: error.message
    });
  });
}

// User login
export const userLogin = async (req, res) => {
  const user = await User.findOne({ userName: req.body.userName });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)){
      const token = generateToken(user);
      res.status(200).json({
        token
      });
    }
  }
}

// Get all users
export const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json({
      message: error.message
    });
  }
}
