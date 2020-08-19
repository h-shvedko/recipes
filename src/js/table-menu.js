/**
 *
 * @param photoId
 * @returns {HTMLElement}
 */
window.createImg = function (photoId) {
    let image = document.createElement('img');
    image.setAttribute('src', './img/image' + photoId + '.jpg');
    image.setAttribute('alt', 'image' + photoId);
    image.classList.add('img-fluid');
    return image;
};

/**
 *
 * @returns {HTMLElement}
 * @param text
 */
window.createHeadline = function (text) {
    let headline = document.createElement('h4');
    headline.innerHTML = text;
    return headline;
};

/**
 *
 * @returns {HTMLElement}
 * @param text
 */
window.createHeadlineH3 = function (text) {
    let headline = document.createElement('h3');
    headline.innerHTML = text;
    return headline;
};

/**
 *
 * @returns {HTMLElement}
 * @param hmtl
 */
window.createBlock = function (hmtl) {
    let blockElement = document.createElement('div');
    blockElement.innerHTML = hmtl;
    return blockElement;
};

/**
 *
 * @returns {HTMLElement}
 * @param text
 */
window.createHeadlineH2 = function (text) {
    let headline = document.createElement('h2');
    let span = document.createElement('span');
    span.innerHTML = text;
    headline.appendChild(span);
    headline.classList.add('headline');
    headline.classList.add('headline--dotted');
    return headline;
};

/**
 *
 * @returns {HTMLElement}
 * @param text
 */
window.createText = function (text) {
    let textTag = document.createElement('p');
    textTag.innerHTML = text;
    return textTag;
};

/**
 *
 * @param object - рецепт одного блюда берется из json
 * @param isPrint
 * @returns {HTMLElement}
 */
window.createBeschreibung = function (object, isPrint) {
    let popover = document.createElement('div');
    let popoverHeader = document.createElement('h3');
    let popoverBody = document.createElement('div');
    let ingredientElement = document.createElement('div');
    let ingredients = object.ingredients;
    let ingredientsHtml = '';
    let image = createImg(object.photoId);

    if (!isPrint) {
        popover.classList.add("popover");
        popover.classList.add("fade");
    } else {
        popover.classList.add("popover-print");
    }

    popoverHeader.classList.add('popover-header');

    popoverBody.classList.add('popover-body');

    popover.appendChild(popoverHeader);
    popover.appendChild(popoverBody);

    popoverHeader.innerText = object.name;

    ingredientElement.classList.add('mt-3');
    ingredientElement.classList.add('mb-3');
    ingredientElement.classList.add('ingredients');
    ingredientElement.classList.add('text-right');

    let weight = createText("<i class=\"fas fa-balance-scale\"></i> " + getGerichteWeight(object, FRUESTUEK_NAME) + " g");
    weight.classList.add('d-inline');
    weight.classList.add('mr-3');

    let kallorien = createText("<i class=\"fas fa-fire-alt\"></i> " + object.relative_calories + " kcal pro 100 g");
    kallorien.classList.add('d-inline');
    kallorien.classList.add('mr-3');

    let zeit = createText("<i class=\"fas fa-hourglass-start\"></i> " + object.time + " min");
    zeit.classList.add('d-inline');
    zeit.classList.add('mr-3');

    let buttonAdd = createText("<button class='btn btn-success wunschlist-button' data-name='" + object.name + "' data-stored='0'>Hinfügen zu Wunschlist</button>");
    buttonAdd.classList.add('d-inline');
    buttonAdd.classList.add('mr-3');

    let infoElement = createBlock(weight.outerHTML + kallorien.outerHTML + zeit.outerHTML + buttonAdd.outerHTML);
    infoElement.classList.add('mt-3');
    infoElement.classList.add('mb-3');
    infoElement.classList.add('text-center');

    let zutatenElement = createText("Zutaten");
    zutatenElement.classList.add('popover-headline');

    ingredientsHtml += zutatenElement.outerHTML;

    if (ingredients.length > 0) {
        for (let i = 0; i < ingredients.length; i++) {
            let measure = '';
            if (ingredients[i].measure !== 'n/a') {
                measure = ingredients[i].measure;
            }

            let quantity = '';
            if (ingredients[i].quantity !== 'n/a') {
                quantity = ingredients[i].quantity;
            }
            ingredientsHtml += createText(quantity + " " + measure + " " + ingredients[i].name).outerHTML;
        }
    }

    ingredientElement.innerHTML = ingredientsHtml;

    let zubereitungElement = createText("Zubereitung");
    zubereitungElement.classList.add('popover-headline');

    popoverBody.innerHTML = image.outerHTML + infoElement.outerHTML + ingredientElement.outerHTML + zubereitungElement.outerHTML + object.process;

    return popover;
};

/**
 *
 * @param object
 * @param type
 * @returns {HTMLElement}
 */
