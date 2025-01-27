import axios from 'axios';
import * as cheerio from 'cheerio';
import FormData from 'form-data';

const parseBarcodeResults = (html) => {
    const $ = cheerio.load(html);
    let results = [];

    $('#result').each((i, table) => {
        const rows = $(table).find('tr');
        if (rows.length > 0) {
            const rawText = $(rows[0]).find('td').eq(1).text().trim();
            const barcodeFormat = $(rows[2]).find('td').eq(1).text().trim();
            const parsedResult = $(rows[4]).find('td').eq(1).text().trim();

            if (rawText && barcodeFormat && parsedResult) {
                results.push({
                    rawText,
                    barcodeFormat,
                    parsedResult
                });
            }
        }
    });

    return results;
}

const fetchBarcodeInfo = async(imageBuffer) => {
    try {
        const formData = new FormData();
        formData.append('file', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });

        const response = await axios.post('https://zxing.org/w/decode', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        const html = response.data;

        const results = parseBarcodeResults(html);
        return results;
    } catch (error) {
    }
}

export { fetchBarcodeInfo };
