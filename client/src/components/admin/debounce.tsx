import * as React from 'react';

import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {useAsync} from "react-async-hook";
import useConstant from "use-constant";

// Generic reusable hook
export const useDebouncedSearch = (searchFunction: (...args: any[]) => any) => {

    // Handle the input text state
    const [inputText, setInputText] = React.useState('');

    // Debounce the original search async function
    const debouncedSearchFunction = useConstant(() =>
        AwesomeDebouncePromise(searchFunction, 300)
    );

    // The async callback is run each time the text changes,
    // but as the search function is debounced, it does not
    // fire a new request on each keystroke
    const searchResults = useAsync(
        async () => {
            if (inputText.length === 0) {
                return [];
            } else {
                return debouncedSearchFunction(inputText);
            }
        },
        [debouncedSearchFunction, inputText]
    );

    // Return everything needed for the hook consumer
    return {
        inputText,
        setInputText,
        searchResults,
    };
};