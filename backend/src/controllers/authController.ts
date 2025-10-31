import { compare, hash } from "bcrypt";
import { prisma } from "../utils/connection";
import { sendToken } from "../utils/features";
import { Request, Response } from "express";

const signUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const exist = await prisma.user.findUnique({
            where: { email },
        });

        if (exist) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        sendToken(res, userWithoutPassword, 201, "User created successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Sign Up failed", error });
    }
};

const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        if (!user.password) {
            return res.status(400).json({ success: false, message: "Password not set for this user" });
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return res.status(404).json({
                success: false,
                message: "Invalid password",
            });
        }

        const { password: _, ...userWithoutPassword } = user;

        sendToken(res, userWithoutPassword, 200, `${user.username} logged in successfully`);
    } catch (error) {
        res.status(500).send({ success: false, message: "Error in sign in API", error });
    }
};

export { signUp, signIn };