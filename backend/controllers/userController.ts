import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user'

export const registerNew = async (req: Request & { file?: any }, res: Response) => {
    try {
        const { name, address, contact, email, password } = req.body;

        const userexist = await User.findOne({ email })

        if (userexist) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        if (!name || !address || !contact || !email || !password) {
            return res.status(400).json({
                message: 'Please enter all fields'
            });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {

                const user = new User({
                    name,
                    address,
                    contact,
                    email,
                    password: hash,
                    profileImage: req.file.path
                });

                jwt.sign({ user }, process.env.JSONSECRET!, { expiresIn: '12h' }, (err: any, token: any) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        user.save();
                        res.status(201).json({
                            message: 'User creation successful and login successful',
                            token: token
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Please enter all fields'
            });
        }

        const user = await User.findOne({ email: email });

        if (user) {
            bcrypt.compare(password, user.password!, (__, result) => {
                if (result) {
                    jwt.sign({ user }, process.env.JSONSECRET!, { expiresIn: '12h' }, (err: any, token: any) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            res.status(200).header('auth-token', token).json({
                                message: 'Login successful',
                                token: token
                            });
                        }
                    });
                } else {
                    res.status(401).json({
                        message: 'Invalid credentials'
                    });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const getUser = async (req: Request & { user?: any }, res: Response) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const updateUser = async (req: Request & { user?: any, file?: any }, res: Response) => {
    try {
        const { name, address, contact, email, password } = req.body;

        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (name) {
            user.name = name;
        }

        if (address) {
            user.address = address;
        }

        if (contact) {
            user.contact = contact;
        }

        if (email) {
            user.email = email;
        }

        if (password) {
            const hash = await bcrypt.hash(password, 10);
            user.password = hash;
        }

        if (req.file) {
            user.profileImage = req.file.path;
        }

        user.save();

        res.status(200).json({
            message: 'User updated successfully'
        });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}