import { fetchGoUpc } from "../api/fetch-go-upc.js";
import { fetchOpenBeautyFacts } from "../api/fetch-open-beauty-facts.js";
import { fetchOpenFoodFacts } from "../api/fetch-open-food-facts.js";

const getProductDetails = async (barcode) => {
    if (!barcode) {
        return null;
    }
    const goUPC = await fetchGoUpc(barcode);
    const openFoodFacts = (await fetchOpenFoodFacts(barcode)) || (await fetchOpenBeautyFacts(barcode));

    return {
        goUPC: goUPC,
        openFoodFacts: openFoodFacts
    };
}

export { getProductDetails };

// (async () => {
//     try {
//         const result = await getProductDetails('8901063029170');
//         console.log(JSON.stringify(result, null, 2));
//     } catch (error) {
//         console.error(error);
//     }
// })();