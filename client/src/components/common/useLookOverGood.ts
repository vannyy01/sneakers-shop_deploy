import {getStorage} from "../../actions/validation";
import {useEffect, useState} from "react";
import {ShoeInterface} from "../../actions/types";
import {addFilters} from "../../utils";
import axios from "axios";

const MAX_GOODS = 8;
/**
 * Hook for setting in looked over good.
 * @param {string} id - Good`s ID.
 * @return {void}
 */
export const setLookedOverGood = (id: string) => {
    const goods = getStorage("looked_over_goods");
    console.log(goods);
    if (goods.includes(id)) {
        return;
    }
    if (goods.length === MAX_GOODS) {
        goods.length = MAX_GOODS - 1;
        localStorage.removeItem("looked_over_goods");
    }
    goods.unshift(id);
    localStorage.setItem("looked_over_goods", JSON.stringify(goods));
};

/**
 * Hook for retrieving looked over goods.
 * @param {boolean} mainPage - The behavior of retriving goods. 5 for the main page.
 * @return {ShoeInterface[]} The list of looked over goods.
 */
export const useLookOverGoods = (mainPage: boolean = false): ShoeInterface[] => {
    const fieldsList = ['_id', 'brand', 'description', 'price', 'title', 'sex', 'type', 'color', 'sizes', 'mainImage', 'discount', 'discountPrice'];
    const [selectedGoods, setSelectedGoods] = useState<ShoeInterface[]>([]);

    useEffect(() => {
        let lookedOverGoods = getStorage("looked_over_goods");
        mainPage && (lookedOverGoods.length = 5);
        const fetchData = async (filters: string, params: { fields: string[] }) => {
            const res = await axios.get(`/api/selected_commodities/${filters}`, {params});
            const {goods}: { goods: ShoeInterface[] } = res.data;
            const sortedGoods: ShoeInterface[] = [];
            for (let look of lookedOverGoods) {
                for (let good of goods) {
                    look === good._id && (sortedGoods.push(good));
                }
            }
            setSelectedGoods(sortedGoods);
        }
        const filters = addFilters({selectedItems: lookedOverGoods});
        const params = {fields: fieldsList};
        fetchData(filters, params).catch((error) => console.error(error));
    }, []);

    return selectedGoods;
}