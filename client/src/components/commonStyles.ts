import { createStyles, makeStyles } from "@material-ui/core";

const selected = {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    textDecoration: "none",
    "&:hover": {
        color: "var(--primary-color)",
        textDecoration: "none"
    }
};

export const useSelectedLinkStyles = makeStyles(() => createStyles({ selected }));

export const useLinkStyles = makeStyles(() => createStyles({
    link: {
        ...selected,
        color: "inherit"
    }
}));