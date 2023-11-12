import { useEffect, useState, useContext } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../../config/firebase";
import { addPost } from "../../services/postService";
import { getUserData } from "../../services/users.services";
import UserContext from "../../providers/user.context";
import LikesDislikes from "../../components/Likes-Dislikes/LikesDislikes";
import Comments from "../../components/Comments/Comments";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const { user } = useContext(UserContext);

  // Define postsRef outside of useEffect
  const postsRef = ref(db, "posts");

  const fetchData = async () => {
    try {
      const snapshot = await get(postsRef);
      const postData = snapshot.val();

      if (postData) {
        const postArray = await Promise.all(
          Object.entries(postData).map(async ([id, data]) => {
            let userData = null;
            if (data.uid) {
              const userDataSnapshot = await getUserData(data.uid);
              if (userDataSnapshot.exists()) {
                userData = userDataSnapshot.val();
              }
            }
            return { id, ...data, user: userData };
          })
        );
        setPosts(postArray);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const unsubscribe = onValue(postsRef, () => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  const handleAddPost = async () => {
    await addPost(newPostTitle, newPostContent, user);
    setNewPostTitle("");
    setNewPostContent("");
  };

  return (
    <div>
      <h2>This is where you read and create posts</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
      </div>
      <div>
        <button type="button" onClick={handleAddPost}>
          Create Post
        </button>
      </div>
      {posts.map((post) => (
        <div key={post.id}>
          <p>Created by: {user.email}</p>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {/* pass postId to LikesDislikes and Comments */}
          <LikesDislikes postId={post.id} />
          <Comments postId={post.id} />
        </div>
      ))}
    </div>
  );
}
