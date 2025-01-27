// TODO: Implement the logic to get the best insights from the product insights by AI and the product insights by algo
// This fucntion is not completed yet and is not used anywhere

const getBestInsights = (productInsightsByAlgo, productInsightsByAI) => {
    if(productInsightsByAI.confidence_score.score + 20 < productInsightsByAlgo.overall.confidence.score) {
        productInsightsByAI.overall.rating = productInsightsByAlgo.overall.rating;
        productInsightsByAI.baby.rating = productInsightsByAlgo.baby.rating;
        productInsightsByAI.children.rating = productInsightsByAlgo.children.rating;
        productInsightsByAI.teenagers.rating = productInsightsByAlgo.teenagers.rating;
        productInsightsByAI.adults.rating = productInsightsByAlgo.adults.rating;
        productInsightsByAI.seniors.rating = productInsightsByAlgo.seniors.rating;
    }
    return productInsightsByAI;
};