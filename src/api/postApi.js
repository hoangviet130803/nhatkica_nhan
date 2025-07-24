import api from "./apiClient";

// ===============================
// 🟦 POST APIs
// ===============================
export const getAllPosts = () => api.get("/post");

export const getPostById = (id) => api.get(`/post/${id}`);

export const getPostsByUserId = (userId) =>
  api.get("/post", { params: { userId } });

export const getPostsBySearchTerm = (term) =>
  api.get("/post", { params: { title_like: term } });

export const getPostsByPage = (page, limit) =>
  api.get("/post", { params: { _page: page, _limit: limit } });

export const getPostsByUserIdAndPage = (userId, page, limit) =>
  api.get("/post", {
    params: {
      userId,
      _page: page,
      _limit: limit,
      _sort: "createdAt",
      _order: "desc",
    },
  });

export const createNewPost = async (post) => {
  return await api.post("/post", post);
};



export const updatePostById = async (id, updatedPost) => {
  const response = await api.put(`/post/${id}`, {
    ...updatedPost,
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};



export const deletePostById = (id) => api.delete(`/post/${id}`);

// ===============================
// 🟨 COMMENT APIs
// ===============================
export const getAllComments = () => api.get("/comment");

export const getCommentsByPostId = (postId) =>
  api.get("/comment", { params: { postId } });

export const getCommentById = (id) => api.get(`/comment/${id}`);

export const createComment = (comment) => api.post("/comment", comment);

export const updateCommentById = (id, comment) =>
  api.put(`/comment/${id}`, comment);

export const deleteCommentById = (id) => api.delete(`/comment/${id}`);


// ===============================
// 🟪 HISTORY APIs
// ===============================
export const getPostHistoryByPostId = (postId) =>
  api.get("/histories", {
    params: { postId, _sort: "editedAt", _order: "desc" },
  });

export const getPostHistoryByUserId = (userId) =>
  api.get("/histories");

export const createPostHistory = (data) => api.post("/histories", data);

export const getHistoriesByCommentId = async (commentId) => {
  const res = await api.get(`/histories?commentId=${commentId}`);
  return res.data;
};

export const deleteAllHistoryByUserId = async (userId) => {
  const { data: histories } = await api.get(`/histories?userId=${userId}`);
  const deleteRequests = histories.map((h) => api.delete(`/histories/${h.id}`));
  return Promise.all(deleteRequests);
};
// ===============================
// 🧹 DELETE POST AND RELATED
// ===============================
export const deletePostAndRelated = async (postId) => {
  const { data: comments } = await api.get("/comment", { params: { postId } });

  for (const comment of comments) {
    const { data: likes } = await api.get("/likes", {
      params: { commentId: comment.id },
    });
    for (const like of likes) {
      await api.delete(`/likes/${like.id}`);
    }
    await api.delete(`/comment/${comment.id}`);
  }

  const { data: postLikes } = await api.get("/likes", { params: { postId } });
  for (const like of postLikes) {
    await api.delete(`/likes/${like.id}`);
  }

  await api.delete(`/post/${postId}`);
};


