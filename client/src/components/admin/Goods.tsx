import * as React from 'react';

import {connect} from "react-redux";

import {fetchGoods} from "../../actions";
import GridView from '../GridView';

import {ShoeInterface} from "../../actions/types";

interface PropsInterface {
    goods: ShoeInterface[] | [],
    fetchGoods: (to: number, fields?: string[]) => void
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof ShoeInterface;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    {id: 'title', numeric: false, disablePadding: true, label: 'Модель'},
    {id: 'brand', numeric: false, disablePadding: true, label: 'Бренд'},
    {id: 'description', numeric: false, disablePadding: true, label: 'Опис'},
    {id: 'price', numeric: true, disablePadding: false, label: 'Ціна'},
    {id: 'type', numeric: false, disablePadding: true, label: 'Тип'},
    {id: 'sex', numeric: false, disablePadding: true, label: 'Стать'},
];

class Goods extends React.Component<PropsInterface, any> {

    public componentDidMount() {
        this.props.fetchGoods(6);
    }

    public render() {
        if (this.props.goods.length > 0 && Array.isArray(this.props.goods)) {
            return (
                <React.Fragment>
                        <GridView idField="_id" createLocationPath='/admin/goods/create' editRoute='/admin/goods/edit' data={this.props.goods} headCells={headCells}
                                  title="Товари"/>
                </React.Fragment>
            )
        }
        return <div>Loading...</div>
    }
}

const mapStateToProps = ({goods}: any) => ({goods});

export default connect(mapStateToProps, {fetchGoods})(Goods);