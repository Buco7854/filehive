function toHumanSize(size){
    const sizes = ["B", "KB", "MB", "GB", "TB"]

    if (size === 0) {
        return "O KB"
    }

    const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)))

    if (i === 0) {
        return size + " " + sizes[i]
    }

    return (size / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

function sortArrayOfDict(array, key){
   return array.sort(function(a, b) {
        const x = a[key];
        const y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })
}
// Sanitize a path, it does not add trailing slash because files might be provided.
function sanitizePath(currentPath){
    let sanitized = "/"
    if (currentPath && currentPath !== '/'){
        sanitized = "/" + currentPath.split('/').filter(c => c && c!== "..").join('/')
    }
    return sanitized
}
function isMatching(route,currentPath){
    const wildcardRegex = new RegExp(`^${sanitizePath(route["path"]).replace("*","")}`, 'gm')
    return (sanitizePath(route["path"].replace("*", "")) === sanitizePath(currentPath)
        ||
        (route["path"].endsWith("/*") && currentPath.match(wildcardRegex))
    )
}

function getPermissionsFor(config, currentPath, user){
    let permissions = null
    if (user){
        for (let r of sortArrayOfDict(config["routes_user_access"], "path").reverse()){
            if(r["user"] === user){
                if (isMatching(r, currentPath)){

                    permissions = {...r};
                    delete permissions["user"]
                    delete permissions["path"]
                    break;
                }

            }
        }
    }
    if (permissions === null){
        for (let r of sortArrayOfDict(config["routes_anonymous_access"], "path").reverse()){
            if (isMatching(r, currentPath)){
                permissions = {...r};
                delete permissions["path"]
                break;
            }
        }
    }
    if (permissions === null){
        permissions = {
            "autoindex": config["autoindex"],
            "upload": config["upload"],
            "show_hidden": config["show_hidden"]
        };
    }
    return permissions;
}

module.exports = {
    getPermissionsFor,
    toHumanSize,
    sortArrayOfDict,
    sanitizePath
}