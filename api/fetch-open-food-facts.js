import fetch from 'node-fetch';

const fetchOpenFoodFacts = async (barcode) => {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
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
            nutrition: {
                servingSize: data.product.serving_size,
                nutrients: data.product.nutriments,
                nutritionGrades: data.product.nutrition_grades,
                nutritionScoreDebug: data.product.nutrition_score_debug,
                nutriscoreData: {
                    grade: data.product.nutriscore_grade,
                    score: data.product.nutriscore_score,
                    details: data.product.nutriscore_data
                }
            },
            processing: {
                novaGroup: data.product.nova_group,
                novaGroupsLabels: data.product.nova_groups,
                processingTags: data.product.ingredients_processing_tags
            },
            environmental_impact: {
                ecoscore: {
                    grade: data.product.ecoscore_grade,
                    score: data.product.ecoscore_score,
                    details: data.product.ecoscore_data
                },
                carbonFootprint: {
                    perKg: data.product.carbon_footprint_per_kg,
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
            traces: data.product.traces,
            labels: data.product.labels,
            categories: data.product.categories,
            countries: data.product.countries,
            manufacturingPlaces: data.product.manufacturing_places,
            storesTags: data.product.stores_tags,
            quantity: data.product.quantity,
            dataSources: {
                sources: data.product.data_sources,
            }
        };

        return productDetails;
    } catch (error) {
        return null;
    }
};

export { fetchOpenFoodFacts };

// Test execution
// (async () => {
//     try {
//         const result = await fetchOpenFoodFacts('3017620422003');
//         console.log(JSON.stringify(result, null, 2));
//     } catch (error) {
//         console.error(error);
//     }
// })();