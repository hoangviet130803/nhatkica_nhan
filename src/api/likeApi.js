import api from "../api/apiClient";

// // ✅ Lấy toàn bộ lượt like
// export const getAllLikes = async () => {
//   const response = await api.get("/likes");
//   return response.data;
// };

// // ✅ Like một bình luận
// export const likeComment = async (commentId, userId) => {
//   const response = await api.post("/likes", { commentId, userId });
//   return response.data;
// };

// // ✅ Unlike (xóa like)
// export const unlikeComment = async (commentId, userId) => {
//   // Tìm likeId theo commentId và userId
//   const getRes = await api.get("/likes", {
//     params: { commentId, userId },
//   });

//   const like = getRes.data[0];
//   if (!like) throw new Error("Like không tồn tại.");

//   const deleteRes = await api.delete(`/likes/${like.id}`);
//   return deleteRes.data;
// };

// // ✅ Lấy toàn bộ like theo commentId
// export const getLikesByCommentId = async (commentId) => {
//   const response = await api.get("/likes", {
//     params: { commentId },
//   });
//   return response.data;
// };

// // ✅ Kiểm tra người dùng đã like chưa
// export const hasUserLikedComment = async (commentId, userId) => {
//   const res = await api.get("/likes", {
//     params: { commentId, userId },
//   });
//   return res.data.length > 0;
// };


// ===============================
// 🟥 LIKE APIs
// ===============================
export const getAllLikes = () => api.get("/likes").then((res) => res.data);

export const getLikesByCommentId = (commentId) =>
  api.get("/likes", { params: { commentId } }).then((res) => res.data);

export const likeComment = (commentId, userId) =>
  api.post("/likes", { commentId, userId }).then((res) => res.data);

export const unlikeComment = async (commentId, userId) => {
  const res = await api.get("/likes", { params: { commentId, userId } });
  const like = res.data[0];
  if (!like) throw new Error("Like không tồn tại");
  return await api.delete(`/likes/${like.id}`);
};

export const hasUserLikedComment = async (commentId, userId) => {
  const res = await api.get("/likes", { params: { commentId, userId } });
  return res.data.length > 0;
};
export const getLikesByPostId = async (postId) => {
  return await api.get(`/likes?postId=${postId}`);
};
