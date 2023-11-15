import './Posts.css';
import { useEffect, useState, useContext } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../config/firebase';
import { addPost, deletePost } from '../../services/post.service';
import { getUserData } from '../../services/users.services';
import UserContext from '../../providers/user.context';
import LikesDislikes from '../../components/Likes-Dislikes/LikesDislikes';
import Comments from '../../components/Comments/Comments';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, userData } = useContext(UserContext);

  // Define postsRef outside of useEffect
  const postsRef = ref(db, 'posts');

  const fetchData = async () => {
    try {
      const snapshot = await get(postsRef);
      const postData = snapshot.val();
      if (postData) {
        const postArray = Object.entries(postData).map(([id, data]) => ({
          id,
          ...data,
          user: data.user,
        }));

        const filtered = postArray.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setPosts(searchQuery !== '' ? (filtered.length > 0 ? filtered : []) : postArray.reverse())
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
  }, [searchQuery]);

  const handleAddPost = async () => {
    if (newPostTitle.length < 16 || newPostTitle.length > 64) {
      alert('Title should be between 16 and 64 symbols long.');
      return;
    }

    if (newPostContent.length < 32 || newPostContent.length > 8192) {
      alert('The content should be between 16 and 64 symbols long.');
      return;
    }

    await addPost(newPostTitle, newPostContent, userData);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
            onChange={(e) => setNewPostTitle(e.target.value)}
            value={newPostTitle}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content:</label>
          <textarea
            className="form-control"
            onChange={(e) => setNewPostContent(e.target.value)}
            value={newPostContent}
          />
        </div>
        <div>
          <button type="button" className="btn btn-primary mt-2" onClick={handleAddPost}>
            Create Post
          </button>
        </div>
      </form>

      <div className="search bg-primary card p-3 mt-3 mb-4">
        <h5 className="mb-3 text-white">Search posts:</h5>
        <input
          className="form-control"
          type="text"
          placeholder="Start typing..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {searchQuery !== '' ? (
        posts.length > 0 ? (
          posts.map((post) => (
            <div className="card mb-4" key={post.id}>
              <div className="bg-dark text-white h4 p-3 card-header row m-0">
                <div className="col-lg-6 text-left p-0">{post.title}</div>
                <div className="col-lg-6 align-items-end text-white">
                  <button
                    className="delete-post btn bg-danger text-white"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    X
                  </button>
                </div>
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
          ))
        ) : (
          <p>No matching posts found.</p>
        )
      ) : (
        posts.map((post) => (
          <div className="card mb-4" key={post.id}>
            <div className="bg-dark text-white h4 p-3 card-header row m-0">
              <div className="col-lg-6 text-left p-0">{post.title}</div>
              <div className="col-lg-6 align-items-end text-white">
                <button
                  className="delete-post btn bg-danger text-white"
                  onClick={() => handleDeletePost(post.id)}
                >
                  X
                </button>
              </div>
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
        ))
      )}
    </div>
  );
}
