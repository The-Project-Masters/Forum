import './Home.css';
import { useEffect, useState, useContext } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../config/firebase';
import LikesDislikes from '../../components/Likes-Dislikes/LikesDislikes';
import Comments from '../../components/Comments/Comments';
import UserContext from '../../providers/user.context';

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
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);
        const usersData = usersSnapshot.val();
        const totalUsers = usersData ? Object.keys(usersData).length : 0;

        // Fetch the total number of posts
        const postsRef = ref(db, 'posts');
        const postsSnapshot = await get(postsRef);
        const postsData = postsSnapshot.val();
        const totalPosts = postsData ? Object.keys(postsData).length : 0;

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

              // Filter out posts without titles, content, and authors
              if (postData && postData.title && postData.content && postData.user) {
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

        // Set the total number of registered users and total number of posts in the state
        setTotalUsers(totalUsers);
        setTotalPosts(totalPosts);
      } catch (error) {
        console.error('dError fetching data:', error);
      }
    };

    fetchData();

    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, fetchData);

    return () => unsubscribe();
  }, [user]);

  const handleExpandRecentPost = (postId) => {
    setExpandedRecentPost(postId === expandedRecentPost ? null : postId);
  };

  const handleExpandCommentedPost = (postId) => {
    setExpandedCommentedPost(postId === expandedCommentedPost ? null : postId);
  };

  return (
    <>
      <div className="row main-banner">
        <div className="banner-overlay">
          <div className="banner-content p-4 text-center text-white">
            <h1>Welcome to BG-Tatko</h1>
            <h3>The place where Bulgarian dads thrive</h3>
            <a href="#Trending">
              <button className="btn btn-primary btn-lg mt-4">Explore the forum</button>
            </a>
          </div>
        </div>
      </div>
      <div className="container row m-auto p-4 mt-4 mb-4" id="Trending">
        <div className="h2 text-center mb-4">Let the numbers talk</div>
        <div className="col-lg-6">
          <div className="list-group card">
            <div className="h1 bg-primary text-white p-3 text-center card-header">{totalUsers}</div>
            <div className="h3 text-center p-3 mb-0">Total number of users</div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="list-group card">
            <div className="h1 bg-primary text-white p-3 text-center card-header">{totalPosts}</div>
            <div className="h3 text-center p-3 mb-0">Total number of posts</div>
          </div>
        </div>
      </div>
      <div className="row container m-auto" id="MostRecent">
        <div className="h1 text-center mb-4">Our TOP Selection</div>
        <div className="col-lg-6">
          <div className="card p-0">
            <div className="h2 text-center mb-4 card-header bg-primary text-white p-3">
              Most recent posts
            </div>
            {mostRecentPosts.map((post) => (
              <div className="card m-3 mb-3 mt-0" key={post.postId}>
                <div className="bg-dark text-white h5 p-3 card-header">{post.title}</div>
                <div className="card-body">
                  {expandedPost === post.postId ? (
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
                      Created by: <strong>@{post.user ? post.user.handle : 'Unknown User'}</strong>
                      <div>
                        <button
                          className="btn btn-primary mt-4"
                          onClick={() => handleExpandPost(post.postId)}
                        >
                          {expandedPost === post.postId ? 'Collapse' : 'View comments'}
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 align-items-end">
                      <LikesDislikes postId={post.postId} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card p-0">
            <div className="h2 text-center mb-4 card-header bg-primary text-white p-3">
              Most recent posts
            </div>
            {mostCommentedPosts.map((post) => (
              <div className="card m-3 mb-3 mt-0" key={post.postId}>
                <div className="bg-dark text-white h5 p-3 card-header">{post.title}</div>
                <div className="card-body">
                  {expandedPost === post.postId ? (
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
                      Created by: <strong>@{post.user ? post.user.handle : 'Unknown User'}</strong>
                      <div>
                        <button
                          className="btn btn-primary mt-4"
                          onClick={() => handleExpandPost(post.postId)}
                        >
                          {expandedPost === post.postId ? 'Collapse ⇕' : 'View comments ⇕'}
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 align-items-end">
                      <LikesDislikes postId={post.postId} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
