const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
let dataToSave = '';
const command = os.type() === 'Windows_NT' 
    ? 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \' \' + $_.CPU + \' \' + $_.WorkingSet }"'
    : 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';

const execInterval = os.type() === 'Windows_NT' ? 500 : 100;

setInterval(() => {
    console.clear();
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        console.log(stdout);
        dataToSave = `${dataToSave}${(new Date).toUTCString()}:${stdout}`;
    });
}, execInterval);

setInterval(() => {
    fs.appendFile('activityMonitor.log', dataToSave, (err) => {
        if (err) throw err;
    });
    dataToSave = '';
}, 60000);
