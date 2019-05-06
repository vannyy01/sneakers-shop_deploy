import * as React from "react";

import {makeStyles, Theme} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import Radio from "@material-ui/core/Radio/Radio";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import {QuestionI} from "./PollSteper";

const useStyles = makeStyles((theme: Theme) => ({
    formControl: {
        margin: theme.spacing(3),
    },
    group: {
        margin: theme.spacing(1, 0),
    }
}));

function PollForm(props: QuestionI) {
    const classes = useStyles();
    const [value, setValue] = React.useState(props.answerA);
    const {answerA, answerB, answerC} = props;

    function handleChange(event: React.ChangeEvent<unknown>) {
        setValue((event.target as HTMLInputElement).value);
    }

    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Відповідь</FormLabel>
            <RadioGroup
                aria-label="answer"
                name="answer"
                className='d-flex'
                value={value}
                onChange={handleChange}
            >
                <FormControlLabel
                    value={answerA}
                    name={answerA}
                    control={<Radio color="primary"/>}
                    label="A"
                    labelPlacement="start"
                />
                <FormControlLabel
                    value={answerB}
                    control={<Radio color="primary"/>}
                    label="B"
                    labelPlacement="start"
                />
                <FormControlLabel
                    value={answerC}
                    control={<Radio color="primary"/>}
                    label="C"
                    labelPlacement="start"
                />
            </RadioGroup>
        </FormControl>
    );
}

export default PollForm;