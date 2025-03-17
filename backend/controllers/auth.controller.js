import bcrypt from "bcryptjs";
import User from '../models/user.model.js'
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signupController = async(req, res) => {
 try {
  // Validating fields
  const { username, email, password } = req.body;

  if(!username || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });

  const usernameTaken = await User.findOne({ username });
  const emailTaken = await User.findOne({ email });

  if(usernameTaken) return res.status(409).json({ success: false, message: 'Username is already in use' });
  if(emailTaken) return res.status(409).json({ success: false, message: 'Email is already in use' });

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  if(!emailRegex.test(email)) return res.status(400).json({ success: false, message: 'Invalid email' });

  // Ensure password meets length requirement before hashing
  if(password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creating randomize image
  const PROFILE_PICS = ['/avatar1.png', 'avatar2.png', 'avatar3.png'];

  const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

  // Creating new user saving and returning to the frontend
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    image
  });

  
  await newUser.save();
  generateTokenAndSetCookie(newUser._id, res);
  

  return res.status(201).json({ success: true, user: {
    ...newUser._doc,
  password: ''
  }});
  
 } catch (error) {
  console.error('error in signupController:' + error.message);
  return res.status(500).json({ success: false, message: 'Internal Server Error'});
 }
}

export const loginController = async(req, res) => {
    try {
      // Input validations
      const { email, password } = req.body;

      if(!email || !password) return res.status(400).json({ success: false, message: 'All fields must be provided' });

      const user = await User.findOne({email});
      if(!user) return res.status(404).json({ success: false, message: 'Invalid credentials' });

      const validateUser = await bcrypt.compare(password, user.password);
      if(!validateUser) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      // set cookie
      generateTokenAndSetCookie(user._id, res);

      return res.status(200).json({ success: true, user: {
        ...user._doc, 
        password: ''
      } });
      
    } catch (error) {
      console.error('Error in loginController: ' + error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const logoutController = async(req, res) => {
  try {
    // clearing cookie
    res.clearCookie('jwt-netflix');
    return res.status(200).json({ success: true, message: 'Logged out successfully'});
  } catch (error) {
    console.error('Error in logoutController: ' + error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const authCheck = async(req,res) => {
  try {
    
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error('Error in authCheck controller: ', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}