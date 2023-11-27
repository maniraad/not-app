const $ = document;

const addBox = $.querySelector('.add-box'),
    popupBox = $.querySelector('.popup-box '),
    popupTitle = $.querySelector('header p'),
    popupClose = $.querySelector('header i'),
    inputElem = $.querySelector('input'),
    asideElem = $.querySelector('aside'),
    modal = $.querySelector('.modal'),
    modalBtns = $.querySelectorAll('.modal__link'),
    textareaElem = $.querySelector('textarea'),
    buttonElem = $.querySelector('button');

let isUpdate = false;
let updateID = null;

let notes = []

addBox.addEventListener('click', showModal)

function showModal(noteTittle, noteDescription) {

    if (isUpdate) {
        popupTitle.innerHTML = 'Update note'
        buttonElem.innerHTML = 'Update Note'
        inputElem.value = noteTittle
        textareaElem.value = noteDescription

    } else {
        popupTitle.innerHTML = 'Add a new note'
        buttonElem.innerHTML = 'Add Note'
    }
    popupBox.classList.add('show');
    inputElem.focus()
}

function closePopUp() {
    popupBox.classList.remove('show');
}

function newNote() {

    if (isUpdate) {

        let allNotes = getLocalStorageNotes()

        allNotes.some((note, index) => {
            if (index === updateID) {
                note.tittle = inputElem.value
                note.description = textareaElem.value
            }
        })

        setLocalStorageNotes(allNotes)
        generateNotes(allNotes)
        clearInputs()
        closePopUp()

        isUpdate = false
    } else {
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
                        <li onclick="editNote(${index},'${note.tittle}','${note.description}')">
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
    Swal.fire({
        text: 'Are you sure to delete note?!',
        icon: 'question',
        iconColor: '#2a9d8f',
        position: "top",
        backdrop: "rgb(0 0 0 / 35%);",
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'OK',
        denyButtonText: 'Cancel',
        confirmButtonColor: '#2a9d8f',
        denyButtonColor: '#ED2939',

        showClass: {
            popup: `
              animate__animated
              animate__fadeInDown
              animate__faster
            `
        },
        hideClass: {
            popup: `
              animate__animated
              animate__fadeOutUp
              animate__faster
            `
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let newNotes = getLocalStorageNotes()
            newNotes.splice(noteIndex, 1)
            setLocalStorageNotes(newNotes)
            generateNotes(newNotes)
        }
    });
}

function editNote(noteId, noteTittle, noteDescription) {

    isUpdate = true
    showModal(noteTittle, noteDescription)
    updateID = noteId

}

function showSetting(el) {
    el.parentElement.classList.add('show')

    $.addEventListener('click', event => {

        if (event.target !== el && event.target.tagName !== 'i') {
            el.parentElement.classList.remove('show')
        }
    })
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
    if (!showModal) {
        if (event.key === 'Enter') {
            newNote()
        }
    }
})