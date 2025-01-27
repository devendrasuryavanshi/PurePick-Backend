// 8901063029170 - jim jam
// 8901088729147 - hair and care
// 8904035416763 - body losen
// 8901396350101 - detol
// 89080146 - nescafe


export const extractFormatDataPrompt = `Task: You are provided with two images that represent the front and back sides of the same product and additional info from GoUPC, OpenFoodFact/OpenBeutyFact and return ONLY a valid JSON response. No additional text or explanations should be included.
1. Extract and separate text from each image
2. Verify if both images belong to the same product

Initial Validation Steps:
1. Extract text from Image 1 and Image 2 separately
2. Compare key identifiers (product type, product name) between images
3. Check if both images show the same product by matching:
   - Product name
   - Product type
   - Package design elements

Things to do carefully:
1. Text Extraction: Extract all visible text from both images, including:
   - Product labels and descriptions
   - Ingredient lists - Accurately identify and list all ingredients with their respective quantities, and add their purposes yourself.
   - Nutritional information
   - Manufacturing details
   - Regulatory information
   - Any additional text present
2. Product Type: Identify whether the product is:
   - Food item
   - Beverage item
   - Body care item
   - Inhale item (e.g. cigarettes)
3. Material Identification: Analyze the product packaging images to identify the materials used. List the materials in descending order of volume as an array in the "type" field (e.g., "glass"). Provide the corresponding volume percentage in the "percentage" field (e.g., XX).
4. Date Processing:
   - Extract dates in priority:
     1. Explicit labels: "Mfg Date:", "Expiry Date:", "Best Before:"
     2. Relative format: "Use within X months from mfg"
     3. Date codes in Batch/Lot numbers
   
   - Rules:
     1. Output format: "DD-MM-YYYY" or "MM-YYYY"
     2. Calculate relative dates from mfg date
     3. Partial dates: Add day=01, year=20XX
     4. Validate: expiry > mfg date
     5. Set null if uncertain

Return ONLY one of these JSON formats:

1. If images show different products:
{
    "error": "different product",
    "rawText": {
        "image1": "string with all text from first image",
        "image2": "string with all text from second image"
    },
    "reason": "string explaining why products are considered different"
}

2. If product is dangerous:
{
    "error": "dangerous product", // which causes immediate death
    "rawText": {
        "image1": "string with all text from first image",
        "image2": "string with all text from second image"
    },
    "reason": "string explaining why product is dangerous"
}

3. If not a valid product category:
{
    "error": "invalid product category",
    "rawText": {
        "image1": "string with all text from first image",
        "image2": "string with all text from second image"
    },
    "reason": "string explaining why product is not a valid category"
}

4. If validation passes (same product), provide full structured data in JSON format with the following fields only:
{
    "rawText": {
        "image1": "string with all text from first image",
        "image2": "string with all text from second image"
    },
    "productType": Food | Beverage | Bodycare | Inhale,
    "productName": string,
    "brand": string,
    "barcode": string,
    "description": string,
    "certifications": [string],
    "price": {
        "amount": string,
        "currency": string
    },
    "weight": {
        "value": string,
        "unit": string
    },
    "ingredients": [
        {
            "name": string, // one ingredient
            "simplifiedName": string,
            "quantity": string,
            "purpose": string,
        }
    ],
    "nutrition": {
        "servingInfo": {
            "servingSize": string,
            "servingsPerContainer": string
        },
        "nutritionalValues": [
            {
                "nutrient": string,
                "amount": string,
                "unit": string,
                "percentDailyValue": string
            }
        ],
        "dietaryInfo": {
            "foodMark": 'veg' | 'non-veg' | 'vegan';
            "isGlutenFree": boolean;
        }
    },
    "allergens": [string],
    "manufacturing": {
        "manufacturer": string,
        "locations": [string],
        "countryOfOrigin": string,
        "dates": {
            "manufacture": string,
            "expiry": string
        },
        "batch": string
    },
    "packaging": {
        "materials": [
            {
                "materialType": string,
                "percentage": string
            }
        ],
        "disposalInstructions": string
    },
    "safety": {
        "warnings": [string],
        "restrictions": [string]
    },
    "storage": {
        "temperature": string,
        "condition": string,
        "shelfLife": string
    },
    "usage": {
        "instructions": string
    },
    "contact": {
        "phone": [string],
        "email": [string],
        "website": string,
        "address": string
    }
}

Additional Instructions:
- Include detailed raw text from both images separately
- Cross-validate critical information
- Verify product-specific details
- Double-check date calculations
- Confirm packaging materials`;

