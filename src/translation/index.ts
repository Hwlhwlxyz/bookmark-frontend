import cn from './cn.json';

let languageMap: any = {
    "cn": cn
}

let selectedLanguage: any = cn;

export function selectLanguage(language: string) {
    selectedLanguage = languageMap[language];
}

export function t(key: string) {
    if (selectedLanguage) {
        if (selectedLanguage[key]) {
            return selectedLanguage[key];
        }
    }
    return key;
}