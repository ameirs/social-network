import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function UserFeed() {
    const { id } = useParams();
    const [postData, setPostData] = useState([]);

    useEffect(() => {
        fetch(`/posts/${id}.json`)
            .then((response) => response.json())
            .then((postData) => {
                console.log("results: ", postData);
                setPostData(postData);
            });        
    }, []);


    useEffect(() => {
        console.log("postData -> ", postData);
    }, [postData]);

    return (
        <>
            {postData?.map((post) => (
                <div key={post.id} className="post-card">
                    <div className="img-container">
                        <img className="preview_img" src={post.preview_img} />
                    </div>
                    <div className="card-info">
                        {/* <div className="avatar-post-container">
                            <img className="avatar" src={post.img_url} />
                        </div> */}
                        <div className="post-text">
                            <p>{post.post_text}</p>
                        </div>
                        <div className="preview_info">
                            <p>{post.preview_desc}</p>
                            <a href={post.preview_url}>
                                {post.preview_title
                                    ? post.preview_title
                                    : "Go to Website"}
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

