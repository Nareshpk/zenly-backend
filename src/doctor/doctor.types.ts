export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  profileImage?: string; // stored filename
}

export interface ProfessionalInfo {
  primarySpecialization: string;
  secondarySpecialization?: string;
  licenseNumber: string;
  licenseExpiry: string;
  qualifications: string;
  experience: string;
  education: string;
  certifications: string;
  department: string;
  position: string;
}

export interface AccountInfo {
  username: string;
  password: string;
  email: string;
}

export interface AccessPermissions {
  patientRecords: boolean;
  prescriptions: boolean;
  billing: boolean;
  reports: boolean;
}

export interface Notifications {
  appointments: boolean;
  patientUpdates: boolean;
  system: boolean;
}

export interface CreateDoctorPayload {
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  account: AccountInfo;
  access: AccessPermissions;
  notifications: Notifications;
}
