let modalOverlay = document.getElementsByClassName('modal-overlay')[0];
let modalContent = document.getElementById('modal-content');
let cancelButton = document.getElementById('cancel-button');
let abortButton = document.getElementById("abort-button");
let confirmButton = document.getElementById('confirm-button');
let modalError = document.getElementById('modal-error');
let selectAllButton = document.getElementById('select-all-button');
let directoryContent = document.getElementById("directory-content");
// the button when you want to create a folder, the one that display the input field
let createFolderButton = document.getElementById("create-folder-button");
let folderCreationConfirmationButton = document.getElementById("folder-creation-confirmation-button");
let folderCreationInput = document.getElementById("folder-creation-input");
let folderCreationRow = document.getElementById("folder-creation-row");
let fileInput = document.getElementById("file-input");
let fileInputButton = document.querySelector('label[for="file-input"]');
let progress = document.getElementById("progress");
let progressBar = document.getElementById("progress-bar");
let xmlHttp = null

function changeButtonState(enable){
    if (enable){
        abortButton.disabled = true;
        abortButton.classList.add('disabled');
        fileInput.disabled = false
        fileInputButton.classList.remove('disabled');
    }
    else{
        fileInput.disabled = true
        fileInputButton.classList.add('disabled');
        abortButton.disabled = false;
        abortButton.classList.remove('disabled');
    }
}

function progressHandler(e)
{
    if(e.total - e.loaded === 0){
        progress.style.width = "102%";
        setTimeout(() => {
            progress.style.width = "0%";
            progressBar.classList.remove("show");
        }, 200)
    }
    else{

        let width = Math.round((e.loaded / e.total) * 100);
        progress.style.width = width + "%";
    }
}

function completeHandler(e)
{
    xmlHttp = null
    progressBar.classList.remove("show");
    progress.style.width = 0;
    changeButtonState(true);
    if (e.target.status === 200){
        window.location.reload();
    }
    else if ([404, 502, 503, 504].includes(e.target.status))
    {
       alert("Unexpected Error, status code: " + e.target.status);
    }
    else
    {
         let jrs = JSON.parse(e.target.responseText);
         alert(e.target.status + ": " +jrs["detail"]);
    }

}

function errorHandler() {
    xmlHttp = null
    progress.style.width = "0%";
    progressBar.classList.remove("show");
    changeButtonState(true);
    alert("A network error happened.");
}
function abortHandler() {
    xmlHttp = null
    progress.style.width = "0%";
    progressBar.classList.remove("show");
    changeButtonState(true);
}
function uploadFiles(files){
    progressBar.classList.add("show");
    changeButtonState(false)
    let formData = new FormData();
    for (const file of files) {
        formData.append("files[]", file);
    }
    formData.append("path",`${path}`);
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `${uploadPath}`, true);
    xmlHttp.upload.addEventListener("progress", progressHandler, false);
    xmlHttp.addEventListener("load", completeHandler, false);
    xmlHttp.addEventListener("error", errorHandler, false);
    xmlHttp.addEventListener("abort", abortHandler, false);
    xmlHttp.send(formData);
}


function selectAll(){
    let checkboxes = document.querySelectorAll(".entity-checkbox");
    let checkedCheckboxes = document.querySelectorAll(".entity-checkbox:checked");
    let targetArray = checkboxes;
    let check = true;
    if (checkboxes.length === checkedCheckboxes.length) {
        targetArray = checkedCheckboxes;
        check = false;
    }
    for (let i = 0; i < targetArray.length; i++){
        targetArray[i].checked = check;
    }
}

function promptDeleteEntities(){
    let entities = Array.from(document.querySelectorAll(".entity-checkbox:checked"));
    let message = null;
    if (entities.length < 1){
        return
    }
    if (entities.length === 1){
        message = `You are about to delete the ${entities[0].dataset.isFile === 'true' ? 'file' : 'directory'} '${entities[0].dataset.entityName}'`;
    }
    else{
        const files = entities.filter(e => e.dataset.isFile === 'true').length;
        const directories = entities.filter(e => e.dataset.isFile === 'false').length;
        message = `You are about to delete `;
        if (files > 0){
            message += files + " file" + (files > 1 ? 's' : '');
        }
        if (directories > 0){
            if (files > 0){
                message += " and ";
            }
            message += directories + " director" + (directories > 1 ? 'ies' : 'y');
        }
    }
    modalContent.innerText = message + '.';
    modalOverlay.classList.add("show");
}
function deleteEntities(){
    let entities = Array.from(document.querySelectorAll(".entity-checkbox:checked"));
    if (entities.length < 1){
        return
    }
    confirmButton.disabled = true
    confirmButton.classList.add('disabled');
    let formData = new FormData();
    for (const e of entities) {
        formData.append("entities[]", e.dataset.entityName);
    }
    formData.append("path",`${path}`);
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `${deletePath}`, true);
    xmlHttp.addEventListener("load", (e) => {
        confirmButton.disabled = false
        confirmButton.classList.remove('disabled');
        if (e.target.status === 200){
            modalError.style.display = 'none'
            window.location.reload();
        }
        else if ([404, 502, 503, 504].includes(e.target.status))
        {
            modalError.style.display = 'block'
            modalError.innerText = "Unexpected Error, status code: " + e.target.status
        }
        else
        {
            let jrs = JSON.parse(e.target.responseText);
            modalError.style.display = 'block'
            modalError.innerText = e.target.status + ": " +jrs["detail"]
        }
    }, false);
    xmlHttp.addEventListener("error", (e) => {
        confirmButton.disabled = false
        confirmButton.classList.remove('disabled');
        modalError.style.display = 'block'
        modalError.innerText = "A network error happened."
    }, false);
    xmlHttp.addEventListener("abort", (e) => {
        confirmButton.disabled = false
        confirmButton.classList.remove('disabled');
        modalError.style.display = 'block'
        modalError.innerText = "The request has been aborted."
    }, false);
    xmlHttp.send(formData);
}

