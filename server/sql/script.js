
var shell = require("shelljs")
var readline = require("readline")
var path = require("path")
const sqlScriptLocation = ""

// https://stackoverflow.com/a/50890409
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}




async function main(){
    // process.argv.forEach(function (val, index, array) {
    //     console.log(index + ': ' + val);
    // });

    // console.log( process.argv[2])
    // console.log( process.argv[3])

    if( process.argv.length < 4){
        console.log("insufficient args")
        return
    }

    let command = process.argv[2]
    let db_version = process.argv[3]
    if(! /v\d+(\.\d+)?/.test(db_version)){
        console.log(`${db_version} is not a valid version format. Should be v<#>[.#] ie v0 or v0.1`)
        return
      }


    let shellResult

    await askQuestion("When you are prompted for a mysql password, please use the password for root user\nPress enter to proceed");

    switch(command){
        case 'build':
            shellResult = shell.exec(
                "mysql -u root -p < database_" + db_version + ".sql",
                { silent: true }
            );
            if (shellResult.stderr){
                console.log(shellResult.stderr)
            }
            else{
                console.log(shellResult.stdout)
            }
            break

        case 'load':
            shellResult = shell.exec(
                "node load_data.js load_data_" + db_version + ".sql",
                { silent: false }
            );
            if (shellResult.stderr){
                console.log(shellResult.stderr)
            }
            else{
                console.log(shellResult.stdout)
            }
            break

        case 'reset':
            // equivalent to build and load
            shellResult = shell.exec(
                "mysql -u root -p < database_" + db_version + ".sql",
                { silent: true }
            );
            if (shellResult.stderr){
                console.log(shellResult.stderr)
            }
            else{
                console.log(shellResult.stdout)
            }
            // load data into tables
            shellResult = shell.exec(
                "node load_data.js load_data_" + db_version + ".sql",
                { silent: true }
            );
            if (shellResult.stderr){
                console.log(shellResult.stderr)
            }
            else{
                console.log(shellResult.stdout)
            }
            break

        case 'clear':
            shellResult = shell.exec(
                "mysql -u root -p < empty_database_" + db_version + ".sql",
                { silent: true }
            );
            if (shellResult.stderr){
                console.log(shellResult.stderr)
            }
            else{
                console.log(shellResult.stdout)
            }
            break

        case 'delete':
    }
}

main()