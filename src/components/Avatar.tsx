"use client";
import { IPost } from "@/types";
import { useEffect, useState } from "react";

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")
        .slice(0, 2);
};

const colors = ["bg-[#d0dfbd]", "bg-[#e3d6b8]", "bg-[#9ead89]", "bg-[#b8d6e3]", "bg-[#e3b8c2]"];

export const Avatar: React.FC<{ name: string }> = ({ name }) => {
    const [bgColor, setBgColor] = useState("");

    useEffect(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setBgColor(randomColor);
    }, [name]);

    return (
        <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${bgColor} mr-4 shadow`}
        >
            {getInitials(name)}
        </div>
    );
};

export const ProfilePicture: React.FC<{ post: IPost }> = ({ post }) => {
    const [imageError, setImageError] = useState(false);
    if (!post || !post.author) return null;

    const { name, profilePicture } = post.author;
    
    return (
        <div className="flex justify-center items-center">
            {profilePicture  && !imageError ?(
                <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={profilePicture}
                    alt="Profile"
                    onError={() => setImageError(true)}
                />
            ) : (
                <Avatar name={name} />
            )}
        </div>
    );
};