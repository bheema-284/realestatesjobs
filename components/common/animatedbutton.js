const AnimatedBorderLoader = ({ title }) => {
    return (
        <div
            className={`
        relative w-full max-w-[150px] h-10
        flex items-center px-3 sm:px-4 py-1.5 rounded text-sm text-gray-800 sm:text-base justify-center
        rounded-lg overflow-hidden
        bg-white
      `}
        >
            {/* Top border */}
            <span
                className="absolute top-0 left-0 h-0.5 w-0 
                   bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500
                   animate-drawLineTop"
            />
            {/* Right border */}
            <span
                className="absolute top-0 right-0 w-0.5 h-0 
                   bg-gradient-to-b from-orange-400 via-purple-500 to-pink-500
                   animate-drawLineRight"
            />
            {/* Bottom border */}
            <span
                className="absolute bottom-0 right-0 h-0.5 w-0 
                   bg-gradient-to-l from-orange-400 via-purple-500 to-pink-500
                   animate-drawLineBottom"
            />
            {/* Left border */}
            <span
                className="absolute bottom-0 left-0 w-0.5 h-0 
                   bg-gradient-to-t from-orange-400 via-purple-500 to-pink-500
                   animate-drawLineLeft"
            />

            <div className="relative z-10 font-semibold text-gray-700 text-center px-3 sm:px-4 py-1.5 rounded text-sm sm:text-base whitespace-nowrap">
                {title}
            </div>
        </div>
    );
};
export default AnimatedBorderLoader