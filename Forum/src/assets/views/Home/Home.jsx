import { useEffect, useState, useContext } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../config/firebase';
import LikesDislikes from '../../components/Likes-Dislikes/LikesDislikes';
import Comments from '../../components/Comments/Comments';
import UserContext from '../../providers/user.context'; // Import your user context

export default function Home() {
  const [mostLikedPosts, setMostLikedPosts] = useState([]);
  const [mostRecentPosts, setMostRecentPosts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the 10 most liked/disliked posts
        const likesRef = ref(db, 'likes');
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
        const recentPostsRef = ref(db, 'posts');
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
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();

    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, fetchData);

    return () => unsubscribe();
  }, [user]); // Add user to the dependency array

  return (
    <div className="row">
      <div className="col-lg-6 ">
        <h3 className="mt-4 mb-4 text-center">Most Recent Posts</h3>
        {mostRecentPosts.map((post) => (
          <div className="card mb-4" key={post.postId}>
            <div className="bg-dark text-white h5 p-3 card-header">{post.title}</div>
            <div className="card-body">
              <p>{post.content}</p>
              <hr />
              <div className="row">
                <div className="col-md-6 align-items-start">
                  <p>
                    Created by: <strong>@{post.user ? post.user.handle : 'Unknown User'}</strong>
                  </p>
                </div>
                <div className="col-md-6 align-items-end">
                  {/* pass postId to LikesDislikes and Comments */}
                  <LikesDislikes postId={post.postId} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-lg-6">
        <h3 className="mt-4 mb-4 text-center">Most Liked Posts</h3>
        {mostLikedPosts.map((post) => (
          <div className="card mb-4" key={post.postId}>
            <div className="bg-dark text-white h5 p-3 card-header">{post.title}</div>
            <div className="card-body">
              <p>{post.content}</p>
              <hr />
              <div className="row">
                <div className="col-md-6 align-items-start">
                  <p>
                    Created by: <strong>@{post.user ? post.user.handle : 'Unknown User'}</strong>
                  </p>
                </div>
                <div className="col-md-6 align-items-end">
                  {/* pass postId to LikesDislikes and Comments */}
                  <LikesDislikes postId={post.postId} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
