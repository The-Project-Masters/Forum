import { useEffect, useState, useContext } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../../config/firebase";
import LikesDislikes from "../../components/Likes-Dislikes/LikesDislikes";
import Comments from "../../components/Comments/Comments";
import UserContext from "../../providers/user.context"; // Import your user context

export default function Home() {
  const [mostLikedPosts, setMostLikedPosts] = useState([]);
  const [mostRecentPosts, setMostRecentPosts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the 10 most liked/disliked posts
        const likesRef = ref(db, "likes");
        const likesSnapshot = await get(likesRef);
        const likesData = likesSnapshot.val();

        if (likesData) {
          const postIdArray = Object.keys(likesData);
          const sortedMostLikedPosts = postIdArray
            .sort((a, b) => {
              const likesA = Object.keys(likesData[a] || {}).length;
              const likesB = Object.keys(likesData[b] || {}).length;
              return likesB - likesA;
            })
            .slice(0, 10);

          const mostLikedPostsArray = await Promise.all(
            sortedMostLikedPosts.map(async (postId) => {
              const postRef = ref(db, `posts/${postId}`);
              const postSnapshot = await get(postRef);
              const postData = postSnapshot.val();
              return { postId, ...postData };
            })
          );

          setMostLikedPosts(mostLikedPostsArray);
        }

        // Fetch the 10 most recent posts
        const recentPostsRef = ref(db, "posts");
        const recentPostsSnapshot = await get(recentPostsRef);
        const postData = recentPostsSnapshot.val();

        if (postData) {
          const sortedRecentPosts = Object.entries(postData)
            .sort(([, postA], [, postB]) => postB.timestamp - postA.timestamp)
            .slice(-10)
            .map(([postId, post]) => ({ postId, ...post }))
            .reverse();

          setMostRecentPosts(sortedRecentPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();

    const postsRef = ref(db, "posts");
    const unsubscribe = onValue(postsRef, fetchData);

    return () => unsubscribe();
  }, [user]); // Add user to the dependency array

  return (
    <div>
      <div style={{ float: "left", width: "50%" }}>
        <h3>Most Liked/Disliked Posts</h3>
        {mostLikedPosts.map((post) => (
          <div key={post.postId}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <LikesDislikes postId={post.postId} />
            <Comments postId={post.postId} />
          </div>
        ))}
      </div>
      <div style={{ float: "right", width: "50%" }}>
        <h3>Most Recent Posts</h3>
        {mostRecentPosts.map((post) => (
          <div key={post.postId}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <LikesDislikes postId={post.postId} />
            <Comments postId={post.postId} />
          </div>
        ))}
      </div>
    </div>
  );
}