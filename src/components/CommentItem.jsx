import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaHeart, FaRegHeart, FaReply, FaEdit, FaTrash } from "react-icons/fa";
import { formatDateTime } from "../utils/common";

const CommentItem = ({
    comment,
    currentUser,
    onLikeComment,
    onReplyComment,
    onUpdateComment,
    onDeleteComment,
    depth = 0,
}) => {
    const [replyText, setReplyText] = useState("");
    const [replying, setReplying] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const isOwner =
        currentUser && String(comment.userId) === String(currentUser.id);
    const hasLikedComment = comment.likedBy?.some(
        (userId) => String(userId) === String(currentUser?.id),
    );

    const handleSaveEdit = () => {
        const trimmed = editText.trim();
        if (!trimmed) {
            return;
        }

        onUpdateComment(comment.id, trimmed);
        setEditing(false);
    };

    const handleReplySubmit = () => {
        const trimmed = replyText.trim();
        if (!trimmed) {
            return;
        }

        onReplyComment(comment.id, trimmed);
        setReplyText("");
        setReplying(false);
    };

    return (
        <div
            className="comment-item"
            style={{ marginLeft: depth > 0 ? `${depth * 16}px` : 0 }}
        >
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <div className="fw-semibold">{comment.username}</div>
                    <small className="comment-time">
                        {formatDateTime(comment.createdAt)}
                    </small>
                </div>

                <div className="d-flex gap-2">
                    {isOwner && (
                        <>
                            <Button
                                variant="link"
                                size="sm"
                                className="p-0"
                                onClick={() => {
                                    setEditing((prev) => !prev);
                                    setEditText(comment.content);
                                }}
                            >
                                <FaEdit />
                            </Button>
                            <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-danger"
                                onClick={() => onDeleteComment(comment.id)}
                            >
                                <FaTrash />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="mb-2">
                {editing ? (
                    <textarea
                        className="form-control"
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                ) : (
                    <div>{comment.content}</div>
                )}
            </div>

            <div className="d-flex align-items-center gap-2 mb-2">
                <button
                    type="button"
                    className={`reaction-pill ${hasLikedComment ? "active" : ""} ${
                        !currentUser ? "disabled" : ""
                    }`}
                    onClick={() => onLikeComment(comment.id)}
                    disabled={!currentUser}
                >
                    <span className="icon">
                        {hasLikedComment ? <FaHeart /> : <FaRegHeart />}
                    </span>
                    <span>{comment.likedBy?.length || 0}</span>
                </button>

                <button
                    type="button"
                    className="reaction-pill"
                    onClick={() => setReplying((prev) => !prev)}
                    disabled={!currentUser}
                >
                    <span className="icon">
                        <FaReply />
                    </span>
                    <span>{comment.replies?.length || 0}</span>
                </button>

                {editing && (
                    <div className="d-flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                            Save
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            {replying && currentUser && (
                <div className="mb-3">
                    <textarea
                        className="form-control mb-2"
                        rows={2}
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="d-flex gap-2">
                        <Button size="sm" onClick={handleReplySubmit}>
                            Reply
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => setReplying(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div className="comment-replies mt-3">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUser={currentUser}
                            onLikeComment={onLikeComment}
                            onReplyComment={onReplyComment}
                            onUpdateComment={onUpdateComment}
                            onDeleteComment={onDeleteComment}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
