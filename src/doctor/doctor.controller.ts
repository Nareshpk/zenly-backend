import { Request, Response } from "express";
import { DoctorModel } from "./doctor.schema";
import bcrypt from "bcryptjs";

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const payload = JSON.parse(req.body.data);

    // profile image
    if (req.file) {
      payload.personal.profileImage = req.file.filename;
    }

    // hash password
    payload.account.password = await bcrypt.hash(
      payload.account.password,
      10
    );

    const doctor = await DoctorModel.create(payload);

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: "Doctor creation failed",
    });
  }
};


export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "");
    const status = String(req.query.status || "all");

    const skip = (page - 1) * limit;

    const query: any = {};

    // 🔍 SEARCH
    if (search) {
      query.$or = [
        { "personal.firstName": { $regex: search, $options: "i" } },
        { "personal.lastName": { $regex: search, $options: "i" } },
        { "account.email": { $regex: search, $options: "i" } },
        {
          "professional.primarySpecialization": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ✅ STATUS FILTER
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    const doctors = await DoctorModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DoctorModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid doctor ID",
    });
  }
};




export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const payload = JSON.parse(req.body.data);

    // If image updated
    if (req.file) {
      payload.personal.profileImage = req.file.filename;
    }

    // Hash password only if updated
    if (payload.account?.password) {
      payload.account.password = await bcrypt.hash(
        payload.account.password,
        10
      );
    }

    const updatedDoctor = await DoctorModel.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Doctor update failed",
    });
  }
};

export const updateDoctorStatus = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;

    const doctor = await DoctorModel.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor status updated",
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update doctor status",
    });
  }
};

