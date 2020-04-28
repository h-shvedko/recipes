/**
 *
 * @type {string}
 */
const STORAGE_NAME = 'gerichte';

/**
 *
 * @param gerichtValue
 */
window.addGerichtToLocalStorage = function (gerichtValue) {

    let currentStorage = JSON.parse(localStorage.getItem(STORAGE_NAME));

    if (currentStorage === null) {
        currentStorage = [];
    }

    if (gerichtNotInStorage(gerichtValue)) {
        currentStorage.push(gerichtValue);
    } else {
        alert('Dies Gericht ist schon im Ihren Menu');
    }

    localStorage.setItem(STORAGE_NAME, JSON.stringify(currentStorage));
};

/**
 *
 */
window.clearLocalStorage = function () {
    localStorage.clear();
};

/**
 *
 * @returns {boolean}
 * @param gerichtValue
 */
window.gerichtNotInStorage = (gerichtValue) => {
    return findItemInLocalStorage(gerichtValue) === null;
};

/**
 *
 * @param gerichtValue
 */
window.removeGerichtToLocalStorage = function (gerichtValue) {
    let gerichtFromStorageInfo = findItemInLocalStorage(gerichtValue);

    if (gerichtFromStorageInfo !== null) {
        let gerichteFromStorage = JSON.parse(localStorage.getItem(STORAGE_NAME));
        let newGerichteValueForStorage = [];
        for (let i = 0; i < gerichteFromStorage.length; i++) {

            if (gerichteFromStorage[i].name === gerichtValue.name
                && gerichteFromStorage[i].day === gerichtValue.day
                && gerichteFromStorage[i].type === gerichtValue.type) {
                continue;
            } else {
                newGerichteValueForStorage.push(gerichteFromStorage[i]);
            }
        }

        clearLocalStorage();
        localStorage.setItem(STORAGE_NAME, JSON.stringify(newGerichteValueForStorage));
    }
};

/**
 *
 * @returns {null|*}
 * @param gerichtValue
 */
window.findItemInLocalStorage = function (gerichtValue) {
    let lengthOfLocalStorage = localStorage.length;

    if (lengthOfLocalStorage > 0) {
        let gerichteFromStorage = JSON.parse(localStorage.getItem(STORAGE_NAME));

        for (let i = 0; i < gerichteFromStorage.length; i++) {

            if (gerichteFromStorage[i].name === gerichtValue.name
                && gerichteFromStorage[i].day === gerichtValue.day
                && gerichteFromStorage[i].type === gerichtValue.type) {
                return gerichteFromStorage[i];
            }
        }

    }

    return null;
};
