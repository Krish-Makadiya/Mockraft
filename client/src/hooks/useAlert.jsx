// hooks/useAlert.js
import { useState } from 'react';
import AlertBox from '../components/main/AlertBox';

export function useAlert() {
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning',
        onConfirm: () => {},
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        showCancel: true
    });

    const showAlert = (options) => {
        setAlertState({
            isOpen: true,
            ...options
        });
    };

    const hideAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    return {
        alertState,
        showAlert,
        hideAlert,
        AlertComponent: () => (
            <AlertBox
                isOpen={alertState.isOpen}
                onClose={hideAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onConfirm={alertState.onConfirm}
                confirmText={alertState.confirmText}
                cancelText={alertState.cancelText}
                showCancel={alertState.showCancel}
            />
        )
    };
}