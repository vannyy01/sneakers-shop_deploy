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
import {Search} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {useState} from "react";
import {FilterListTypeArray} from "./index";
import Select, {ActionMeta, components, PlaceholderProps} from 'react-select';
import _map from "lodash/map";
import {ItemDataType} from "../../types";

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

interface EnhancedTableToolbarPropsI<T> {
    filterList?: FilterListTypeArray<T>,
    handleChangeFilter: (newValue: ItemDataType, actionMeta: ActionMeta<ItemDataType>) => void,
    searchItems: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    deleteItems: () => void,
    selected: string[],
    searchFieldPlaceholder: string,
    searchCondition?: string,
    title: string,
    location: string
}

const Placeholder: React.FC<PlaceholderProps<ItemDataType>> = (props) => {
    return <components.Placeholder {...props} children={props.children}/>;
};

const EnhancedTableToolbar = <T, >({
                                       selected,
                                       title,
                                       location,
                                       deleteItems,
                                       searchItems,
                                       searchFieldPlaceholder,
                                       searchCondition,
                                       filterList,
                                       handleChangeFilter
                                   }: EnhancedTableToolbarPropsI<T>) => {
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
                            Обрано {selected.length} записів
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
                                label={searchFieldPlaceholder}
                                onChange={searchItems}
                                defaultValue={searchCondition}
                            />
                        </Grid>
                    </Grid>
                </div>
            )}
            <div className={classes.spacer}/>
            {selected.length === 0 && showFilters && (_map(filterList, ({
                                                                            filterName,
                                                                            filterLabel,
                                                                            fields,
                                                                            selectedOption
                                                                        }) =>
                <Select
                    key={filterName.id as string}
                    closeMenuOnSelect={true}
                    isClearable={true}
                    isSearchable={false}
                    name={filterName.id as string}
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
                    options={_map(fields, ({label, value}) => ({label, value}))}
                    value={selectedOption}
                />
            ))}
            <div className={classes.actions}>
                {selected.length > 0 ? (
                    <Tooltip title="Видалити">
                        <IconButton aria-label="Видалити запис" onClick={deleteItems}>
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

export default EnhancedTableToolbar;
// export default <T,>(props: EnhancedTableToolbarPropsI<T>) => connect(null, {deleteManyGoods})(() => EnhancedTableToolbar(props));