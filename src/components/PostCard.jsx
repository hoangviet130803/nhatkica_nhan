import React from "react";
import { Card, Badge } from "react-bootstrap";
import ReactionPill from "./ReactionPill";
import { FaHeart, FaRegHeart, FaRegCommentDots } from "react-icons/fa";

const PostCard = ({
    post,
    author,
    createdAt,
    isLiked,
    onLike,
    onView,
    currentUser,
    shortenText,
    formatDateTime,
    showStatus = true,
}) => {
    return (
        <Card
            className="border-0 shadow-sm"
            style={{
                background: "var(--card)",
                color: "var(--text)",
                borderRadius: "14px",
                transition: "0.2s",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-3px)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
            }
        >
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>{author}</div>
                    {showStatus && (
                        <Badge
                            bg={post.isPublic ? "success" : "secondary"}
                            style={{
                                padding: "6px 10px",
                                borderRadius: "20px",
                            }}
                        >
                            {post.isPublic ? "Public" : "Private"}
                        </Badge>
                    )}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">{post.title}</h5>
                    <small style={{ color: "var(--text-muted)" }}>
                        {formatDateTime(createdAt)}
                    </small>
                </div>

                <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
                    {shortenText(post.content)}
                </p>

                <div className="d-flex align-items-center gap-3 mt-3">
                    <ReactionPill
                        icon={isLiked ? <FaHeart /> : <FaRegHeart />}
                        count={post.likedBy?.length || 0}
                        active={isLiked}
                        disabled={!currentUser}
                        onClick={onLike}
                    />

                    <ReactionPill
                        icon={<FaRegCommentDots />}
                        count={post.comments?.length || 0}
                        onClick={onView}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default PostCard;
