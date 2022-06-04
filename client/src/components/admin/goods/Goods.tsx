import * as React from 'react';
import {connect} from "react-redux";
import {
    clearGoodsState as clearItemsState,
    deleteManyGoods as deleteManyItems,
    fetchGoods as fetchItems,
    searchGoods as searchItems
} from "../../../actions";
import GridView, {FilterListTypeArray} from '../../GridView';
import {ShoeInterface} from "../../../actions/types";
import {HeadCell} from "../../types";
import {sexes, shoeTypes} from "./BaseGood";

interface PropsInterface {
    goods: ShoeInterface[] | [],
    count: number,
    fetchGoods: (skip: number, limit: number, count: boolean) => void,
    searchGoods: (condition: string, skip: number, limit: number, count: boolean) => void,
    clearGoodsState: () => void,
    deleteManyGoods: (goods: string[], onSuccessCallback: () => void) => void
}


const headCells: Array<HeadCell<ShoeInterface>> = [
    {id: 'title', numeric: false, disablePadding: true, label: 'Модель'},
    {id: 'brand', numeric: false, disablePadding: true, label: 'Бренд'},
    {id: 'description', numeric: false, disablePadding: true, label: 'Опис'},
    {id: 'price', numeric: true, disablePadding: false, label: 'Ціна'},
    {id: 'type', numeric: false, disablePadding: true, label: 'Тип'},
    {id: 'sex', numeric: false, disablePadding: true, label: 'Стать'},
];

const filterList: FilterListTypeArray<ShoeInterface> = {
    [headCells[4].id]: {
        filterName: headCells[4],
        filterLabel: "Тип",
        fields: shoeTypes
    },
    [headCells[5].id]: {
        filterName: headCells[5],
        filterLabel: "Стать",
        fields: sexes
    }
};

const Goods: React.FC<PropsInterface> = ({goods, count, fetchGoods, searchGoods, clearGoodsState, deleteManyGoods}) => {

    const goodsCount = 10;

    const onDeleteCallback = (): void => {
        alert('Items are successfully deleted.');
        fetchGoods(0, goodsCount, true);
    }

    return (
        <GridView
            idField="_id"
            filterList={filterList}
            createLocationPath='/admin/goods/create'
            editRoute='/admin/goods/edit'
            rowsCount={goodsCount}
            count={count}
            data={goods}
            headCells={headCells}
            fetchItems={fetchGoods}
            searchItems={searchGoods}
            clearItems={clearGoodsState}
            deleteMessage="Ви справді хочете видалити виділенні товари?"
            deleteButtons={["Скасувати", "Видалити"]}
            title="Товари"
            deleteItems={[deleteManyGoods, onDeleteCallback]}
        />
    )
};

const mapStateToProps = ({goods: {goods, count}}: any) => ({goods, count});

export default connect(mapStateToProps, {
    fetchGoods: fetchItems,
    searchGoods: searchItems,
    clearGoodsState: clearItemsState,
    deleteManyGoods: deleteManyItems
})(Goods);