import { useEffect, useState, useContext } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../../config/firebase";
import LikesDislikes from "../../components/Likes-Dislikes/LikesDislikes";
import Comments from "../../components/Comments/Comments";
import UserContext from "../../providers/user.context";

export default function Home() {
  const [mostCommentedPosts, setMostCommentedPosts] = useState([]);
  const [mostRecentPosts, setMostRecentPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [expandedRecentPost, setExpandedRecentPost] = useState(null);
  const [expandedCommentedPost, setExpandedCommentedPost] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the total number of registered users
        const usersRef = ref(db, "users");
        const usersSnapshot = await get(usersRef);
        const usersData = usersSnapshot.val();
        const totalUsers = usersData ? Object.keys(usersData).length : 0;

        // Fetch the total number of posts
        const postsRef = ref(db, "posts");
        const postsSnapshot = await get(postsRef);
        const postsData = postsSnapshot.val();
        const totalPosts = postsData ? Object.keys(postsData).length : 0;

        // Fetch the 10 most commented posts
        const commentsRef = ref(db, "comments");
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

              // Filter out posts without titles, content, and authors
              if (
                postData &&
                postData.title &&
                postData.content &&
                postData.user
              ) {
                return { postId, ...postData };
              } else {
                return null;
              }
            })
          );

          // Remove null values from the array
          const filteredMostCommentedPosts = mostCommentedPostsArray.filter(
            (post) => post !== null
          );

          setMostCommentedPosts(filteredMostCommentedPosts);
        }

        // Fetch the 10 most recent posts
        const recentPostsRef = ref(db, "posts");
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

        // Set the total number of registered users and total number of posts in the state
        setTotalUsers(totalUsers);
        setTotalPosts(totalPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const postsRef = ref(db, "posts");
    const unsubscribe = onValue(postsRef, fetchData);

    return () => unsubscribe();
  }, [user]);

  const handleExpandRecentPost = (postId) => {
    setExpandedRecentPost(postId === expandedRecentPost ? null : postId);
  };

  const handleExpandCommentedPost = (postId) => {
    setExpandedCommentedPost(
      postId === expandedCommentedPost ? null : postId
    );
  };

  return (
    <div className="row">
      <div className="col-lg-6 mt-4">
        <div className="card mb-4">
          <div className="bg-dark text-white h5 p-3 card-header">
            Total Users: {totalUsers}
          </div>
        </div>
      </div>
      <div className="col-lg-6 mt-4">
        <div className="card mb-4">
          <div className="bg-dark text-white h5 p-3 card-header">
            Total Posts: {totalPosts}
          </div>
        </div>
      </div>
      <div className="col-lg-6 ">
        <h3 className="mt-4 mb-4 text-center">Most Recent Posts</h3>
        {mostRecentPosts.map((post) => (
          <div className="card mb-4" key={post.postId}>
            <div className="bg-dark text-white h5 p-3 card-header">
              {post.title}
            </div>
            <div className="card-body">
              {expandedRecentPost === post.postId ? (
                <div>
                  <p>{post.content}</p>
                  <hr />
                  <Comments postId={post.postId} />
                </div>
              ) : (
                <p>{post.content.slice(0, 100)}...</p>
              )}
              <div className="row">
                <div className="col-md-6 align-items-start">
                  <p>
                    Created by:{" "}
                    <strong>
                      @{post.user ? post.user.handle : "Unknown User"}
                    </strong>
                  </p>
                </div>
                <div className="col-md-6 align-items-end">
                  <LikesDislikes postId={post.postId} />
                  <button
                    className="btn btn-link"
                    onClick={() => handleExpandRecentPost(post.postId)}
                  >
                    {expandedRecentPost === post.postId ? "Collapse" : "View"}
                  </button>
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
            <div className="bg-dark text-white h5 p-3 card-header">
              {post.title}
            </div>
            <div className="card-body">
              {expandedCommentedPost === post.postId ? (
                <div>
                  <p>{post.content}</p>
                  <hr />
                  <Comments postId={post.postId} />
                </div>
              ) : (
                <p>{post.content.slice(0, 100)}...</p>
              )}
              <div className="row">
                <div className="col-md-6 align-items-start">
                  <p>
                    Created by:{" "}
                    <strong>
                      @{post.user ? post.user.handle : "Unknown User"}
                    </strong>
                  </p>
                </div>
                <div className="col-md-6 align-items-end">
                  <LikesDislikes postId={post.postId} />
                  <button
                    className="btn btn-link"
                    onClick={() => handleExpandCommentedPost(post.postId)}
                  >
                    {expandedCommentedPost === post.postId ? "Collapse" : "View"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
