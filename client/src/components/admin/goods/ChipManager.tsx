import * as React from 'react';
import ChipInput from "material-ui-chip-input";
import {useEffect, useState} from "react";
import {SizeInterface} from "../../../actions/types";
import Chip from "@material-ui/core/Chip";
import {Avatar} from "@material-ui/core";
import {PaperComponent} from "./BaseGood";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from '@material-ui/core/TextField';
import {validateNumberInput} from "../../../actions/validation";
import {inArray} from "../../utils";

interface ChipManagerProps {
    label: string,
    sizes: SizeInterface[] | [],
    setChips: (chipItems: any) => void
}

const ChipManager = ({label, sizes, setChips}: ChipManagerProps) => {
    const [chipItems, setChipItems] = useState<SizeInterface[]>(sizes);
    const [chipDialog, setChipDialog] = useState<boolean>(false);
    const [activeChip, setActiveChip] = useState<SizeInterface>();

    useEffect(() => {
        setChipItems(sizes);
    }, [sizes]);


    useEffect(() => {
        setChips(chipItems);
    }, [JSON.stringify(chipItems)]);

    const showChipDialog = (chip?: SizeInterface) => {
        if (chip) {
            setActiveChip(chip);
        } else {
            const index: number = chipItems.findIndex(value => value.sizeValue === activeChip.sizeValue);
            const tempItems: SizeInterface[] = [...chipItems];
            tempItems[index] = activeChip;
            setChipItems(tempItems);
        }
        setChipDialog(!chipDialog);
    }

    const handleAddChip = (chip: SizeInterface) => {
        chip.count = +chip.count;
        chip.sizeValue = +chip.sizeValue;
        if (chip.sizeValue > 9 && chip.sizeValue < 100 && !inArray<SizeInterface>(chip, 'sizeValue', chipItems)) {
            setChipItems([...chipItems, {sizeValue: chip.sizeValue, count: 0}]);
        }
    }

    const handleDeleteChip = (chip: SizeInterface) => {
        setChipItems(chipItems.filter(item => item.sizeValue !== chip.sizeValue));
    }

    const handleChangeCount = ({target: {value}}: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const chip: SizeInterface = Object.assign({}, activeChip);
        chip.count = validateNumberInput(value);
        setActiveChip(chip);
    }

    const handleKeyPressDialog = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            showChipDialog();
        }
    }

    return (
        <>
            <ChipInput
                label={label}
                blurBehavior={'add'}
                dataSourceConfig={{text: 'count', value: 'sizeValue'}}
                value={chipItems}
                onAdd={chip => handleAddChip(chip)}
                onDelete={chip => handleDeleteChip(chip)}
                chipRenderer={({
                                   value,
                                   text,
                                   chip,
                                   isFocused,
                                   handleDelete,
                                   className
                               }, key) =>
                    <Chip
                        key={key}
                        avatar={<Avatar>{value}</Avatar>}
                        label={text}
                        onClick={() => showChipDialog(chip)}
                        onDelete={handleDelete}
                        variant="outlined"
                        className={className}
                    />
                }
            />
            <Dialog
                open={chipDialog}
                onClose={() => showChipDialog()}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle>Розмір взуття {activeChip?.sizeValue}</DialogTitle>
                <DialogContent>
                    <TextField
                        value={activeChip?.count.toString()}
                        onChange={event => handleChangeCount(event)}
                        onKeyPress={event => handleKeyPressDialog(event)}
                        autoFocus={true}
                        margin="dense"
                        id="count"
                        label="Кількість взуття"
                        type="number"
                        fullWidth={true}
                    />
                </DialogContent>
                <DialogActions>
                    <Button name="cancel" onClick={() => showChipDialog()}
                            color="primary">
                        Закрити
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ChipManager;