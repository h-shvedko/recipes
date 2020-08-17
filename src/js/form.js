let formErrors = [];

/**
 *
 * @type {string}
 */
const WEIBLICH_GESCHLECHT = 'weiblich';

/**
 *
 * @type {string}
 */
const MAENLICH_GESCHLECHT = 'maennlich';

/**
 *
 * @type {number}
 */
const ERGEBNIS_ZUNEHMEN = 1;

/**
 *
 * @type {number}
 */
const ERGEBNIS_ABNEHMEN = 2;

/**
 *
 * @type {number}
 */
const ERGEBNIS_BLEIBEN = 3;

/**
 *
 * @type {string}
 */
const AKTIVITAT_MANGEL = '1';

/**
 *
 * @type {string}
 */
const AKTIVITAT_MASSIGE = '2';

/**
 *
 * @type {string}
 */
const AKTIVITAT_MITTLERE = '3';

/**
 *
 * @type {string}
 */
const AKTIVITAT_SEHR_AKTIVE = '4';

/**
 *
 * @type {string}
 */
const AKTIVITAT_SPORTLER = '5';

/**
 *
 * @type {number}
 */
const FRUESTUEK_PROZENT = 30;

/**
 *
 * @type {number}
 */
const MITTAGESSEN_PROZENT = 50;

/**
 *
 * @type {number}
 */
const ABENDESSEN_PROZENT = 20;

/**
 *
 * @type {number}
 */
const MENU_300 = 300;

/**
 *
 * @type {number}
 */
const MENU_500 = 500;

/**
 *
 * @type {number}
 */
const MENU_800 = 800;

/**
 *
 * @type {string}
 */
const FRUESTUEK_NAME = 'fruestuek';

/**
 *
 * @type {string}
 */
const MITTAGESSEN_NAME = 'mittag';

/**
 *
 * @type {string}
 */
const ABENDESSEN_NAME = 'abend';

if (formElement) {
    /**
     *
     */
    formElement.addEventListener('reset', function (event) {
        let ergebnis = document.getElementsByClassName('ergebnis-container')[0];
        let speiseplanAbgrage = document.getElementsByClassName('speiseplan-anfrage')[0];
        let speiseplan = document.getElementsByClassName('menu-container')[0];
        let listErgebnis = document.querySelector('.list-of-products');

        if (ergebnis) {
            ergebnis.style.display = 'none';
            speiseplanAbgrage.style.display = 'none';
            speiseplan.style.display = 'none';
            listErgebnis.style.display = 'none';
        }
    });

    /**
     *
     */
    formElement.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        let formValid = validateForm(formElement);
        let formData = prepareFormData(event.target.elements);

        if (formValid) {
            kalories = calculateCalories(formData);
        }

        let ergebnissKalorien = document.querySelector('.ergebnis-container') || null;
        let speiseplanAnfrage = document.querySelector('.speiseplan-anfrage') || null;

        if (ergebnissKalorien !== null) {
            let name = formData['vorname'];

            if (name.length > 0) {
                name = name + ', ';
            }

            if (kalories < 1200) {
                ergebnissKalorien.getElementsByClassName('result-text')[0].innerHTML = name + 'Sie sollen mindestens <strong>1200</strong> Kalorien pro Tag essen! Aber villeicht haben Sie etwas falsch eingegeben.'
            } else {
                ergebnissKalorien.getElementsByClassName('result-text')[0].innerHTML = name + 'Sie sollen maximal <strong>' + kalories + '</strong> Kalorien pro Tag essen!'
            }

            ergebnissKalorien.style.display = 'block';
            speiseplanAnfrage.style.display = 'block';

            let menuErgebniss = document.querySelector('.menu-container') || null;
            if (menuErgebniss !== null) {
                menuErgebniss.style.display = 'none';
            }

            let einkaufsList = document.querySelector('.list-of-products') || null;
            if (einkaufsList !== null) {
                einkaufsList.style.display = 'none';
            }
        }

        return false;
    });
}

/**
 * Form validation method
 * @param form - form javascript object
 * @returns {boolean}
 */
validateForm = function (form) {
    let res = true;

    return res;
};

/**
 *
 * @param aktivitaet
 * @returns {number}
 */
