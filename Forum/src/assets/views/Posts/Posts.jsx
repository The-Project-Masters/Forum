// Posts.jsx
import { useEffect, useState } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../config/firebase';
import { addPost } from '../../services/postService';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const postData = snapshot.val();
      if (postData) {
        const postArray = Object.entries(postData).map(([id, data]) => ({ id, ...data }));
        setPosts(postArray);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddPost = async () => {
    await addPost(newPostTitle, newPostContent);
    // Fetch and update the posts after adding a new post
    // (You may also choose to update the state without re-fetching)
    const postsRef = ref(db, 'posts');
    const snapshot = await get(postsRef);
    const postData = snapshot.val();
    if (postData) {
      const postArray = Object.entries(postData).map(([id, data]) => ({ id, ...data }));
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
          {/* Add more post details as needed */}
        </div>
      ))}
    </div>
  );
}
