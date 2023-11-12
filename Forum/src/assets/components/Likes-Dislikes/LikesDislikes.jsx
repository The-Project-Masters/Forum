import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../config/firebase";
import UserContext from "../../providers/user.context";

export default function LikesDislikes({ postId, commentId }) {
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    const likesRef = commentId
      ? ref(db, `likes/${postId}/${commentId}`)
      : ref(db, `likes/${postId}`);
    const dislikesRef = commentId
      ? ref(db, `dislikes/${postId}/${commentId}`)
      : ref(db, `dislikes/${postId}`);

    const likesUnsubscribe = onValue(likesRef, (snapshot) => {
      const likesData = snapshot.val();
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
          return updatedLikes;
        });
        // Update the database
        set(likesRef, likes);
      } else {
        // User has not liked, add the like
        setLikes((prevLikes) => ({ ...prevLikes, [user.uid]: true }));
        set(likesRef, { ...likes, [user.uid]: true });
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
          return updatedDislikes;
        });
        set(dislikesRef, dislikes);
      } else {
        // User has not disliked, add the dislike
        setDislikes((prevDislikes) => ({ ...prevDislikes, [user.uid]: true }));
        set(dislikesRef, { ...dislikes, [user.uid]: true });
      }
    }
  };

  return (
    <div>
      <button onClick={handleLike}>
        Like ({likes && likes[user?.uid] ? 1 : 0})
      </button>
      <button onClick={handleDislike}>
        Dislike ({dislikes && dislikes[user?.uid] ? 1 : 0})
      </button>
    </div>
  );
}

LikesDislikes.propTypes = {
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string,
};