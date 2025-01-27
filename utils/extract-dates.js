// Extracts manufacture and expiration dates from the input string, handling approximately 792 date formats with diverse patterns, separators, and flexible day, month, and year combinations.

const datePatterns = [
    /\b(0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-/.,](\d{4})\b/gi,  // DD-MMM-YYYY
    /\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-/.,](0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](20[2-9][0-9])\b/gi, // MMM-DD-YYYY
    /\b(\d{4})[-/.,](0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/gi,  // YYYY-DD-MMM
    /\b(20[2-9][0-9])[-/.,](JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-/.,](0[1-9]|1[0-9]|2[0-9]|3[0-1])\b/gi, // YYYY-MMM-DD
    /\b(20[2-9][0-9])[-/.,](0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](0[1-9]|1[0-9]|2[0-9]|3[0-1])\b/g, // YYYY-DD-MM / YYYY-MM-DD
    /\b(0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-/.,](\d{2})\b/gi,   // DD-MMM-YY
    /\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-/.,](0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](\d{2})\b/gi,  // MMM-DD-YY
    /\b(0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](20[2-9][0-9])\b/g, // DD-MM-YYYY / MM-DD-YYYY
    /\b(0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,](0[1-9]|1[0-9]|2[0-9]|3[0-1])[-/.,]([2-9][0-9])\b/g, // DD-MM-YY / MM-DD-YY
    /\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-/.,](\d{4})\b/gi,   // MMM-YYYY
    /\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-/.,](\d{2})\b/gi,  // MMM-YY
    /\b(20[2-9][0-9])[-/.,](0[1-9]|1[0-2])\b/g, // YYYY-MM
    /\b(0[1-9]|1[0-2])[-/.,](20[2-9][0-9])\b/g, // MM-YYYY
    /\b(0[1-9]|1[0-2])[-/.,]([2-9][0-9])\b/g,    // MM-YY
    /\b(\d{4})[-/.,](JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/gi,   // YYYY-MMM
    /\b(\d{2})[-/.,](JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/gi,  // YY-MMM
];

const useBeforePatterns = [
    /\bbefore (\d+)\s*(day|week|month|year|days|weeks|months|years)\b/i,
    new RegExp(`\\b(before|by|expires?|exp|until|expire)\\s*(?:[:-]?|=)\\s*(${[...datePatterns].map(p => p.source).join('|')})\\b`, 'i')
];

const manufactureDatePattern = new RegExp(`\\b(mfd|manufactured|manufacture date|mfg|produced|production date)\\s*(?:[:-]?|=)\\s*(${[...datePatterns].map(p => p.source).join('|')})\\b`, 'i');

const formatDate = (date) => {
    try {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } catch (error) {
        return null;
    }
}

const parseDateComponents = (dayOrMonth, monthOrDay, year) => {
    if (dayOrMonth.length === 4 || dayOrMonth > 31) {
        [dayOrMonth, year] = [year, dayOrMonth];
    }
    let day = dayOrMonth;
    let month = monthOrDay;
    if (parseInt(dayOrMonth) > 12 || parseInt(monthOrDay) > 12) {
        day = parseInt(dayOrMonth) > 12 ? dayOrMonth : monthOrDay;
        month = parseInt(dayOrMonth) > 12 ? monthOrDay : dayOrMonth;
    }
    const parsedYear = year.length === 2 || year < 100 ? `20${year}` : year;
    return new Date(`${parsedYear}-${month}-${parseInt(day)}`);
}

const extractDates = (originalData) => {
    try {
        const currentDate = new Date();
        let data = originalData;
        let manufactureDate = null;
        let expirationDate = null;
        let dates = [];

        let n = datePatterns.length;

        for (let i = 0; i < n; i++) {
            const pattern = datePatterns[i];
            pattern.lastIndex = 0;

            let match = pattern.exec(data);
            if (match !== null) {
                let date;
                if (match.length >= 4) {
                    let [fullMatch, dayOrMonth, monthOrDay, year] = match;
                    date = parseDateComponents(dayOrMonth, monthOrDay, year);
                } else {
                    let [fullMatch, monthOrAbbr, year] = match;
                    if (monthOrAbbr.length === 4 || monthOrAbbr > 31) {
                        let temp = monthOrAbbr;
                        monthOrAbbr = year;
                        year = temp;
                    }
                    const month = isNaN(monthOrAbbr) ? new Date(Date.parse(monthOrAbbr + " 1, 2020")).getMonth() + 1 : monthOrAbbr;
                    const parsedYear = year.length === 2 ? `20${year}` : year;
                    date = new Date(`${parsedYear}-${month}-01`);
                }

                if (date > currentDate) {
                    expirationDate = formatDate(date);
                } else {
                    dates.push(date);
                    if (dates.length >= 2) {
                        break;
                    }
                }
                data = data.replace(match[0], '');
                i = -1;
            }
        };

        dates.sort((a, b) => a - b);// ascending order

        manufactureDate = formatDate(dates[0]);
        if (!expirationDate) {
            expirationDate = formatDate(dates[dates.length - 1]);
        }

        if (manufactureDate && new Date(manufactureDate.split('-').reverse().join('-')) > currentDate) {
            manufactureDate = null;
        }

        let mfgMatch = manufactureDatePattern.exec(originalData);
        if (mfgMatch && mfgMatch[0]) {
            manufactureDate = mfgMatch[0].replace(/\b(mfd|manufactured|manufacture date|mfg|produced|production date)\b\s*[:\-]?=?\s*/gi, "").trim();
            const expParts = manufactureDate.split(/[-\/ ]/).map(part => isNaN(part) ? new Date(Date.parse(part + " 1, 2020")).getMonth() + 1 : Number(part));

            if (expParts.length === 3) {
                let [dayOrMonth, monthOrDay, year] = expParts;
                date = parseDateComponents(dayOrMonth, monthOrDay, year);
                manufactureDate = formatDate(date);
            } else {
                let [month, year] = expParts;
                if (month > 12) {
                    [month, year] = [year, month];
                }
                date = parseDateComponents(1, month, year);
                manufactureDate = formatDate(date);
            }

            if (manufactureDate === expirationDate) {
                expirationDate = null;
            }
        }

        // Handle cases with "use before X days/weeks/months/years from manufacturing date"
        let useBeforeMatch = useBeforePatterns[0].exec(originalData);
        if (useBeforeMatch && manufactureDate) {
            const amount = parseInt(useBeforeMatch[1], 10);
            const unit = useBeforeMatch[2]?.toLowerCase();
            const mfdParts = manufactureDate.split('-').map(Number);
            let mfdDate = new Date(mfdParts[2], mfdParts[1] - 1, mfdParts[0]);

            // Calculate the expiration date based on the "use before" information
            switch (unit) {
                case 'day':
                case 'days':
                    mfdDate.setDate(mfdDate.getDate() + amount);
                    break;
                case 'week':
                case 'weeks':
                    mfdDate.setDate(mfdDate.getDate() + amount * 7);
                    break;
                case 'month':
                case 'months':
                    mfdDate.setMonth(mfdDate.getMonth() + amount);
                    break;
                case 'year':
                case 'years':
                    mfdDate.setFullYear(mfdDate.getFullYear() + amount);
                    break;
            }

            expirationDate = formatDate(mfdDate);
        } else {
            useBeforeMatch = useBeforePatterns[1].exec(originalData);

            if (useBeforeMatch && useBeforeMatch[0]) {
                expirationDate = useBeforeMatch[0].replace(/\b(before|by|expires?|exp|until|expire)\b\s*[:\-]?=?\s*/gi, "").trim();
                const expParts = expirationDate.split(/[-\/ ]/).map(part => isNaN(part) ? new Date(Date.parse(part + " 1, 2020")).getMonth() + 1 : Number(part));

                if (expParts.length === 3) {
                    let [dayOrMonth, monthOrDay, year] = expParts;
                    date = parseDateComponents(dayOrMonth, monthOrDay, year);
                    expirationDate = formatDate(date);
                } else {
                    let [month, year] = expParts;
                    if (month > 12) {
                        [month, year] = [year, month];
                    }
                    date = parseDateComponents(1, month, year);
                    expirationDate = formatDate(date);
                }
            }
        }

        return {
            manufactureDate: manufactureDate != expirationDate ? manufactureDate : null,
            expiryDate: expirationDate
        };

    } catch (error) {
        return {
            manufactureDate: null,
            expiryDate: null
        };
    }
}

export { extractDates };