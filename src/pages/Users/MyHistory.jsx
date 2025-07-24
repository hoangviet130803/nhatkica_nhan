import { useEffect, useState, useCallback } from "react";
import {
  getPostHistoryByUserId,
  getPostById,
  deleteAllHistoryByUserId,
} from "../../api/postApi";
import { getUserById } from "../../api/userApi";
import { Card, Button, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";

const MyHistory = () => {
  const [loading, setLoading] = useState(true);
  const [historyList, setHistoryList] = useState([]);
  const [postMap, setPostMap] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Tải lịch sử chỉnh sửa của user
  const loadHistory = useCallback(async (userId) => {
    try {
      const { data: historyData } = await getPostHistoryByUserId(userId);

      const sorted = historyData
        .sort((a, b) => new Date(b.editedAt) - new Date(a.editedAt))
        .slice(0, 20);

      const postIds = [...new Set(sorted.map((h) => h.postId))];

      const postResults = await Promise.all(
        postIds.map(async (id) => {
          try {
            const { data } = await getPostById(id);
            return { id, data };
          } catch {
            return { id, data: null };
          }
        })
      );

      const postMapResult = {};
      postResults.forEach(({ id, data }) => {
        if (data) postMapResult[id] = data;
      });

      setHistoryList(sorted);
      setPostMap(postMapResult);
    } catch (err) {
      setError("Không thể tải lịch sử bài viết.");
      toast.error("❌ Lỗi tải lịch sử.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteAll = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) return navigate("/login");

    const confirm = window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử?");
    if (!confirm) return;

    try {
      await deleteAllHistoryByUserId(user.id);
      setHistoryList([]);
      toast.success("🗑️ Đã xóa toàn bộ lịch sử.");
    } catch (err) {
      toast.error("❌ Lỗi khi xóa lịch sử.");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      toast.info("Vui lòng đăng nhập để xem lịch sử.");
      return navigate("/login");
    }

    const verifyUser = async () => {
      try {
        const { data } = await getUserById(user.id);
        if (!data || data.id !== user.id) throw new Error();
        await loadHistory(user.id);
      } catch (err) {
        toast.error("Tài khoản không hợp lệ. Đăng nhập lại.");
        localStorage.removeItem("userInfo");
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate, loadHistory]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Đang tải lịch sử chỉnh sửa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Header />
        <h2>Lịch sử chỉnh sửa bài viết</h2>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (historyList.length === 0) {
    return (
      <div className="container mt-4">
        <Header />
        <h2>Lịch sử chỉnh sửa bài viết</h2>
        <p>Chưa có lịch sử chỉnh sửa nào.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Header />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mt-2">🕓 Lịch sử chỉnh sửa</h2>
        <Button variant="danger" className="mt-2" onClick={handleDeleteAll}>
          Xóa toàn bộ lịch sử
        </Button>
      </div>

      {historyList.map((history) => {
        const post = postMap[history.postId];
        const currentLikes = post?.likeCount ?? 0;
        const currentComments = post?.comments?.length ?? 0;
        const snapshotComments = history.commentsSnapshot?.length ?? 0;

        const isChanged = {
          title: post?.title !== history.title,
          content: post?.content !== history.content,
          like: currentLikes !== (history.likesCount ?? 0),
          comments: currentComments !== snapshotComments,
        };

        return (
          <Card key={history.id} className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>
                Bài viết:{" "}
                <strong>
                  {post ? (
                    post.title
                  ) : (
                    <span className="text-danger">[Đã bị xóa]</span>
                  )}
                </strong>
              </Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Thời điểm chỉnh sửa:{" "}
                {new Date(history.editedAt).toLocaleString()}
              </Card.Subtitle>

              <Row>
                <Col md={6}>
                  <h6 className="text-decoration-underline">
                    📌 Trước chỉnh sửa:
                  </h6>
                  <p>
                    <strong>Tiêu đề:</strong> {history.title}
                  </p>
                  <p>
                    <strong>Nội dung:</strong> {history.content}
                  </p>
                  {/* <p>
                    <strong>❤️ Likes:</strong> {history.likesCount ?? 0}
                  </p>
                  <p>
                    <strong>💬 Bình luận:</strong> {snapshotComments}
                  </p> */}
                </Col>
                <Col md={6}>
                  <h6 className="text-decoration-underline">📍 Hiện tại:</h6>
                  <p>
                    <strong>Tiêu đề:</strong>{" "}
                    {post ? (
                      isChanged.title ? (
                        <span className="text-success">{post.title}</span>
                      ) : (
                        <span className="text-muted">Không thay đổi</span>
                      )
                    ) : (
                      <span className="text-danger">Không có</span>
                    )}
                  </p>
                  <p>
                    <strong>Nội dung:</strong>{" "}
                    {post ? (
                      isChanged.content ? (
                        <span className="text-success">
                          {post.content?.slice(0, 150)}...
                        </span>
                      ) : (
                        <span className="text-muted">Không thay đổi</span>
                      )
                    ) : (
                      <span className="text-danger">Không có</span>
                    )}
                  </p>
                  {/* <p>
                    <strong>❤️ Likes:</strong>{" "}
                    {post ? (
                      isChanged.like ? (
                        <span className="text-success">{currentLikes}</span>
                      ) : (
                        <span className="text-muted">Không thay đổi</span>
                      )
                    ) : (
                      <span className="text-danger">Không có</span>
                    )}
                  </p> */}

                  
                  {/* <p>
                    <strong>💬 Bình luận:</strong>{" "}
                    {post ? (
                      isChanged.comments ? (
                        <span className="text-success">{currentComments}</span>
                      ) : (
                        <span className="text-muted">Không thay đổi</span>
                      )
                    ) : (
                      <span className="text-danger">Không có</span>
                    )}
                  </p> */}
                </Col>
              </Row>

              <div className="text-end">
                {post ? (
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    Xem bài viết
                  </Button>
                ) : (
                  <Button variant="secondary" className="mt-3" disabled>
                    Bài viết đã bị xóa
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default MyHistory;
