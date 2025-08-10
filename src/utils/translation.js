import enTranslation from "./en.json"
import { store } from "@/redux/store";
export const t = (label) => {
    const langData = store.getState().Language?.selectedLanguage?.json_data && store.getState().Language?.selectedLanguage?.json_data[label];
    if (langData) {
        return langData;
    } else {
        return enTranslation[label];
    }
};