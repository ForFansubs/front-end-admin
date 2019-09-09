import React from 'react'

import { toast } from 'react-toastify';
import './toast.css';

import { Box, Typography } from '@material-ui/core'

function Message(props) {
    const { message, overridemessage } = props

    return (
        <Box
            p={2}
            bgcolor="background.level2"
            boxShadow={2}
        >
            <Typography variant="h5">{overridemessage ? overridemessage : message}</Typography>
        </Box>
    )
}

export function payload(container, type, message) {
    return ({
        container,
        type,
        message
    })
}

export default function ToastNotification(payload) {
    const { container, message, type } = payload

    const config = {
        position: "bottom-center",
        closeButton: false,
        autoClose: 3000,
        progressClassName: type === "success" ? "success-progressbar" : "error-progressbar"
    }
    toast.dismiss()

    switch (container) {
        case "process-success":
            return toast.success(({ closeToast }) => <Message type="success" onClick={closeToast} message="Başarıyla giriş yaptınız!" overridemessage={message} />, config)
        case "process-error":
            return toast.success(({ closeToast }) => <Message type="error" onClick={closeToast} message="İsteğinizi gerçekleştirirken bir sorunla karşılaştık." overridemessage={message} />, config)
        default:
            return false
    }
}