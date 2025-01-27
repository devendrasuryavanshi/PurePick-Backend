import { searchAmazonProduct } from "../api/amazon-product-search.js";

const getAlternateProductDetails = async (productInsights) => {
    try {
        const updatedAlternatives = await Promise.all(
            productInsights.alternatives.map(async (alt) => {
                const data = await searchAmazonProduct(alt.name);
                if (data.success) {
                    return {
                        ...alt,
                        name: data.product.title || alt.name,
                        imageUrl: data.product.imageUrl,
                        link: data.product.productUrl,
                        price: data.product.price,
                    };
                }
                return alt;
            })
        );

        return {
            ...productInsights,
            alternatives: updatedAlternatives
        };
    } catch (error) {
        return productInsights;
    }
}

export default getAlternateProductDetails;
