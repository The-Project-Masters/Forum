// Posts.jsx
import { useEffect, useState, useContext } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../config/firebase';
import { addPost } from '../../services/postService';
import { getUserData } from '../../services/users.services';
import UserContext from '../../providers/user.context';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, async (snapshot) => {
      const postData = snapshot.val();
      if (postData) {
        const postArray = await Promise.all(
          Object.entries(postData).map(async ([id, data]) => {
            if (data.uid) {
              // Fetch user data for each post
              const userDataSnapshot = await getUserData(data.uid);
              const userData = userDataSnapshot.val();
              return { id, ...data, user: userData }; // Include user data in the post
            } else {
              // Handle the case where uid is undefined
              return { id, ...data, user: null };
            }
          })
        );
        setPosts(postArray);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddPost = async () => {
    await addPost(newPostTitle, newPostContent, user);
    // Fetch and update the posts after adding a new post
    const postsRef = ref(db, 'posts');
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

    setNewPostTitle('');
    setNewPostContent('');
  };

  return (
    <div>
      <h2>This is where you read and create posts</h2>
      <div>
        <label>Title:</label>
        <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
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
      {/* Display posts */}
      {posts.map((post) => (
  <div key={post.id}>
    <h3>{post.title}</h3>
    <p>{post.content}</p>
    <p>Created by: {user.email || 'Unknown User'}</p>
    {/* Add more post details as needed */}
  </div>
))}
    </div>
  );
}
