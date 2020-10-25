import * as React from 'react';

import {connect} from "react-redux";
import GridView from '../GridView';

import {fetchGoods} from "../../actions";
import {ShoeInterface} from "../../actions/types";

interface PropsInterface {
    goods: ShoeInterface[] | [],
    fetchGoods: (to: number) => void
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof ShoeInterface;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Модель' },
    { id: 'brand', numeric: false, disablePadding: true, label: 'Бренд' },
    { id: 'description', numeric: false, disablePadding: true, label: 'Опис' },
    { id: 'price', numeric: true, disablePadding: false, label: 'Ціна' },
    { id: 'type', numeric: false, disablePadding: true, label: 'Тип' },
    { id: 'sex', numeric: false, disablePadding: true, label: 'Стать' },
];

class Goods extends React.Component<PropsInterface, any> {

    public componentDidMount() {
        this.props.fetchGoods(6);
    }

    public render() {
        if (this.props.goods) {
            for (const item of this.props.goods) {
                delete item.images;
                delete item.mainImage;
                delete item.size;
            }
            return <GridView idField="_id" data={this.props.goods} headCells={headCells} title="Товари"/>
        }
        return <div>Loading...</div>
    }
}

const mapStateToProps = ({goods}: any) => ({goods});

export default connect(mapStateToProps, {fetchGoods})(Goods);