window.generateGerichtElement = function (object, type) {

    if (typeof object !== 'undefined') {
        let image1 = createImg(object.photoId);

        let headline1 = createBlock(object.name);
        headline1.classList.add('headline');

        let process = createBeschreibung(object, false);

        let reloadIcon = createText('<i class="fas fa-sync fa-2x"></i>');
        reloadIcon.setAttribute('title', 'Neues Gericht laden');
        reloadIcon.classList.add('reload-gericht');

        let addToMenuIcon = createText("<i class=\"far fa-check-circle fa-2x wunschlist-icon\" data-name='" + object.name + "' data-stored='0'></i>");
        addToMenuIcon.setAttribute('title', ADD_TO_MENU_LABEL);
        addToMenuIcon.classList.add('wunschlist-icon-wrapper');

        let div = createBlock(image1.outerHTML + reloadIcon.outerHTML + addToMenuIcon.outerHTML + headline1.outerHTML);

        div.classList.add('info-wrapper');
        div.classList.add('text-center');

        let divDisabledOverlay = createBlock('');
        divDisabledOverlay.classList.add('overlay');

        let divWrapper = createBlock(div.outerHTML + process.outerHTML + divDisabledOverlay.outerHTML);
        divWrapper.classList.add('gericht');
        divWrapper.setAttribute('data-name', object.name.replace('\"', '\''));

        return divWrapper;
    } else {
        return createBlock('');
    }

};

/**
 *
 * @param menuObject
 * @param index
 * @param type
 * @returns {HTMLElement[]}
 */
window.getGerictenByType = function (menuObject, index, type) {

    let gerichtTmpA, gerichtTmpB, gerichtTmpC;

    switch (type) {
        case FRUESTUEK_NAME:
            gerichtTmpA = generateGerichtElement(menuObject[index].fruestuek1, type);
            gerichtTmpA.setAttribute('data-day', (index + 1).toString());
            gerichtTmpA.setAttribute('data-type', type);

            gerichtTmpB = generateGerichtElement(menuObject[index].fruestuek2, type);
            gerichtTmpB.setAttribute('data-day', (index + 1).toString());
            gerichtTmpB.setAttribute('data-type', type);

            gerichtTmpC = generateGerichtElement(menuObject[index].fruestuek3, type);
            gerichtTmpC.setAttribute('data-day', (index + 1).toString());
            gerichtTmpC.setAttribute('data-type', type);
            break;
        case MITTAGESSEN_NAME:
            gerichtTmpA = generateGerichtElement(menuObject[index].mittag1, type);
            gerichtTmpA.setAttribute('data-day', (index + 1).toString());
            gerichtTmpA.setAttribute('data-type', type);

            gerichtTmpB = generateGerichtElement(menuObject[index].mittag2, type);
            gerichtTmpB.setAttribute('data-day', (index + 1).toString());
            gerichtTmpB.setAttribute('data-type', type);

            gerichtTmpC = generateGerichtElement(menuObject[index].mittag3, type);
            gerichtTmpC.setAttribute('data-day', (index + 1).toString());
            gerichtTmpC.setAttribute('data-type', type);
            break;
        case ABENDESSEN_NAME:
            gerichtTmpA = generateGerichtElement(menuObject[index].abend1, type);
            gerichtTmpA.setAttribute('data-day', (index + 1).toString());
            gerichtTmpA.setAttribute('data-type', type);

            gerichtTmpB = generateGerichtElement(menuObject[index].abend2, type);
            gerichtTmpB.setAttribute('data-day', (index + 1).toString());
            gerichtTmpB.setAttribute('data-type', type);

            gerichtTmpC = generateGerichtElement(menuObject[index].abend3, type);
            gerichtTmpC.setAttribute('data-day', (index + 1).toString());
            gerichtTmpC.setAttribute('data-type', type);
            break;
    }

    return [gerichtTmpA, gerichtTmpB, gerichtTmpC];
}

/**
 *
 * @param table
 * @returns {*}
 */
window.getTableHeader = function(table) {
    let theadCell1 = createBlock('<h3 style="visibility: hidden;">Tag N</h3>');
    theadCell1.classList.add('col-auto');

    let theadCell2 = createBlock('');
    theadCell2.classList.add('col');

    let theadCell2Row = createBlock('');
    theadCell2Row.classList.add('row');
    theadCell2Row.classList.add('m-1');
    theadCell2.append(theadCell2Row);

    let theadCell2RowCell1 = createBlock('Fruhstück');
    theadCell2RowCell1.classList.add('font-weight-bold');
    theadCell2RowCell1.classList.add('text-center');
    theadCell2RowCell1.classList.add('table-head');
    theadCell2RowCell1.classList.add('col-12');
    theadCell2RowCell1.classList.add('col-md-4');

    let theadCell2RowCell2 = createBlock('Mittagessen');
    theadCell2RowCell2.classList.add('font-weight-bold');
    theadCell2RowCell2.classList.add('text-center');
    theadCell2RowCell2.classList.add('table-head');
    theadCell2RowCell2.classList.add('col-12');
    theadCell2RowCell2.classList.add('col-md-4');

    let theadCell2RowCell3 = createBlock('Abendessen');
    theadCell2RowCell3.innerHTML = "Abendessen";
    theadCell2RowCell3.classList.add('font-weight-bold');
    theadCell2RowCell3.classList.add('text-center');
    theadCell2RowCell3.classList.add('table-head');
    theadCell2RowCell3.classList.add('col-12');
    theadCell2RowCell3.classList.add('col-md-4');

    theadCell2Row.append(theadCell2RowCell1);
    theadCell2Row.append(theadCell2RowCell2);
    theadCell2Row.append(theadCell2RowCell3);

    table.appendChild(theadCell1);
    table.appendChild(theadCell2);

    return table;
}

