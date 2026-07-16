import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CommentForm = ({
    currentUser,
    commentText,
    onChangeText,
    savingComment,
    onSubmit,
}) => {
    return currentUser ? (
        <form onSubmit={onSubmit}>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => onChangeText(e.target.value)}
                />
            </div>
            <Button
                type="submit"
                disabled={!commentText.trim() || savingComment}
            >
                {savingComment ? "Posting..." : "Post Comment"}
            </Button>
        </form>
    ) : (
        <p
            style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
            }}
        >
            Please{" "}
            <Link
                to="/login"
                style={{
                    color: "var(--text)",
                    textDecoration: "underline",
                    fontWeight: 600,
                }}
            >
                login
            </Link>{" "}
            to like and comment on this post.
        </p>
    );
};

export default CommentForm;
