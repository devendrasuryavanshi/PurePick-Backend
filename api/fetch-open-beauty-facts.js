const fetchOpenBeautyFacts = async (barcode) => {
    const url = `https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'PurePick - Food & Beauty Product Info App'
            }
        });

        const data = await response.json();

        if (!data.product) {
            throw new Error('Product not found');
        }

        const productDetails = {
            name: data.product.product_name,
            brand: data.product.brands,
            image: data.product.image_url,
            productPageUrl: data.product.official_website,
            ingredients: {
                text: data.product.ingredients_text,
                list: data.product.ingredients?.map(i => i.text) || [],
                percentages: data.product.ingredients?.map(i => ({
                    name: i.text,
                    percent: i.percent_estimate
                })) || []
            },
            composition: {
                ingredientAnalysis: data.product.ingredients_analysis,
                ingredientsPalmOilStatus: data.product.ingredients_from_palm_oil_n,
                veganStatus: data.product.ingredients_analysis_tags?.includes('en:vegan'),
                vegetarianStatus: data.product.ingredients_analysis_tags?.includes('en:vegetarian')
            },
            environmental_impact: {
                ecoscore: {
                    grade: data.product.ecoscore_grade,
                    score: data.product.ecoscore_score,
                    details: data.product.ecoscore_data
                },
                carbonFootprint: {
                    perUnit: data.product.carbon_footprint_per_unit,
                    total: data.product.carbon_footprint_total,
                    details: data.product.carbon_footprint_details
                },
                threatenedSpecies: data.product.threatened_species
            },
            packaging: {
                materials: data.product.packaging_materials?.map(material => ({
                    materialType: material,
                    percentage: data.product.packaging_materials_analysis[material]
                })) || [],
                disposalInstructions: data.product.packaging_recycling_tags?.join(", ") || null
            },
            allergens: data.product.allergens,
            warnings: data.product.warning,
            period_after_opening: data.product.period_after_opening,
            categories: data.product.categories,
            countries: data.product.countries,
            manufacturingPlaces: data.product.manufacturing_places,
            storesTags: data.product.stores_tags,
            quantity: data.product.quantity,
            labels: data.product.labels,
            dataSources: {
                sources: data.product.data_sources,
            }
        };

        return productDetails;
    } catch (error) {
        return null;
    }
};

export { fetchOpenBeautyFacts };

// Test execution
// (async () => {
//     try {
//         const result = await fetchOpenBeautyFacts('247');
//         console.log(JSON.stringify(result, null, 2));
//     } catch (error) {
//         console.error(error);
//     }
// })();