/**
 *
 * @param tbody
 * @param i
 * @param menuObject
 * @param day
 * @returns {*}
 */
window.getTableContent = function(tbody, i, menuObject, day) {
    let gerichts = getGerictenByType(menuObject, i, FRUESTUEK_NAME);
    let gericht1 = gerichts[0];
    let gericht2 = gerichts[1];
    let gericht3 = gerichts[2];

    gerichts = getGerictenByType(menuObject, i, MITTAGESSEN_NAME);
    let gericht4 = gerichts[0];
    let gericht5 = gerichts[1];
    let gericht6 = gerichts[2];

    gerichts = getGerictenByType(menuObject, i, ABENDESSEN_NAME);
    let gericht7 = gerichts[0];
    let gericht8 = gerichts[1];
    let gericht9 = gerichts[2];

    let headlineH3 = createHeadlineH3("Tag " + (day)).outerHTML;
    let cell0 = createBlock(headlineH3);
    cell0.classList.add('col-auto');
    cell0.classList.add('font-weight-bold');
    cell0.classList.add('text-center');

    let cell1 = createBlock('');
    cell1.classList.add('col');

    let cell1Row = createBlock('');
    cell1Row.classList.add('row');
    cell1.append(cell1Row);

    let theadCell2RowCell1 = createBlock('Fruhstück');
    theadCell2RowCell1.classList.add('font-weight-bold');
    theadCell2RowCell1.classList.add('text-center');
    theadCell2RowCell1.classList.add('table-head');

    let cell1HTML = theadCell2RowCell1.outerHTML + gericht1.outerHTML + gericht2.outerHTML + gericht3.outerHTML;
    let cell1RowCell1 = createBlock(cell1HTML);
    cell1RowCell1.classList.add('menu-item');
    cell1RowCell1.classList.add('fruestuek');
    cell1RowCell1.classList.add('col-12');
    cell1RowCell1.classList.add('col-md-4');

    let theadCell2RowCell2 = createBlock('Mittagessen');
    theadCell2RowCell2.classList.add('font-weight-bold');
    theadCell2RowCell2.classList.add('text-center');
    theadCell2RowCell2.classList.add('table-head');

    let cell2HTML = theadCell2RowCell2.outerHTML + gericht4.outerHTML + gericht5.outerHTML + gericht6.outerHTML;
    let cell1RowCell2 = createBlock(cell2HTML);
    cell1RowCell2.classList.add('col-12');
    cell1RowCell2.classList.add('col-md-4');
    cell1RowCell2.classList.add('menu-item');
    cell1RowCell2.classList.add('mittag');

    let theadCell2RowCell3 = createBlock('Abendessen');
    theadCell2RowCell3.innerHTML = "Abendessen";
    theadCell2RowCell3.classList.add('font-weight-bold');
    theadCell2RowCell3.classList.add('text-center');
    theadCell2RowCell3.classList.add('table-head');

    let cell3HTML = theadCell2RowCell3.outerHTML + gericht7.outerHTML + gericht8.outerHTML + gericht9.outerHTML;
    let cell1RowCell3 = createBlock(cell3HTML);
    cell1RowCell3.classList.add('col-12');
    cell1RowCell3.classList.add('col-md-4');
    cell1RowCell3.classList.add('menu-item');
    cell1RowCell3.classList.add('abend');

    cell1Row.append(cell1RowCell1);
    cell1Row.append(cell1RowCell2);
    cell1Row.append(cell1RowCell3);

    tbody.append(cell0);
    tbody.append(cell1);

    return tbody;
}

/**
 *
 * @param menuObject
 * @returns {HTMLElement}
 */
window.generateHtmlForMenu = function (menuObject) {
    let block = document.createElement('div');
    block.classList.add('row');
    block.classList.add('table');

    if (menuObject.length > 0) {
        for (let i = 0; i < menuObject.length; i++) {

            let blockCol = createBlock('');
            blockCol.classList.add('col-12');

            let tbody = createBlock('');
            tbody.classList.add('table');
            tbody.classList.add('row');

            let tag = i + 1;
            tbody = getTableContent(tbody, i, menuObject, tag);
            tbody.classList.add('day-' + tag);
            blockCol.appendChild(tbody);

            block.appendChild(blockCol);

        }
    }

    return block;
};

/**
 *
 * @param zeitName
 * @returns {string}
 */
window.determineTypeofGericht = function (zeitName) {

    if (zeitName.indexOf(FRUESTUEK_NAME) !== -1) {
        return FRUESTUEK_NAME;
    }
    if (zeitName.indexOf(MITTAGESSEN_NAME) !== -1) {
        return MITTAGESSEN_NAME;
    }
    if (zeitName.indexOf(ABENDESSEN_NAME) !== -1) {
        return ABENDESSEN_NAME;
    }
};

