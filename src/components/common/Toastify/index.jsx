// src/components/common/Toastify.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toastify = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      pauseOnFocusLoss
      pauseOnHover
      draggable
    />
  );
};

export default Toastify;
