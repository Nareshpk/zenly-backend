import { Request, Response } from "express";
import UserProfile from "../models/UserProfile";
export const saveUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const {
      age,
      sex,
      bloodGroup,
      address,
    } = req.body;

    /* ------------------ IMAGE ------------------ */
    let avatar: string | undefined;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (files?.profile?.[0]) {
      avatar = `/uploads/${files.profile[0].filename}`;
    }

    /* ------------------ UPSERT PROFILE ------------------ */
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          age: age ? Number(age) : undefined,
          sex,
          bloodGroup,
          address,
          ...(avatar && { avatar }),
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("Save user profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await UserProfile.findOne({ userId });

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("Get user profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