/**
 *
 * @param zeitName
 * @returns {string}
 */
window.determineTypeofGerichtAndReturnTitle = function (zeitName) {
    let title = "Fruhstück";

    if (zeitName.indexOf(FRUESTUEK_NAME) !== -1) {
        title = 'Fruhstück';
    }
    if (zeitName.indexOf(MITTAGESSEN_NAME) !== -1) {
        title = 'Mittagessen';
    }
    if (zeitName.indexOf(ABENDESSEN_NAME) !== -1) {
        title = 'Abendessen';
    }

    return title;
};

/**
 *
 * @param menuObject
 * @returns {HTMLElement}
 */
window.generateHtmlForPrintMenu = function (menuObject) {
    let block = document.createElement('div');
    if (menuObject.length > 0) {

        let blockCol = document.createElement('div');
        let table = document.createElement('table');

        block.classList.add('row');
        block.classList.add('table');

        blockCol.classList.add('col');
        blockCol.classList.add('col-12');

        table.classList.add('table');
        table.classList.add('w-100');

        block.appendChild(blockCol);
        blockCol.appendChild(table);

        let tbody = document.createElement('tbody');

        let trBody;
        for (let i = 0; i < menuObject.length; i++) {
            let tag = i + 1;

            trBody = document.createElement('tr');

            let cell0 = trBody.insertCell(0);

            let innerTable = document.createElement('table');

            for (let zeitName in menuObject[i]) {
                if (menuObject[i].hasOwnProperty(zeitName)) {
                    let innerTr = document.createElement('tr');
                    innerTr.classList.add('gericht');
                    innerTr.setAttribute('data-name', menuObject[i][zeitName].name);
                    innerTr.setAttribute('data-day', tag);
                    innerTr.setAttribute('data-type', determineTypeofGericht(zeitName));

                    let innerCell0 = innerTr.insertCell(0);
                    let innerCell1 = innerTr.insertCell(1);

                    let innerImage = createImg(menuObject[i][zeitName].photoId);
                    let innerHeadline = createHeadline(menuObject[i][zeitName].name);
                    let innerWeight = createText("<i class=\"fas fa-balance-scale\"></i> " + getGerichteWeight(menuObject[i][zeitName], zeitName) + " g");
                    let innerKallorien = createText("<i class=\"fas fa-fire-alt\"></i> " + menuObject[i][zeitName].relative_calories + " kcal pro 100 g");
                    let innerZeit = createText("<i class=\"fas fa-hourglass-start\"></i> " + menuObject[i][zeitName].time + " min");
                    let innerProcess = createBeschreibung(menuObject[i][zeitName], true);

                    let title = determineTypeofGerichtAndReturnTitle(zeitName);

                    innerCell0.innerHTML = title + '<br>' + 'Tag ' + tag;
                    innerCell0.classList.add('title-print');
                    innerCell0.classList.add('font-weight-bold');
                    innerCell0.classList.add('text-center');

                    innerCell0.classList.add('w-20');
                    innerCell1.innerHTML = innerImage.outerHTML + innerHeadline.outerHTML + innerWeight.outerHTML + innerKallorien.outerHTML + innerZeit.outerHTML + innerProcess.outerHTML;
                    innerCell1.classList.add('w-80');
                    innerCell1.classList.add('menu-item');
                    innerCell1.classList.add('fruestuek');

                    //@TODO: insert page break after each menu item
                    // let pageBreakTr = document.createElement('tr')
                    // pageBreakTr.classList.add('pagebreak');
                    // pageBreakTr.insertCell(0);
                    // innerTable.appendChild(pageBreakTr);

                    innerTable.appendChild(innerTr);
                }
            }

            cell0.innerHTML = innerTable.outerHTML;


            tbody.appendChild(trBody);
        }

        table.appendChild(tbody);

    }


    return block;
};

/**
 *
 * @param event
 */
window.showBeschreibung = function (event) {

    return false;
    let element = event.currentTarget;

    let popover = element.querySelector('.popover');

    if (popover) {
        popover.classList.add('show');
    }

    return true;
};

/**
 *
 * @param event
 */
window.hideBeschreibung = function (event) {
    return false;
    let element = event.currentTarget;

    let popover = element.querySelector('.popover');

    if (popover) {
        popover.classList.remove('show');
    }

    return true;
};

/**
 *
 */
window.addEventListenrsForMenus = function () {
    let menuItems = document.querySelectorAll('.menu-item');

    if (menuItems) {
        menuItems.forEach(function (element) {
            element.addEventListener('mouseover', showBeschreibung);
            element.addEventListener('mouseleave', hideBeschreibung);
        })
    }
};

