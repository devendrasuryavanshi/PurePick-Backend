const getUpcOrEan = (barcodeInfo) => {
    let barcode = null;

    if (barcodeInfo && barcodeInfo.length > 0) {
        barcodeInfo.forEach(item => {
            if (item?.barcodeFormat?.includes('EAN') || item?.barcodeFormat?.includes('UPC')) {
                barcode = item.parsedResult;
            }
        });
    }
    return barcode;
}

export { getUpcOrEan };