import * as React from 'react';

import {connect} from "react-redux";

import {deleteManyGoods, fetchGoods} from "../../actions";
import GridView from '../GridView';

import {ShoeInterface} from "../../actions/types";

interface PropsInterface {
    goods: ShoeInterface[] | [],
    fetchGoods: (to: number, fields?: string[]) => void,
    deleteManyGoods: (goods: string[], onSuccessCallback: () => void) => void
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

class Goods extends React.Component<PropsInterface, { goodsCount: 5 | 10 | 25 | 50 }> {
    constructor(props: PropsInterface) {
        super(props);
        this.state = {goodsCount: 25};
    }

    public componentDidMount() {
        this.props.fetchGoods(this.state.goodsCount);
    }

    public render() {
        if (this.props.goods.length > 0 && Array.isArray(this.props.goods)) {
            return (
                <React.Fragment>
                    <GridView idField="_id"
                              createLocationPath='/admin/goods/create'
                              editRoute='/admin/goods/edit'
                              data={this.props.goods}
                              headCells={headCells}
                              deleteMessage={"Ви справді хочете видалити виділенні товари?"}
                              deleteButtons={["Скасувати", "Видалити"]}
                              title="Товари"
                              deleteItems={[this.props.deleteManyGoods, this.onDeleteCallback]}
                    />
                </React.Fragment>
            )
        }
        return <div>Loading...</div>
    }

    protected onDeleteCallback = (): void => {
        alert('Items are successfully deleted.');
        this.props.fetchGoods(this.state.goodsCount);
    };
}

const mapStateToProps = ({goods}: any) => ({goods});

export default connect(mapStateToProps, {fetchGoods, deleteManyGoods})(Goods);