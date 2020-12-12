import { Alert } from '@material-ui/lab'

export function WarningBox(props) {
    const { children, variant } = props

    return (
        <Alert variant={variant}>{children}</Alert>
    )
}