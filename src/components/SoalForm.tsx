import { useState } from "react";
import { convertImageToBase64 } from "../utils/upload";
import WysiwygArea from "./WysiwygArea";

interface IForm<T> {
  data?: T;
  title: string;
  headList: string[];
  keyList: string[];
  disabled?: string[];
  type: string[];
  hint?: string[];
  selectList?: {
    [key: string]: { key: string | number; name: string }[];
  };
  classCustom?: string;
  onSubmit: (data: T) => void;
  onCancel: () => void;
}

export function SoalForm<T extends Record<string, any>>({
  data,
  title,
  headList,
  keyList,
  type,
  disabled = [],
  hint,
  selectList,
  classCustom,
  onSubmit,
  onCancel,
}: IForm<T>) {
  const [useImage, setUseImage] = useState(false);
  const [itype, setItype] = useState<string[]>(type);
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
      convertImageToBase64(file).then((image) => {
        const { id } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: image }));
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // encode any text-editor fields to base64
    const payload = keyList.reduce((acc, key, idx) => {
      const val = formData[key] ?? ""
      acc[key] =
        itype[idx] === "text-editor"
          ? btoa(unescape(encodeURIComponent(val.replace(
            /<annotation encoding="application\/vnd\.wiris\.mtweb-params\+json">[\s\S]*?<\/annotation>/g,
            ''
          ))))
          : val
      return acc
    }, {} as T)

    // submit encoded payload
    onSubmit(payload)
    console.log("Form: ", payload)
    // onSubmit(formData);
    // console.log("Form: ", formData);
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

      <div className="flex items-center gap-2 px-4">
        <input
          type="checkbox"
          id="useImage"
          checked={useImage}
          onChange={() => setUseImage((prev) => {
            if(!prev){
              setItype(["select", "select", "file", "text-editor", "file", "file", "file", "file", "select"]);
            }
            else{
              // if (!prev) {
              //   setFormData((prevData) => ({
              //   ...prevData,
              //   pilihan_a: "",
              //   pilihan_b: "",
              //   pilihan_c: "",
              //   pilihan_d: "",
              //   }));
              // }
              setItype(["select", "select", "file", "text-editor", "text", "text", "text", "text", "select"]);
            }
            return !prev
          })}
          className="cursor-pointer"
        />
        <label htmlFor="useImage" className="cursor-pointer text-gray-600">
          Use Image
        </label>
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

            {itype[index] === "select" && selectList && selectList[item] && (
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

            {itype[index] === "text-editor" && (
              <div>
                {/* <textarea
                  id={item}
                  value={formData[item]}
                  onChange={handleChange}
                  className="bg-gray-50 border-2 border-gray-300 rounded-lg px-2 py-1.5 text-black w-full"
                ></textarea> */}
                <WysiwygArea
                  content={formData[item]?.replace(
                    /<annotation encoding="application\/vnd\.wiris\.mtweb-params\+json">[\s\S]*?<\/annotation>/g,
                    ''
                  )}
                  onChange={(value) =>
                    setFormData((prevData) => ({ ...prevData, [item]: value }))
                  }
                />
              </div>
            )}

            {itype[index] === "date" && (
              <input
                disabled={isDisabled(item)}
                id={item}
                type={itype[index]}
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

            {itype[index] === "file" && (
              <input
                disabled={isDisabled(item)}
                id={item}
                type={itype[index]}
                onChange={handleChangeFileUpload}
                className={`bg-gray-50 border-2 ${
                  isDisabled(item)
                    ? "border-gray-200 text-gray-400"
                    : "border-gray-300 text-black"
                } rounded-lg px-2 py-1.5 text-black`}
              />
            )}

            {itype[index] !== "select" &&
              itype[index] !== "text-editor" &&
              itype[index] !== "date" &&
              itype[index] !== "file" && (
                <input
                  disabled={isDisabled(item)}
                  id={item}
                  type={itype[index]}
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
