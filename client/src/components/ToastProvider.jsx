import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const darkMode = localStorage.getItem('theme') === 'dark';

const ToastProvider = () => {
  return (
   <ToastContainer
   position='top-center'
   autoClose={3000}
   hideProgressBar={false}
   newestOnTop={false}
   closeOnClick
   rtl={false}
   pauseOnFocusLoss
   draggable
   pauseOnHover
   theme={darkMode ? 'dark' : 'light'}
   />
  )
}

export default ToastProvider
