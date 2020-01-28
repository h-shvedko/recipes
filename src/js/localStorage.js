window.addGerichtToLocalStorage = function (gericht) {

    let currentStorage = JSON.parse(localStorage.getItem('gerichte'));

    if(currentStorage === null){
        currentStorage = [];
    }

    currentStorage.push(gericht);

    localStorage.setItem('gerichte', JSON.stringify(currentStorage));
};

window.clearLocalStorage = function () {
  localStorage.clear();
};
