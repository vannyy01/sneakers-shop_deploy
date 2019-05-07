import * as React from 'react';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {answerOnPoll, getAnswersResult} from "../../actions";
import {AnswerI} from "../../actions/types";
import PollStepper from './PollSteper';

interface DialogBoxI {
    answerOnPoll: (id: number, answerKey: string) => void,
    getAnswersResult: () => void,
    onClick: () => void,
    poll: AnswerI
}

const useStyles = makeStyles(() =>
    createStyles({
        dialog: {
            minHeight: '700px',
            zIndex: 1112
        },
        media: {
            height: '300px',
            marginBottom: '0.5em',
            minWidth: '50%!important',
            width: '550px'
        },
    }),
);

function DialogBox(props: DialogBoxI) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={true}
                className={classes.dialog}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Ваші кросівки</DialogTitle>
                <DialogContent>
                    {!props.poll.item ?
                        <PollStepper onNext={props.answerOnPoll} onFinish={props.getAnswersResult}/>
                        :
                        <React.Fragment>
                            <CardMedia
                                image={props.poll.image}
                                className={`${classes.media} rounded`}
                            />
                            <div>
                                <Typography gutterBottom={true} variant="h5" component="h2">
                                    {props.poll.title}
                                </Typography>
                                <p style={{fontSize: 18}}>{props.poll.description}</p>
                            </div>
                        </React.Fragment>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClick} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

const mapStateToProps = ({poll}: any) => {
    return {poll};
};

export default connect(mapStateToProps, {answerOnPoll, getAnswersResult})(DialogBox);