getAktivitaet = function (aktivitaet) {

    switch (aktivitaet) {
        case AKTIVITAT_MANGEL:
            return 1.2;
        case AKTIVITAT_MASSIGE:
            return 1.375;
        case AKTIVITAT_MITTLERE:
            return 1.55;
        case AKTIVITAT_SEHR_AKTIVE:
            return 1.725;
        case AKTIVITAT_SPORTLER:
            return 1.9;
    }
};

/**
 * Calculation of calories
 * @param formData
 * @returns {number}
 */
calculateCalories = function (formData) {
    let res = 0,
        bmr = 0,
        a, b, c, d, amr;
    let geschlecht = formData['geschlecht'] || null;
    let gewicht = formData['gewicht'] || 0;
    let alter = formData['alter'] || 0;
    let grosse = formData['grosse'] || 0;
    let aktivitaet = formData['aktivitaet'] || 0;
    let ergebnis = parseInt(formData['ergebnis']) || 0;

    if (geschlecht !== null) {
        if (geschlecht === WEIBLICH_GESCHLECHT) {
            a = 447.593;
            b = 9.247;
            c = 3.098;
            d = 4.33;
        } else {
            a = 88.362;
            b = 13.397;
            c = 4.799;
            d = 5.677;
        }

        let koeff = 1;
        switch (ergebnis) {
            case ERGEBNIS_ZUNEHMEN:
                koeff = 1.2;
                break;
            case ERGEBNIS_ABNEHMEN:
                koeff = 0.8;
                break;
        }

        bmr = (a + b * gewicht + c * grosse - d * alter) * koeff;
        amr = getAktivitaet(aktivitaet);

        res = Math.round(bmr * amr);
    }

    return res;
};

/**
 * Preparing data drom form
 * @param formElements
 * @returns {Array}
 */
prepareFormData = function (formElements) {
    let data = [];

    if (formElements) {
        let dataName, dataValue;

        for (let i = 0; i < formElements.length; i++) {
            if (formElements[i].hasAttribute('name')) {
                if (formElements[i].hasAttribute('type') && formElements[i].getAttribute('type') === 'radio'
                    && formElements[i].checked) {
                    dataName = formElements[i].getAttribute('name');
                    dataValue = formElements[i].value;
                } else if (formElements[i].hasAttribute('type') && formElements[i].getAttribute('type') !== 'radio' && formElements[i].tagName !== 'select') {
                    dataName = formElements[i].getAttribute('name');
                    dataValue = formElements[i].value;
                } else if (formElements[i].tagName.toLocaleLowerCase() === 'select') {
                    dataValue = formElements[i].options[formElements[i].selectedIndex].value;
                    dataName = formElements[i].getAttribute('name');
                }
                data[dataName] = dataValue;
            }
        }
    }

    return data;
};

/**
 * Get content from recipes files
 */
loadGerichten = function () {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            recipes = JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", "./recipes.json", false);
    xhttp.send();
};

/**
 * Generates menu table
 */
generateMenu = function (isSaved) {
    fruestuckKalorien = Math.floor(kalories * FRUESTUEK_PROZENT / 100);
    mittagessenKalorien = Math.floor(kalories * MITTAGESSEN_PROZENT / 100);
    abendessenKalorien = Math.floor(kalories * ABENDESSEN_PROZENT / 100);

    let ergebnisContainer = document.getElementsByClassName('ergebnis-container')[0];
    let menuAnfrage = document.getElementsByClassName('speiseplan-anfrage')[0];

    if (ergebnisContainer) {
        let tage = menuAnfrage.querySelectorAll('.tage');
        let nummerTage = 3;

        if (tage) {
            tage.forEach(function (elem) {
                if (elem.checked) {
                    nummerTage = elem.value
                }
            });
        }
        let menuObject = [];

        if (!isSaved) {
            menuObject = getMenuObject(nummerTage);
        } else {
            menuObject = getMenuObjectNotRandom(nummerTage);
        }

        let htmlElement = generateHtmlForMenu(menuObject);
        let htmlElementForPrint = generateHtmlForPrintMenu(menuObject);
        let tableMenu = document.getElementsByClassName('menu-container')[0];

        if (tableMenu) {
            tableMenu.style.display = 'block';
            let ergebnis = tableMenu.querySelector('.result-text.display');
            if (ergebnis) {
                ergebnis.innerHTML = htmlElement.outerHTML;
                ergebnis.scrollIntoView({block: "start", behavior: "smooth"});
                addEventListenrsForMenus();
            }

            let ergebnisPrint = tableMenu.querySelector('.result-text.print');
            if (ergebnisPrint) {
                ergebnisPrint.innerHTML = htmlElementForPrint.outerHTML;
            }

            attachEventsToGerichtElements();
        }
    }
};

