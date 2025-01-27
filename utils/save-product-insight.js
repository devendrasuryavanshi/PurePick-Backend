import { ProductInsight } from '../models/product-insight.js';
import { User } from '../models/user.js';

export const saveProductInsight = async (productInsightData, userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const defaultValue = {
            rating: null,
            reason: null,
            cautions: [],
            key_factors: [],
            risks: [],
            benefits: [],
            impact_factors: []
        };

        const productInsight = new ProductInsight({
            userId: userId,
            userIdCopy: user.email,
            overall: {
                rating: productInsightData.overall?.rating || null,
                reason: productInsightData.overall?.reason || null,
                key_factors: productInsightData.overall?.key_factors || []
            },
            user: {
                rating: productInsightData.user?.rating || null,
                reason: productInsightData.user?.reason || null,
                risks: productInsightData.user?.risks || [],
                benefits: productInsightData.user?.benefits || []
            },
            age_groups: {
                baby: productInsightData.age_groups?.baby || defaultValue,
                children: productInsightData.age_groups?.children || defaultValue,
                teenagers: productInsightData.age_groups?.teenagers || defaultValue,
                adults: productInsightData.age_groups?.adults || defaultValue,
                seniors: productInsightData.age_groups?.seniors || defaultValue
            },
            eco_rating: {
                rating: productInsightData.eco_rating?.rating || null,
                reason: productInsightData.eco_rating?.reason || null,
                impact_factors: productInsightData.eco_rating?.impact_factors || []
            },
            confidence: {
                score: productInsightData.confidence?.score || null,
                reason: productInsightData.confidence?.reason || null,
                data_quality: productInsightData.confidence?.data_quality || null
            },
            sources: productInsightData.sources || [],
            alternatives: productInsightData.alternatives || []
        });

        const savedProductInsight = await ProductInsight.save();
        return savedProductInsight._id;
    } catch (error) {
        throw error;
    }
};
