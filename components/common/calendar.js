import React from 'react'

function Calendar(props) {
    const {
        title,
        placeholder,
        type,
        name,
        id,
        onBlur,
        iserror,
        value,
        errormsg,
        disabled,
        required,
        rangepicker,
        fromtitle,
        totitle,
        pattern,
        toOnchange,
        fromOnchange,
        tomin,
        min,
        tomax,
        max,
        toValue,
        containerStyle,
        fromContainerStyle,
        toContainerStyle,
        errorContainerStyle,
        fromInputProps,
        toInputProps,
        orangeColor,
        step
    } = props;

    function getMinMaxValueIfValid(inputElement) {
        const value = inputElement && (inputElement.includes("-") || inputElement.includes(":")) ? inputElement : undefined;
        return value;
    }


    return (
        <>
            <div className={containerStyle}>
                <div
                    className={`relative border border-gray-300 bg-white rounded-md px-3 py-2 shadow-sm focus-within:ring-1 ${orangeColor ? "focus-within:ring-orange-500 focus-within:border-orange-500" : "focus-within:ring-purple-600 focus-within:border-purple-600"}
            ${fromContainerStyle} ${disabled ? "opacity-50" : "opacity-100"}`}
                >
                    <label htmlFor="name" className="label capitalize text-gray-500">
                        {rangepicker ? fromtitle : title}
                        {required ? "*" : null}
                    </label>
                    <input
                        type={type}
                        name={name}
                        id={id}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 text-[1.125re] mt-[0.188rem]"
                        placeholder={placeholder}
                        onChange={fromOnchange}
                        onBlur={onBlur}
                        disabled={disabled}
                        value={value}
                        required={required}
                        pattern={pattern}
                        min={getMinMaxValueIfValid(min)}
                        max={getMinMaxValueIfValid(max)}
                        step={step}
                        {...fromInputProps}
                    />
                </div>

                {rangepicker && (
                    <>
                        <div
                            className={`relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 ${orangeColor ? "focus-within:ring-orange-500 focus-within:border-orange-500" : "focus-within:ring-purple-600 focus-within:border-purple-600"} ${toContainerStyle} ${disabled ? "opacity-50" : "opacity-100"}`}
                        >
                            <label htmlFor="name" className="label capitalize text-gray-500">
                                {rangepicker ? totitle : title}
                                {required ? "*" : null}
                            </label>
                            <input
                                type={type}
                                name={name}
                                id={id}
                                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 text-[1.125re] mt-[0.188rem]"
                                placeholder={placeholder}
                                onChange={toOnchange}
                                onBlur={onBlur}
                                disabled={disabled}
                                value={toValue}
                                required={required}
                                pattern={pattern}
                                min={getMinMaxValueIfValid(tomin)}
                                max={getMinMaxValueIfValid(tomax)}
                                step={step}
                                {...toInputProps}
                            />
                        </div>
                    </>
                )}
            </div>
            <div className={errorContainerStyle}>
                {iserror && (
                    <p className={`${orangeColor ? "text-orange-600" : "text-red-600"} mt-2 text-sm`}>
                        {errormsg}
                    </p>
                )}

            </div>
        </>
    );
}


export default Calendar;