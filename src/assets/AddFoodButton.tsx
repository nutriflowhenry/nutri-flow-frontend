const AddFoodButton = () => {
    return (
        <div className="w-[91px] h-[95px] flex items-center justify-center z-50 p-0 overflow-visible">
            <svg
                width="91"
                height="92"
                viewBox="0 0 91 92"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Círculo de fondo */}
                <g filter="url(#filter1_dd_68_666)">
                    <circle cx="49" cy="49" r="35" fill="url(#paint0_linear_68_666)" />
                </g>

                {/* Icono de suma */}
                <path d="M34 49H61" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M48 62V35" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>

                <defs>
                    <filter id="filter1_dd_68_666" x="0" y="0" width="98" height="98" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feOffset dx="4" dy="4"/>
                        <feGaussianBlur stdDeviation="5"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feBlend mode="normal" in="SourceGraphic"/>
                    </filter>
                    <linearGradient id="paint0_linear_68_666" x1="23" y1="25.5" x2="70" y2="80" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D9E3CA"/>
                        <stop offset="1" stopColor="#686E5F"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default AddFoodButton;
