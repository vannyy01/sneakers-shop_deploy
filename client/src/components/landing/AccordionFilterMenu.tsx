import * as React from "react";
import {Accordion, AccordionDetails, AccordionSummary, FormGroup, Theme} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {makeStyles} from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import {ItemsType} from "../types";
import {FilterStateType} from "./Goods";
import {map} from "lodash";

const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        accordionExpanded: {
            margin: "0 !important",
        },
        drawerFormGroup: {
            marginBottom: 0,
        },
        drawerFormControl: {
            fontSize: 15,
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexShrink: 0,
        },
    })
);


interface AccordionFilterMenuType {
    name: string,
    label: string,
    expandedFilterItem: string | false,
    handleChangeFilter: (panel: string | false) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void,
    filterFields: ItemsType
    filterState: FilterStateType,
    handleChangeFilterOption: (event: React.ChangeEvent<HTMLInputElement>) => void,
    row?: boolean
}

const AccordionFilterMenu: React.FC<AccordionFilterMenuType> = ({
                                                                    name,
                                                                    label,
                                                                    expandedFilterItem,
                                                                    handleChangeFilter,
                                                                    handleChangeFilterOption,
                                                                    filterFields,
                                                                    filterState,
                                                                    row = false
                                                                }) => {
    const classes = useStyles();
    return (
        <Accordion expanded={expandedFilterItem === name}
                   onChange={handleChangeFilter(name)}
                   classes={{expanded: classes.accordionExpanded}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`${name}-content`}
                id={`${name}-header`}
            >
                <Typography className={classes.heading}>{label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FormGroup row={row}>
                    {map(filterFields, item =>
                        <FormControlLabel
                            key={item.label}
                            className={classes.drawerFormGroup}
                            control={
                                <Checkbox
                                    disabled={item.count === 0}
                                    checked={filterState[item.value]}
                                    onChange={handleChangeFilterOption}
                                    name={item.label}
                                    value={item.value}
                                    color="primary"
                                />
                            }
                            classes={{label: classes.drawerFormControl}}
                            label={`${item.label} (${item.count})`}
                        />
                    )}
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    )
};

export default AccordionFilterMenu;