import { fetchBarcodeInfo } from "../api/fetch-barcode-info.js";
import { extractDates } from "./extract-dates.js";
import { getAIAnalysis } from "../services/ai/ai-analysis.js";
import { extractAndFormatData } from "../services/ai/extract-and-format-data.js";
import getAlternateProductDetails from "./get-alternate-product-details.js";
import { getProductDetails } from "./get-product-details.js";
import { getUpcOrEan } from "./get-upc-ean.js";
import { getUserDetails } from "./get-user-details.js";
import { uploadImages } from "../services/storage/upload-images.js";
import { prepareProductInsight } from "./prepare-product-insight.js";
import { ProductInsight } from "../models/product-insight.js";

const processData = async(data, socket, userId) => {
    try {
        // Image Processing
        const buffer1 = Buffer.from(data[0].file, 'base64');
        const buffer2 = Buffer.from(data[1].file, 'base64');
        socket.emit("image-upload", { isSuccess: true });

        // Product Scanning
        let barcode = getUpcOrEan(data[0].barcodeInfo) || getUpcOrEan(data[1].barcodeInfo);
        if (!barcode) {
            barcode = getUpcOrEan(await fetchBarcodeInfo(buffer2)) ||
                getUpcOrEan(await fetchBarcodeInfo(buffer1));
        }
        socket.emit("product-scanning", { isSuccess: true });

        // Product Info Search
        const userDetails = await getUserDetails(userId);
        const productAdditionalInfo = await getProductDetails(barcode);
        socket.emit("product-info-search", { isSuccess: true });

        // Text Extraction
        let productDetails = await extractAndFormatData({ buffer1, buffer2, productAdditionalInfo });
        if (productDetails?.error) {
            const errorMessage = productDetails.error.toString().includes('different') ? "The images show different products" : productDetails.error.toString().includes('invalid') ? "Invalid product category" : productDetails.reason;
            socket.emit("extraction", {
                isSuccess: false,
                message: errorMessage
            });
            return;
        }
        socket.emit("extraction", { isSuccess: true });


        productDetails.barcode = barcode;
        const dates = extractDates(productDetails.rawText.image1 + " " + productDetails.rawText.image2);
        if (dates.manufactureDate) productDetails.manufacturing.dates.manufacture = dates.manufactureDate;
        if (dates.expiryDate) productDetails.manufacturing.dates.expiry = dates.expiryDate;

        // Product Analysis
        let productInsightsByAI = await getAIAnalysis(productDetails, productAdditionalInfo, userDetails);
        if (!productInsightsByAI) {
            socket.emit("product-analysis", { isSuccess: false, message: "Product analysis failed. The Model is not working properly." });
            return;
        }
        socket.emit("product-analysis", { isSuccess: true });

        // Alternative Suggestions
        productInsightsByAI = await getAlternateProductDetails(productInsightsByAI);
        socket.emit("alternative-search", { isSuccess: true });

        // Result Preparation
        const [url1, url2] = await Promise.all([
            uploadImages(buffer1, productDetails),
            uploadImages(buffer2, productDetails)
        ]);
        const completeData = await prepareProductInsight(productInsightsByAI, productDetails, productAdditionalInfo, { url1, url2 }, userId);
        if (completeData.error) {
            socket.emit("result-preparation", { isSuccess: false, message: completeData.error });
            return;
        }
        const savedInsight = await new ProductInsight(completeData).save();
        socket.emit("result-preparation", { isSuccess: true, productInsightId: savedInsight._id });

    } catch (error) {
        socket.emit("process-error", { message: "Something went wrong. Please try again later." });
    }
}


export { processData };