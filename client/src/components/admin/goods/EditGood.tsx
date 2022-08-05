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
import {
    createBrand,
    deleteGood,
    fetchBrands,
    fetchGoodByID,
    updateGood,
    deleteBrand,
    clearGoodsState
} from "../../../actions";
import {ShoeInterface} from "../../../actions/types";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import BaseGood, {BaseGoodPropsType, BaseGoodStateType} from "./BaseGood";
import UploadImages from "../UploadImages";
import ChipManager from "./ChipManager";
import _map from "lodash/map";
import {ItemsType} from "../../../types";
import EditableSelect from "../../select/EditableSelect";
import {colors, sexes, shoeTypes} from "./goodTypes";
import CRUDStyles from "../crudStyles";
import {isEmpty} from "lodash";
import he from "he";

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
    classes: { alert: string, button: string, paper: string, root: string },
    fetchGoodByID: (id: string, onErrorCallback: () => void) => void,
    good: ShoeInterface,
    brands?: ItemsType,
    updateGood: (good: ShoeInterface | {}, callback: () => void) => void,
    deleteGood: (id: string, callback: () => void) => void,
    clearGoodsState: () => void,
}

interface EditGoodStateType extends BaseGoodStateType {
    showDeleteDialog: boolean,
}

class EditGood extends BaseGood<EditGoodPropsType, EditGoodStateType> {

    protected static defaultState = (): EditGoodStateType =>
        ({...BaseGood.defaultState(), showDeleteDialog: false, formValid: true});

    constructor(props: EditGoodPropsType) {
        super(props);
        this.state = {...EditGood.defaultState(), good: undefined};
    }

    public componentDidMount() {
        this.props.fetchGoodByID(this.props.match.params.commID,
            () => this.props.history.push('/admin/goods')
        );
        this.props.fetchBrands();
        this.setState({good: this.props.good})
    }

    public componentDidUpdate(prevProps: Readonly<EditGoodPropsType>, prevState: Readonly<EditGoodStateType>): void {
        if (JSON.stringify(prevProps.good) !== JSON.stringify(this.props.good)) {
            this.setState({good: this.props.good})
        }
    }

    public componentWillUnmount() {
        this.props.clearGoodsState();
    }

    public render() {
        const {classes, brands} = this.props;
        const options = _map(brands, ({label, value}) => ({label, value}));
        if (!isEmpty(this.state.good) && !isEmpty(brands)) {
            const {
                title,
                brand,
                description,
                fullDescription,
                mainImage,
                type,
                sex,
                color,
                price,
                sizes
            } = this.state.good;
            const {
                showAlert,
                showDialog,
                showDeleteDialog,
                showDeleteOptionDialog,
                optionToDelete,
                isLoading,
                formErrors
            } = this.state;
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
                                <EditableSelect
                                    required={true}
                                    isLoading={isLoading}
                                    name="brand"
                                    label="Бренд"
                                    optionValue={brand}
                                    options={options}
                                    errorMessage={formErrors.brand}
                                    showDeleteOptionDialog={this.showDeleteOptionDialog}
                                    changeList={this.handleChangeList}
                                    createOption={this.handleCreateBrand}
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
                                    id="fullDescription"
                                    name="fullDescription"
                                    multiline={true}
                                    maxRows={10}
                                    label="Детальний опис"
                                    fullWidth={true}
                                    autoComplete="fullDescription-name"
                                    value={he.decode(fullDescription)}
                                    onChange={this.handleOnChange}
                                    helperText={formErrors.fullDescription}
                                    error={formErrors.fullDescription.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <TextField
                                    required={true}
                                    disabled={true}
                                    id="mainImage"
                                    name="mainImage"
                                    label="Заставка. Оберіть одне із зображень нижче"
                                    fullWidth={true}
                                    value={mainImage || ""}
                                    helperText={formErrors.mainImage}
                                    error={formErrors.mainImage.length > 0}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <UploadImages dirPrefix="commodities/" dirName={this.props.match.params.commID}
                                              mainImage={mainImage}
                                              setMainImage={this.setMainImage}/>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <ChipManager label="Вкажіть розміри" sizes={sizes} setChips={this.handleAddChips}/>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <TextField
                                    required={true}
                                    id="color"
                                    name="color"
                                    label="Колір"
                                    SelectProps={{classes: {root: classes.root}}}
                                    fullWidth={true}
                                    autoComplete="color-name"
                                    select={true}
                                    value={color}
                                    onChange={this.handleOnChange}
                                    helperText={formErrors.color}
                                    error={formErrors.color.length > 0}
                                >
                                    {_map(colors, option => (
                                        <MenuItem key={option.value} value={option.value}
                                                  style={{
                                                      backgroundColor: option.value.toString(),
                                                      color: option.value.toString() === "black" ? "#ffffff" : "inherit"
                                                  }}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                                    {_map(shoeTypes, option => (
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
                                    {_map(sexes, option => (
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
                        open={showDeleteOptionDialog}
                        onClose={() => this.handleClose("option")}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                            Видалити {optionToDelete}?
                        </DialogTitle>
                        <DialogActions>
                            <Button autoFocus={true} name="cancel" onClick={() => this.handleClose("option")}
                                    color="primary">
                                Відміна
                            </Button>
                            <Button name="save" onClick={this.handleDeleteOption} color="primary">
                                Видалити
                            </Button>
                        </DialogActions>
                    </Dialog>
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

    protected handleClose = (name: "cancel" | "alert" | "option" | "save"): void => {
        switch (name) {
            case "cancel":
                this.setState({showDialog: false, showDeleteDialog: false});
                break;
            case "alert":
                this.setState({showAlert: false});
                break;
            case "option":
                this.setState({showDeleteOptionDialog: false, optionToDelete: undefined})
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

    };

}

const mapStateToProps = ({goods: {goods}, brands}: { goods: {goods: ShoeInterface[]}, brands: ItemsType }) => ({
    good: goods[0],
    brands
});

export default connect(mapStateToProps, {
    fetchGoodByID,
    clearGoodsState,
    updateGood,
    deleteGood,
    fetchBrands,
    createBrand,
    deleteBrand
})(withStyles(CRUDStyles)(EditGood));