if (menuPrint) {
    menuPrint.addEventListener('click', function (event) {
        event.preventDefault();

        let disabledGerichte = document.querySelectorAll('.gericht.disabled');

        if (disabledGerichte.length > 0 || isMenuLoadedFromLocalStorage) {
            for (let i = 0; i < disabledGerichte.length; i++) {
                disabledGerichte[i].style.display = 'none';
            }

            window.print();
        } else {
            showWarningPopup('Sie haben keine Gerichte gewählen!');
        }
        return false;
    });

    window.onafterprint = () => {
        let disabledGerichte = document.querySelectorAll('.gericht.disabled');

        if (disabledGerichte.length > 0) {
            for (let i = 0; i < disabledGerichte.length; i++) {
                disabledGerichte[i].style.display = 'block';
            }
        }

    };
}

if (menuSave) {
    menuSave.addEventListener('click', function (event) {
        event.preventDefault();

        let gerichte = getAllFromLocalStorage();

        if (gerichte.length > 0) {
            addStoreIntoLocalStorage().then(() => {
                showWarningPopup('Das Speiseplan wurde gespeichert.');
            }).catch((err) =>  showWarningPopup('Sie haben keine Gerichte gewählen.'));
        } else {
            showWarningPopup('Sie haben keine Gerichte gewählen!');
        }
        return false;
    });
}

if (listePrint) {
    listePrint.addEventListener('click', function (event) {
        event.preventDefault();

        document.querySelector('.menu-container').style.display = 'none';
        document.querySelector('#show-menu').style.display = 'block';
        window.print();

        return false;
    });
}

let menuShow = document.getElementById('show-menu');

if (menuShow) {
    menuShow.addEventListener('click', function (event) {
        event.preventDefault();

        document.querySelector('.menu-container').style.display = 'block';
        document.querySelector('#show-menu').style.display = 'none';

        return false;
    });
}

if (listGenerate) {
    listGenerate.addEventListener('click', function (event) {
        event.preventDefault();

        let storedMenuObject = getAllFromLocalStorage();

        if (storedMenuObject && storedMenuObject.length > 0) {
            let listWrapper = document.createElement('div');
            let listWrapperCol = document.createElement('div');

            listWrapper.classList.add('row');
            listWrapperCol.classList.add('col-12');

            listWrapper.appendChild(listWrapperCol);

            let listOfProducts;
            listOfProducts = getListOfProducts(storedMenuObject);

            if (listOfProducts) {
                for (let name in listOfProducts) {
                    let quantity = listOfProducts[name]['quantity'] ? listOfProducts[name]['quantity'] : '';
                    let element = createText("<span class='custom-control-input'></span>" + name + ": " + quantity + " " + listOfProducts[name]['measure'] + "&nbsp;<i class=\"fas fa-times-circle d-print-none einkaufliste-remove\" title='aus der Einkaufliste entfernen'></i>");
                    element.classList.add('custom-control');
                    listWrapperCol.appendChild(element);
                }

                let listErgebnis = document.querySelector('.list-of-products');

                if (listErgebnis) {
                    let textContainer = listErgebnis.getElementsByClassName('result-text')[0];

                    if (textContainer) {
                        textContainer.innerHTML = listWrapper.outerHTML;
                        listErgebnis.style.display = 'block';
                        listErgebnis.scrollIntoView({block: "start", behavior: "smooth"});
                    }

                    attachEventsToEinkaufliste();
                }
            }
        } else {
            showWarningPopup('Sie haben keine Gerichte gewählen!');
        }
        return false;
    });
}

/**
 *
 * @param object
 * @returns {Array}
 */
window.getListOfProducts = function (object) {
    let listOfProducts = [];
    if (object.length > 0) {
        for (let i = 0; i < object.length; i++) {
            if (object[i].ingredients && object[i].ingredients.length > 0) {
                let ingredients = object[i].ingredients;
                for (let j = 0; j < ingredients.length; j++) {

                    let nameOfIngredient = ingredients[j]['name'].trim();
                    if (nameOfIngredient in listOfProducts) {
                        listOfProducts[nameOfIngredient] = {
                            'quantity': parseFloat(ingredients[j]['quantity']) + parseFloat(listOfProducts[nameOfIngredient]['quantity']),
                            'measure': ingredients[j]['measure']
                        };
                    } else {
                        listOfProducts[nameOfIngredient] = {
                            'quantity': parseFloat(ingredients[j]['quantity']),
                            'measure': ingredients[j]['measure']
                        };
                    }
                }
            }
        }
    }

    return listOfProducts;
};

/**
 *
 */
window.attachEventsToGerichtElements = function () {
    let gerichtElements = document.querySelectorAll('.gericht');

    if (gerichtElements.length > 0) {
        gerichtElements.forEach(function (element, key) {
            element.addEventListener('click', function (event) {
                let htmlTitle = element.querySelector('.popover-header').outerHTML;
                let htmlContent = element.querySelector('.popover-body').outerHTML;
                let popupWindow = document.querySelector('.remodal-wrapper') || null;
                let lightbox = document.querySelector('.remodal-overlay') || null;
                if (popupWindow !== null && lightbox !== null) {
                    popupWindow.querySelector('.modal-title').innerHTML = htmlTitle;
                    popupWindow.querySelector('.content').innerHTML = htmlContent;
                    popupWindow.style.display = 'block';
                    popupWindow.setAttribute('data-name', element.getAttribute('data-name'));
                    popupWindow.setAttribute('data-type', element.getAttribute('data-type'));
                    popupWindow.setAttribute('data-day', element.getAttribute('data-day'));
                    lightbox.style.display = 'block';
                    attachEventListenerToAddButton();
                }
            });
        });
        attachEventListenerToAddIcons();
    }
};


