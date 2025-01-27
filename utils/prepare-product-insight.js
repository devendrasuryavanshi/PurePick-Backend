import { _ } from "ajv";
import { User } from "../models/user.js";

export const prepareProductInsight = async (productInsightData, extractedData, productAdditionalInfo, imageUrls, userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return { error: 'User not found' };
    }

    return {
        userId,
        userIdCopy: {
            _id: user._id,
        },
        productDetails: {
            productType: extractedData?.productType || 'Food',
            productName: productAdditionalInfo?.goUPC?.name || extractedData?.productName || productAdditionalInfo?.openFoodFacts?.name || null,
            brand: productAdditionalInfo?.goUPC?.tableData?.Brand || extractedData?.brand || productAdditionalInfo?.openFoodFacts?.brand || null,
            barcode: extractedData?.barcode || productAdditionalInfo?.goUPC?.tableData?.UPC || null,
            description: productAdditionalInfo?.goUPC?.description || extractedData?.description || productAdditionalInfo?.openFoodFacts?.description || null,
            certifications: extractedData?.certifications || productAdditionalInfo?.openFoodFacts?.labels || [],
            price: {
                amount: productAdditionalInfo?.goUPC?.tableData?.Price || extractedData?.price?.amount || null,
                currency: extractedData?.price?.currency || 'INR'
            },
            weight: {
                value: productAdditionalInfo?.goUPC?.tableData?.Weight || extractedData?.weight?.value || productAdditionalInfo?.openFoodFacts?.quantity || null,
                unit: extractedData?.weight?.unit || 'g'
            },
            ingredients: extractedData?.ingredients || productAdditionalInfo?.openFoodFacts?.ingredients?.list || [],

            nutrition: {
                servingInfo: {
                    servingSize: productAdditionalInfo?.openFoodFacts?.nutrition?.servingSize || extractedData?.nutrition?.servingInfo?.servingSize || null,
                    servingsPerContainer: extractedData?.nutrition?.servingInfo?.servingsPerContainer || null
                },
                nutritionalValues: productAdditionalInfo?.openFoodFacts?.nutrition?.nutrients ?
                    Object.entries(productAdditionalInfo.openFoodFacts.nutrition.nutrients)
                        .filter(([key, value]) => {
                            return !key.includes('_') && typeof value === 'number';
                        })
                        .map(([nutrient, amount]) => ({
                            nutrient: nutrient.replace(/-/g, ' '),
                            amount: amount.toString(),
                            unit: productAdditionalInfo.openFoodFacts.nutrition.nutrients[`${nutrient}_unit`] || 'g',
                            percentDailyValue: null
                        })) :
                    extractedData?.nutrition?.nutritionalValues || [],
                dietaryInfo: {
                    foodMark: productAdditionalInfo?.goUPC?.additionalAttributes?.['Food Mark'] ||
                        extractedData?.nutrition?.dietaryInfo?.foodMark ||
                        (productAdditionalInfo?.openFoodFacts?.labels?.includes('Green') ? 'veg' :
                            productAdditionalInfo?.openFoodFacts?.labels?.includes('Red') ? 'non-veg' : null),
                    isGlutenFree: productAdditionalInfo?.goUPC?.additionalAttributes?.['Gluten Free'] === 'Yes' ||
                        extractedData?.nutrition?.dietaryInfo?.isGlutenFree || null,
                },
            },
            allergens: extractedData?.allergens || productAdditionalInfo?.openFoodFacts?.allergens || [],
            manufacturing: {
                manufacturer: extractedData?.manufacturing?.manufacturer || productAdditionalInfo?.goUPC?.tableData?.Manufacturer || null,
                locations: extractedData?.manufacturing?.locations || [productAdditionalInfo?.openFoodFacts?.manufacturingPlaces] || [],
                countryOfOrigin: productAdditionalInfo?.goUPC?.tableData?.['Country of Origin'] || extractedData?.manufacturing?.countryOfOrigin || null,
                dates: {
                    manufacture: extractedData?.manufacturing?.dates?.manufacture || null,
                    expiry: extractedData?.manufacturing?.dates?.expiry || null
                },
                batch: extractedData?.manufacturing?.batch || null
            },
            packaging: {
                materials: productAdditionalInfo?.openFoodFacts?.packaging?.materials || extractedData?.packaging?.materials || [],
                disposalInstructions: extractedData?.packaging?.disposalInstructions || null
            },
            safety: {
                warnings: extractedData?.safety?.warnings || [],
                restrictions: extractedData?.safety?.restrictions || []
            },
            storage: {
                temperature: extractedData?.storage?.temperature || null,
                condition: extractedData?.storage?.condition || null,
                shelfLife: extractedData?.storage?.shelfLife || null
            },
            usage: {
                instructions: extractedData?.usage?.instructions || null
            },
            contact: {
                phone: extractedData?.contact?.phone || [],
                email: extractedData?.contact?.email || [],
                website: productAdditionalInfo?.goUPC?.tableData?.Website || extractedData?.contact.website || productAdditionalInfo?.openFoodFacts?.productPageUrl || null,
                address: extractedData?.contact?.address || null
            }
        },
        images: {
            image1: imageUrls?.url1?.imageUrl || productAdditionalInfo?.goUPC?.image || productAdditionalInfo?.openFoodFacts?.image || null,
            image2: imageUrls?.url2?.imageUrl || null
        },
        rawText: {
            image1: extractedData?.rawText?.image1 || null,
            image2: extractedData?.rawText?.image2 || null
        },
        overall: {
            rating: productInsightData?.overall?.rating || null,
            reason: productInsightData?.overall?.reason || null,
            key_factors: productInsightData?.overall?.key_factors || []
        },
        user: {
            rating: productInsightData?.user?.rating || null,
            reason: productInsightData?.user?.reason || null,
            risks: productInsightData?.user?.risks || [],
            benefits: productInsightData?.user?.benefits || []
        },
        age_groups: {
            baby: productInsightData?.age_groups?.baby || defaultValue,
            children: productInsightData?.age_groups?.children || defaultValue,
            teenagers: productInsightData?.age_groups?.teenagers || defaultValue,
            adults: productInsightData?.age_groups?.adults || defaultValue,
            seniors: productInsightData?.age_groups?.seniors || defaultValue
        },
        eco_rating: {
            rating: productInsightData?.eco_rating?.rating || null,
            reason: productInsightData?.eco_rating?.reason || null,
            impact_factors: productInsightData?.eco_rating?.impact_factors || []
        },
        confidence: {
            score: productInsightData?.confidence?.score || null,
            reason: productInsightData?.confidence?.reason || null,
            data_quality: productInsightData?.confidence?.data_quality || null
        },
        sources: productInsightData?.sources || [],
        alternatives: productInsightData?.alternatives || []
    };
};