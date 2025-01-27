import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productInsightSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    userIdCopy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    productDetails: {
        productType: {
            type: String,
            enum: ['Food', 'Beverage', 'Bodycare', 'Inhale', 'Other'],
            default: 'Other',
            required: true
        },
        productName: String,
        brand: String,
        barcode: String,
        description: String,
        certifications: [String],
        price: {
            amount: String,
            currency: String
        },
        weight: {
            value: String,
            unit: String
        },
        ingredients: [{
            name: String,
            simplifiedName: String,
            quantity: String,
            purpose: String
        }],
        nutrition: {
            servingInfo: {
                servingSize: String,
                servingsPerContainer: String
            },
            nutritionalValues: [{
                nutrient: String,
                amount: String,
                unit: String,
                percentDailyValue: String
            }],
            dietaryInfo: {
                foodMark: {
                    type: String,
                    enum: ['veg', 'non-veg', 'vegan', null],
                },
                isGlutenFree: Boolean
            }
        },
        allergens: [String],
        manufacturing: {
            manufacturer: String,
            locations: [String],
            countryOfOrigin: String,
            dates: {
                manufacture: String,
                expiry: String
            },
            batch: String
        },
        packaging: {
            materials: [{
                materialType: { type: String },
                percentage: { type: String }
            }],
            disposalInstructions: String
        },
        safety: {
            warnings: [String],
            restrictions: [String]
        },
        storage: {
            temperature: String,
            condition: String,
            shelfLife: String
        },
        usage: {
            instructions: String
        },
        contact: {
            phone: [String],
            email: [String],
            website: String,
            address: String
        }
    },
    images: {
        image1: {
            type: String,
            required: true
        },
        image2: {
            type: String,
            required: true
        }
    },
    rawText: {
        image1: String,
        image2: String
    },
    overall: {
        rating: Number,
        reason: String,
        key_factors: [String]
    },
    user: {
        rating: Number,
        reason: String,
        risks: [String],
        benefits: [String]
    },
    age_groups: {
        baby: {
            rating: Number,
            reason: String,
            cautions: [String]
        },
        children: {
            rating: Number,
            reason: String,
            cautions: [String]
        },
        teenagers: {
            rating: Number,
            reason: String,
            cautions: [String]
        },
        adults: {
            rating: Number,
            reason: String,
            cautions: [String]
        },
        seniors: {
            rating: Number,
            reason: String,
            cautions: [String]
        }
    },
    eco_rating: {
        rating: Number,
        reason: String,
        impact_factors: [String]
    },
    confidence: {
        score: Number,
        reason: String,
        data_quality: String
    },
    sources: [{
        name: { type: String },
        sourceType: { type: String },
        link: { type: String },
        relevance: { type: String }
    }],
    alternatives: [{
        name: String,
        rating: Number,
        key_benefits: [String],
        health_advantages: [String],
        eco_score: Number,
        price_comparison: String,
        imageUrl: String,
        link: String
    }],
    chat: {
        messages: [{
            id: { type: String, required: true },
            role: { type: String, enum: ['user', 'assistant'], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }],
        messageCount: { type: Number, default: 0, max: 10 }
    },
    shared: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const ProductInsight = mongoose.model('ProductInsight', productInsightSchema);
