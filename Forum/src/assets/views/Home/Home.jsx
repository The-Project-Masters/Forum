import { useEffect, useState, useContext } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../config/firebase';
import LikesDislikes from '../../components/Likes-Dislikes/LikesDislikes';
import Comments from '../../components/Comments/Comments';
import UserContext from '../../providers/user.context';

export default function Home() {
  const [mostCommentedPosts, setMostCommentedPosts] = useState([]);  // Updated state name
  const [mostRecentPosts, setMostRecentPosts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the 10 most commented posts
        const commentsRef = ref(db, 'comments');
        const commentsSnapshot = await get(commentsRef);
        const commentsData = commentsSnapshot.val();

        if (commentsData) {
          const postIdArray = Object.keys(commentsData);
          const sortedMostCommentedPosts = postIdArray
            .sort((a, b) => {
              const commentsA = Object.keys(commentsData[a] || {}).length;
              const commentsB = Object.keys(commentsData[b] || {}).length;
              return commentsB - commentsA;
            })
            .slice(0, 10);

          const mostCommentedPostsArray = await Promise.all(
            sortedMostCommentedPosts.map(async (postId) => {
              const postRef = ref(db, `posts/${postId}`);
              const postSnapshot = await get(postRef);
              const postData = postSnapshot.val();
              return { postId, ...postData };
            })
          );

          setMostCommentedPosts(mostCommentedPostsArray);
        }

        // Fetch the 10 most recent posts
        const recentPostsRef = ref(db, 'posts');
        const recentPostsSnapshot = await get(recentPostsRef);
        const postData = recentPostsSnapshot.val();

        if (postData) {
          const sortedRecentPosts = Object.entries(postData)
            .sort(([, postA], [, postB]) => postB.timestamp - postA.timestamp)
            .slice(0, 10)
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
        <h3 className="mt-4 mb-4 text-center">Most Commented Posts</h3>
        {mostCommentedPosts.map((post) => (
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
