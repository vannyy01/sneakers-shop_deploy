import * as React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {SiteOptionType} from "../../../actions/types";
import {useEffect} from "react";
import {fetchSiteOptions} from "../../../actions/siteOptionController";
import {isEmpty} from "lodash";
import SiteOptionCard from "./SiteOptionCard";


const useStyles = makeStyles((theme: Theme) => createStyles({
    content: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
        minWidth: 700, // So the Typography noWrap works
        padding: theme.spacing(3),
        width: "100%"
    },
    root: {
        maxWidth: 300,
        width: 250,
        marginTop: 50,
    },
    toolbar: theme.mixins.toolbar,
}));

const SiteOptions: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const getSelector = ({siteOptions: siteOpts}: { siteOptions: SiteOptionType[] }): SiteOptionType[] => siteOpts;
    const siteOptions = useSelector(getSelector, shallowEqual);

    useEffect(() => {
        dispatch(fetchSiteOptions(["*"]));
    }, [dispatch]);

    return (
        <main className={"container " + classes.content}>
            <div className="row justify-content-between">
                {!isEmpty(siteOptions) && siteOptions.map((option) =>
                    <SiteOptionCard key={option.name} option={option}/>
                )}
            </div>
        </main>
    );
};

export default SiteOptions;