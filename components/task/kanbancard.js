
const TaskCard = ({ task = {} }) => {
    const getBadgeColor = (type) => {
        const mappings = {
            Design: 'purple',
            'Feature Request': 'teal',
            Backend: 'blue',
            QA: 'green',
            default: 'teal',
        };
        return mappings[type] || mappings.default;
    };
    const colorClasses = {
        purple: 'bg-purple-100 text-purple-800',
        teal: 'bg-teal-100 text-teal-800',
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
    };

    const Badge = ({ color = 'teal', children }) => {
        return (
            <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[color] || colorClasses.teal}`}
            >
                {children}
            </span>
        );
    };

    return (
        <div className="bg-white shadow rounded px-3 pt-3 pb-5 border border-white">
            <div className="flex justify-between">
                <p className="text-gray-700 font-semibold font-sans tracking-wide text-sm">
                    {task.title}
                </p>
                <img
                    className="w-6 h-6 rounded-full ml-3"
                    src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
                    alt="Avatar"
                />
            </div>
            <div className="flex mt-4 justify-between items-center">
                <span className="text-sm text-gray-600">{task.date}</span>
                {task.type && (
                    <Badge color={getBadgeColor(task.type)}>{task.type}</Badge>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
