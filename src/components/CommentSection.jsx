import React from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentSection = ({
    post,
    currentUser,
    commentText,
    setCommentText,
    savingComment,
    onAddComment,
    onLikeComment,
    onReplyComment,
    onUpdateComment,
    onDeleteComment,
}) => {
    return (
        <div className="mt-5 comment-section">
            <h5>Comments</h5>

            <div className="comment-list">
                {!(Array.isArray(post.comments) && post.comments.length > 0) ? (
                    <p className="text-muted">No comments yet.</p>
                ) : (
                    (post.comments || []).map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            onLikeComment={onLikeComment}
                            onReplyComment={onReplyComment}
                            onUpdateComment={onUpdateComment}
                            onDeleteComment={onDeleteComment}
                        />
                    ))
                )}
            </div>

            <div className="comment-form-wrapper mt-4">
                <CommentForm
                    currentUser={currentUser}
                    commentText={commentText}
                    onChangeText={setCommentText}
                    savingComment={savingComment}
                    onSubmit={onAddComment}
                />
            </div>
        </div>
    );
};

export default CommentSection;
