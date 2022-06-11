const localisation = "fr";



const local = {
    fr: {
        "nomduboss": "Nom du boss",
        "controle": "Control",
        "tMini": "T mini",
        "tMax": "T max",
        "derniereVerif": "Derniere verification",
        "id": "id",
        "statut": "Statut",
        "oui": "Oui",
        "non": "Non",
        "inconnu": "Inconnu",
    },
    en: {
        "nomduboss": "Boss name",
        "control": "Control",
        "tMini": "min T",
        "tMax": "max T",
        "derniereVerif": "Last checked",
        "id": "id",
        "statut": "Status",
        "oui": "Yes",
        "non": "No",
        "inconnu": "Unknown",
    }
}

// function to help translate the text
function translate(text) {
    return local[localisation][text];
}

// add space arount string the lenght of the string can not be more than variable maxLenght
function addSpace(text, maxLenght) {

 // add space arount string the lenght of the string can not be more than variable maxLenght
 // if lentgh is more than maxLenght remove space from the end of the string
    // if lentgh is less than maxLenght add space from the end of the string
    let textLenght = text.length;
    let space = " ";
    let spaceToAdd = maxLenght - textLenght;
    let spaceToAddLeft = Math.floor(spaceToAdd / 2);
    let spaceToAddRight = Math.ceil(spaceToAdd / 2);
    let spaceToAddLeftString = "";
    let spaceToAddRightString = "";
    for (let i = 0; i < spaceToAddLeft; i++) {
        spaceToAddLeftString += space;
    }
    for (let i = 0; i < spaceToAddRight; i++) {
        spaceToAddRightString += space;
    }
    if (textLenght > maxLenght) {
        return text.substring(0, maxLenght - 3) + "...";
    }
    if (textLenght < maxLenght) {
            return spaceToAddLeftString + text + spaceToAddRightString;
    }
}

 // add x "-" sgtring
function addLine(number) {
    let line = "";
    for (let i = 0; i < number; i++) {
        line += "-";
    }
    return line;
}
  

module.exports = { localisation,local,translate,addSpace,addLine};