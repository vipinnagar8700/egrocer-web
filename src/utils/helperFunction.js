export const extractJSONFromMarkup = (markupString) => {
    const jsonRegex = /<script type="application\/ld\+json">(.*?)<\/script>/s;
    const match = markupString.match(jsonRegex);
    if (match && match.length >= 2) {
        const extractedJSON = match[1];

        try {
            return JSON.parse(extractedJSON);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

    return null;
};