/**
 *
 */
window.attachEventsToGerichtElementsByParent = function (parent) {
    let gerichtElements = parent.querySelectorAll('.gericht');

    if (gerichtElements.length > 0) {
        gerichtElements.forEach(function (element, key) {
            element.addEventListener('click', function (event) {
                let htmlTitle = element.querySelector('.popover-header').outerHTML;
                let htmlContent = element.querySelector('.popover-body').outerHTML;
                let popupWindow = document.querySelector('.remodal-wrapper') || null;
                let lightbox = document.querySelector('.remodal-overlay') || null;
                if (popupWindow !== null && lightbox !== null) {
                    popupWindow.querySelector('.modal-title').innerHTML = htmlTitle;
                    popupWindow.querySelector('.content').innerHTML = htmlContent;
                    popupWindow.style.display = 'block';
                    popupWindow.setAttribute('data-name', element.getAttribute('data-name'));
                    popupWindow.setAttribute('data-type', element.getAttribute('data-type'));
                    popupWindow.setAttribute('data-day', element.getAttribute('data-day'));
                    lightbox.style.display = 'block';
                    attachEventListenerToAddButton();
                }
            });
        });
        attachEventListenerToAddIcons();
    }
};

/**
 *
 * @param elementToAttach
 */
window.attachEventListenerForPopUp = function (elementToAttach) {
    elementToAttach.addEventListener('click', function (event) {
        let element = event.target;

        let parent = element.closest('.remodal') || null;

        if (parent === null || event.target.classList.contains('remodal-close')) {
            let popupWindow = document.querySelector('.remodal-wrapper') || null;
            let lightbox = document.querySelector('.remodal-overlay') || null;
            if (popupWindow !== null && lightbox !== null) {
                popupWindow.style.display = 'none';
                lightbox.style.display = 'none';
            }
        }
    });
};


let remodalWrapper = document.querySelector('.remodal-wrapper') || null;

if (remodalWrapper !== null) {
    attachEventListenerForPopUp(remodalWrapper);
}

let remodalClose = document.querySelector('.remodal-close') || null;
if (remodalClose !== null) {
    attachEventListenerForPopUp(remodalClose);
}

/**
 *
 * @param name
 * @param type
 * @param day
 * @returns {null}
 */
window.findGericht = (name, type, day) => {
    let gerichtResult = null;

    if (typeof menuObject !== 'undefined' && menuObject.length > 0) {
        if (menuObject.hasOwnProperty(day - 1)) {
            let menuObjectByDay = menuObject[day - 1];

            for (let menuObjectType in menuObjectByDay) {
                if (menuObjectType.indexOf(type) !== -1) {
                    if (menuObjectByDay.hasOwnProperty(menuObjectType) && menuObjectByDay[menuObjectType].name === name) {
                        gerichtResult = menuObjectByDay[menuObjectType];
                    }
                }
            }
        }
    }

    return gerichtResult;
};

/**
 *
 * @param name
 * @param type
 * @param day
 * @param isIconAction
 * @param element
 */
window.removeGerichtFromMenu = function (name, day, type, isIconAction, element) {
    let gericht = findGericht(name, type, day);
    let gerichtPopoverIcon = getGerichtPopoverIcon(day, type, name);
    let gerichtPopoverButton = getGerichtPopoverButton(day, type, name);

    removeGerichtToLocalStorage(gericht);
    if (isIconAction) {
        element.setAttribute('title', ADD_TO_MENU_LABEL);
        element.closest('.gericht').querySelector('.popover-body').querySelector('.wunschlist-button').innerHTML = ADD_TO_MENU_LABEL;
    } else {
        element.innerHTML = ADD_TO_MENU_LABEL;
    }
    element.setAttribute('data-stored', 0);

    if (gerichtPopoverIcon !== null) {
        gerichtPopoverIcon.setAttribute('title', ADD_TO_MENU_LABEL);
        gerichtPopoverIcon.setAttribute('data-stored', 0);
    }

    if (gerichtPopoverButton !== null) {
        gerichtPopoverButton.innerHTML = ADD_TO_MENU_LABEL;
        gerichtPopoverButton.setAttribute('data-stored', 0);
    }
}

/**
 *
 * @param name
 * @param day
 * @param type
 * @param isIconAction
 * @param element
 */
