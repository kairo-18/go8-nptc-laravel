import { Bounce, ToastContainer, toast, Id } from 'react-toastify';
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
        type?: 'info' | 'success' | 'warning' | 'error' | 'loading';
        position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
        autoClose?: number | false;
        isLoading?: boolean;
    },
): Id => {  
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

    if (options?.isLoading || options?.type === 'loading') {
        return toast.loading(message, defaultOptions);
    }

    switch (options?.type) {
        case 'success':
            return toast.success(message, defaultOptions);
        case 'warning':
            return toast.warning(message, defaultOptions);
        case 'error':
            return toast.error(message, defaultOptions);
        default:
            return toast(message, defaultOptions);
    }
};

export type { Id };
