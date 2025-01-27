import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const API_KEYS = [
    { key: process.env.GOOGLE_API_KEY_1, cx: process.env.SEARCH_ENGINE_ID_1 },
    { key: process.env.GOOGLE_API_KEY_2, cx: process.env.SEARCH_ENGINE_ID_2 },
    { key: process.env.GOOGLE_API_KEY_3, cx: process.env.SEARCH_ENGINE_ID_3 },
    { key: process.env.GOOGLE_API_KEY_4, cx: process.env.SEARCH_ENGINE_ID_4 },
    { key: process.env.GOOGLE_API_KEY_5, cx: process.env.SEARCH_ENGINE_ID_5 },
    { key: process.env.GOOGLE_API_KEY_6, cx: process.env.SEARCH_ENGINE_ID_6 },
    { key: process.env.GOOGLE_API_KEY_7, cx: process.env.SEARCH_ENGINE_ID_7 }
];

let currentKeyIndex = 0;

const getNextApiKey = () => {
    const keyPair = API_KEYS[currentKeyIndex];
    return keyPair;
}

const searchAmazonProduct = async (productName) => {
    const GOOGLE_SEARCH_API = 'https://www.googleapis.com/customsearch/v1';

    for (let retryCount = 0; retryCount < API_KEYS.length; retryCount++) {
        try {
            const { key, cx } = getNextApiKey();

            const response = await axios.get(GOOGLE_SEARCH_API, {
                params: {
                    key: key,
                    cx: cx,
                    q: `${productName} site:amazon.in`,
                    num: 10,
                    gl: 'in',
                    safe: 'active'
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.items && response.data.items.length > 0) {
                const amazonResults = filterAndRankAmazonResults(response.data.items, productName);
                if (amazonResults.length > 0) {
                    const bestMatch = await scrapeAmazonProductDetails(amazonResults[0].link);
                    return { success: true, product: bestMatch };
                }
            }

            return { success: false, message: 'No matching Amazon products found' };

        } catch (error) {
            if (error.response?.status === 429) {
                currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
                continue;
            }

            // return { 
            //     success: false, 
            //     error: 'API request failed',
            //     details: error.message 
            // };
        }
    }
};

// Search Result Processing Functions
const filterAndRankAmazonResults = (items, productName) => {
    return items
        .filter(item => item.link.includes('amazon.in'))
        .map(item => ({
            title: item.title,
            link: item.link,
            matchScore: calculateMatchScore(item.title.toLowerCase(), productName.toLowerCase())
        }))
        .filter(item => item.matchScore >= 30)
        .sort((a, b) => b.matchScore - a.matchScore);
}

const calculateMatchScore = (title, searchTerm) => {
    const searchWords = searchTerm.split(' ');
    let matchCount = title.includes(searchTerm) ? 30 : 0;

    searchWords.forEach(word => {
        if (title.includes(word)) matchCount++;
    });

    return (matchCount / searchWords.length) * 100;
}

// Product Detail Scraping Functions
const scrapeAmazonProductDetails = async (url) => {
    try {
        const affiliateUrl = generateAffiliateUrl(url);

        const response = await axios.get(affiliateUrl, {
            headers: {
                'User-Agent': generateRandomUserAgent()
            }
        });

        const $ = cheerio.load(response.data);
        const imageElement = $('#landingImage');

        const originalImageUrl = imageElement.attr('data-old-hires') || imageElement.attr('src');
        const highQualityImageUrl = enhanceImageQuality(originalImageUrl);

        return {
            title: $('#productTitle').text().trim(),
            imageUrl: highQualityImageUrl,
            productUrl: affiliateUrl,
            price: $('#priceblock_ourprice').text().trim() || $('.a-price-whole').first().text().trim()
        };
    } catch (error) {
        return {
            error: 'Failed to fetch product details',
            url
        };
    }
}

// Utility Functions
const enhanceImageQuality = (originalUrl) => {
    if (!originalUrl) return null;
    let cleanUrl = originalUrl.split('._')[0];
    return `${cleanUrl}._SL1500_.jpg`;
}

const generateRandomUserAgent = () => {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

const generateAffiliateUrl = (url) => {
    if (url.includes('/s?') || url.includes('/s/')) {
        return `${url}&tag=purepick-21&linkCode=ll1&language=en_IN&ref_=as_li_ss_tl`;
    }
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?tag=purepick-21&linkCode=ll1&language=en_IN&ref_=as_li_ss_tl`;
}

export { searchAmazonProduct };

// Test execution
// (async () => {
//     const productName = "buddha hair oil";
//     const result = await searchAmazonProduct(productName);
//     console.log(result);
// })();
