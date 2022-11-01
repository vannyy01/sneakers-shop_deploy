import {ShoeInterface} from "../../actions/types";
import {useEffect, useState} from "react";
import axios from "axios";

/**
 * Hook for retrieving looked over goods.
 * @param {number} limit - Maximum number of goods to retrieve.
 * @return {ShoeInterface[]} The list of looked over goods.
 */
export const useGoodsForSale = (limit: number = 10): ShoeInterface[] => {
    const fieldsList = ['_id', 'brand', 'description', 'price', 'title', 'sex', 'type', 'color', 'sizes', 'mainImage', 'discount', 'discountPrice'];
    const [goods, setGoods] = useState<ShoeInterface[]>([]);

    useEffect(() => {
        const fetchData = async (params: { fields: string[] }) => {
            const res = await axios.get(`/api/commodity/sale`, {params: {...params, limit}});
            const {goods}: { goods: ShoeInterface[] } = res.data;
            setGoods(goods);
        }
        const params = {fields: fieldsList};
        fetchData(params).catch((error) => console.error(error));
    }, []);

    return goods;
}