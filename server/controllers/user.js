import bcrpyt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;


export const signin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        //Existing User
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: 'User does not exist' });
        
        //Checking Password
        const isPasswordCorrect = await bcrpyt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id, }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        res.status(500).json({ message: 'Something Went Wrong' });
    }
}

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    try {
        //Existing User
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exist' });

        //Password
        if (password !== confirmPassword) return res.status(400).json({ message: 'Password do not Match' });

        const hashedPassword = await bcrpyt.hash(password, 12);
        
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
        
        const token = jwt.sign({ email: result.email, id: result._id, }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result, token });


    } catch (error) {
        res.status(500).json({ message: 'Something Went Wrong' });
    }
}