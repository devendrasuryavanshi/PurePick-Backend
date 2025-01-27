const text1 = `VINNVLING
BRITANNIA
JIMJAM
Naughty Jam
Energy 56 kcal
3%A
Per approx. 11.5 g serve (Approx. 1 Biscuit)
Images are for illustration purpose only
Flavoured Sandwich Biscuits
BRITANNIA
JIMJAM`

const text2 = `LOT NO. MACHINE CODE
802180
325
BEST BEFORE SIX MONTHS FRO
Pkg. Material Mid. By: Ullex Ltd. Jammu, Registration No.: JKSPCB/PWM/1/2015/01-05 DT: 20.03.15
Nutrition Information Per 100g product (approx..)
Carbohydrates
73g
Sugars
33.5g
Protein
Fat
5g
19g
Saturated fatty acids
9.5g
Mono unsaturated fatty acids
7.2g
Poly unsaturated fatty acids
2.2g
Trans fatty acids
Og
Cholesterol
Omg
Energy
483kcal
8 901063029170
Marketed By: BRITANNIA INDUSTR
5/1 A HUNGERFORD STREET, KOLK (A WADIA Enterprise)
For Mfg. unit address & Lic. No. read the "Lot No." and see address panel below. 95: BRITANNIA INDUSTRIES LTD, PLOT NG
UDHAM SINGH NAGAR, RUDRAPUR 26315 Lic No 1001201200022-
INGREDIENTS: RE VEGETABLE OIL ( (PALM & SESAME EDIBLE STARCH, EDIBLE COMMON AGENTS (503(11), REGULATOR (330)
CONTAINS PERMITT ADDED FLAVOURS [ARTIFICIAL FLAVOUR & VANILLA)].
(Numbers in brackets
STORE IN A COOL, HYGIEN CONTENTS TO A CLEAN A`

const text3 = `Hair Care
TRIPLE BLEND
NON STICKY HAIR OIL
Aloe Vera
Olive Oil & Green Tea DAMAGE REPAIR`;

const text4 = `₹31.00
₹0.65/ml
10/2023
GG0225
MMtkd. By. Marico Ltd, 175 CST marico Road, Kalina, Mumbai-400 098, MH. For Mild and Pkd. location refer to first and second dletter of Batch No. No. respectively and see address panel below. IG) Marico Ltd, 1-G, BIP, North Guwahati-781 101, Assam. M: C-57M/2021 (A) Marico Ltd, Plot no SM 23/24, Sanand II Industrial Estate, GIDC, Sanand, Dist: Ahmedabad-382170, Gujarat. M: GC/1471. FOR EXTERNAL USE ONLY. For feedback, contact Marico Consumer Services Cell, PO Box No. 9411, Mumbai-400 093, MH. Cal 1800222248, Email: csc@marico.com Store e in in cool place protected from sunlight. Type of pe of Material Material: Type 3 Hair C Oil
Use before 3 36 months s from the e date da e of of manufacturing. MRP (Incl. of all taxes), Unit Sale Price, Mfd., Batch No. } See above
Net Qty:
48 ml
8 901088 729147`

const fakeProductDetails = `{
    "Product Type": "food item",
    "Product Name": "Healthy Snack Bar",
    "Brand": "NutriGood",
    "Ingredients": [
        {
            "name": "Oats",
            "simplifiedName": "oats",
            "quantity": "50g"
        },
        {
            "name": "Honey",
            "simplifiedName": "honey",
            "quantity": "20g"
        },
        {
            "name": "Almonds",
            "simplifiedName": "almonds",
            "quantity": "15g"
        },
        {
            "name": "Dried Cranberries",
            "simplifiedName": "cranberries",
            "quantity": "10g"
        },
        {
            "name": "Chia Seeds",
            "simplifiedName": "chia seeds",
            "quantity": "5g"
        }
    ],
    "Net Weight/Volume": "100g",
    "Price": "$2.99",
    "Serving Size": "50g",
    "Servings Per Container": "2",
    "Nutritional Information": [
        {
            "perAmount": "50g"
        },
        {
            "name": "Calories",
            "amount": "200"
        },
        {
            "name": "Total Fat",
            "amount": "10g"
        },
        {
            "name": "Saturated Fat",
            "amount": "1g"
        },
        {
            "name": "Trans Fat",
            "amount": "0g"
        },
        {
            "name": "Cholesterol",
            "amount": "0mg"
        },
        {
            "name": "Sodium",
            "amount": "50mg"
        },
        {
            "name": "Total Carbohydrates",
            "amount": "30g"
        },
        {
            "name": "Dietary Fiber",
            "amount": "5g"
        },
        {
            "name": "Sugars",
            "amount": "15g"
        },
        {
            "name": "Protein",
            "amount": "5g"
        },
        {
            "name": "Vitamin D",
            "amount": "0mcg"
        },
        {
            "name": "Calcium",
            "amount": "50mg"
        },
        {
            "name": "Iron",
            "amount": "1mg"
        },
        {
            "name": "Potassium",
            "amount": "150mg"
        }
    ],
    "Allergen Information": "Contains almonds. May contain traces of peanuts and other tree nuts.",
    "Manufactured By": "NutriGood Inc.",
    "Country of Origin": "USA",
    "Manufacture Date": "01-09-2024",
    "Expiration Date": "01-09-2025",
    "Lot Number": "NG123456",
    "Storage Instructions": "Store in a cool, dry place.",
    "Usage Instructions": "Open package and enjoy.",
    "Product Description": "A delicious and healthy snack bar made with natural ingredients.",
    "Product Features": "High in fiber, No artificial preservatives, Gluten-free",
    "Product Benefits": "Provides energy, Supports digestive health",
    "Product Usage": "Ideal for a quick snack or post-workout energy boost.",
    "Product Warnings": [
        {
            "warningType": "Allergen",
            "description": "Contains almonds. May contain traces of peanuts and other tree nuts."
        }
    ],
    "Address": "123 NutriGood Lane, Healthy City, USA",
    "Packaging Type": "Plastic wrapper",
    "Sustainability Information": "Packaging is recyclable.",
    "Certifications": "Non-GMO, Organic",
    "Barcode": "1234567890123",
    "Recycling Information": "Please recycle the wrapper.",
    "Customer Service Contact": {
        "contact number": ["1-800-123-4567"],
        "contact email": ["support@nutrigood.com"]
    },
    "Website": "https://www.nutrigood.com",
    "Material": ["plastic"],
    "Material Volume": [100],
    "Food Marks": "vegan",
    "user": {
        "age": 30,
        "conditions": ["none"],
        "diseases": ["none"],
        "allergies": ["none"]
    }
}`;

export const dummyData = {
    text1,
    text2,
    text3,
    text4,
    fakeProductDetails
}