import * as React from 'react';
// import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PollStepper from './PollSteper';

// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         form: {
//             display: 'flex',
//             flexDirection: 'column',
//             margin: 'auto',
//             width: 'fit-content',
//         },
//         formControl: {
//             marginTop: theme.spacing(2),
//             minWidth: 120,
//         },
//         formControlLabel: {
//             marginTop: theme.spacing(1),
//         },
//     }),
// );

function MaxWidthDialog(props: { onClick: () => void }) {
    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={true}
                aria-labelledby="max-width-dialog-title"
                style={{zIndex: 1112}}
            >
                <DialogTitle id="max-width-dialog-title">Ваші кросівки</DialogTitle>
                <DialogContent>
                    <PollStepper/>
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

export default MaxWidthDialog;