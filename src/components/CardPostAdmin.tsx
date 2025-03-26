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
        <div className={`flex shadow-lg rounded-lg mx-4 md:mx-auto my-5 max-w-md md:max-w-2xl ${post.status !== "approved" ? "bg-gray-200" : "bg-white"}`}>
            <div className="flex items-start px-4 py-6">
                <ProfilePicture post={post} />
                
                <div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-900 -mt-1">{post.author.name}</h2>
                        <h3 className="text-lg font-semibold text-gray-900 -mt-1">{post.title}</h3>
                    </div>
                    <p className="mt-3 text-gray-700 text-sm">{post.content}</p>
                    {post.image && <img src={post.image} alt="Post Image" className="mt-2 w-full rounded-md" />}
                    
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
            </div>
        </div>
    );
};

export default CardPostAdmin;
