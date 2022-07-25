import * as React from 'react';
import {connect} from "react-redux";
import {
    clearGoodsState as clearItemsState,
    deleteManyGoods as deleteManyItems,
    fetchGoods as fetchItems,
    searchGoods as searchItems,
    fetchBrands as fetchBr
} from "../../../actions";
import GridView, {FilterListTypeArray} from '../../GridView';
import {ShoeInterface} from "../../../actions/types";
import {HeadCell, ItemsType} from "../../../types";
import {useEffect} from "react";
import _isEmpty from "lodash/isEmpty";
import {sexes, shoeTypes} from "./goodTypes";

export const headCells: Array<HeadCell<ShoeInterface>> = [
    {id: 'title', numeric: false, disablePadding: true, label: 'Модель'},
    {id: 'brand', numeric: false, disablePadding: true, label: 'Бренд'},
    {id: 'description', numeric: false, disablePadding: true, label: 'Опис'},
    {id: 'price', numeric: true, disablePadding: false, label: 'Ціна'},
    {id: 'type', numeric: false, disablePadding: true, label: 'Тип'},
    {id: 'sex', numeric: false, disablePadding: true, label: 'Стать'},
];

interface PropsInterface {
    goods: ShoeInterface[],
    brands: ItemsType,
    count: number,
    fetchGoods: ({
                     skip,
                     limit,
                     count,
                     fields
                 }: { skip: number, limit: number, count: boolean, fields?: string[] }) => void,
    fetchBrands: () => void,
    searchGoods: (condition: string, skip: number, limit: number, count: boolean) => void,
    clearGoodsState: () => void,
    deleteManyGoods: (goods: string[], onSuccessCallback: () => void) => void
}

const Goods: React.FC<PropsInterface> = ({
                                             goods,
                                             brands = {},
                                             count,
                                             fetchGoods,
                                             fetchBrands,
                                             searchGoods,
                                             clearGoodsState,
                                             deleteManyGoods
                                         }) => {

    const goodsCount = 10;

    const filterList: FilterListTypeArray<ShoeInterface> = {
        [headCells[1].id]: {
            filterName: headCells[1],
            filterLabel: "Бренд",
            fields: brands
        },
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

    useEffect(() => {
        fetchBrands();
    }, []);

    const onDeleteCallback = (): void => {
        alert('Items are successfully deleted.');
        fetchGoods({skip: 0, limit: goodsCount, count: true});
    }

    return (
        !_isEmpty(brands) && <GridView
            <ShoeInterface>
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
            searchFieldPlaceholder="Модель, бренд, стать..."
        />
    )
};

const mapStateToProps = ({
                             goods: {goods, count},
                             brands
                         }: { goods: { goods: ShoeInterface[], count: number }, brands: ItemsType }) => ({
    goods,
    count,
    brands
});

export default connect(mapStateToProps, {
    fetchGoods: fetchItems,
    searchGoods: searchItems,
    clearGoodsState: clearItemsState,
    deleteManyGoods: deleteManyItems,
    fetchBrands: fetchBr
})(Goods);