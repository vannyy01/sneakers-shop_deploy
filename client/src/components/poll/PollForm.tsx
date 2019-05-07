import * as React from "react";

import {makeStyles, Theme} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import Radio from "@material-ui/core/Radio/Radio";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";

const useStyles = makeStyles((theme: Theme) => ({
    formControl: {
        margin: theme.spacing(3),
    },
    group: {
        margin: theme.spacing(1, 0),
    }
}));

function PollForm(props: any) {
    const classes = useStyles();
    const {answerA, answerB, answerC} = props;

    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Відповідь</FormLabel>
            <RadioGroup
                aria-label="answer"
                name="answer"
                className='d-flex'
                onChange={props.handleChange}
            >
                <FormControlLabel
                    value='answerA'
                    control={<Radio color="primary"/>}
                    label={answerA}
                />
                <FormControlLabel
                    value='answerB'
                    control={<Radio color="primary"/>}
                    label={answerB}
                />
                <FormControlLabel
                    value='answerC'
                    control={<Radio color="primary"/>}
                    label={answerC}
                />
            </RadioGroup>
        </FormControl>
    );
}

export default PollForm;