/**
 *
 * @param recipeObject
 * @returns {*}
 */
getGerichteNumber = function (recipeObject) {
    let nummerVonGerichte = recipeObject.dishes.length - 1;
    return getRandomGerichtNummer(1, nummerVonGerichte);
}

/**
 *
 * @returns {*}
 * @param recipeObjectToCheck
 */
filterWithType = function (recipeObjectToCheck) {
    let newRecipeObject = [];
    let recipeObject = recipeObjectToCheck.dishes;

    if(typeof recipeObject !== 'undefined' && recipeObject.length > 0){
        for(let i = 0; i < recipeObject.length; i++){
            if(inTypeArray(recipeObject[i].type)){
                newRecipeObject.push(recipeObject[i]);
            }
        }

        recipeObject.dishes = newRecipeObject;
    }

    return recipeObject;
};

/**
 *
 * @param element
 * @returns {boolean}
 */
inTypeArray = function(element){
    let typeResults = typeResultsWrapper.querySelectorAll('input:checked');
    if(typeResults.length > 0){
        let selectedValues = [];
        for (let i = 0; i < typeResults.length; i++) {
            selectedValues.push(typeResults[i].value);
        }
        return selectedValues.indexOf(element) !== -1;
    }

    return false;
};

/**
 *
 * @returns {*}
 * @param recipeObjectToCheck
 */
filterWithAllergie = function (recipeObjectToCheck) {
    let newRecipeObject = [];
    let recipeObject = recipeObjectToCheck.dishes;

    if(typeof recipeObject !== 'undefined' && recipeObject.length > 0){
        for(let i = 0; i < recipeObject.length; i++){
            if(!inAllergieArray(recipeObject[i].allergic)){
                newRecipeObject.push(recipeObject[i]);
            }
        }

        recipeObject.dishes = newRecipeObject;
    }

    return recipeObject;
};

/**
 *
 * @returns {boolean}
 * @param elements
 */
inAllergieArray = function(elements){
    let allergieResults = allergieResultsWrapper.querySelectorAll('input:checked');
    if(allergieResults.length > 0){
        let selectedValues = [];
        for (let i = 0; i < selectedValues.length; i++) {
            selectedValues.push(selectedValues[i].value);
        }

        if(elements.length > 0){
            for (let j = 0; j < elements.length; j++) {
                if(selectedValues.indexOf(elements[j]) !== -1){
                    return false;
                }
            }
        }
    }

    return true;
};

/**
 *
 * @returns {[]}
 */
getGerichtItem = function () {
    let tmpTag = [];
    for (let j = 1; j <= 9; j++) {
        let recipeObject = recipes;
        recipeObject = filterWithType(recipeObject);
        recipeObject = filterWithAllergie(recipeObject);
        let gerichteNummer = getGerichteNumber(recipeObject);

        let type = FRUESTUEK_NAME;
        if (j > 3 && j <= 6) {
            type = MITTAGESSEN_NAME;
        } else if (j > 6) {
            type = ABENDESSEN_NAME;
        }

        while (getGerichteWeight(recipeObject.dishes[gerichteNummer], type) > MAX_GERICVHT_WEIGHT
        || getGerichteWeight(recipeObject.dishes[gerichteNummer], type) < MIN_GERICHT_WEIGHT) {
            gerichteNummer = getGerichteNumber(recipeObject);
        }

        tmpTag[j] = recipeObject.dishes[gerichteNummer];
    }
    return tmpTag;
}

/**
 *
 * @param nummerTage
 */
getMenuObject = function (nummerTage) {
    let res = [];

    let usedNumbers;
    for (let i = 1; i <= nummerTage; i++) {
        let tmpRes = [];
        let tmpTag = getGerichtItem();

        usedNumbers = [];
        tmpRes['fruestuek1'] = tmpTag[1];
        tmpRes['fruestuek2'] = tmpTag[2];
        tmpRes['fruestuek3'] = tmpTag[3];
        tmpRes['mittag1'] = tmpTag[4];
        tmpRes['mittag2'] = tmpTag[5];
        tmpRes['mittag3'] = tmpTag[6];
        tmpRes['abend1'] = tmpTag[7];
        tmpRes['abend2'] = tmpTag[8];
        tmpRes['abend3'] = tmpTag[9];

        res.push(tmpRes);
    }

    menuObject = res;

    return res;
};

