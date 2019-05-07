import {
    ANSWER_POLL, AnswerPollAction, CALC_POLL, CalcPollAction, PollReducerI
} from "../actions/types";

type AuthAction = AnswerPollAction | CalcPollAction;


type pollReducerState = PollReducerI;

const initialState: pollReducerState = {
    answerA: {
        count: 0,
        description: 'fіgfgаd',
        image: 'https://pumaimages.azureedge.net/images/105479/04/sv01/fnd/PNA/h/600/w/600',
        item: '1',
        title: 'Puma ONE 19.1'
    },
    answerB: {
        count: 0,
        description: 'fdsfdіаd',
        image: 'https://cdn3.volusion.com/goz35.avhz4/v/vspfiles/photos/SM-NIAH7380-810-2.jpg?1518609283',
        item: '2',
        title: 'Nike Mercurial Vapor XII Elite'
    },
    answerC: {
        count: 0,
        description: 'fіfgrewаd',
        image: 'https://images.ua.prom.st/791146201_w640_h640_183683869_w640__048_m19894.jpg',
        item: '3',
        title: 'adidas 11pro'
    }
};

/**
 * @param state
 * @param action
 */
export const pollReducer = (state: pollReducerState = initialState, action: AuthAction) => {
    switch (action.type) {
        case ANSWER_POLL:
            console.log(action.payload.answerKey);
            state[action.payload.answerKey].count = state[action.payload.answerKey].count + 1;
            return state;
        case CALC_POLL:
            const {answerA, answerB, answerC} = state;
            const answers = [answerA, answerB, answerC].sort((a, b) => a.count - b.count);
            if (answerA.count === answerB.count) {
                return {
                    description: 'fіаd',
                    image: 'https://www.prodirectsoccer.com/productimages/V3_1_Main/197750_Main_Thumb_0416797.jpg',
                    item: '4',
                    title: 'Nike Phantom VNM',
                };
            }
            if (answerA.count === answerC.count) {
                return {
                    description: 'fфіd',
                    image: 'https://www.prodirectsoccer.com/ProductImages/Thumbs/195593_Main_Thumb_0383868.jpg',
                    item: '5',
                    title: 'Adidas Predator 19+',
                };
            }
            if (answerC.count === answerB.count) {
                return {
                    description: 'fаіd',
                    image: 'https://www.futbolemotion.com/imagesarticulos/131117/750/bota-adidas-nemeziz-19.1-ag-active-red-silver-metallic-solar-red-0.jpg',
                    item: '6',
                    title: 'adidas Nemeziz 19.1',
                };
            }
            return answers[0];
        default:
            return state;
    }
};