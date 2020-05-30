const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const got = require('got');
const fs = require('fs');

async function run() {
    // set constants
    const url = 'https://raw.githubusercontent.com/dephell/dephell/master/install.py'
    const file_name = '.dephell_install.py'

    // get variables

    const env = core.getInput('dephell-env');
    console.log(github.context)
    if (!env) {
        core.setFailed("`dephell-env` is required")
    }
    console.log(`dephell-env: ${env}`);

    const python = core.getInput('python-version') || "python3";
    console.log(`python-version: ${python}`);

    const version = core.getInput('dephell-version');
    if (version) {
        console.log(`dephell-version: ${version}`);
    }

    const executable = 'python3'
    console.log(`python executable for dephell: ${executable}`);

    // download installation script
    const file = fs.createWriteStream(file_name)
    const response = await got(url);
    file.write(response.body)
    file.close()

    // run installation script
    let options = {
        silent: true,
        ignoreReturnCode: true,
    };
    let args = [file_name]
    if (version) {
        args.push('--version', version)
    }
    code = await exec.exec(executable, args, options)
    if (code) {
        core.setFailed("cannot execute installation script")
    }
    fs.unlinkSync(file_name)

    // in all comands below we don't suppress stdout
    // and don't fail on non-zero exit code
    options = {
        ignoreReturnCode: true,
    };

    // show dephell info
    code = await exec.exec('dephell', ['inspect', 'self'], options)
    if (code) {
        core.setFailed("cannot run dephell")
    }

    // create venv, install dependencies, run the command
    code = await exec.exec('dephell', ['venv', 'create', '--env', env, '--python', python], options)
    if (code) {
        core.setFailed("cannot create venv")
    }
    code = await exec.exec('dephell', ['deps', 'install', '--env', env, '--silent'], options)
    if (code) {
        core.setFailed("cannot install deps")
    }
    code = await exec.exec('dephell', ['venv', 'run', '--env', env], options)
    if (code) {
        core.setFailed("non-zero status code returned by the command")
    }
}

async function main() {
    try {
        run();
    } catch (error) {
        core.setFailed(error);
    }
}

main()
