var shell = require("shelljs")
var path = require("path")

let pwd = shell.pwd()
shell.echo(`Running load_data.js from ${pwd}`)

// Get the location of secure_file_priv
let shellResult = shell.exec(
    "mysql -u root -p -e \"SHOW VARIABLES LIKE 'secure_file_priv';",
    { silent: true }
);
// user to acccess secure_file_priv location doesnt need to be root

if (shellResult.stdout == "") {
    console.log("Error: probably wrong pw")
    shell.exit(1)
    return
}

let outputLines = shellResult.stdout.split(/[\r\n]+/)
let locationStringArray = outputLines[1].split(/\t/)

if ((locationStringArray.length) != 2) {
    shell.echo("secure_file_priv location may be missing?")
    shell.echo("Please set it up")
    shell.exit(1)
}
let destFolder = locationStringArray[1]

if (destFolder === "") {
    shell.echo("secure_file_priv location is empty string \"")
    shell.exit(1)
    return
}

if (destFolder === "NULL") {
    shell.echo("secure_file_priv location NULL")
    shell.echo("Please set it up")
    shell.exit(1)
    return
}

// Check secure_file_priv location is valid directory
if (!shell.test('-d', destFolder)) {
    shell.echo("invalid dest directory")
    shell.exit(1)
    return
}







let args = process.argv.slice(2)

// Check for script file parameter
if (args.length == 0) {
    shell.echo("Missing parameter for sql script")
    shell.exit(1)
    return
}

let scriptLocation = args[0]
let sqlScript = shell.cat(scriptLocation).stdout
// console.log(`modifiedScript is ${modifiedScript}`)





// Grab csv file location from the script file
shellResult = shell.grep(/(load data infile).*"/, scriptLocation)
let dataToLoad = shellResult.stdout.split("load data infile")
dataToLoad.shift() // pop off empty string which stores what comes before the value to split on
// console.log(`loadDataInstructions is ${dataToLoad}`)
/*
    dataToLoad is a comma-separated string array.
    Its values may have newlines attached
    eg:
    ["./data/Hotels_v0.csv" into table hotel
    , "./data/Rooms_v0.csv" into table room
    ]
*/
// console.log(dataToLoad.length)


dataToLoad.forEach(element => {
    // console.log("["+element+"]")
    let csvLocation = element.trim().match(/".*"/)[0].replace(/"/g, "")
    sqlScript = processLoadInstruction(csvLocation, sqlScript)
});



/**
 * 
 * @param {string} csvLocation The original location of the csv file eg ./data/Hotels_v0.csv
 * @param {string} script The actual contents of the sql script
 */
function processLoadInstruction(csvLocation, script) {
    // console.log(csvLocation)


    // Check valid csv file location
    if (!shell.test('-f', csvLocation)) {
        shell.echo(`invalid src file ${csvLocation}`)
        shell.exit(1)
        return
    }
    // Copy csv file to secure_file_priv location
    shell.echo(`Attempting to copy ${csvLocation} to ${destFolder}`)
    let shellResult = shell.cp("-u", csvLocation, destFolder)
    // console.log(shellResult)

    // Make modified copy of sql script with the correct csv file data location
    let csvName = path.basename(csvLocation)
    console.log(csvName)

    let modifiedScript = script.replace(csvLocation,
        path.normalize(destFolder + csvName).replace(/\\/g, "/")
    )

    return modifiedScript
}

shell.echo("Running copy of modified script:")
shell.echo("-------------")
shellResult = shell.echo(sqlScript).exec("mysql -u root -p ")
// user is root bc needs FILE privileges

// console.log(shellResult)
if( shellResult.stderr){
    shell.echo("An error occurred")
    shell.exit(1)
    return    
}

shell.echo("It seems to have worked, but you'll have to check")
shell.exit(0)
return
