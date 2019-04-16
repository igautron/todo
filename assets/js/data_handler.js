// PACK ALL DATA TO MONGO DATABASE
function packData(note){
    
    let type   = note;
    let regex  = /<br\s*[\/]?>/gi;
    let regex2 = /&nbsp;/gi;

    if(type.dataset.type == 'note'){
        let headerData   = note.querySelector('.header').innerText;
        let noteTextData = note.querySelector('.noteText').innerHTML;
        let typeData     = type.getAttribute('data-type');
        let text = noteTextData.replace(regex2, '').replace(regex, "\n");

        return {
            type: typeData,
            header: headerData,
            noteText: text
        };
    }
    if(type.dataset.type == 'list'){
        let headerData = note.querySelector('.header').innerText;
        let typeData   = type.getAttribute('data-type');
        let lists      = note.querySelectorAll('.textEl:not([aria-label="newTodo"])');

        let normalArr  = [];
        let checkedArr = [];

        for(let i = 0;i < lists.length; i++){

            let text = lists[i].innerHTML.replace(regex, "\n").replace(regex2, '');

            if(lists[i].previousElementSibling.getAttribute('aria-checked') == 'true')
                checkedArr.push(text);
            else
                normalArr.push(text);
            
        }

        return {
            type: typeData,
            header: headerData,
            list: {
                normal: normalArr,
                checked: checkedArr
            }
        };
    }
}

// GET ID REQUIRED FOR POST AND DELETE REQUEST
function getNoteId(note){
    return note.getAttribute('data-id');
}


// PUT REQUEST
async function putData(dataEl){
    try{    
        const noteData  = await packData(dataEl);
        const id        = await getNoteId(dataEl);
        const fetchObj  = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(noteData)
        }

        await fetch(`/${id}`, fetchObj)
            .then(()=>window.location.href = '/')
            .catch(err=>console.log(err))
    }catch(err){
        console.log(err)
    }
}

// DELETE REQUEST
async function deleteData(dataEl){
    try{
        const id = await getNoteId(dataEl);

        await fetch(`/${id}`, {method: "DELETE"})
            .then(()=>window.location.href = '/')
            .catch(err=>console.log(err))
    }catch(err){
        console.log(err)
    }    
}

// POST REQUEST
async function postData(dataEl){
    try{
        const noteData = await packData(dataEl);
        const fetchObj = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(noteData)
        }
        console.log(noteData);

        await fetch('/', fetchObj)
            .then(()=>window.location.href = '/')
            .catch(err=>console.log(err))
    }catch(err){
        console.log(err)
    }
}