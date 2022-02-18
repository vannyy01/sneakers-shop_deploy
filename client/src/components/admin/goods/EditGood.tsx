import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Paper, {PaperProps} from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import {connect} from 'react-redux';
import {deleteGood, fetchGoodByID, updateGood} from "../../../actions";
import {ShoeInterface} from "../../../actions/types";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import BaseGood, {BaseGoodPropsType, BaseGoodStateType, GoodStyles, sexes, types} from "./BaseGood";
import UploadImages from "../UploadImages";
import ChipManager from "./ChipManager";

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function PaperComponent(props: PaperProps) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

interface EditGoodPropsType extends BaseGoodPropsType {
    classes: { alert: string, button: string, paper: string },
    fetchGoodByID: (id: string, onErrorCallback: () => void) => void,
    good: ShoeInterface,
    updateGood: (good: ShoeInterface | {}, callback: () => void) => void,
    deleteGood: (id: string, callback: () => void) => void
}

interface EditGoodStateType extends BaseGoodStateType {
    showDeleteDialog: boolean
}

class EditGood extends BaseGood<EditGoodPropsType, EditGoodStateType> {

    protected static defaultState = (): EditGoodStateType =>
        ({...BaseGood.defaultState(), showDeleteDialog: false, formValid: true});

    constructor(props: EditGoodPropsType) {
        super(props);
        this.state = EditGood.defaultState();
    }

    public componentDidMount() {
        this.props.fetchGoodByID(this.props.match.params.commID,
            () => this.props.history.push('/admin/goods')
        );
        this.setState({good: this.props.good})
    }

    public componentDidUpdate(prevProps: Readonly<EditGoodPropsType>, prevState: Readonly<EditGoodStateType>): void {
        if (JSON.stringify(prevProps.good) !== JSON.stringify(this.props.good)) {
            this.setState({good: this.props.good})
        }
    }

    public render() {
        if (this.state.good?._id) {
            const {classes} = this.props;
            const {title, brand, description, mainImage, type, sex, price, sizes} = this.state.good;
            const {showAlert, showDialog, showDeleteDialog, formErrors} = this.state;
            return <Paper className={classes.paper}>
                <Typography component="h1" variant="h4" align="center">
                    Товар
                </Typography>
                <React.Fragment>
                    <Typography variant="h6" gutterBottom={true}>
                        Редагування
                    </Typography>
                    <form noValidate={true} onSubmit={this.handleSubmit}>
                        <Grid container={true} spacing={3}>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="title"
                                    name="title"
                                    label="Назва моделі"
                                    fullWidth={true}
                                    autoComplete="title-name"
                                    onChange={this.handleOnChange}
                                    value={title}
                                    helperText={formErrors.title}
                                    error={formErrors.title.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="brand"
                                    name="brand"
                                    label="Бренд"
                                    fullWidth={true}
                                    multiline={true}
                                    autoComplete="brand-name"
                                    value={brand}
                                    onChange={this.handleOnChange}
                                    helperText={formErrors.brand}
                                    error={formErrors.brand.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <TextField
                                    required={true}
                                    id="description"
                                    name="description"
                                    multiline={true}
                                    maxRows={4}
                                    label="Опис товару"
                                    fullWidth={true}
                                    autoComplete="description-name"
                                    value={description}
                                    onChange={this.handleOnChange}
                                    helperText={formErrors.description}
                                    error={formErrors.description.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <TextField
                                    required={true}
                                    disabled={true}
                                    id="mainImage"
                                    name="mainImage"
                                    label="Заставка. Оберіть одне із зображень нижче"
                                    multiline={true}
                                    fullWidth={true}
                                    autoComplete="mainImage-name"
                                    value={mainImage}
                                    helperText={formErrors.mainImage}
                                    error={formErrors.mainImage.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <UploadImages commID={this.props.match.params.commID} mainImage={mainImage}
                                              setMainImage={this.setMainImage}/>
                            </Grid>
                            <Grid item={true} xs={12}>
                                <ChipManager label="Вкажіть розміри" sizes={sizes} setChips={this.handleAddChips}/>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="type"
                                    name="type"
                                    label="Тип"
                                    fullWidth={true}
                                    autoComplete="type-name"
                                    select={true}
                                    value={type}
                                    onChange={this.handleOnChange}
                                    helperText={formErrors.type}
                                    error={formErrors.type.length > 0}
                                >
                                    {types.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField required={true}
                                           id="sex" name="sex" label="Стать" fullWidth={true}
                                           autoComplete="sex-name" select={true} value={sex}
                                           helperText={formErrors.sex}
                                           error={formErrors.sex.length > 0}
                                           onChange={this.handleOnChange}
                                >
                                    {sexes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="price"
                                    name="price"
                                    label="Ціна"
                                    fullWidth={true}
                                    autoComplete="shipping postal-code"
                                    value={price}
                                    onChange={this.handleOnChange}
                                    helperText={formErrors.price}
                                    error={formErrors.price.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={false}
                                    disabled={true}
                                    id="price_vat"
                                    name="price_vat"
                                    label="ціна з пдв"
                                    fullWidth={true}
                                    autoComplete="price_vat-name"
                                    value={(price * 1.2).toFixed(2)}
                                    helperText={formErrors.price}
                                    error={formErrors.price.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    style={{backgroundColor: "#1fbd3a", color: "#fff"}}
                                    startIcon={<ArrowBack/>}
                                    className={classes.button}
                                    onClick={this.handleComeBack}
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
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DeleteIcon/>}
                                    className={classes.button}
                                    onClick={this.showDeleteDialog}
                                >
                                    Видалити
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Dialog
                        open={showDeleteDialog}
                        onClose={() => this.handleClose("cancel")}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                            Видалити товар
                        </DialogTitle>
                        <DialogActions>
                            <Button autoFocus={true} name="cancel" onClick={() => this.handleClose("cancel")}
                                    color="primary">
                                Відміна
                            </Button>
                            <Button name="save" onClick={this.handleDelete} color="primary">
                                Видалити товар
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={showDialog}
                        onClose={() => this.handleClose("cancel")}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                            Оновити товар
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Щоб оноваити товар, натисність "Зберегти зміни"
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus={true} name="cancel" onClick={() => this.handleClose("cancel")}
                                    color="primary">
                                Відміна
                            </Button>
                            <Button name="save" onClick={this.handleSave} color="primary">
                                Зберегти зміни
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={showAlert}
                              autoHideDuration={6000} className={classes.alert}
                              onClose={() => this.handleClose("alert")}>
                        <Alert onClose={() => this.handleClose("alert")} severity="error">Виправте помилки!</Alert>
                    </Snackbar>
                </React.Fragment>
            </Paper>
        }
        return <div>Loading...</div>;
    }

    protected handleClose = (name: "cancel" | "alert" | "save"): void => {
        switch (name) {
            case "cancel":
                this.setState({showDialog: false, showDeleteDialog: false});
                break;
            case "alert":
                this.setState({showAlert: false});
                break;
            default:
                alert('Збережено');
                break;
        }
    };

    protected handleSave = (): void => {
        this.props.updateGood(this.state.good, () =>
            this.props.history.push('/admin/goods')
        );
    };

    protected showDeleteDialog = (): void => {
        this.setState({showDeleteDialog: true});
    };

    protected handleDelete = (): void => {
        this.props.deleteGood(this.state.good._id,
            () => this.props.history.push('/admin/goods'));

    }


}

const mapStateToProps = ({goods}: { goods: ShoeInterface }) => ({good: goods});

export default connect(mapStateToProps, {fetchGoodByID, updateGood, deleteGood})(withStyles(GoodStyles)(EditGood));