const core = require('@actions/core');
const exec = require('@actions/exec');
const got = require('got');
const fs = require('fs');

async function run() {
    // set constants
    const url = 'https://raw.githubusercontent.com/dephell/dephell/master/install.py'
    const file_name = '.dephell_install.py'

    // get variables
    const env = core.getInput('dephell-env');
    if (!env) {
        core.setFailed("`dephell-env` is required")
    }
    console.log(`dephell-env: ${env}`);
    const python = core.getInput('python-version');
    if (!env) {
        core.setFailed("`python-version` is required")
    }
    console.log(`python-version: ${python}`);

    // download installation script
    const file = fs.createWriteStream(file_name)
    const response = await got(url);
    file.write(response.body)
    file.close()

    // run installation script
    const options = {
        silent: true,
    };
    code = await exec.exec('python3', [file_name], options)
    if (code) {
        core.setFailed("cannot execute installation script")
    }
    fs.unlinkSync(file_name)

    // show dephell info
    code = await exec.exec('dephell', ['inspect', 'self'])
    if (code) {
        core.setFailed("cannot run dephell")
    }

    // create venv, install dependencies, run the command
    code = await exec.exec('dephell', ['venv', 'create', '--env', env, '--python', python])
    if (code) {
        core.setFailed("cannot create venv")
    }
    code = await exec.exec('dephell', ['deps', 'install', '--env', env])
    if (code) {
        core.setFailed("cannot install deps")
    }
    code = await exec.exec('dephell', ['venv', 'run', '--env', env])
    if (code) {
        core.setFailed("non-zero status code returned by the command")
    }
}

try {
    run();
} catch (error) {
    core.setFailed(error);
}
