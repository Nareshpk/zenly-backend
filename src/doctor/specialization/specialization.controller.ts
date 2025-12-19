import { Request, Response } from "express";
import specializationModel from "./specialization.model";

/* CREATE */
export const createSpecialization = async (req: Request, res: Response) => {
  try {
    const { name, description, department } = req.body;

    const exists = await specializationModel.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Specialization already exists" });
    }

    const specialization = await specializationModel.create({
      name,
      description,
      department,
    });

    res.status(201).json({ success: true, data: specialization });
  } catch (error) {
    res.status(500).json({ success: false, message: "Create failed" });
  }
};

/* GET ALL */
export const getAllSpecializations = async (req: Request, res: Response) => {
  const data = await specializationModel.find().sort({ createdAt: -1 });
  console.log("data=================>>" + data);

  res.json({ success: true, data });
};

/* GET BY ID */
export const getSpecializationById = async (req: Request, res: Response) => {
  const specialization = await specializationModel.findById(req.params.id);
  if (!specialization)
    return res.status(404).json({ message: "Not found" });

  res.json({ success: true, data: specialization });
};

/* UPDATE */
export const updateSpecialization = async (req: Request, res: Response) => {
  const updated = await specializationModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, data: updated });
};

/* TOGGLE ACTIVE */
export const toggleSpecializationStatus = async (
  req: Request,
  res: Response
) => {
  const specialization = await specializationModel.findById(req.params.id);
  if (!specialization)
    return res.status(404).json({ message: "Not found" });

  specialization.isActive = !specialization.isActive;
  await specialization.save();

  res.json({ success: true, data: specialization });
};

/* DELETE */
export const deleteSpecialization = async (req: Request, res: Response) => {
  await specializationModel.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted successfully" });
};
