import type { StudentProfile, StudentProfileAccess } from "@lgpd-lesson/shared";

export const SISCAD_API_URL =
  import.meta.env.SISCAD_API_URL ?? "http://localhost:3001/v1";

export const getStudentProfileInfo = ({
  accessToken,
}: {
  accessToken: string | null;
}): Promise<{
  profile?: Pick<StudentProfile, "id" | "userId">;
  profilesShared: Pick<StudentProfileAccess, "studentProfileId" | "userId">[];
  profileSharedWith: Pick<
    StudentProfileAccess,
    "studentProfileId" | "userId"
  >[];
}> =>
  fetch(`${SISCAD_API_URL}/profiles`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json());

export const getStudentProfile = ({
  studentProfileId,
  accessToken,
  password,
}: {
  studentProfileId: string;
  accessToken: string | null;
  password: string;
}) =>
  fetch(`${SISCAD_API_URL}/profiles/${studentProfileId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      password,
    },
  }).then((response) => response.json());

export type Fields = Array<{
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}>;

export const getStudentProfileFields = (): Promise<Fields> =>
  fetch(`${SISCAD_API_URL}/profiles/fields`).then((response) =>
    response.json()
  );

export const submitStudentProfile = ({
  accessToken,
  password,
  studentProfile,
}: {
  accessToken: string | null;
  password: string;
  studentProfile: Record<string, string>;
}) =>
  fetch(`${SISCAD_API_URL}/profiles`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      password,
      student_profile: studentProfile,
    }),
  }).then((response) => response.json());
