import {Checkbox, withStyles} from "@material-ui/core";

const CustomCheckbox = withStyles({
    root: {
        color: 'var(--primary-color)',
        "&$checked": {
            color: 'var(--primary-color)',
        },
    },
    checked: {}
})(Checkbox);

export default CustomCheckbox;