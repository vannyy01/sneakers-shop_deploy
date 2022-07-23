import * as React from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {SiteOptionType} from "../../../actions/types";
import {useEffect, useState} from "react";
import {fetchSiteOptions, updateSiteOption} from "../../../actions/siteOptionController";
import {Button, createStyles, makeStyles, Paper, Typography} from "@material-ui/core";
import {useHistory, useParams} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import {Alert, PaperComponent} from "../goods/BaseGood";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles((theme) => createStyles(
    {
        alert: {
            marginTop: theme.spacing(7)
        },
        button: {
            margin: theme.spacing(1)
        },
        paper: {
            marginBottom: theme.spacing(3),
            marginTop: theme.spacing(3),
            padding: theme.spacing(2),
            [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
                marginBottom: theme.spacing(6),
                marginTop: theme.spacing(6),
                padding: theme.spacing(3),
            },
            width: "60em"
        },
        root: {height: 27},
    }
));

type FormsErrorsType = {
    [key in keyof Omit<SiteOptionType, "_id">]: { valid: boolean; errorText: string; };
};

const SiteOptionEdit: React.FC = () => {
    const classes = useStyles();
    const {optionName} = useParams<{ optionName: string }>();
    const history = useHistory();
    const dispatch = useDispatch();
    const getSelector = ({siteOptions: siteOpts}: { siteOptions: SiteOptionType[] }): SiteOptionType[] => siteOpts;
    const siteOption = useSelector(getSelector, shallowEqual)[0];
    const [option, setOption] = useState<SiteOptionType>();
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
    const initialFormErrors: FormsErrorsType = {
        name: {valid: true, errorText: ""},
        label: {valid: true, errorText: ""},
        title: {valid: true, errorText: ""},
        description: {valid: true, errorText: ""}
    };
    const [formErrors, setFormErrors] = useState<FormsErrorsType>(initialFormErrors);
    const [formValid, setFormValid] = useState<boolean>(true);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showEditDialog, setShowDialog] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchSiteOptions([optionName]));
    }, [dispatch]);

    useEffect(() => {
        console.log(siteOption);
        setOption(siteOption);
    }, [siteOption]);

    const validateField = (fieldName: string, value: any): void => {
        const fieldValidationErrors = formErrors;
        switch (fieldName) {
            case 'label':
                if (typeof value !== 'string') {
                    fieldValidationErrors.label.errorText = 'некоректний текст';
                    fieldValidationErrors.label.valid = false;
                    break;
                }
                fieldValidationErrors.label.errorText = '';
                fieldValidationErrors.label.valid = true;
                break;
            case 'title':
                if (typeof value !== 'string') {
                    fieldValidationErrors.title.errorText = 'некоректний тип';
                    fieldValidationErrors.title.valid = false;
                }
                fieldValidationErrors.title.errorText = '';
                fieldValidationErrors.title.valid = true;
                break;
            case 'description' :
                if (typeof value !== 'string') {
                    fieldValidationErrors.description.errorText = 'некоректний текст';
                    fieldValidationErrors.description.valid = false;
                    break;
                }
                if (value.length < 20) {
                    fieldValidationErrors.description.errorText = 'занадто короткий текст';
                    fieldValidationErrors.description.valid = false;
                    break;
                }
                fieldValidationErrors.description.errorText = '';
                fieldValidationErrors.description.valid = true;
                break;
            default:
                break;
        }
        setFormErrors(() => fieldValidationErrors);
        validateForm();
    };

    const validateForm = (): void => {
        let isValid = true;
        for (const key in formErrors) {
            if (!formErrors[key].valid) {
                isValid = false;
            }
        }
        setFormValid(isValid);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        const {name, value} = event.target;
        const newState: SiteOptionType = option;
        newState[name] = value;

        setTypingTimeout(setTimeout(() => {
            validateField(name, value);
            setOption(newState);
        }, 400));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!formValid) {
            setShowAlert(true);
            return;
        }
        const {_id, name, label, title, description} = option;
        const updatedOption = {
            _id,
            name,
            label: label.trim(),
            title: title.trim(),
            description: description.trim(),
        };
        setOption(() => updatedOption);
        setShowDialog(true);
    };

    const handleClose = (name: "cancel" | "alert" | "save"): void => {
        switch (name) {
            case "cancel":
                setShowDialog(false);
                break;
            case "alert":
                setShowAlert(false);
                break;
            default:
                alert('Збережено');
                break;
        }
    };

    const handleSave = (): void => {
        dispatch(updateSiteOption(option,
            () => history.push('/admin'))
        );
    }

    return option ? (
            <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom={true}>
                    Змінити параметр сайту {optionName}
                </Typography>
                <form noValidate={true} onSubmit={handleSubmit}>
                    <Grid container={true} spacing={3}>
                        <Grid item={true} xs={12} sm={6}>
                            <TextField
                                required={true}
                                id="name"
                                name="name"
                                label="Параметр сайту"
                                fullWidth={true}
                                value={option.name}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <TextField
                                required={true}
                                id="label"
                                name="label"
                                label="Аліас параметру"
                                fullWidth={true}
                                autoComplete="label-name"
                                value={option.label}
                                onChange={handleChange}
                                helperText={formErrors.label.errorText}
                                error={!formErrors.label.valid}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <TextField
                                required={true}
                                id="title"
                                name="title"
                                label="Заголовок"
                                fullWidth={true}
                                autoComplete="title-name"
                                value={option.title}
                                onChange={handleChange}
                                helperText={formErrors.title.errorText}
                                error={!formErrors.title.valid}
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <TextField
                                required={true}
                                id="description"
                                name="description"
                                label="Опис"
                                multiline={true}
                                fullWidth={true}
                                autoComplete="description-name"
                                value={option.description}
                                onChange={handleChange}
                                helperText={formErrors.description.errorText}
                                error={!formErrors.description.valid}
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Button
                                variant="contained"
                                color="inherit"
                                style={{backgroundColor: "#1fbd3a", color: "#fff"}}
                                startIcon={<ArrowBack/>}
                                className={classes.button}
                                onClick={history.goBack}
                            >
                                Повернутися назад
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<DeleteIcon/>}
                                className={classes.button}
                            >
                                Зберегти
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Dialog
                    open={showEditDialog}
                    onClose={() => handleClose("cancel")}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                        Оновити параметр сайту
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Щоб оноваити параметр, натисність "Зберегти зміни"
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus={true} name="cancel" onClick={() => handleClose("cancel")}
                                color="primary">
                            Відміна
                        </Button>
                        <Button name="save" onClick={handleSave} color="primary">
                            Зберегти зміни
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={showAlert}
                          autoHideDuration={6000} className={classes.alert}
                          onClose={() => handleClose("alert")}>
                    <Alert onClose={() => handleClose("alert")} severity="error">Виправте помилки!</Alert>
                </Snackbar>
            </Paper>
        ) :
        <div>Loading...</div>

};

export default SiteOptionEdit;