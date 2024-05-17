import { FormProvider, useForm } from "react-hook-form";
import {
  firebaseAuthErrorsHandler,
  formErrorsHandler,
} from "@/services/errorHandler";
import { IFormFieldOptions, IFormFieldType, IFormRegisterType } from "@/@types";
import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { capitalize, formatInvalidMessage } from "@/services/format";
import { useUsers } from "@/context/UsersContext";

interface Props {
  className?: string;
  handleOnSubmit: (data: IFormRegisterType) => Promise<void>;
  submitBtn: () => React.ReactNode | string;
  formFields: IFormFieldType;
  disabled?: boolean;
}

const defaultInputClass =
  "border border-solid bg-white rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center";

const AuthForm = ({
  className = "",
  handleOnSubmit,
  submitBtn,
  formFields,
  disabled = false,
}: Props) => {
  const methods = useForm<IFormRegisterType>({ mode: "onBlur" });
  const [error, setError] = useState<string | null>(null);
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const { verifyUniqueField } = useUsers();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: IFormRegisterType) => {
    console.log("test1", { data });
    const formError = formErrorsHandler(data);
    const invalidMessage: string[] = [];
    if (data.rg) {
      verifyUniqueField(data.rg, "rg") && invalidMessage.push("RG");
    }
    if (data.email) {
      verifyUniqueField(data.email, "email") && invalidMessage.push("Email");
    }
    if (data.cpf) {
      verifyUniqueField(data.cpf, "cpf") && invalidMessage.push("CPF");
    }

    console.log({ invalidMessage });

    console.log({ formError });
    if (!formError && invalidMessage.length < 1) {
      try {
        await handleOnSubmit(data);
      } catch (error: any) {
        console.log({ error });

        setError(error?.errors?.[0]?.message);
      }
    } else {
      if (formError) setError(formError);
      if (invalidMessage.length > 0)
        setError(invalidMessage.join(" ") + " já cadastrado.");
    }
  };

  const renderFormfield = (
    formName: string,
    formOptions: IFormFieldOptions,
  ) => {
    if (formOptions.fieldType === "select" && formOptions?._formStates) {
      const opt = formOptions?._formStates[0];
      const setOpt = formOptions?._formStates[1];
      return (
        <select
          className={
            "border border-solid bg-white rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center " +
            formOptions.inputClassName
          }
          onChange={evt => {
            setOpt(evt.target.value);
          }}
          value={opt}
        >
          {formOptions?.options &&
            formOptions?.options.map((e, i) => (
              <option key={i} value={e}>
                {capitalize(e)}
              </option>
            ))}
        </select>
      );
    }

    if (formOptions.fieldType === "textarea") {
      return (
        <textarea
          {...register(formName, formOptions)}
          className={`${formOptions?.inputClassName || ""} 
             ${defaultInputClass}`}
          defaultValue={formOptions.defaultValue}
        />
      );
    }

    if (formOptions.fieldType === "password") {
      return (
        <div className="relative">
          {hidePassword ? (
            <input
              type={formOptions.fieldType}
              {...register(formName, formOptions)}
              className={`${formOptions?.inputClassName || ""}
            ${defaultInputClass}`}
              defaultValue={formOptions.defaultValue}
              placeholder={formOptions.placeholder}
            />
          ) : (
            <input
              type="text"
              {...register(formName, formOptions)}
              className={`${formOptions?.inputClassName || ""}
            ${defaultInputClass} `}
            />
          )}
          <div
            className="absolute top-2 right-2"
            onClick={() => setHidePassword(prevState => !prevState)}
          >
            {hidePassword ? (
              <AiFillEye className="w-9 h-9 text-blue-900 dark:text-white" />
            ) : (
              <AiFillEyeInvisible className="w-9 h-9 text-blue-900 dark:text-white" />
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <input
          type={formOptions.fieldType}
          {...register(formName, formOptions)}
          className={`${formOptions?.inputClassName || ""}
            ${defaultInputClass}`}
          defaultValue={formOptions.defaultValue}
          placeholder={formOptions.placeholder}
          step={
            formOptions?.fieldType === "number" ? formOptions?.step : undefined
          }
          min={
            formOptions?.fieldType === "number"
              ? (formOptions?.min as unknown as number)
              : undefined
          }
          max={
            formOptions?.fieldType === "number"
              ? (formOptions?.max as unknown as number)
              : undefined
          }
        />
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        action=""
        className={`${className} w-full mx-auto px-4`}
        onSubmit={handleSubmit(onSubmit)}
      >
        {Object.entries(formFields).map(([formName, formOptions], index) => (
          <div key={index} className={`${formOptions.divClassName}  mt-8`}>
            <div className="flex items-center justify-between">
              <label
                htmlFor=""
                className={
                  formOptions?.labelClassName +
                  " block mb-3 font-sans text-blue-900 dark:text-white"
                }
              >
                {formOptions?.fieldLabel || capitalize(formName)}
              </label>
            </div>

            {renderFormfield(formName, formOptions)}
            {errors?.[formName] && (
              <p
                className={
                  formOptions?.errorClassName +
                  " text-red-400 h-0 w-0 whitespace-nowrap transition-all"
                }
              >
                {errors?.[formName]?.message}
              </p>
            )}
          </div>
        ))}
        <div className="flex flex-col items-center justify-center pt-8 col-span-full">
          <div className="block min-h-8">
            {error && (
              <small className="form-error dark:!text-red-500 ">{error}</small>
            )}
          </div>
          <button
            type="submit"
            className={`btn disabled:!bg-gray-400 max-w-[200px]`}
          >
            <div className="capitalize text-white font-normal">
              {submitBtn()}
            </div>
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AuthForm;
