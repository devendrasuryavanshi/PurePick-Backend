import axios from 'axios';
import * as cheerio from 'cheerio';

// currently not used

const googleSearch = async(query) => {
    const GOOGLE_SEARCH_URL = 'https://www.google.com/search';
    
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
        };

        const response = await axios.get(GOOGLE_SEARCH_URL, {
            params: {
                q: query,
                hl: 'en',
                gl: 'us',
                num: 100
            },
            headers
        });

        const $ = cheerio.load(response.data);
        
        return {
            success: true,
            searchMetadata: {
                query,
                timestamp: new Date().toISOString(),
                totalResults: extractSearchStats($)
            },
            organicResults: extractOrganicResults($),
            featuredSnippet: extractFeaturedSnippet($),
            relatedSearches: extractRelatedSearches($),
            knowledgeGraph: extractKnowledgeGraph($),
            topStories: extractTopStories($),
            images: extractImages($),
            videos: extractVideos($),
            peopleAlsoAsk: extractPeopleAlsoAsk($)
        };

    } catch (error) {
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

const extractSearchStats = ($) => {
    return $('.result-stats').text().trim();
}

const extractOrganicResults = ($) => {
    const results = [];
    $('.g').each((_, element) => {
        const title = $(element).find('h3').text().trim();
        const link = $(element).find('a').first().attr('href');
        const snippet = $(element).find('.VwiC3b').text().trim();
        
        if (title && link && !link.includes('/search?')) {
            results.push({
                title,
                link,
                snippet,
                position: results.length + 1
            });
        }
    });
    return results;
}

const extractFeaturedSnippet = ($) => {
    const featured = $('.c2xzTb');
    if (featured.length) {
        return {
            title: featured.find('h3').text().trim(),
            content: featured.find('.hgKElc').text().trim(),
            source: featured.find('cite').text().trim()
        };
    }
    return null;
}

const extractRelatedSearches = ($) => {
    const related = [];
    $('.k8XOCe').each((_, element) => {
        const term = $(element).text().trim();
        if (term) related.push(term);
    });
    return related;
}

const extractKnowledgeGraph = ($) => {
    const kg = $('.kp-wholepage');
    if (kg.length) {
        return {
            title: kg.find('.qrShPb').text().trim(),
            description: kg.find('.kno-rdesc').text().trim(),
            attributes: extractKnowledgeGraphAttributes($, kg)
        };
    }
    return null;
}

const extractKnowledgeGraphAttributes= ($, kg) => {
    const attributes = {};
    kg.find('.rVusze').each((_, element) => {
        const key = $(element).find('.w8qArf').text().trim();
        const value = $(element).find('.kno-fv').text().trim();
        if (key && value) attributes[key] = value;
    });
    return attributes;
}

const extractTopStories = ($) => {
    const stories = [];
    $('.WlydOe').each((_, element) => {
        stories.push({
            title: $(element).find('.mCBkyc').text().trim(),
            source: $(element).find('.CEMjEf').text().trim(),
            time: $(element).find('.OSrXXb').text().trim(),
            link: $(element).find('a').attr('href')
        });
    });
    return stories;
}

const extractImages = ($) => {
    const images = [];
    $('.image-result').each((_, element) => {
        const src = $(element).find('img').attr('src');
        if (src && !src.includes('data:image')) {
            images.push({
                src,
                alt: $(element).find('img').attr('alt'),
                link: $(element).find('a').attr('href')
            });
        }
    });
    return images;
}

const extractVideos = ($) => {
    const videos = [];
    $('.uYNZm').each((_, element) => {
        videos.push({
            title: $(element).find('.DhN8Cf').text().trim(),
            source: $(element).find('.NUnG9d').text().trim(),
            duration: $(element).find('.FxmvPc').text().trim(),
            link: $(element).find('a').attr('href')
        });
    });
    return videos;
}

const extractPeopleAlsoAsk = ($) => {
    const questions = [];
    $('.related-question-pair').each((_, element) => {
        questions.push({
            question: $(element).find('.cbphWd').text().trim(),
            snippet: $(element).find('.wDYxhc').text().trim()
        });
    });
    return questions;
}

export {
    googleSearch
};