/**
 *
 * @param nummerTage
 */
getMenuObjectNotRandom = function () {
    let tmpRes = [];
    let tmpTag = [];
    let recipeObject = recipes;
    let nummerTage = 7; //use max number of days

    for (let dish of recipeObject.dishes) {
        tmpRes[dish.type + dish.day] = dish;
    }

    for (let i = 1; i <= nummerTage; i++) {
        tmpTag[i] = [];
        for (let tmpResIndex in tmpRes) {
            if(tmpRes.hasOwnProperty(tmpResIndex)){
                if (tmpResIndex.indexOf(i.toString()) !== -1) {
                    tmpTag[i][tmpRes[tmpResIndex].type + '1'] = tmpRes[tmpResIndex];
                }
            }
        }
    }

    tmpTag = tmpTag.filter(function () {
        return true;
    });

    menuObject = tmpTag;

    return tmpTag;
};

/**
 *
 * @param min
 * @param max
 * @returns {*}
 */
getRandomNummer = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 *
 * @param min
 * @param max
 * @returns {*}
 */
getRandomGerichtNummer = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let nummer = Math.floor(Math.random() * (max - min + 1)) + min;

    //TODO increase number of dishes and activate this again
    if (usedNumbers.includes(nummer)) {
        try{
            nummer = getRandomGerichtNummer(min, max);
            usedNumbers.push(nummer);
        } catch (e) {
            console.log(e);
        }
    }

    return nummer;
};

if (menuCalculate) {
    /**
     *
     */
    menuCalculate.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        let ifWeHaveStoredMenu = getStoredIntoLocalStorage();
        let savedMenu = getAllFromLocalStorage();

        if (ifWeHaveStoredMenu && ifWeHaveStoredMenu === '1' && savedMenu && savedMenu.length > 0) {
            let einkaufsList = document.querySelector('.list-of-products') || null;
            if (einkaufsList !== null) {
                einkaufsList.style.display = 'none';
            }

            if (showinteractivePopup('Sie haben schon ein Speiseplan gespeichern. Möchten Sie das aufladen?')) {
                recipes = {dishes: savedMenu};
                generateMenu(true);
                isMenuLoadedFromLocalStorage = true;
            } else {
                isMenuLoadedFromLocalStorage = false;
                clearLocalStorage();
                loadGerichten();
                generateMenu(false);
            }

        } else {
            let einkaufsList = document.querySelector('.list-of-products') || null;
            if (einkaufsList !== null) {
                einkaufsList.style.display = 'none';
            }
            clearLocalStorage();

            loadGerichten();

            generateMenu(false);
        }
        return false;
    });
}

/**
 *
 * @param gerichtObject - рецепт одного блюда берется из json
 * @param type
 * @returns {number}
 */
window.getGerichteWeight = function (gerichtObject, type) {
    let weight = 0;

    let frueschtuek = kalories * FRUESTUEK_PROZENT / 100;
    let mittag = kalories * MITTAGESSEN_PROZENT / 100;
    let abend = kalories * ABENDESSEN_PROZENT / 100;

    let kaloriesProPorzionGramm = gerichtObject.calories;

    let koefficientFruestuek = frueschtuek / kaloriesProPorzionGramm;
    let koefficientMittag = mittag / kaloriesProPorzionGramm;
    let koefficientAbend = abend / kaloriesProPorzionGramm;

    switch (type) {
        case FRUESTUEK_NAME:
            weight = Math.round(gerichtObject.weight * koefficientFruestuek);
            break;
        case ABENDESSEN_NAME:
            weight = Math.round(gerichtObject.weight * koefficientAbend);
            break;
        case MITTAGESSEN_NAME:
            weight = Math.round(gerichtObject.weight * koefficientMittag);
            break;
    }

    return weight;
};

if (allergieJa) {
    allergieJa.addEventListener('click', function (event) {
        let allergieWrapper = document.querySelector('.filters-wrapper.allergie');
        if (allergieWrapper) {
            allergieWrapper.classList.remove('d-none');
        }
    });
}

if (allergieNein) {
    allergieNein.addEventListener('click', function (event) {
        let allergieWrapper = document.querySelector('.filters-wrapper.allergie');
        if (allergieWrapper) {
            allergieWrapper.classList.add('d-none');
        }
    });
}
