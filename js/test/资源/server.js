const server = require('express');
const app = server();
const fs = require('fs');
const _ = require('lodash');
const cp = require('child_process');
let fileList = fs.readdirSync(__dirname);
let buildName;
for (let i = fileList.length; i--; i >= 0) {
    if (fileList[i].indexOf('build') !== -1 && fileList[i].indexOf('zip') == -1) {
        buildName = fileList[i];
        break;
    } else {
        continue;
    }
}

if (!buildName) {
    cp.execSync('node scripts/build.js');
    // cp.spawnSync('node scripts/build.js');
    let fileList = fs.readdirSync(__dirname);
    for (let i = fileList.length; i--; i >= 0) {
        if (fileList[i].indexOf('build') !== -1 && fileList[i].indexOf('zip') == -1) {
            buildName = fileList[i];
            break;
        } else {
            continue;
        }
    }
}

app.use('/iser-web', server.static(__dirname + '/' + buildName));
app.use(server.static(__dirname));
app.get('/', (req, res) => {
    res.redirect('/sso.html')
})
app.listen(7170, () => {
    console.log('server start at 7170,buildName: ', __dirname+'/'+buildName)
});
