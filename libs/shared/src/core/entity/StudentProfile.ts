import { User } from "./User";

export interface StudentProfile {
  id: string;

  maritalStatus: string;
  skinColor: string;

  userId: User["id"];
  symmetricKey: string;
}

export interface StudentProfileAccess {
  studentProfileId: StudentProfile["id"];
  userId: User["id"];

  usageIntention: string;

  symmetricKey: string | null;
}
