import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  aliases: {
    type: [String],
  },
  description: {
    type: String,
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fats: Number,
    vitamins: [String],
    minerals: [String]
  },
  healthInfo: {
    ageGroups: {
      baby: {
        maxLimitGram: Number,
        risks: [String],
        benefits: [String],
        rating: {
          type: Number,
          min: 0,
          max: 10
        }
      },
      children: {
        maxLimitGram: Number,
        risks: [String],
        benefits: [String],
        rating: {
          type: Number,
          min: 0,
          max: 10
        }
      },
      teenagers: {
        maxLimitGram: Number,
        risks: [String],
        benefits: [String],
        rating: {
          type: Number,
          min: 0,
          max: 10
        }
      },
      adults: {
        maxLimitGram: Number,
        risks: [String],
        benefits: [String],
        rating: {
          type: Number,
          min: 0,
          max: 10
        }
      },
      seniors: {
        maxLimitGram: Number,
        risks: [String],
        benefits: [String],
        rating: {
          type: Number,
          min: 0,
          max: 10
        }
      }
    },
    allergies: [String],
    diseases: [String],
    overallRating: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  regulatoryInfo: {
    authorities: [{
      authorityName: String,
      approved: Boolean,
      notes: String
    }]
  },
  benefits: {
    general: [String],
    specificConditions: [{
      condition: String,
      benefits: [String]
    }]
  },
  losses: {
    general: [String],
    specificConditions: [{
      condition: String,
      losses: [String]
    }]
  },
  additionalInfo: {
    storageRecommendations: String,
    commonUses: [String],
    origin: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export { Ingredient };