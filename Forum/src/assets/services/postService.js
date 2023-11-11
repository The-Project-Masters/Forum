// postsService.js
import { ref, push } from 'firebase/database';
import { db } from '../config/firebase';

export const addPost = async (title, content) => {
  const post = {
    title,
    content,
  };

  const postsRef = ref(db, 'posts');
  await push(postsRef, post);
};
