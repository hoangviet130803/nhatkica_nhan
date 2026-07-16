import api from "./API";

export const getAllPosts = async () => {
    const res = await api.get(`/posts`);
    return res.data; // trả về mảng posts
};

export const createPost = async (post) => {
    const res = await api.post("/posts", post);
    return res.data;
};
export const getPostById = async (id) => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
};

export const updatePost = async (id, post) => {
    const res = await api.patch(`/posts/${id}`, post);
    return res.data;
};

export const addLikeToPost = async (id, likedBy) => {
    const res = await api.patch(`/posts/${id}`, { likedBy });
    return res.data;
};

export const addCommentToPost = async (id, comments) => {
    const res = await api.patch(`/posts/${id}`, { comments });
    return res.data;
};

// export const deletePost = async (id) => {
//     await api.delete(`/posts/${id}`);
// };
export const deletePost = async (id, userId) => {
    const res = await api.patch(`/posts/${id}`, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: userId,
    });
    return res.data;
};

export const restorePost = async (id) => {
    const res = await api.patch(`/posts/${id}`, {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
    });
    return res.data;
};

export const permanentlyDeletePost = async (id) => {
    await api.delete(`/posts/${id}`);
};
