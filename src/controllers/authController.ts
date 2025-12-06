import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    console.log("req.body==========>>",req.body);
    
  const { firstName,lastName, email,phone, role,password,confirmPassword } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const cPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, email,phone, role, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ user: { id: newUser._id,firstName, lastName, email,phone, role, password }, token });
  } catch (err) {
    next({ message: "Server error" });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user: any = await User.findOne({ email });
    if (!user) res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({ user: { id: user._id, name: user.name, email }, token });
  } catch (err) {
    next({ message: "Server error" });
  }
};
