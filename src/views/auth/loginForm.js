const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const usernameElement = document.getElementById("username-field");
const passwordElement = document.getElementById("password-field");
const passwordVisibilityIcon = document.getElementById("password-visibility-icon");
const passwordVisibilityButton = document.getElementById("password-visibility-button");
const persistentElement = document.getElementById("persistent-field");

// a cool way to do it from stack overflow https://stackoverflow.com/a/15724300
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function togglePasswordVisibility(){
    if (passwordElement.type === "password"){
        passwordElement.type = "text";
        passwordVisibilityIcon.src = `${staticPath}/icons/eye-slash-regular.svg`;

    }
    else{
        passwordElement.type = "password";
        passwordVisibilityIcon.src = `${staticPath}/icons/eye-regular.svg`;
    }
}

function changeButtonState(enable){
    if (enable){
        loginButton.disabled = false;
        loginButton.innerHTML = 'Login'
        loginButton.classList.remove('disabled');
    }
    else{
        loginButton.disabled = true;
        loginButton.classList.add('disabled');
        loginButton.innerHTML = `<img class="spin" src="${staticPath}/icons/spinner-solid.svg" alt="" height="30px" width="30px"/>`;
    }
}

function completeHandler(event)
{
    changeButtonState(true)
    if (event.target.status === 200){
        const lastVisited = getCookie("lastVisited")
        const redirect = decodeURIComponent(lastVisited) || "/"
        window.location.replace(redirect)
    }
    else if ([400, 409, 401, 403, 429].includes(event.target.status))
    {
        let jrs=JSON.parse(event.target.responseText);
        loginErrorMsg.style.display='unset'
        loginErrorMsg.innerText = jrs["detail"];
    }
    else
    {
        loginErrorMsg.style.display='unset';
        loginErrorMsg.innerText = "Sorry an unexcpected error occured, status code: "+event.target.status;
    }
}

function errorHandler() {
    changeButtonState(true)
    loginErrorMsg.style.display = 'unset';
    loginErrorMsg.innerText = "A network error occured or the request has been aborted."
}

function handleSubmit(e) {
    e.preventDefault();
    let req = new XMLHttpRequest();
    let formData = {
        "username": usernameElement.value,
        "password": passwordElement.value,
        "persistent": persistentElement.checked,
    }
    req.addEventListener("load", completeHandler, false);
    req.addEventListener("error", errorHandler, false);
    req.addEventListener("abort", errorHandler, false);
    req.open("POST", formUrl);
    req.setRequestHeader("Content-Type","application/json")
    req.send(JSON.stringify(formData));
    changeButtonState(false)
    return false;
}

loginForm.addEventListener("submit", handleSubmit);
passwordVisibilityButton.addEventListener("click", togglePasswordVisibility);