import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import FindIndex from 'lodash-es/findIndex'

import PropTypes from 'prop-types'

function DatePicker(props) {
    const { release_date, setAnimeData, setData, slug } = props

    function handleInputChange(date) {
        setAnimeData(state => ({ ...state, release_date: date }))

        if (setData) {
            setData(data => {
                const newDataSet = data
                newDataSet[FindIndex(data, { slug: slug })]["release_date"] = date
                setData(newDataSet)
            })
        }
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Çıkış tarihi"
                format="MM/dd/yyyy"
                value={release_date}
                onChange={handleInputChange}
                fullWidth
                inputVariant="filled"
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
    );
}

function TimePicker(props) {
    const { release_date, setAnimeData, setData, slug } = props

    function handleInputChange(date) {
        setAnimeData(state => ({ ...state, release_date: date }))

        if (setData) {
            setData(data => {
                const newDataSet = data
                newDataSet[FindIndex(data, { slug: slug })]["release_date"] = date
                setData(newDataSet)
            })
        }
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Çıkış saati"
                value={release_date}
                onChange={handleInputChange}
                fullWidth
                inputVariant="filled"
                KeyboardButtonProps={{
                    'aria-label': 'change time',
                }}
            />
        </MuiPickersUtilsProvider>
    )
}

export { DatePicker, TimePicker }

DatePicker.propTypes = {
    release_date: PropTypes.instanceOf(Date),
    setAnimeData: PropTypes.func.isRequired,
    setData: PropTypes.func,
    slug: PropTypes.string
}

TimePicker.propTypes = {
    release_date: PropTypes.instanceOf(Date),
    setAnimeData: PropTypes.func.isRequired,
    setData: PropTypes.func,
    slug: PropTypes.string
}