import {
  FormEvent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAccessToken } from "../../api/oauth";
import { formDataToObject } from "../../util/formData";

type Fields = Array<{
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}>;

export function StudentProfileForm() {
  const [fields, setFields] = useState<Fields>([]);

  useEffect(() => {
    fetch("http://localhost:3001/v1/profiles/fields")
      .then((response) => response.json())
      .then((data) => setFields(data));
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
        .then(console.log);
    },
    []
  );

  return (
    <form onSubmit={onSubmit} className="text-sm">
      <FormRow className="form-row">
        <h3 className="uppercase">Dados pessoais</h3>
      </FormRow>
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
        >
          {question.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectFormRow>
      ))}

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
    </form>
  );
}

function SelectFormRow(
  props: PropsWithChildren<{ name: string; label: string }>
) {
  return (
    <FormRow>
      <label className="font-semibold">{props.label}</label>
      <select
        name={props.name}
        className="block w-full py-2 px-4 bg-white border border-gray-200"
        defaultValue=""
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
