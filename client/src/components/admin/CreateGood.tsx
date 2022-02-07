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
import BaseGood, {Alert, GoodStyles, PaperComponent, PropsType, StateType, sexes, types} from "./BaseGood";
import {withStyles} from "@material-ui/core";
import {createGood} from "../../actions";
import {connect} from "react-redux";
import {ShoeInterface} from "../../actions/types";
import UploadImages from "./UploadImages";

interface CreateGoodProps extends PropsType {
    createGood: (good: ShoeInterface, callback: () => void) => void;
}

class CreateGood extends BaseGood<CreateGoodProps, StateType> {
    constructor(props: CreateGoodProps) {
        super(props);
        this.state = this.defaultState();
    }

    public render() {
        const {title, brand, description, mainImage, type, sex, price} = this.state.good;

        return <Paper className={this.props.classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Товар
            </Typography>
            <React.Fragment>
                <Typography variant="h6" gutterBottom={true}>
                    Створення
                </Typography>
                <form noValidate={true} onSubmit={event => this.handleSubmit(event)}>
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
                                onChange={event => this.handleChange(event, 'title')}
                                helperText={this.state.formErrors.title}
                                error={this.state.formErrors.title.length > 0}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <TextField
                                required={true}
                                id="brand"
                                name="brand"
                                label="Бренд"
                                fullWidth={true}
                                autoComplete="brand-name"
                                value={brand}
                                onChange={event => this.handleChange(event, 'brand')}
                                helperText={this.state.formErrors.brand}
                                error={this.state.formErrors.brand.length > 0}
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
                                onChange={event => this.handleChange(event, 'description')}
                                helperText={this.state.formErrors.description}
                                error={this.state.formErrors.description.length > 0}
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
                                helperText={this.state.formErrors.mainImage}
                                error={this.state.formErrors.mainImage.length > 0}
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <UploadImages mainImage={mainImage}
                                          setMainImage={this.setMainImage}/>
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
                                onChange={event => this.handleChange(event, 'type')}
                                helperText={this.state.formErrors.type}
                                error={this.state.formErrors.type.length > 0}
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
                                       helperText={this.state.formErrors.sex}
                                       error={this.state.formErrors.sex.length > 0}
                                       onChange={event => this.handleChange(event, 'sex')}
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
                                onChange={event => this.handleChange(event, 'price')}
                                helperText={this.state.formErrors.price}
                                error={this.state.formErrors.price.length > 0}
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
                                helperText={this.state.formErrors.price}
                                error={this.state.formErrors.price.length > 0}
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Button
                                variant="contained"
                                color="inherit"
                                style={{backgroundColor: "#1fbd3a", color: "#fff"}}
                                startIcon={<ArrowBack/>}
                                className={this.props.classes.button}
                                onClick={this.handleComeBack}
                            >
                                Повернутися назад
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<DeleteIcon/>}
                                className={this.props.classes.button}
                            >
                                Зберегти
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon/>}
                                className={this.props.classes.button}
                                onClick={this.handleDelete}
                            >
                                Видалити
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Dialog
                    open={this.state.showDialog}
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
                <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={this.state.showAlert}
                          autoHideDuration={6000} className={this.props.classes.alert}
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
        this.setState(this.defaultState())
    }

    protected setMainImage = (mainImage: string): void => {
        const newState: ShoeInterface = this.state.good;
        newState.mainImage = mainImage;
        this.setState({good: newState});
    }

}

export default connect(null, {createGood})(withStyles(GoodStyles)(CreateGood));