window.addGerichtToMenu = function (name, day, type, isIconAction, element) {
    let gericht = findGericht(name, type, day);
    let gerichtPopoverIcon = getGerichtPopoverIcon(day, type, name);
    let gerichtPopoverButton = getGerichtPopoverButton(day, type, name);

    if (gericht !== null) {
        gericht.day = day;
        gericht.type = type;
        addGerichtToLocalStorage(gericht);

        if (isIconAction) {
            element.setAttribute('title', REMOVE_FROM_MENU_LABEL);
            element.closest('.gericht').querySelector('.popover-body').querySelector('.wunschlist-button').innerHTML = REMOVE_FROM_MENU_LABEL;
        } else {
            element.innerHTML = REMOVE_FROM_MENU_LABEL;
        }
        element.setAttribute('data-stored', 1);
        if (gerichtPopoverIcon !== null) {
            gerichtPopoverIcon.setAttribute('title', REMOVE_FROM_MENU_LABEL);
            gerichtPopoverIcon.setAttribute('data-stored', 1);
        }
        if (gerichtPopoverButton !== null) {
            gerichtPopoverButton.innerHTML = REMOVE_FROM_MENU_LABEL;
            gerichtPopoverButton.setAttribute('data-stored', 1);
        }
    }
}

/**
 *
 */
window.attachEventListenerToAddButton = function () {
    let addButtons = document.querySelectorAll('.wunschlist-button');

    if (addButtons.length > 0) {
        addButtons.forEach(function (buttonElement, key) {
            buttonElement.addEventListener('click', function (event) {
                event.stopPropagation();
                eventHandlerForAddElements(event);

                return false;
            });
        });

        window.addButtonsEventAttached = true;
    }
};

/**
 *
 */
window.attachEventListenerToAddButtonByParent = function (parent) {
    let addButtons = parent.querySelectorAll('.wunschlist-button');

    if (addButtons.length > 0) {
        addButtons.forEach(function (buttonElement, key) {
            buttonElement.addEventListener('click', function (event) {
                event.stopPropagation();
                eventHandlerForAddElements(event);

                return false;
            });
        });
    }
};


/**
 *
 */
window.attachEventListenerToAddIcons = function () {
    let addButtons = document.querySelectorAll('.wunschlist-icon');

    if (addButtons.length > 0 && !window.addIconsEventAttached) {
        addButtons.forEach(function (buttonElement, key) {
            buttonElement.addEventListener('click', function (event) {
                event.stopPropagation()
                eventHandlerForAddElements(event);

                return false;
            });
        });

        window.addIconsEventAttached = true;
    }
};


/**
 *
 */
window.attachEventListenerToAddIconsByParent = function (parent) {
    let addButtons = parent.querySelectorAll('.wunschlist-icon');

    if (addButtons.length > 0) {
        addButtons.forEach(function (buttonElement, key) {
            buttonElement.addEventListener('click', function (event) {
                event.stopPropagation()
                eventHandlerForAddElements(event);

                return false;
            });
        });
    }
};

/**
 *
 * @param event
 */
window.eventHandlerForAddElements = function (event) {
    let type, day, name, isIconAction = false;
    let element = event.currentTarget;
    let isStored = element.getAttribute('data-stored');
    let parentModal = element.closest('.remodal-wrapper');

    if (parentModal === null) {
        let parentGericht = element.closest('.gericht');
        isIconAction = true;
        name = parentGericht.getAttribute('data-name');
        type = parentGericht.getAttribute('data-type');
        day = parentGericht.getAttribute('data-day');
    } else {
        name = parentModal.getAttribute('data-name');
        type = parentModal.getAttribute('data-type');
        day = parentModal.getAttribute('data-day');
    }


    //@TODO: check not only by day+name+type but by day+type
    if (isStored === '1') {
        removeGerichtFromMenu(name, day, type, isIconAction, element);
    } else {
        addGerichtToMenu(name, day, type, isIconAction, element);
    }
    toggleGerichteAfterSelection(day, type, name);
    toggleGerichtePrintVersionAfterSelection(day, type, name);
}


/**
 *
 * @param day
 * @param type
 * @param name
 */
window.toggleGerichteAfterSelection = function (day, type, name) {
    let parentTRWrapper = document.querySelector('.day-' + day);
    let gerichteColumn = null;
    let gerichte = [];

    if (parentTRWrapper !== null) {
        gerichteColumn = parentTRWrapper.querySelector('.' + type);

        if (gerichteColumn !== null) {
            gerichte = gerichteColumn.querySelectorAll('div.gericht:not([data-name="' + name + '"])');

            if (gerichte.length > 0) {
                for (let i = 0; i < gerichte.length; i++) {
                    if (gerichte[i].classList.contains('disabled')) {
                        gerichte[i].classList.remove('disabled');
                    } else {
                        gerichte[i].classList.add('disabled');
                        gerichte[i].classList.remove('active');
                    }
                }
            }

            let gerichtContain = gerichteColumn.querySelector('div.gericht[data-name="' + name + '"]');

            if (gerichtContain !== null) {
                if (gerichtContain.classList.contains('active')) {
                    gerichtContain.classList.remove('active');
                } else {
                    gerichtContain.classList.add('active');
                    gerichtContain.classList.remove('disabled');
                }
            }
        }
    }
};
/**
 *
 * @param day
 * @param type
 * @param name
 */
