import React, { useEffect, useState } from "react";
import { getUsers, getGenders, getRoles, deleteUser } from "../../api/userApi";
import {
  Table,
  Row,
  Col,
  Button,
  Navbar,
  Spinner,
  Alert,
} from "react-bootstrap";
import "../../App.css";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [genderMap, setGenderMap] = useState({});
  const [roleMap, setRoleMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("userInfo"));

  // ✅ Kiểm tra quyền admin
  useEffect(() => {
    if (!currentUser || Number(currentUser.roleId) !== 1) {
      alert("⛔ Bạn không có quyền truy cập trang này.");
      navigate("/"); // hoặc navigate("/unauthorized")
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, genderRes, rolesRes] = await Promise.all([
          getUsers(),
          getGenders(),
          getRoles(),
        ]);
        setUsers(usersRes.data);

        const genderObj = {};
        genderRes.data.forEach((g) => (genderObj[g.id] = g.name));
        setGenderMap(genderObj);

        const roleObj = {};
        rolesRes.data.forEach((r) => (roleObj[r.id] = r.name));
        setRoleMap(roleObj);
      } catch (err) {
        console.error("❌ Lỗi call API:", err);
        setError("Không thể tải danh sách người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleDelete = async (userId) => {
    if (userId === currentUser.id) {
      alert("❗ Bạn không thể xóa chính mình!");
      return;
    }

    const confirm = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
    if (!confirm) return;

    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("❌ Lỗi khi xóa người dùng:", error);
      alert("Không thể xóa người dùng.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2>🔧 Quản lý người dùng (Admin)</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col sm={3} className="d-flex justify-content-start mb-3">
            {/* <Link to="/admin/users/new" className="btn btn-primary">
              ➕ Thêm người dùng
            </Link> */}
          </Col>
        </Row>

        <div className="table-responsive">
          <Table className="table table-bordered table-striped hover-custom">
            <thead className="table-danger">
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Giới tính</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Chi tiết</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{genderMap[user.genderId]}</td>
                  <td>{user.email}</td>
                  <td>{roleMap[user.roleId]}</td>
                  <td>
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="btn btn-info btn-sm"
                    >
                      Xem
                    </Link>
                  </td>
                  <td>
                    {user.id !== currentUser.id && (
                      <Button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        🗑️ Xóa
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
