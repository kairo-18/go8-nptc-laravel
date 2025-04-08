import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toast = () => {
    return (
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
        />
    );
};

export const showToast = (
    message: string,
    options?: {
        type?: 'info' | 'success' | 'warning' | 'error';
        position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
        autoClose?: number | false;
    },
) => {
    const defaultOptions = {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
        ...options,
    };

    switch (options?.type) {
        case 'success':
            toast.success(message, defaultOptions);
            break;
        case 'warning':
            toast.warning(message, defaultOptions);
            break;
        case 'error':
            toast.error(message, defaultOptions);
            break;
        default:
            toast(message, defaultOptions);
    }
};
