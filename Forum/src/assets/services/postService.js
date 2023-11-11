// postsService.js
import { ref, push } from 'firebase/database';
import { db } from '../config/firebase';



export const addPost = async (title, content, user) => {
    const post = {
      title,
      content,
      user: {
        uid: user.uid,
        email: user.email,
        // Add other user details as needed
      },
    };
  
    const postsRef = ref(db, 'posts');
    await push(postsRef, post);
  };