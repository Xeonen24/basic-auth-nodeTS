import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import type { IUser } from "../types";

export const registerNew = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Please enter all fields" });

    const userexist = await User.findOne({ email });
    if (userexist) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 16);
    const user = new User({ username, email, password: hash });
    await user.save();

    const token = jwt.sign({ user }, process.env.JSONSECRET!, { expiresIn: "1d" });
    res.status(201).json({
      message: "User creation successful and login successful",
      token,
      user: username,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Please enter all fields" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ user }, process.env.JSONSECRET!, { expiresIn: "1d" });
    res.status(200).header("auth-token", token).json({
      message: "Login successful",
      token,
      user: username,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUser = async (req: Request & { user?: any }, res: Response) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateUser = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.username = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 16);

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
