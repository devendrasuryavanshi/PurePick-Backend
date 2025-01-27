import Ingredient from "../models/ingredient";
import User from "../models/user";

// This fucntion is not completed yet and is not used anywhere

const getCustomAnalysis = async ({ data, userId }) => {
    let analysis = {
        overall: {
            rating: 0.0,
        },
        user: {
            rating: 0.0,
            risks: [],
            benefits: [],
        },
        baby: {
            rating: 0.0,
            risks: [],
            benefits: [],
        },
        children: {
            rating: 0.0,
            risks: [],
            benefits: [],
        },
        teenagers: {
            rating: 0.0,
            risks: [],
            benefits: [],
        },
        adults: {
            rating: 0.0,
            risks: [],
            benefits: [],
        },
        seniors: {
            rating: 0.0,
            risks: [],
            benefits: [],
        },
        ecoRating: 0.0,
        confidence: {
            score: 0.0,
        }
    };
    const calculateRating = async () => {
        let n = data.ingredients.length;
        analysis.confidence.score += 100.0 * n;

        let missing = 0;
        let riskCount = 0;
        const user = await User.findById(userId);

        for (let item of data.ingredients) {
            const ingredient = await Ingredient.findOne({ aliases: item.name });
            if (ingredient) {
                addRatings(ingredient.healthInfo);
                addHealthData(ingredient.healthInfo.ageGroups);

                riskCount += countUserRisks(user, ingredient);
            } else {
                missing++;
            }
        }
        const { risks, benefits } = getAgeData(user.age);
        analysis.user.risks = risks;
        analysis.user.benefits = benefits;

        analysis.user.rating += getAgeRating(user.age);
        analysis.user.rating /= Math.pow(2, riskCount);

        addDefaultRatings(missing * 5.0);
        analysis.confidence.score -= 100.0 * missing;
        analysis.confidence.score /= (n - missing == 0 ? 1.0 : parseFloat(n - missing));
        normalizeToFiveScale(n);
    }

    const countUserRisks = (user, ingr) => {
        let count = 0;
        count += user.allergies.filter(a => ingr.healthInfo.allergies.find(i => i.name === a)).length;
        count += user.diseases.filter(d => ingr.healthInfo.diseases.find(i => i.name === d)).length;
        return count;
    }

    const addRatings = (healthInfo) => {
        analysis.overall.rating += healthInfo.overallRating;
        analysis.baby.rating += healthInfo.ageGroups.baby.rating;
        analysis.children.rating += healthInfo.ageGroups.children.rating;
        analysis.teenagers.rating += healthInfo.ageGroups.teenagers.rating;
        analysis.adults.rating += healthInfo.ageGroups.adults.rating;
        analysis.seniors.rating += healthInfo.ageGroups.seniors.rating;
    }

    const addHealthData = (ageGroups) => {
        analysis.baby.risks = [...analysis.baby.risks, ...ageGroups.baby.risks];
        analysis.baby.benefits = [...analysis.baby.benefits, ...ageGroups.baby.benefits];
        analysis.children.risks = [...analysis.children.risks, ...ageGroups.children.risks];
        analysis.children.benefits = [...analysis.children.benefits, ...ageGroups.children.benefits];
        analysis.teenagers.risks = [...analysis.teenagers.risks, ...ageGroups.teenagers.risks];
        analysis.teenagers.benefits = [...analysis.teenagers.benefits, ...ageGroups.teenagers.benefits];
        analysis.adults.risks = [...analysis.adults.risks, ...ageGroups.adults.risks];
        analysis.adults.benefits = [...analysis.adults.benefits, ...ageGroups.adults.benefits];
        analysis.seniors.risks = [...analysis.seniors.risks, ...ageGroups.seniors.risks];
        analysis.seniors.benefits = [...analysis.seniors.benefits, ...ageGroups.seniors.benefits];
    }

    const getAgeData = (age) => {
        switch (true) {
            case age >= 0 && age <= 2:
                return { risks: analysis.baby.risks, benefits: analysis.baby.benefits };
            case age >= 3 && age <= 12:
                return { risks: analysis.children.risks, benefits: analysis.children.benefits };
            case age >= 13 && age <= 19:
                return { risks: analysis.teenagers.risks, benefits: analysis.teenagers.benefits };
            case age >= 20 && age <= 59:
                return { risks: analysis.adults.risks, benefits: analysis.adults.benefits };
            case age >= 60 && age <= 120:
                return { risks: analysis.seniors.risks, benefits: analysis.seniors.benefits };
            default:
                return { risks: [], benefits: [] };
        }
    }

    const getAgeRating = (age) => {
        switch (true) {
            case age >= 0 && age <= 2:
                return analysis.baby.rating;
            case age >= 3 && age <= 12:
                return analysis.children.rating;
            case age >= 13 && age <= 19:
                return analysis.teenagers.rating;
            case age >= 20 && age <= 59:
                return analysis.adults.rating;
            case age >= 60 && age <= 120:
                return analysis.seniors.rating;
            default:
                return 0;
        }
    }

    const addDefaultRatings = (rating) => {
        analysis.overall.rating += rating;
        analysis.user.rating += rating;
        analysis.baby.rating += rating;
        analysis.children.rating += rating;
        analysis.teenagers.rating += rating;
        analysis.adults.rating += rating;
        analysis.seniors.rating += rating;
    }

    const normalizeToFiveScale = (n) => {
        analysis.overall.rating /= n;
        analysis.user.rating /= n;
        analysis.baby.rating /= n;
        analysis.children.rating /= n;
        analysis.teenagers.rating /= n;
        analysis.adults.rating /= n;
        analysis.seniors.rating /= n;
    }

    await calculateRating();
    return analysis;
}

export { getCustomAnalysis };