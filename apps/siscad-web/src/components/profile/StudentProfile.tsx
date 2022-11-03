import {
  FormEvent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAccessToken } from "../../api/oauth";
import { getPassportInfo } from "../../api/passport";
import {
  Fields,
  getStudentProfile,
  getStudentProfileFields,
  getStudentProfileInfo,
} from "../../api/siscad";
import { formDataToObject } from "../../util/formData";

export function StudentProfile() {
  const [studentProfileId, setStudentProfileId] = useState<string>();
  const [studentProfileData, setStudentProfileData] =
    useState<Record<string, string>>();

  const profileAlreadySubmitted = studentProfileId !== undefined;
  const hasProfileAccess = studentProfileData !== undefined;

  useEffect(() => {
    const accessToken = getAccessToken();

    getStudentProfileInfo({
      accessToken,
    })
      .then((data) => {
        if (data.profile?.id) {
          setStudentProfileId(data.profile.id);
        }
      })
      .catch(console.error);
  }, []);

  const onPasswordSubmit = (password: string) => {
    const accessToken = getAccessToken();

    if (studentProfileId) {
      getStudentProfile({
        accessToken,
        password,
        studentProfileId,
      })
        .then((data) => {
          if (!data.error) {
            setStudentProfileData(data);
          }
        })
        .catch(console.error);
    }
  };

  return (
    <div className="relative">
      <StudentPasswordPrompt
        open={profileAlreadySubmitted && !hasProfileAccess}
        onSubmit={onPasswordSubmit}
      />
      <StudentProfileForm submittedProfileData={studentProfileData} />
    </div>
  );
}

function StudentPasswordPrompt(props: {
  open?: boolean;
  onSubmit: (password: string) => void;
}) {
  const [password, setPassword] = useState("");

  return (
    <div
      className={`${
        props.open ? "block" : "hidden"
      } absolute bg-gray-200/80 h-full w-full p-4 z-[2]`}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          props.onSubmit(password);
        }}
        className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-6"
      >
        <h4 className="text-gray-700 text-lg">
          Digite sua senha para visualizar seus dados
        </h4>
        <div className="p-4 border border-gray-200 rounded-md flex gap-4">
          <i className={`bi bi-lock-fill text-lg text-gray-600`}></i>
          <input
            type="password"
            className="placeholder:text-xl w-full"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder={"Sua senha"}
          />
        </div>
        <button
          type="submit"
          className="rounded text-white text-lg font-semibold w-full p-4 bg-blue-400 hover:bg-blue-500"
        >
          <span>Visualizar</span>
        </button>
      </form>
    </div>
  );
}

export function StudentProfileForm(props: {
  submittedProfileData?: Record<string, string>;
}) {
  const [fields, setFields] = useState<Fields>([]);

  useEffect(() => {
    getStudentProfileFields().then((data) => setFields(data));
  }, []);

  const onSubmit = useMemo(
    () => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);

      const { password, ...studentProfile } = formDataToObject(formData);

      const accessToken = getAccessToken();

      fetch("http://localhost:3001/v1/profiles", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          password,
          student_profile: studentProfile,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            window.location.reload();
          }
        });
    },
    []
  );

  return (
    <form onSubmit={onSubmit} className="text-sm">
      <FormRow className="form-row">
        <p>
          Conheça a Política de Privacidade e Proteção de Dados no âmbito da
          Fundação Universidade Federal de Mato Grosso do Sul (UFMS) publicada
          no{" "}
          <a
            className="text-blue-500"
            href="https://boletimoficial.ufms.br/bse/publicacao?id=427333"
          >
            boletim oficial da UFMS
          </a>
        </p>
      </FormRow>

      {fields.map((question, i) => (
        <SelectFormRow
          key={question.name}
          name={question.name}
          label={`${i + 1}. ${question.label}`}
          value={props.submittedProfileData?.[question.name]}
        >
          {question.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectFormRow>
      ))}

      {props.submittedProfileData === undefined && (
        <>
          <div className="py-4 px-6 flex gap-2">
            <input type="checkbox" id="userConsent" />
            <label htmlFor="userConsent">
              Autorizo a coleta e utilização dos meus dados
            </label>
          </div>

          <div className="p-4 flex justify-end">
            <button
              type="submit"
              className="py-2 px-6 bg-blue-500 hover:bg-blue-600 rounded-sm text-white font-semibold"
            >
              Finalizar
            </button>
          </div>
        </>
      )}
    </form>
  );
}

function SelectFormRow(
  props: PropsWithChildren<{
    name: string;
    label: string;
    value?: string;
  }>
) {
  return (
    <FormRow>
      <label className="font-semibold">{props.label}</label>
      <select
        name={props.name}
        className="block w-full py-2 px-4 bg-white border border-gray-200"
        value={props.value}
      >
        <option value="">Selecione</option>
        {props.children}
      </select>
    </FormRow>
  );
}

function FormRow(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  return <div {...props} className="flex flex-col gap-2 p-4 even:bg-gray-10" />;
}
