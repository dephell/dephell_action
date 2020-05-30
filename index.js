const core = require('@actions/core');
const exec = require('@actions/exec');
const request = require('request');
const fs = require('fs');

try {
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
    request.get(url).on('error', core.setFailed).pipe(file)
    file.close()
    await exec.exec('python', [file_name])
    fs.unlink(file_name)

    // show dephell info
    await exec.exec('dephell inspect self')

    // create venv, install dependencies, run the command
    await exec.exec('dephell', ['venv', 'create', '--env', env, '--python', python])
    await exec.exec('dephell', ['deps', 'install', '--env', env])
    await exec.exec('dephell', ['venv', 'run', '--env', env])
} catch (error) {
    core.setFailed(error.message);
}
