// NotificationsDemo.jsx
import React from "react";
import { ToastContainer, toast as toastifyToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";

import * as Dialog from "@radix-ui/react-dialog";

import { Toaster, toast as hotToast } from "react-hot-toast";

function NotificationsDemo() {
  // Toastify
  const showToastify = () => {
    toastifyToast.success("🟢 Thông báo từ React-Toastify!");
  };

  // SweetAlert2
  const showSweetAlert = () => {
    Swal.fire({
      title: "Bạn có chắc không?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Đã xóa!", "Dữ liệu đã bị xóa.", "success");
      }
    });
  };

  // Hot Toast
  const showHotToast = () => {
    hotToast.success("🔥 react-hot-toast hoạt động!");
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto text-center">
      {/* <h1 className="text-2xl font-bold mb-4">🔔 Demo các loại thông báo</h1> */}

      {/* React-Toastify */}
      {/* <button
        onClick={showToastify}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        React-Toastify
      </button>
      <ToastContainer /> */}

      {/* SweetAlert2 */}
      <button
        onClick={showSweetAlert}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        SweetAlert2
      </button>

      {/* Radix UI Dialog */}
      {/* <Dialog.Root>
        <Dialog.Trigger className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Radix Dialog
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-6 rounded-xl shadow-xl w-96 -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-xl font-bold">
              Đây là Radix Dialog
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600">
              Modal này được xây dựng bằng thư viện @radix-ui/react-dialog.
            </Dialog.Description>
            <div className="mt-4 flex justify-end">
              <Dialog.Close className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                Đóng
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root> */}

      {/* Hot Toast */}
      {/* <button
        onClick={showHotToast}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        React-Hot-Toast
      </button>
      <Toaster position="top-right" /> */}
    </div>
  );
}

export default NotificationsDemo;
