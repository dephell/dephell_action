const core = require('@actions/core');
const exec = require('@actions/exec');
const https = require('https');
const fs = require('fs');

async function run() {
    // set constants
    const url = 'https://raw.githubusercontent.com/dephell/dephell/master/install.py'
    const file_name = '.dephell_install.py'

    // get variables
    const env = core.getInput('dephell-env');
    const python = core.getInput('python-version');
    console.log(`dephell-env: ${env}`);
    console.log(`python-version: ${python}`);

    // install dephell
    const file = fs.createWriteStream(file_name)
    https.get(url, (response) => response.pipe(file)).on('error', core.setFailed).end();
    file.close()
    code = await exec.exec('python3', [file_name])
    console.log(`install: ${code}`)
    if (code) {
        core.setFailed("cannot execute installation script")
    }
    fs.unlinkSync(file_name)

    // show dephell info
    code = await exec.exec('python3', ['-m', 'dephell', 'inspect', 'self'])
    console.log(`install: ${inspect}`)
    if (code) {
        core.setFailed("cannot run dephell")
    }

    // create venv, install dependencies, run the command
    code = await exec.exec('python3', ['-m', 'dephell', 'venv', 'create', '--env', env, '--python', python])
    if (code) {
        core.setFailed("cannot create venv")
    }
    code = await exec.exec('python3', ['-m', 'dephell', 'deps', 'install', '--env', env])
    if (code) {
        core.setFailed("cannot install deps")
    }
    code = await exec.exec('python3', ['-m', 'dephell', 'venv', 'run', '--env', env])
    if (code) {
        core.setFailed("non-zero status code returned by the command")
    }
}

try {
    run();
} catch (error) {
    core.setFailed(error);
}
