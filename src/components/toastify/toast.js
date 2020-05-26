import React from 'react'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './toast.css';

import { Box, Typography } from '@material-ui/core'



function Message(props) {
    const { message, overridemessage } = props

    return (
        <Box
            borderRadius="5px"
        >
            <Typography variant="body1">
                <b>{overridemessage ? overridemessage : message}</b>
            </Typography>
        </Box>
    )
}

export function payload(type, message) {
    return ({
        type,
        message
    })
}

export default function ToastNotification(payload) {
    const { type, message } = payload

    const config = {
        position: "bottom-center",
        closeButton: false,
        autoClose: 3000,
        hideProgressBar: true,
    }
    toast.dismiss()

    switch (type) {
        case "success":
            return toast.success(({ closeToast }) => <Message type="success" onClick={closeToast} message="Başarıyla giriş yaptınız!" overridemessage={message} />, config)
        case "error":
            return toast.error(({ closeToast }) => <Message type="error" onClick={closeToast} message="İsteğinizi gerçekleştirirken bir sorunla karşılaştık." overridemessage={message} />, config)
        case "info":
            return toast.info(({ closeToast }) => <Message type="error" onClick={closeToast} message="İsteğinizi gerçekleştirirken bir sorunla karşılaştık." overridemessage={message} />, config)
        default:
            return false
    }
}