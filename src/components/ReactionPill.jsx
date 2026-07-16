import React from "react";

const ReactionPill = ({
    icon,
    count,
    active,
    disabled,
    onClick,
    label,
    className = "",
}) => {
    return (
        <button
            type="button"
            className={`reaction-pill ${active ? "active" : ""} ${
                disabled ? "disabled" : ""
            } ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="icon">{icon}</span>
            <span>{count}</span>
            {label && <span className="reaction-label">{label}</span>}
        </button>
    );
};

export default ReactionPill;
