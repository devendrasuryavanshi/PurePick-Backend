import * as cheerio from 'cheerio';

const fetchGoUpc = async (barcode) => {
    const url = `https://go-upc.com/search?q=${barcode}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
        });
        
        const data = await response.text();
        const $ = cheerio.load(data);
        
        const tableData = {};
        $('.table-striped tr').each((_, row) => {
            const label = $(row).find('.metadata-label').text().trim();
            const value = $(row).find('td:last-child').text().trim();
            if (label && value) {
                tableData[label] = value;
            }
        });

        const additionalAttributes = {};
        $('h2:contains("Additional Attributes")').next('ul').find('li').each((_, item) => {
            const label = $(item).find('.metadata-label').text().replace(':', '').trim();
            const value = $(item).text().replace($(item).find('.metadata-label').text(), '').replace(':', '').trim();
            if (label && value) {
                additionalAttributes[label] = value;
            }
        });

        const productDetailsGoUPC = {
            name: $('.product-name').text().trim(),
            image: $('.product-image img').first().attr('src'),
            description: $('h2:contains("Description")').next('span').text().trim(),
            tableData,
            additionalAttributes
        }

        
        return productDetailsGoUPC;
    } catch (error) {
        return null;
    }
}

export { fetchGoUpc };

// (async () => {
//     try {
//         const result = await fetchGoUpc('89080146');
//         console.log(JSON.stringify(result, null, 2));
//     } catch (error) {
//         console.error(error);
//     }
// })();
