
export default function Button({ title, type, btnType, onClick, disabled }) {
    return (
        <button
            type={type}
            className={`${disabled ? "opacity-50 cursor-not-allowed" : "opacity-100"} w-full text-white bg-violet-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-violet-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="capitalize">{title}</span>
        </button>
    )
}