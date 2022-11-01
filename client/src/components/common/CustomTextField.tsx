import {TextField, withStyles} from "@material-ui/core";

const CustomTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'var(--primary-color)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--primary-color)',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'var(--primary-color)',
            },
        },
    },
})(TextField);

export default CustomTextField;