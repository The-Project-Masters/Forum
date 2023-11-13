import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { ref, onValue, set, update } from 'firebase/database';
import { db } from '../../config/firebase';
import UserContext from '../../providers/user.context';

export default function LikesDislikes({ postId, commentId }) {
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const { user, userData } = useContext(UserContext);

  useEffect(() => {
    const likesRef = commentId
      ? ref(db, `likes/${postId}/${commentId}`)
      : ref(db, `likes/${postId}`);
    const dislikesRef = commentId
      ? ref(db, `dislikes/${postId}/${commentId}`)
      : ref(db, `dislikes/${postId}`);

    const likesUnsubscribe = onValue(likesRef, (snapshot) => {
      const likesData = snapshot.val();
      // console.log(likesData);
      if (likesData) {
        setLikes(likesData);
      }
    });

    const dislikesUnsubscribe = onValue(dislikesRef, (snapshot) => {
      const dislikesData = snapshot.val();
      if (dislikesData) {
        setDislikes(dislikesData);
      }
    });

    return () => {
      likesUnsubscribe();
      dislikesUnsubscribe();
    };
  }, [postId, commentId]);

  const handleLike = () => {
    if (user) {
      const likesRef = commentId
        ? ref(db, `likes/${postId}/${commentId}`)
        : ref(db, `likes/${postId}`);
      // Check if the user has already liked
      if (likes && likes[user.uid]) {
        // User already liked, remove the like
        setLikes((prevLikes) => {
          const updatedLikes = { ...prevLikes };
          delete updatedLikes[user.uid];
          // Update the database with the updatedLikes
          set(likesRef, updatedLikes);
          update(ref(db), updatedLikes);
          return updatedLikes;
        });
      } else {
        // User has not liked, add the like
        setLikes((prevLikes) => ({ ...prevLikes, [user.uid]: true }));
        update(likesRef, { ...likes, [user.uid]: true });
      }
    }
  };

  const handleDislike = () => {
    if (user) {
      const dislikesRef = commentId
        ? ref(db, `dislikes/${postId}/${commentId}`)
        : ref(db, `dislikes/${postId}`);

      // Check if the user has already disliked
      if (dislikes && dislikes[user.uid]) {
        // User already disliked, remove the dislike
        setDislikes((prevDislikes) => {
          const updatedDislikes = { ...prevDislikes };
          delete updatedDislikes[user.uid];
          set(dislikesRef, updatedDislikes);
          return updatedDislikes;
        });
      } else {
        // User has not disliked, add the dislike
        setDislikes((prevDislikes) => ({ ...prevDislikes, [user.uid]: true }));
        update(dislikesRef, { ...dislikes, [user.uid]: true });
      }
    }
  };

  return (
    <div>
      <button className="btn-success btn m-1" onClick={handleLike}>
        Like ({Object.keys(likes || {}).length})
      </button>
      <button className="btn-danger btn m-1" onClick={handleDislike}>
        Dislike ({Object.keys(dislikes || {}).length})
      </button>
    </div>
  );
}

LikesDislikes.propTypes = {
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string,
};
