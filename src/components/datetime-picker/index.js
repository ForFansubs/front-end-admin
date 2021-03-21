import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import FindIndex from "lodash-es/findIndex";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function DatePicker(props) {
    const { t } = useTranslation("components");
    const { release_date, setAnimeData, setData, slug } = props;

    function handleInputChange(date) {
        setAnimeData((state) => ({ ...state, release_date: date }));

        if (setData) {
            setData((data) => {
                const newDataSet = data;
                newDataSet[FindIndex(data, { slug: slug })][
                    "release_date"
                ] = date;
                return newDataSet;
            });
        }
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                margin='normal'
                id='date-picker-dialog'
                label={t("datepicker.label")}
                format={t("common:date_picker_format")}
                value={release_date}
                onChange={handleInputChange}
                fullWidth
                inputVariant='filled'
                KeyboardButtonProps={{
                    "aria-label": "change date",
                }}
            />
        </MuiPickersUtilsProvider>
    );
}

function TimePicker(props) {
    const { t } = useTranslation("components");
    const { release_date, setAnimeData, setData, slug } = props;

    function handleInputChange(date) {
        setAnimeData((state) => ({ ...state, release_date: date }));

        if (setData) {
            setData((data) => {
                const newDataSet = data;
                newDataSet[FindIndex(data, { slug: slug })][
                    "release_date"
                ] = date;
                return newDataSet;
            });
        }
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
                margin='normal'
                id='time-picker'
                label={t("timepicker.label")}
                value={release_date}
                onChange={handleInputChange}
                fullWidth
                inputVariant='filled'
                KeyboardButtonProps={{
                    "aria-label": "change time",
                }}
            />
        </MuiPickersUtilsProvider>
    );
}

export { DatePicker, TimePicker };

DatePicker.propTypes = {
    release_date: PropTypes.instanceOf(Date),
    setAnimeData: PropTypes.func.isRequired,
    setData: PropTypes.func,
    slug: PropTypes.string,
};

TimePicker.propTypes = {
    release_date: PropTypes.instanceOf(Date),
    setAnimeData: PropTypes.func.isRequired,
    setData: PropTypes.func,
    slug: PropTypes.string,
};
