import { useState } from "react";

interface IForm<T> {
  data?: T;
  title: string;
  headList: string[];
  keyList: string[];
  disabled?: string[];
  type: string[];
  acceptFile?: string[];
  hint?: string[];
  selectList?: {
    [key: string]: { key: string | number; name: string }[];
  };
  classCustom?: string;
  onSubmit: (data: T) => void;
  onCancel: () => void;
}

export function Import<T extends Record<string, any>>({
  data,
  title,
  headList,
  keyList,
  type,
  acceptFile,
  disabled = [],
  hint,
  selectList,
  classCustom,
  onSubmit,
  onCancel,
}: IForm<T>) {
  const [formData, setFormData] = useState<T>(() => {
    if (!data) {
      return keyList.reduce((acc, key) => ({ ...acc, [key]: "" }), {} as T);
    }
    return keyList.reduce(
      (acc, key) => ({
        ...acc,
        [key]: data[key] && key !== "password" ? data[key] : "",
      }),
      {} as T
    );
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleChangeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFormData((prevData) => ({
          ...prevData,
          [e.target.id]: file,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    console.log("Form: ", formData);
  };

  const isDisabled = (property: string) => {
    return disabled.includes(property);
  };

  const style = {
    button:
      "transition-all min-w-30 text-white px-2 py-2 rounded-lg cursor-pointer",
  };

  return (
    <div
      className={`${classCustom} flex flex-col h-full text-black rounded-md shadow-lg border-l-2 border-gray-400 p-4`}
    >
      <div className="h-16 py-4 px-4">
        <h1 className="text-green-700 font-bold">{title}</h1>
        <div className="h-0.5 w-full bg-gray-200 mt-2 rounded-lg"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 h-full px-4 py-3 bg-white overflow-y-auto"
      >
        {keyList.map((item, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex justify-between">
              <label htmlFor={item} className="font-medium text-gray-600">
                {headList[index]}
              </label>
            </div>

            {type[index] === "select" && selectList && selectList[item] && (
              <select
                disabled={isDisabled(item)}
                id={item}
                value={formData[item]}
                onChange={handleChange}
                className={`bg-gray-50 border-2 ${
                  isDisabled(item)
                    ? "border-gray-200 text-gray-400"
                    : "border-gray-300 text-black"
                } rounded-lg px-2 py-1.5`}
              >
                <option value="" disabled>
                  Pilih Item
                </option>
                {selectList[item].map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}

            {type[index] === "text-editor" && (
              <div>
                <textarea
                  id={item}
                  value={formData[item]}
                  onChange={handleChange}
                  className="bg-gray-50 border-2 border-gray-300 rounded-lg px-2 py-1.5 text-black w-full"
                ></textarea>
              </div>
            )}

            {type[index] === "date" && (
              <input
                disabled={isDisabled(item)}
                id={item}
                type={type[index]}
                value={
                  formData[item]
                    ? new Date(formData[item]).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className={`bg-gray-50 border-2 ${
                  isDisabled(item)
                    ? "border-gray-200 text-gray-400"
                    : "border-gray-300 text-black"
                } rounded-lg px-2 py-1.5 text-black`}
              />
            )}

            {type[index] === "file" && (
              <input
                disabled={isDisabled(item)}
                id={item}
                type={type[index]}
                accept={acceptFile?.join(',') ?? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
                onChange={handleChangeFileUpload}
                className={`bg-gray-50 border-2 ${
                  isDisabled(item)
                    ? "border-gray-200 text-gray-400"
                    : "border-gray-300 text-black"
                } rounded-lg px-2 py-1.5 text-black`}
              />
            )}

            {type[index] !== "select" &&
              type[index] !== "text-editor" &&
              type[index] !== "date" &&
              type[index] !== "file" && (
                <input
                  disabled={isDisabled(item)}
                  id={item}
                  type={type[index]}
                  value={formData[item]}
                  onChange={handleChange}
                  className={`bg-gray-50 border-2 ${
                    isDisabled(item)
                      ? "border-gray-200 text-gray-400"
                      : "border-gray-300 text-black"
                  } rounded-lg px-2 py-1.5 text-black`}
                />
              )}

            {hint?.[index] && (
              <p className="text-sm font-medium text-gray-400">{hint[index]}</p>
            )}
          </div>
        ))}
      </form>

      <div className="h-16 rounded-b-md">
        <div className="flex h-full gap-6 py-4 justify-center items-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className={
              "bg-blue-400 hover:bg-blue-500 font-semibold " + style.button
            }
          >
            UPDATE
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={
              "bg-red-400 hover:bg-red-500 font-semibold " + style.button
            }
          >
            BATAL
          </button>
        </div>
      </div>
    </div>
  );
}
