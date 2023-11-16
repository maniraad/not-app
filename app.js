const $ = document;

const addBox = $.querySelector('.add-box'),
    popupBox = $.querySelector('.popup-box '),
    popupTitle = $.querySelector('header p'),
    popupClose = $.querySelector('header i'),
    inputElem = $.querySelector('input'),
    textareaElem = $.querySelector('textarea'),
    buttonElem = $.querySelector('button');

let notes = []

let isUpdate = false;


addBox.addEventListener('click', () => {
    if (isUpdate) {
        popupTitle.innerHTML = 'Update note'
        buttonElem.innerHTML = 'Update Note'
    } else {
        popupTitle.innerHTML = 'Add a new note'
        buttonElem.innerHTML = 'Add Note'
    }
    popupBox.classList.add('show');
    inputElem.focus()
});

function closePopUp(){
    popupBox.classList.remove('show');
}

function generateNotes(notes) {
    console.log(notes);
}

function getLocalStorageNotes() {
    let localStorageNotes = localStorage.getItem('notes')

    if (localStorageNotes) {
        notes = JSON.parse(localStorageNotes)
    } else {
        notes = []
    }

    return notes
}

window.addEventListener('load', () => {
    let notes = getLocalStorageNotes()
    generateNotes(notes)
})
popupClose.addEventListener('click',()=>{closePopUp()})
buttonElem.addEventListener('click',()=>{
    
    closePopUp()
})