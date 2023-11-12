import { useEffect, useState, useContext } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../../config/firebase";
import { addPost } from "../../services/postService";
import { getUserData } from "../../services/users.services";
import UserContext from "../../providers/user.context";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [comments, setComments] = useState({});
  const [userLikedPosts, setUserLikedPosts] = useState([]);
  const [userDislikedPosts, setUserDislikedPosts] = useState([]);
  const { user } = useContext(UserContext);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const postsRef = ref(db, "posts");
    const unsubscribe = onValue(postsRef, async (snapshot) => {
      const postData = snapshot.val();
      if (postData) {
        const postArray = await Promise.all(
          Object.entries(postData).map(async ([id, data]) => {
            if (data.uid) {
              const userDataSnapshot = await getUserData(data.uid);
              const userData = userDataSnapshot.val();
              return { id, ...data, user: userData };
            } else {
              return { id, ...data, user: null };
            }
          })
        );
        setPosts(postArray);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLikePost = (postId) => {
    if (userLikedPosts.includes(postId)) {
      // If the post is already liked, remove the like
      setLikes((prevLikes) => {
        const updatedLikes = { ...prevLikes };
        delete updatedLikes[postId];
        return updatedLikes;
      });
      setUserLikedPosts((prevLikedPosts) =>
        prevLikedPosts.filter((id) => id !== postId)
      );
    } else {
      // If the post is not liked, add the like
      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: (prevLikes[postId] || 0) + 1,
      }));
      setUserLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
    }
  };

  const handleDislikePost = (postId) => {
    if (userDislikedPosts.includes(postId)) {
      // If the post is already disliked, remove the dislike
      setDislikes((prevDislikes) => {
        const updatedDislikes = { ...prevDislikes };
        delete updatedDislikes[postId];
        return updatedDislikes;
      });
      setUserDislikedPosts((prevDislikedPosts) =>
        prevDislikedPosts.filter((id) => id !== postId)
      );
    } else {
      // If the post is not disliked, add the dislike
      setDislikes((prevDislikes) => ({
        ...prevDislikes,
        [postId]: (prevDislikes[postId] || 0) + 1,
      }));
      setUserDislikedPosts((prevDislikedPosts) => [
        ...prevDislikedPosts,
        postId,
      ]);
    }
  };

  const handleAddComment = (postId) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), commentInput],
    }));
  
    // Clear the comment input after adding a comment
    setCommentInput("");
  };

  const handleAddPost = async () => {
    await addPost(newPostTitle, newPostContent, user);
    const postsRef = ref(db, "posts");
    const snapshot = await get(postsRef);
    const postData = snapshot.val();
    if (postData) {
      const postArray = await Promise.all(
        Object.entries(postData).map(async ([id, data]) => {
          if (data.uid) {
            const userDataSnapshot = await getUserData(data.uid);
            const userData = userDataSnapshot.val();
            return { id, ...data, user: userData };
          } else {
            return { id, ...data, user: null };
          }
        })
      );
      setPosts(postArray);
    }

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
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Created by: {post.user?.email || "Unknown User"}</p>
          <button onClick={() => handleLikePost(post.id)}>
            Like ({likes[post.id] || 0})
          </button>
          <button onClick={() => handleDislikePost(post.id)}>
            Dislike ({dislikes[post.id] || 0})
          </button>
          <div>
            <h4>Comments:</h4>
            <ul>
              {(comments[post.id] || []).map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
            <input
  type="text"
  placeholder="Add a comment"
  value={commentInput}
  onChange={(e) => setCommentInput(e.target.value)}
/>
<button onClick={() => handleAddComment(post.id, commentInput)}>
  Add Comment
</button>
          </div>
        </div>
      ))}
    </div>
  );
}