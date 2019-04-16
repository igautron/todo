const creater        = document.getElementById('creater'),
      createNote     = document.querySelector('.createNote'),
      createList     = document.querySelector('.createList'),
      createHeader   = document.querySelector('.createHeader'),
      controls       = document.getElementById('controls'),
      createListCont = document.getElementById('list'),
      noNote         = document.querySelector('.no-note');



// GLOBAL FUNCTIONS
function headerKeyHandler(e){
    if(e.keyCode === 13){
        e.preventDefault();
    }
}

function noteTextSpaceHandle(e){
    if (e.keyCode === 13) {
        e.preventDefault();
        
          let selection = window.getSelection(),
              range     = selection.getRangeAt(0),
              br        = document.createElement('br');
        
          let bnode = document.createTextNode('\u00A0');
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          range.collapse(false);
          e.target.appendChild(bnode);

          selection.removeAllRanges();
          selection.addRange(range);
    }
}

let cListEls = document.querySelectorAll('[aria-label="newTodo"]');
for(let clist of cListEls){
    clist.addEventListener('keydown', addListEl);
}
// note functionnality
let notes = document.querySelectorAll('.note');
for(let note of notes){
    note.addEventListener('click', noteFunctional, false)
}



// CREATE NOTES FUNCTIONS
function showNoteElement(){
    createHeader.hidden = false;
    controls.hidden     = false;
}

// remove all lists from creater
function removeAllLists(){
    const listCont = creater.querySelector('.listCont');
    if(listCont){
        const length   = listCont.children.length,
              selector = '.listEl:not(:last-child)';
            
        if(length > 1){
            const lists = listCont.querySelectorAll(selector);
            lists.forEach(list => list.remove());
        }
    }
}
// reset resetCreater
function resetCreater(){
    removeAllLists();
    createNote.hidden      = false;
    createNote.innerHTML   = '';
    creater.removeAttribute('data-type');
    createList.hidden      = false;
    createHeader.hidden    = true;
    createHeader.innerHTML = '';
    controls.hidden        = true;
    list.hidden            = true;
}



function noteFunctional(e){

    let t  = e.target;
    let cl = t.classList;
    let p  = t.parentNode;
    
    switch(true){
        case cl.contains('createNote'):
            t.onkeydown = noteTextSpaceHandle;
            createList.hidden = true;
            creater.dataset.type = 'note';
            showNoteElement();
            break;

        case cl.contains('createList'):
            createNote.hidden = true;
            t.hidden = true;
            createListCont.hidden = false;
            creater.dataset.type = 'list';
            showNoteElement();
            break;
            
        case cl.contains('header'):
            t.onkeydown = headerKeyHandler;
            break;

        case cl.contains('noteText'):
            t.onkeydown = noteTextSpaceHandle;
            break;

        case cl.contains('checkEl'):
            checkListChange(t);
            break;

        case cl.contains('textEl'):
            t.onkeydown = noteTextSpaceHandle;
            break;

        case cl.contains('delEl'):
            p.remove();
            break;

        case cl.contains('cancel'):
            resetCreater();
            break;

        case cl.contains('add'):
            postData(creater);  //POST REQUEST
            break;

        case cl.contains('edit'):
            putData(this);     //PUT REQUEST
            break;

        case cl.contains('delete'):
            deleteData(this);  //DELETE REQUEST
            break;
    }

}




// CHECKLIST FUNCTOIN
function checkListChange(t){
    if(t.hasAttribute('aria-checked')){
        let isCheked = (t.getAttribute('aria-checked')  == 'false') ? true : false;
        t.setAttribute('aria-checked', `${isCheked}`)
    }
}

// ADD LIST ELEMENT FUNCTION
function addListEl(e){

    if(!e.ctrlKey && !e.metaKey && !e.altKey && e.keyCode !== 13){

        this.parentNode.removeAttribute('role');
        this.previousSibling.setAttribute('aria-checked', 'false');
        this.removeAttribute('placeholder');
        this.setAttribute('aria-label', 'listText');
        this.removeEventListener("keydown", addListEl);
    
        let listEl  = document.createElement('div');
        let checkEl = document.createElement('div');
        let textEl  = document.createElement('div');
        let delEl   = document.createElement('div');

        listEl.classList.add('listEl');
        checkEl.classList.add('checkEl');
        textEl.classList.add('textEl');
        delEl.classList.add('delEl');

        listEl.setAttribute('role', 'createListEl');
        textEl.setAttribute('contenteditable', 'true');
        textEl.setAttribute('placeholder', 'New TODO');
        textEl.setAttribute('role', 'textbox');
        textEl.setAttribute('aria-label', 'newTodo');

        textEl.addEventListener("keydown", addListEl, false);
        
        listEl.appendChild(checkEl);
        listEl.appendChild(textEl);
        listEl.appendChild(delEl);
        this.parentNode.parentNode.appendChild(listEl);
    }
    else{
        e.preventDefault();
    }
}


// new
const minis = document.querySelectorAll('.mini')
for(mini of minis){
    mini.addEventListener("click", function(e) {
        let cln = e.target.classList;
        
        if( !(cln.contains('delete') || cln.contains('edit') || cln.contains('setTime')) ){
            this.classList.remove('mini')
            this.classList.add('fixed')
            document.querySelector('.selBg').classList.add('selected')
        }
    });
}

const selBg = document.querySelector('.selBg')
selBg.addEventListener("click", function(e) {
    
    this.classList.remove('selected')
    
    document.querySelector('.fixed').classList.add("mini")
    document.querySelector('.fixed').classList.remove("fixed")

});