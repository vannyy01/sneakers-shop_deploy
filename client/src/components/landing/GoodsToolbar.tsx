import * as React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import SortSelect from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import IconButton from "@material-ui/core/IconButton/IconButton";
import FilterList from "@material-ui/icons/FilterList";

const rows: Array<{ row: string, label: string }> = [
    {row: 'priceAsc', label: 'За зростанням ціни'},
    {row: 'priceDesc', label: 'За зменшенням ціни'},
    {row: 'title', label: 'За назвою'}
];

interface GoodsToolbarType {
    orderBy: string,
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    setOpenDrawer: (open: boolean) => void,
    formControlClass: string
}

const GoodsToolbar: React.FC<GoodsToolbarType> = ({orderBy, handleChange, setOpenDrawer, formControlClass}) => {
    return <div className="d-flex justify-content-sm-between">
        <FormControl className={formControlClass}>
            <InputLabel htmlFor="orderBy-simple">Сортування</InputLabel>
            <SortSelect
                value={orderBy}
                onChange={handleChange}
                inputProps={{
                    id: 'orderBy-simple',
                    name: 'orderBy',
                }}
            >
                {rows.map(item =>
                    <MenuItem key={item.row} value={item.row}>{item.label}</MenuItem>
                )}
            </SortSelect>
        </FormControl>
        <div className="d-flex justify-content-end align-items-center">
            <Tooltip title="Фільтри" placement="top">
                <IconButton onClick={() => setOpenDrawer(true)} style={{width: "50px"}}>
                    <FilterList/>
                </IconButton>
            </Tooltip>
        </div>
    </div>
};

export default GoodsToolbar;