const asciiArt = `  ______ _ _      _    _ _           
 |  ____(_) |    | |  | (_)          
 | |__   _| | ___| |__| |___   _____ 
 |  __| | | |/ _ \\  __  | \\ \\ / / _ \\
 | |    | | |  __/ |  | | |\\ V /  __/
 |_|    |_|_|\\___|_|  |_|_| \\_/ \\___|`

const color = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
};

module.exports = {
    color,
    asciiArt
};
