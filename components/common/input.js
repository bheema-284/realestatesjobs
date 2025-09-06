import React from "react";

function Input(props) {
  const {
    title,
    placeholder,
    type,
    name,
    id,
    onChange,
    onBlur,
    isError,
    value,
    errormsg,
    disabled,
    required,
    containerstyle,
    inputProps,
    max,
    min,
    step,
    maxLength,
    nocaps,
  } = props;

  return (
    <div className={containerstyle}>
      <div
        className={`relative border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-purple-600 focus-within:border-purple-600 dark:focus-within:ring-purple-400 dark:focus-within:border-purple-400 ${disabled ? "opacity-50" : "opacity-100"
          } bg-white dark:bg-gray-800`}
      >
        <label
          htmlFor={id}
          className={`label capitalize text-gray-500 dark:text-gray-400
            absolute -top-2 left-2 -mt-px inline-block bg-white dark:bg-gray-800 px-1 text-xs font-medium`}
        >
          {title}
          {required ? "*" : null}
        </label>
        <input
          type={type}
          name={name}
          id={id}
          className={
            nocaps
              ? `block w-full border-0 p-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 text-[1.125rem] mt-[0.188rem] bg-transparent`
              : `block w-full border-0 p-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 text-[1.125rem] mt-[0.188rem] ${!value && value?.length === 0 ? "opacity-50" : "opacity-100"
              } bg-transparent`
          }
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          value={value}
          required={required}
          max={max}
          min={min}
          step={step}
          maxLength={maxLength}
          autoComplete={"off"}
          autoCorrect={"off"}
          {...inputProps}
        />
      </div>

      {isError && (
        <p className={`text-red-600 mt-2 text-sm`} id="email-error">
          {errormsg}
        </p>
      )}
    </div>
  );
}

export default Input;