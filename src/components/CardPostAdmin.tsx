import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfilePicture from "@/components/Avatar";
import { IPost } from "@/types";

interface PostCardProps {
    post: IPost;
    handlePostStatus: (id: string, status: string) => void;
}

const CardPostAdmin: React.FC<PostCardProps> = ({ post, handlePostStatus }) => {
    return (
        <div className={`flex flex-col md:flex-row shadow-lg rounded-lg mx-auto my-5 max-w-md md:max-w-2xl ${post.status !== "approved" ? "bg-gray-200" : "bg-white"}`}>
        
        <div className="flex justify-center items-center md:justify-start md:items-start pt-4 pl-6">
            <ProfilePicture post={post} />
        </div>

        <div className="flex-1 px-6 py-6 pt-3 flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">{post.author.name}</h2>
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>

                {post.image && (
                    <div className="w-full mt-2 md:hidden">
                        <img src={post.image} alt="Post Image" className="w-2/3 h-auto p-2 rounded-xl mx-auto" />
                    </div>
                )}

                <p className="mt-3 mr-0 text-gray-700 text-sm w-full text-justify">{post.content}</p>
            </div>

            {/* Reacciones y Botón */}
            <div className="mt-4 flex items-center">
                <div className="flex mr-2 text-gray-700 text-sm">
                    <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-1" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post.reactions.length}</span>
                </div>
                <button onClick={() => handlePostStatus(post.id, post.status)} className="mx-1 flex items-center">
                    <FontAwesomeIcon icon={post.status === "approved" ? faBan : faCheck} className={`text-1xl mr-1 ${post.status === "approved" ? "text-red-500" : "text-green-500"}`} />
                    {post.status === "approved" ? "Bloquear" : "Desbloquear"}
                </button>
            </div>
        </div>

        {/* Imagen del Post (Derecha en pantallas grandes) */}
        {post.image && (
            <div className="hidden md:flex w-1/3 justify-end px-7 m-auto mt-19 py-2 md:pb-0">
                <img src={post.image} alt="Post Image" className="w-auto h-40 object-cover rounded-md" />
            </div>
        )}
    </div>
    );
};

export default CardPostAdmin;
