import * as React from 'react';
import classNames from "classnames";
import {makeStyles, createStyles, Theme} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Add from '@material-ui/icons/Add';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {deleteManyGoods} from "../../actions";
import {Search} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {useState} from "react";
import {FilterListType} from "./index";
import Select, {components, PlaceholderProps} from 'react-select';

const useStyles = makeStyles((theme: Theme) => createStyles({
    actions: {
        color: theme.palette.text.secondary,
        display: 'flex'
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                color: theme.palette.secondary.main,
            }
            : {
                backgroundColor: theme.palette.secondary.dark,
                color: theme.palette.text.primary,
            },
    root: {
        paddingRight: theme.spacing(1),
    },
    spacer: {
        flex: '1 1 100%',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    title: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        height: 50,
    },
    margin: {
        margin: theme.spacing(1),
        width: '100%',
    },
    inputProps: {
        "& label.Mui-focused": {
            color: "#000000"
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "#000000"
        },
        "& .MuiFilledInput-underline:after": {
            borderBottomColor: "#000000"
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#000000"
            }
        }
    }
}));

interface EnhancedTableToolbarPropsI {
    filterList?: FilterListType[],
    handleChangeFilter: (newValue: any, actionMeta: any) => void,
    searchItems: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    deleteItems: () => void,
    selected: any[],
    title: string,
    location: string
}

const Placeholder: React.FC<PlaceholderProps<{ label: string, value: string | number }>> = (props) => {
    return <components.Placeholder {...props} children={props.children}/>;
};

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarPropsI> = ({
                                                                        selected,
                                                                        title,
                                                                        location,
                                                                        deleteItems,
                                                                        searchItems,
                                                                        filterList,
                                                                        handleChangeFilter
                                                                    }) => {
    const classes = useStyles();
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const handleShowFilters = (): void => setShowFilters(!showFilters);

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: selected.length > 0,
            })}
        >
            {selected.length === 0 ? (
                <div className={classes.title}>
                    <Typography variant="subtitle1" id="tableTitle">
                        {title}
                    </Typography>
                </div>
            ) : (
                <div style={{width: '100%'}}>
                    {selected.length > 0 &&
                        <Typography color="inherit" variant="subtitle2">
                            {selected.length} selected
                        </Typography>
                    }
                </div>
            )}
            {selected.length === 0 && (
                <div className={classes.margin}>
                    <Grid container={true} spacing={1} alignItems="flex-end">
                        <Grid item={true}>
                            <Search/>
                        </Grid>
                        <Grid item={true}>
                            <TextField
                                id="input-with-icon-grid"
                                className={classes.inputProps}
                                label="Модель, бренд, стать..."
                                onChange={searchItems}
                            />
                        </Grid>
                    </Grid>
                </div>
            )}
            <div className={classes.spacer}/>
            {selected.length === 0 && showFilters && (filterList.map(({filterName, filterLabel, fields, selectedOption}) =>
                <Select
                    key={filterName.id}
                    closeMenuOnSelect={true}
                    isClearable={true}
                    isSearchable={false}
                    name={filterName.id}
                    components={{Placeholder}}
                    placeholder={filterLabel}
                    onChange={handleChangeFilter}
                    styles={{
                        container: (base) => ({
                            ...base,
                            width: '50%',
                            margin: '5px'
                        })
                    }}
                    options={fields}
                    value={selectedOption}
                />
            ))}
            <div className={classes.actions}>
                {selected.length > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete" onClick={deleteItems}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <React.Fragment>
                        <Tooltip title="Створити новий запис">
                            <NavLink to={location}>
                                <IconButton aria-label="Створити новий запис">
                                    <Add/>
                                </IconButton>
                            </NavLink>
                        </Tooltip>
                        <Tooltip title="Фільтри">
                            <IconButton aria-label="Фільтри" onClick={handleShowFilters}>
                                <FilterListIcon/>
                            </IconButton>
                        </Tooltip>
                    </React.Fragment>
                )}
            </div>
        </Toolbar>
    );
};


export default connect(null, {deleteManyGoods})(EnhancedTableToolbar);