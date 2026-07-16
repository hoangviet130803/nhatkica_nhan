/* global globalThis */

export const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export const getCurrentUser = () => {
    if (typeof globalThis === "undefined" || !globalThis.localStorage)
        return null;

    try {
        const user = globalThis.localStorage.getItem("currentUser");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Failed to parse currentUser", error);
        return null;
    }
};

export const getDisplayAvatar = (avatar) => avatar || DEFAULT_AVATAR;

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isPhoneNumber = (value) => /^\d{10}$/.test(value);

export const isPostOwner = (postUserId, currentUser) =>
    !!currentUser && String(currentUser.id) === String(postUserId);

export const filterVisiblePosts = (posts, currentUser) =>
    posts.filter((post) => {
        if (post.isDeleted) return false;
        if (!currentUser) return post.isPublic;
        return post.isPublic || isPostOwner(post.userId, currentUser);
    });

export const shortenText = (text = "", maxLength = 140) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

export const formatDateTime = (value) => new Date(value).toLocaleString();
