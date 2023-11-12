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
      <div className="card mt-4 mb-4 p-4">
        <h2>This is where you read and create posts</h2>
        <div className="p-4">
          <label>Title:</label>
          <input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
        </div>
        <div>
          <button type="button" onClick={handleAddPost}>
            Create Post
          </button>
        </div>
      </div>
      {posts.map((post) => (
        <div className="card mb-4" key={post.id}>
          {/* Move user.email inside the map function */}
          <div className="bg-success text-white h4 card-header">{post.title}</div>
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