window.toggleGerichtePrintVersionAfterSelection = function (day, type, name) {
    let parentTRWrapper = document.querySelectorAll('.result-text.print .gericht[data-day="' + day + '"][data-type="' + type + '"]');
    if (parentTRWrapper.length > 0) {
        for (let i = 0; i < parentTRWrapper.length; i++) {
            if (parentTRWrapper.hasOwnProperty(i) && parentTRWrapper[i].getAttribute('data-name').indexOf(name) === -1) {
                if (parentTRWrapper[i].classList.contains('disabled')) {
                    parentTRWrapper[i].classList.remove('disabled');
                } else {
                    parentTRWrapper[i].classList.add('disabled');
                }
            }
        }
    }
};

/**
 *
 * @param day
 * @param type
 * @param name
 * @returns {null}
 */
window.getGerichtPopoverIcon = function (day, type, name) {
    let parentTRWrapper = document.querySelector('.day-' + day);
    let gerichteColumn = null;
    let gerichtePopover = null;
    let gerichtePopoverButton = null;

    if (parentTRWrapper !== null) {
        gerichteColumn = parentTRWrapper.querySelector('.' + type);

        if (gerichteColumn !== null) {
            try {
                gerichtePopover = gerichteColumn.querySelector('div.gericht[data-name="' + name + '"]');
            } catch (e) {
                alert('Leider dieses Gericht ist fehlgeschlagen (((');
            }

            if (gerichtePopover !== null) {
                gerichtePopoverButton = gerichtePopover.querySelector('.wunschlist-icon');
            }
        }
    }

    return gerichtePopoverButton;
};

/**
 *
 * @param day
 * @param type
 * @param name
 * @returns {null}
 */
window.getGerichtPopoverButton = function (day, type, name) {
    let parentTRWrapper = document.querySelector('.day-' + day);
    let gerichteColumn = null;
    let gerichtePopover = null;
    let gerichtePopoverButton = null;

    if (parentTRWrapper !== null) {
        gerichteColumn = parentTRWrapper.querySelector('.' + type);

        if (gerichteColumn !== null) {
            try {
                gerichtePopover = gerichteColumn.querySelector('div.gericht[data-name="' + name + '"]');
            } catch (e) {
                alert('Leider dieses Gericht ist fehlgeschlagen (((');
            }

            if (gerichtePopover !== null) {
                gerichtePopoverButton = gerichtePopover.querySelector('.wunschlist-button');
            }
        }
    }

    return gerichtePopoverButton;
};

/**
 *
 * @param event
 */
window.reloadGerichtEventHandler = function (event) {
    let day, type;
    let reloadIcon = event.currentTarget;
    let parentGerichtWrapper = reloadIcon.closest('.menu-item');

    if (parentGerichtWrapper !== null) {
        let gerichten = parentGerichtWrapper.querySelectorAll('.gericht');
        if (gerichten.length > 0) {
            for (let i = 0; i < gerichten.length; i++) {
                day = gerichten[i].getAttribute('data-day');
                type = gerichten[i].getAttribute('data-type');
                gerichten[i].remove();
            }
        }

        let menuObject = getMenuObjectByTagAndType(day, type);
        let menuObjectHtml = getGerictenByType(menuObject, day - 1, type);
        let tableHeader = parentGerichtWrapper.querySelector('.table-head');
        parentGerichtWrapper.innerHTML = tableHeader.outerHTML + menuObjectHtml[0].outerHTML + menuObjectHtml[1].outerHTML + menuObjectHtml[2].outerHTML;

        attachEventListenerToReloadGerichtIconByParent(parentGerichtWrapper);
        attachEventListenerToAddIconsByParent(parentGerichtWrapper);
        attachEventListenerToAddButtonByParent(parentGerichtWrapper);
        attachEventsToGerichtElementsByParent(parentGerichtWrapper);
    }
};


/**
 *
 */
window.attachEventListenerToReloadGerichtIcon = function () {
    let reloadIcons = document.querySelectorAll('.reload-gericht');

    if (reloadIcons.length > 0 && !window.reloadIconsEventAttached) {
        reloadIcons.forEach(function (reloadElement, key) {
            reloadElement.addEventListener('click', function (event) {
                event.stopPropagation()
                reloadGerichtEventHandler(event);
                return false;
            });
        });

        window.reloadIconsEventAttached = true;
    }
};

/**
 *
 */
window.attachEventListenerToReloadGerichtIconByParent = function (parent) {
    let reloadIcons = parent.querySelectorAll('.reload-gericht');

    if (reloadIcons.length > 0) {
        reloadIcons.forEach(function (reloadElement, key) {
            reloadElement.addEventListener('click', function (event) {
                event.stopPropagation()
                reloadGerichtEventHandler(event);
                return false;
            });
        });
    }
};

/**
 *
 */
window.attachEventsToEinkaufliste = function () {
    let removeIcon = document.querySelectorAll('.einkaufliste-remove');

    if (removeIcon.length > 0) {

        for (let i = 0; i < removeIcon.length; i++) {
            removeIcon[i].addEventListener('click', function (event) {
                let parentWrapper = event.currentTarget.closest('.custom-control');

                if (parentWrapper) {
                    parentWrapper.remove();
                }
            });
        }
    }
};

}
