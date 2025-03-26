"use client";
import { useEffect, useState } from "react";

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("")
        .slice(0, 2);
};

const colors = ["bg-[#d0dfbd]", "bg-[#e3d6b8]", "bg-[#9ead89]"];

interface AvatarProps {
    name: string;
    profilePicture?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, profilePicture }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [profilePicture]);

    const colorClass = colors[name.charCodeAt(0) % colors.length];

    return (
        <>
            {profilePicture && !imageError ? (
                <img className="w-12 h-12 rounded-full object-cover mr-4 shadow" src={profilePicture} alt="avatar" onError={() => setImageError(true)}/>
            ) : (
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${colorClass} mr-4 shadow`}
                >
                    {getInitials(name)}
                </div>
            )}
        </>
    );
};

export default Avatar;