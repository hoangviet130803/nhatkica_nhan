import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getUserById,
  deleteUser,
  getGenders,
  getRoles,
} from "../../api/userApi";
import { getPostsByUserId, getAllComments } from "../../api/postApi";
import { Button, Card, Spinner, ListGroup, Image } from "react-bootstrap";
//xem chi tiết người dùng về tên email, giới tính, vai trò, danh sách bài viết của người dùng đó

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [genderMap, setGenderMap] = useState({});
  const [roleMap, setRoleMap] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, gendersRes, rolesRes, postsRes, commentsRes] =
          await Promise.all([
            getUserById(id),
            getGenders(),
            getRoles(),
            getPostsByUserId(id), // ✅ chỉ lấy bài viết của user này
            getAllComments(),
          ]);

        setUser(userRes.data);

        // Xử lý map giới tính và vai trò
        const genderObj = {};
        gendersRes.data.forEach((g) => (genderObj[g.id] = g.name));
        setGenderMap(genderObj);

        const roleObj = {};
        rolesRes.data.forEach((r) => (roleObj[r.id] = r.name));
        setRoleMap(roleObj);

        setUserPosts(postsRes.data);

        // Đếm số lượng bình luận từng bài viết
        const commentMap = {};
        commentsRes.data.forEach((cmt) => {
          commentMap[cmt.postId] = (commentMap[cmt.postId] || 0) + 1;
        });
        setCommentsCount(commentMap);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (String(id) === String(currentUser.id)) {
      alert("⚠️ Bạn không thể xóa chính mình!");
      return;
    }

    const confirm = window.confirm("Bạn có chắc muốn xóa người dùng này?");
    if (!confirm) return;

    try {
      await deleteUser(id);
      alert("✅ Xóa thành công!");
      navigate("/admin");
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
      alert("Không thể xóa người dùng.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="m-4 p-4 shadow-lg">
      <h3 className="mb-4 text-center">📋 Thông tin người dùng</h3>

      <div className="mb-3">
        <p>
          <strong>👤 Tên:</strong> {user.name}
        </p>
        <p>
          <strong>📧 Email:</strong> {user.email}
        </p>
        <p>
          <strong>👫 Giới tính:</strong> {genderMap[user.genderId]}
        </p>
        <p>
          <strong>🛡 Vai trò:</strong> {roleMap[user.roleId]}
        </p>
      </div>

      <div className="d-flex gap-3 mb-4">
        <Button variant="secondary" onClick={handleBack}>
          ⬅️ Quay lại
        </Button>
        {String(currentUser.id) !== String(user.id) && (
          <Button variant="danger" onClick={handleDelete}>
            🗑️ Xóa người dùng
          </Button>
        )}
      </div>

      <hr />
      <h4 className="mb-3">📝 Danh sách bài viết:</h4>

      {userPosts.length === 0 ? (
        <p>📭 Người dùng này chưa viết bài nào.</p>
      ) : (
        userPosts.map((post) => (
          <Card key={post.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text className="text-muted">
                {post.content.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                <span>💬 Bình luận: {commentsCount[post.id] || 0}</span>
                <Link
                  to={`/post/${post.id}`}
                  className="btn btn-sm btn-primary"
                >
                  Xem chi tiết
                </Link>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Card>
  );
};

export default UserDetail;
