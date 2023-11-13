import './Posts.css';
import { useEffect, useState, useContext } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../config/firebase';
import { addPost } from '../../services/post.service';
import { getUserData } from '../../services/users.services';
import UserContext from '../../providers/user.context';
import LikesDislikes from '../../components/Likes-Dislikes/LikesDislikes';
import Comments from '../../components/Comments/Comments';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const { user, userData } = useContext(UserContext);

  // Define postsRef outside of useEffect
  const postsRef = ref(db, 'posts');

  const fetchData = async () => {
    try {
      const snapshot = await get(postsRef);
      const postData = snapshot.val();
      if (postData) {
        const postArray = await Promise.all(
          Object.entries(postData).map(async ([id, data]) => {
            return { id, ...data, user: data.user };
          })
        );
        setPosts(postArray);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
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
    await addPost(newPostTitle, newPostContent, userData);
    setNewPostTitle('');
    setNewPostContent('');
  };

  return (
    <div>
      <form className="card mt-4 mb-4 p-4">
        <h2 className="mb-4">Create new post</h2>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            className="form-control"
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content:</label>
          <textarea
            className="form-control"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
        </div>
        <div>
          <button type="button" className="btn btn-primary mt-2" onClick={handleAddPost}>
            Create Post
          </button>
        </div>
      </form>

      {posts
        .slice()
        .reverse()
        .map((post) => (
          <div className="card mb-4" key={post.id}>
            <div className="bg-dark text-white h4 p-3 card-header">
              {post.title}
              {/* Move user.email here */}
            </div>
            <div className="card-body">
              <p>{post.content}</p>
              <hr />
              <div className="row">
                <div className="col-md-6 align-items-start">
                  <p className="mb-0">
                    Author: <strong>@{post.user ? post.user.handle : 'Unknown User'}</strong>
                  </p>
                </div>
                <div className="col-md-6 align-items-end">
                  <LikesDislikes postId={post.id} />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Comments postId={post.id} />
            </div>
          </div>
        ))}
    </div>
  );
}
