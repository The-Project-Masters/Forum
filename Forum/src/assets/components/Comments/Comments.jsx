import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../../config/firebase';
import UserContext from '../../providers/user.context';
import LikesDislikes from '../Likes-Dislikes/LikesDislikes';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user, userData } = useContext(UserContext);

  useEffect(() => {
    const commentsRef = ref(db, `comments/${postId}`);

    const commentsUnsubscribe = onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        const commentsArray = Object.entries(commentsData).map(([id, data]) => ({
          id,
          ...data,
        }));
        setComments(commentsArray);
      }
    });

    return () => {
      commentsUnsubscribe();
    };
  }, [postId]);

  const handleAddComment = () => {
    const commentsRef = ref(db, `comments/${postId}`);
    push(commentsRef, { content: newComment, userData: userData });
    setNewComment('');
  };

  return (
    <div className="pt-3 pb-3">
      <h4>Comments:</h4>
      <div className="list-group list-group-flush">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="m-4">
              <h5>
                {comment.userData ? comment.userData.handle || 'Unknown User' : 'Unknown User'}
              </h5>
              <div>{comment.content}</div>
            </div>
            {/* <LikesDislikes postId={postId} commentId={comment.id} /> */}
          </div>
        ))}
      </div>
      <div className="card p-4 mt-2">
        <h5 className="mb-3"> Leave a comment:</h5>
        <textarea
          className="form-control mb-4"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment here..."
        />
        <button className="btn btn-primary" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
};
