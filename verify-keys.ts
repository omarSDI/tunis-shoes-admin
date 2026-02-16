import { translations } from './app/lib/translations';

const enKeys = Object.keys(translations.en).sort();
const frKeys = Object.keys(translations.fr).sort();
const arKeys = Object.keys(translations.ar).sort();

console.log('EN vs FR:', enKeys.length === frKeys.length && enKeys.every((k, i) => k === frKeys[i]));
console.log('EN vs AR:', enKeys.length === arKeys.length && enKeys.every((k, i) => k === arKeys[i]));

if (enKeys.length !== frKeys.length) {
    console.log('Differences EN-FR:', enKeys.filter(k => !frKeys.includes(k)), frKeys.filter(k => !enKeys.includes(k)));
}
if (enKeys.length !== arKeys.length) {
    console.log('Differences EN-AR:', enKeys.filter(k => !arKeys.includes(k)), arKeys.filter(k => !enKeys.includes(k)));
}
