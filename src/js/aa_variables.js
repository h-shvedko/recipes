window.onload = function () {
    /**
     *
     * @type {HTMLElement}
     */
    let formElement = document.getElementById('form');

    /**
     *
     * @type {HTMLElement}
     */
    let menuCalculate = document.getElementById('menu-calculate');

    /**
     *
     * @type {Element}
     */
    let modal = document.querySelector('.modal');

    /**
     *
     * @type {Element}
     */
    let lightbox = document.querySelector('.lightbox');

    /**
     *
     * @type {Element}
     */
    let closeModalButton = document.querySelector('.hide-modal');

    /**
     *
     * @type {HTMLElement}
     */
    let allergieJa = document.getElementById('allergie-ja');

    /**
     *
     * @type {HTMLElement}
     */
    let allergieNein = document.getElementById('allergie-nein');

    /**
     *
     * @type {HTMLElement}
     */
    let typeResultsWrapper = document.getElementById('type-results');

    /**
     *
     * @type {HTMLElement}
     */
    let allergieResultsWrapper = document.getElementById('allergie-results');

    /**
     *
     * @type {number}
     */
    let kalories = 0;

    /**
     *
     * @type {number}
     */
    let fruestuckKalorien = 0;

    /**
     *
     * @type {number}
     */
    let mittagessenKalorien = 0;

    /**
     *
     * @type {number}
     */
    let abendessenKalorien = 0;

    /**
     *
     */
    let recipes;

    /**
     *
     * @type {Array}
     */
    let usedNumbers = [];

    /**
     *
     */
    let menuItems;

    /**
     *
     * @type {HTMLElement}
     */
    let listGenerate = document.getElementById('list-generation');

    /**
     *
     * @type {HTMLElement}
     */
    let menuPrint = document.getElementById('menu-print');

    /**
     *
     * @type {HTMLElement}
     */
    let menuSave = document.getElementById('menu-save');

    /**
     *
     * @type {HTMLElement}
     */
    let listePrint = document.getElementById('liste-print');

    /**
     *
     * @type {Array}
     */
    let menuObject = [];

    /**
     *
     * @type {number}
     */
    const MIN_GERICHT_WEIGHT = 200;

    /**
     *
     * @type {number}
     */
    const MAX_GERICHT_WEIGHT = 1500;

    /**
     *
     * @type {string}
     */
    const ADD_TO_MENU_LABEL = 'Hinfügen zu Wunschlist';

    const REMOVE_FROM_MENU_LABEL = 'aus der Wunschliste entfernen';

    /**
     *
     * @type {boolean}
     */
    let isMenuLoadedFromLocalStorage = false;

    /**
     *
     * @type {{}}
     */
    let allergieValues = {
        'gluten': 1,
        'laktose': 2,
        'nuesse': 3,
        'pilze': 4,
        'zitrusfruechte': 5
    }

    /**
     *
     * @type {{normal: number, vegitarien: number, vegan: number}}
     */
    let gerichteType = {
        'normal': 1,
        'vegitarien': 2,
        'vegan': 3
    };

    /**
     *
     * @type {boolean}
     */
    window.allergieJa = false;

    /**
     *
     * @type {boolean}
     */
    window.allergieNein = true;

    /**
     *
     * @type {boolean}
     */
    window.addButtonsEventAttached = false;

    /**
     *
     * @type {boolean}
     */
    window.addIconsEventAttached = false;

    /**
     *
     * @type {boolean}
     */
    window.reloadIconsEventAttached = false;

    /**
     *
     * @type {number}
     */
    window.nummerTage = 3;
