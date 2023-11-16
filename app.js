const $ = document;

const addBox = $.querySelector('.add-box'),
    popupBox = $.querySelector('.popup-box '),
    popupTitle = $.querySelector('header p'),
    popupClose = $.querySelector('header i'),
    inputElem = $.querySelector('input'),
    asideElem = $.querySelector('aside'),
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

function closePopUp() {
    popupBox.classList.remove('show');
}

function newNote() {
    let newNote = {
        tittle: inputElem.value,
        description: textareaElem.value,
        date: getNowDate()
    }

    notes.push(newNote)
    setLocalStorageNotes(notes)
    generateNotes(notes)
    clearInputs()
    closePopUp()
}

function clearInputs() {
    inputElem.value = ''
    textareaElem.value = ''
}

function generateNotes(notes) {

    $.querySelectorAll('.note').forEach(note => { note.remove() })

    notes.forEach((note, index) => {
        asideElem.insertAdjacentHTML("beforeend", `
        <li class="note">
            <div class="details">
                <p>${note.tittle}</p>
                <span>${note.description}</span>
            </div>
            <div class="bottom-content">
                <span>${note.date}</span>
                <div class="settings">
                    <i class="uil uil-ellipsis-h" onclick="showSetting(this)"></i>
                    <ul class="menu">
                        <li onclick="editNote(0, '', '')">
                            <i class="uil uil-pen"></i>Edit
                        </li>
                        <li onclick="removeNote(${index})">
                            <i class="uil uil-trash"></i>Delete
                        </li>
                    </ul>
                </div>
            </div>
        </li>
        `)
    });
}

function removeNote(noteIndex) {

    let deleted = confirm('Are you sure to delete note?!')
    if (deleted) {
        let selectedNote = getLocalStorageNotes()

        selectedNote.splice(noteIndex, 1)
        setLocalStorageNotes(selectedNote)
        generateNotes(selectedNote)
    }
}

function showSetting(el) {
    el.parentElement.classList.add('show')
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

function setLocalStorageNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes))
}

function getNowDate() {
    let now = new Date()
    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    let nowDay = now.getDay()
    let nowMonth = now.getMonth()
    let nowYear = now.getFullYear()
    let dayOfMonth = now.getDate()

    return `${months[nowMonth]} ${dayOfMonth}, ${nowYear} (${days[nowDay]})`
}

buttonElem.addEventListener('click', () => newNote())

window.addEventListener('load', () => {
    let notes = getLocalStorageNotes()
    generateNotes(notes)
})

popupClose.addEventListener('click', () => { closePopUp() })

window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        closePopUp()
    }
    if (event.key === 'Enter') {
        newNote()
    }
})