function createFolder(){
    const name = folderCreationInput.value
    if(!name){
        return
    }
    folderCreationInput.disabled = true
    folderCreationConfirmationButton.disabled = true
    folderCreationConfirmationButton.classList.add('disabled');
    let formData = new FormData();
    formData.append("name", folderCreationInput.value);
    formData.append("path",`${path}`);
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `${createFolderPath}`, true);
    xmlHttp.addEventListener("load", (e) => {
        folderCreationConfirmationButton.disabled = false;
        folderCreationConfirmationButton.classList.remove('disabled');
        folderCreationInput.disabled = false;
        if (e.target.status === 200){
            window.location.reload();
        }
        else if ([404, 502, 503, 504].includes(e.target.status))
        {
            alert("Unexpected Error, status code: " + e.target.status)
        }
        else
        {
            let jrs = JSON.parse(e.target.responseText);
            alert(e.target.status + ": " +jrs["detail"])
        }
    }, false);
    xmlHttp.addEventListener("error", (e) => {
        folderCreationConfirmationButton.disabled = false
        folderCreationConfirmationButton.classList.remove('disabled');
        folderCreationInput.disabled = false;
        alert("A network error happened.")
    }, false);
    xmlHttp.addEventListener("abort", (e) => {
        folderCreationConfirmationButton.disabled = false
        folderCreationConfirmationButton.classList.remove('disabled');
        folderCreationInput.disabled = false;
        alert("The request has been aborted.")
    }, false);
    xmlHttp.send(formData);
}
modalOverlay.style.display = 'flex';
document.getElementById("delete-button").addEventListener("click", promptDeleteEntities)
confirmButton.addEventListener("click", deleteEntities)

cancelButton.addEventListener("click", () => {
    modalOverlay.classList.remove("show");
    setTimeout(()=>{modalError.style.display = 'none';}, 500)
})


directoryContent.addEventListener("dragenter", (e) => {
    e.preventDefault()
    directoryContent.classList.add('on-drag');
})
directoryContent.addEventListener("dragover", (e) => {
    e.preventDefault()
    directoryContent.classList.add('on-drag');
})

directoryContent.addEventListener("dragleave", () => {
    directoryContent.classList.remove('on-drag');
})

directoryContent.addEventListener("drop", (e) => {
    e.preventDefault();
    directoryContent.classList.remove('on-drag');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type || f.size%4096 !== 0)
    if (files.length > 0){
        uploadFiles(files);
    }

});
abortButton.addEventListener("click", () => {
    if (xmlHttp){
        xmlHttp.abort();
    }
})
fileInput.addEventListener("change", (e) => {uploadFiles(fileInput.files)})

selectAllButton.addEventListener("click", selectAll)
createFolderButton.addEventListener("click", () => {
    if (folderCreationRow.style.display === 'none'){
        folderCreationRow.style.display = 'table-row';
    }
    else{
        folderCreationRow.style.display = 'none';
    }

})
folderCreationConfirmationButton.addEventListener("click", createFolder)
folderCreationInput.addEventListener("keyup", (e) => {
    if (e.key === 'Enter' || e.code === 13){
        createFolder();
    }
})
/*
folderCreationInput.addEventListener("input", () => {
    let entities = Array.from(document.querySelectorAll(".entity-checkbox")).map(e => e.dataset.entityName);
    if (entities.includes(folderCreationInput.value)){
        folderCreationInput.classList.add("text-red");
        folderCreationConfirmationButton.disabled = true;
        folderCreationConfirmationButton.classList.add('disabled');
        return
    }
    folderCreationInput.classList.remove("text-red");
    folderCreationConfirmationButton.disabled = false;
    folderCreationConfirmationButton.classList.remove('disabled');
})*/
window.onclick = function(event) {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove("show");
        setTimeout(()=>{modalError.style.display = 'none';}, 500)

    }
}
