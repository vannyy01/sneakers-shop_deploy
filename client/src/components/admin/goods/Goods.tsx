import * as React from 'react';

import {connect} from "react-redux";

import {deleteManyGoods as deleteManyItems, fetchGoods as fetchItems} from "../../../actions";
import GridView from '../../GridView';

import {ShoeInterface} from "../../../actions/types";
import {useEffect, useState} from "react";

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

const Goods: React.FC<PropsInterface> = ({goods, fetchGoods, deleteManyGoods}) => {

    const [goodsCount, setGoodsCount] = useState<number>(25);

    useEffect(() => {
            fetchGoods(goodsCount);
        }
    )

    const onDeleteCallback = (): void => {
        alert('Items are successfully deleted.');
        fetchGoods(goodsCount);
    }

    if (goods.length > 0 && Array.isArray(goods)) {
        return (
            <React.Fragment>
                <GridView idField="_id"
                          createLocationPath='/admin/goods/create'
                          editRoute='/admin/goods/edit'
                          data={goods}
                          headCells={headCells}
                          deleteMessage={"Ви справді хочете видалити виділенні товари?"}
                          deleteButtons={["Скасувати", "Видалити"]}
                          title="Товари"
                          deleteItems={[deleteManyGoods, onDeleteCallback]}
                />
            </React.Fragment>
        )
    }
    return <div>Loading...</div>
};

const mapStateToProps = ({goods}: any) => ({goods});

export default connect(mapStateToProps, {fetchGoods: fetchItems, deleteManyGoods: deleteManyItems})(Goods);