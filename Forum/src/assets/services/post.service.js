// postsService.js
import { ref, push, remove } from 'firebase/database';
import { db } from '../config/firebase';

export const addPost = async (title, content, userData) => {
  const post = {
    title,
    content,
    user: {
      uid: userData.uid,
      handle: userData.handle,
      email: userData.email,
    },
  };
  const postsRef = ref(db, 'posts');
  await push(postsRef, post);
};

export const deletePost = async (postId) => {
  const postRef = ref(db, `posts/${postId}`);
  await remove(postRef);
};
