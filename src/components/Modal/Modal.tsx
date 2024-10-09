import React from 'react';
import { UserFormProps } from '../form/AddEditUserForm/AddEditUserForm';
import { AiOutlineClose } from 'react-icons/ai'; // Import the close icon from react-icons

interface Props {
    open: boolean;
    modalMode: string;
    children: any;
    close: any;
}

const Modal = ({ open, modalMode, children, close }: Props) => {
    const closeModal = () => close();

    return (
        <div>
            {open && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                    {modalMode}
                                </h3>
                                <button 
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={closeModal}
                                    aria-label="Close modal"
                                >
                                    <AiOutlineClose className="h-6 w-6" />
                                </button>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Modal;
