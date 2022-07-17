import Typography from "@material-ui/core/Typography";
import * as React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "@material-ui/core/Snackbar";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import BaseGood, {
    Alert,
    GoodStyles,
    PaperComponent,
    BaseGoodPropsType, BaseGoodStateType
} from "./BaseGood";
import {withStyles} from "@material-ui/core";
import {createBrand, createGood, deleteBrand, fetchBrands} from "../../../actions";
import {connect} from "react-redux";
import {ShoeInterface} from "../../../actions/types";
import UploadImages from "../UploadImages";
import ChipManager from "./ChipManager";
import _map from "lodash/map";
import {ItemsType} from "../../types";
import EditableSelect from "../../select/EditableSelect";
import {colors, sexes, shoeTypes} from "./goodTypes";

interface CreateGoodProps extends BaseGoodPropsType {
    createGood: (good: ShoeInterface, callback: () => void) => void;
}

class CreateGood extends BaseGood<CreateGoodProps, BaseGoodStateType> {
    constructor(props: CreateGoodProps) {
        super(props);
        this.state = CreateGood.defaultState();
    }

    public componentDidMount() {
        this.props.fetchBrands();
    }

    public render() {
        const {classes, brands} = this.props;
        const options = _map(brands, ({label, value}) => ({label, value}));
        const {title, description, mainImage, type, sex, price, color, sizes} = this.state.good;
        const {showAlert, showDialog, formErrors, isLoading} = this.state;

        return <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Товар
            </Typography>
            <React.Fragment>
                <Typography variant="h6" gutterBottom={true}>
                    Створення
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
                                value={title}
                                onChange={this.handleOnChange}
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
                            <UploadImages mainImage={mainImage}
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
                                fullWidth={true}
                                autoComplete="color-name"
                                select={true}
                                value={color}
                                onChange={this.handleOnChange}
                                helperText={formErrors.color}
                                error={formErrors.color.length > 0}
                            >
                                {_map(colors, (option) => (
                                    <MenuItem key={option.value} value={option.value}>
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
                                {_map(shoeTypes, (option) => (
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
                                {_map(sexes, (option) => (
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
                                onClick={this.handleDelete}
                            >
                                Очистити
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Dialog
                    open={showDialog}
                    onClose={() => this.handleClose("cancel")}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                        Створити товар
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Щоб створити товар, натисність "Створити товар"
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus={true} name="cancel" onClick={() => this.handleClose("cancel")}
                                color="primary">
                            Відміна
                        </Button>
                        <Button name="save" onClick={() => this.handleSave()} color="primary">
                            Створити товар
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

    protected handleSave = (): void => {
        this.props.createGood(this.state.good,
            () => {
                this.props.history.push('/admin/goods');
            });
    };

    protected handleDelete = (): void => {
        this.setState(CreateGood.defaultState())
    }

    protected setMainImage = (mainImage: string): void => {
        const newState: ShoeInterface = this.state.good;
        newState.mainImage = mainImage;
        this.setState({good: newState});
    }

}

const mapStateToProps = ({brands}: { brands: ItemsType }) => ({brands});

export default connect(mapStateToProps, {
    createGood,
    fetchBrands,
    createBrand,
    deleteBrand
})(withStyles(GoodStyles)(CreateGood));