export const AIAnalysisPrompt = (productDetails, productAdditoinalInfo, userDetails) => {
    return `[SEARCH EXECUTION PROTOCOL - MANDATORY]
[SEARCH EXECUTION PROTOCOL]
- GOOGLE SEARCH IS EXTREMELY MANDATORY
- You MUST search FDA.gov, WHO.int, CDC.gov, PubMed and Scholar.google.com for any information.
- Record exact search URLs and scientific DOIs (max 2 years old).
- NO analysis permitted without verified search evidence.

[ANALYSIS FRAMEWORK]
1. Regulatory & Scientific Research:
   PRIMARY SOURCES:
   - FDA: Latest guidelines, safety assessments, recalls, ingredient restrictions, age-specific guidelines
   - WHO: Global health recommendations, safety standards
   - EFSA: Scientific opinions, risk assessments
   - CDC: Health benchmarks, safety protocols
   - EMA: Safety warnings, approved ingredients
   - FAO: Nutritional guidelines, food safety
   
   SCIENTIFIC SOURCES:
   - scholar.google.com: Peer-reviewed studies on ingredients, research papers, clinical findings
   - PubMed: Clinical trials, health impact studies, clinical trials
   - NIH: Research databases, health guidelines
   - Healthline: Health: Expert-reviewed content, health impacts, nutritional information
   
   MARKET RESEARCH:
   - Amazon.com: Product alternatives, ratings, pricing
   - Blinkit.com: Product alternatives, pricing
   - Health food databases(OpneFoodFact, GO UPC): Clean label products, Product details
   - Eco-product directories: Sustainable alternatives

2. Comprehensive Analysis Framework (Scale 0-10):
   INGREDIENT SAFETY (40%)
   - Rate products on inherent quality
   - Focus on ingredient quality and benefits
   - Evaluate harmful substances strictly
   - Industry and regulatory compliance
   - Maximum permissible limits
   - Toxicity profiles
   - Banned substance check

   NUTRITIONAL VALUE (30%)
   - Primary benefits assessment
   - Positive health contributions
   - Functional effectiveness
   - Quality of ingredients
   - Potency of active ingredients
   - Value proposition
   - Intended outcome delivery
   
   HEALTH IMPACT (30%)
   - Primary beneficial effects
   - Positive long-term impact
   - Performance enhancement
   - Functional benefits
   - Quality of life improvement
   - Therapeutic value
   - Wellness contribution

RATING GUIDELINES:
- 9-10: Outstanding products with proven excellence
- 7-8: High-quality products with strong benefits
- 5-6: Standard products meeting expectations
- 3-4: Products with quality concerns
- 0-2: Products with serious issues ans harmful effects

[RATING MANDATE]
Rate products based on their true quality and value, starting from a position of excellence. A product's rating should reflect its inherent worth - pure, natural, and nutritious products deserve the highest ratings (9-10) without hesitation. For example, 100% pure milk, fresh fruits, or natural honey automatically qualify for top ratings due to their complete nutritional profiles and natural composition. Never reduce ratings for natural components that are integral to the product, like fats in milk or natural sugars in fruits.

Quality manufactured products can also achieve high ratings (8-10) when they demonstrate excellent ingredients, proven benefits, strong manufacturing standards, and solid nutritional value. The key is to evaluate what makes a product genuinely good - its ingredient quality, nutritional completeness, manufacturing excellence, scientific validation, and intended purpose effectiveness.

Reserve low ratings (0-3) exclusively for products that are genuinely problematic - those with excessive artificial ingredients, harmful levels of processed sugars, dangerous preservatives, or serious nutritional deficiencies. A product deserves a low rating when it fails to deliver its promised benefits or contains truly harmful components, not because of hypothetical concerns.

Keep all health considerations, potential allergies, dietary preferences, and lifestyle factors as separate advisory notes. These should inform consumers but not impact the core product rating. The fundamental question should always be "How good is this product at being what it claims to be?" rather than "What if someone has specific concerns?" This approach ensures ratings reflect true product quality while maintaining comprehensive consumer information

Zero rating for banned/dangerous substances or proven harmful effects for user or specific age groups

Rate products at their maximum potential based on quality, ingredients and effectiveness - all users are perfectly healthy with zero restrictions or concerns - give ratings that truly reflect product excellence - focus exclusively on actual benefits and proven value - document any general advisories separately without impacting the core rating.

Drastically reduce rating or set to 0 for unsafe product or highly dangerous ingredients for user or specific age groups


3. Detailed Rating Categories:
   PRIMARY RATINGS (Highest Priority)
   - User-specific health rating
     * Age-based adjustments
     * Condition-specific modifications
     * Allergy considerations
     * Disease interactions
     * Lifestyle compatibility
   
   - Overall health score
     * Ingredient quality weight
     * Safety profile impact
     * Nutritional balance
     * Health benefit ratio
     * Risk factor assessment

   SECONDARY RATINGS
   Age Group Analysis:
   - Baby (0-2):
     * Brain development impact
     * Organ system sensitivity
     * Growth phase safety
     * Immune system effects

   - Children (3-12):
     * Cognitive development
     * Physical growth needs
     * Activity energy demands
     * Learning phase support

   - Teenagers (13-19):
     * Hormonal balance
     * Peak growth needs
     * Sports performance
     * Mental development

   - Adults (20-59):
     * Performance optimization
     * Stress resistance
     * Recovery support
     * Longevity factors

   - Seniors (60+):
     * Nutrient absorption
     * Medication interactions
     * Organ function support
     * Cognitive maintenance

   Eco-Rating Factors:
   - Material sustainability
   - Recycling potential
   - Carbon footprint
   - Production impact
   - Disposal effects

4. Product-Specific Evaluation:
   FOOD PRODUCTS:
   - Nutrient density ratio
   - Additive safety levels
   - Processing methods
   - Preservation impact
   - Bioavailability
   - Shelf stability
   - Quality indicators

   BODY CARE PRODUCTS:
   - Dermal absorption
   - Skin sensitivity
   - pH compatibility
   - Cumulative exposure
   - Systemic effects
   - Application safety
   - Stability factors

5. Required JSON Output Structure:
{
    "overall": {
        "rating": number (0-10),
        "reason": detailed_string,
        "key_factors": [string]
    },
    "user": {
        "rating": number (0-10),
        "reason": detailed_string,
        "risks": [string],
        "benefits": [string]
    },
    "age_groups": {
        "baby": {
            "rating": number,
            "reason": string,
            "cautions": [string]
        },
        "children": {similar_structure},
        "teenagers": {similar_structure},
        "adults": {similar_structure},
        "seniors": {similar_structure}
    },
    "eco_rating": {
        "rating": number,
        "reason": string,
        "impact_factors": [string]
    },
    "confidence": {
        "score": number (0-100),
        "reason": string,
        "data_quality": string // one word
    },
    "sources": [{
        "name": string,
        "sourceType": "regulatory|scientific|market",
        "link": string, // direct source page URL
        "relevance": string
    }],
    "alternatives": [{
        "name": string,
        "rating": number,
        "key_benefits": [string],
        "health_advantages": [string],
        "eco_score": number,
        "price_comparison": string, // one word
        "link": string // direct product page URL
    }]
}

Product Details: ${JSON.stringify(productDetails)}
Product Additional Info: ${JSON.stringify(productAdditoinalInfo)}
User Details: ${JSON.stringify(userDetails)}

CRITICAL REQUIREMENTS:
   - User safety takes absolute priority
   - Include specific regulatory quotes in reasons (e.g., "According to FDA...")
   - Zero rating for any banned ingredients for user or specific age groups
   - Ratings must be numbers between 0 and 10, dot not use null or undefined
   - Drastically reduce rating or set to 0 for unsafe product or highly dangerous ingredients for user or specific age groups
   - Mandatory check against age-restricted ingredients
   - Consider cumulative effects of ingredients
   - Use 'You' instead of 'User' in the user-specific reason
   - Include at max 10 sources and 5 alternatives product links`
}