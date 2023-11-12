import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { ref, onValue, push } from "firebase/database";
import { db } from "../../config/firebase";
import UserContext from "../../providers/user.context";
import LikesDislikes from "../Likes-Dislikes/LikesDislikes";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const commentsRef = ref(db, `comments/${postId}`);

    const commentsUnsubscribe = onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        const commentsArray = Object.entries(commentsData).map(
          ([id, data]) => ({
            id,
            ...data,
          })
        );
        setComments(commentsArray);
      }
    });

    return () => {
      commentsUnsubscribe();
    };
  }, [postId]);

  const handleAddComment = () => {
    const commentsRef = ref(db, `comments/${postId}`);
    push(commentsRef, { content: newComment, uid: user.uid });
    setNewComment("");
  };

  return (
    <div>
      <h4>Comments:</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{user.email || "Unknown User"} : {comment.content}</p>
            <LikesDislikes postId={postId} commentId={comment.id} />
          </li>
        ))}
      </ul>
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
};
