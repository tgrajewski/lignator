'use strict';


const fs = require('fs');
const path = require('path');


function _readdir(dir) {
    var warn = false;
    while (true)
        try {
            return fs.readdirSync(dir, {'withFileTypes': true});
        } catch (e) {
            if (e.code === 'ENOENT')
                return [];
            if (e.code === 'EPERM')
                fs.chmodSync(dir, 0o777);

            if (!warn && lignator.log) {
                if (lignator.log === log)
                    lignator.log(`Waiting for '${dir}' to be scanned`);
                else
                    lignator.log(dir, e);
                warn = true;
            }
        }
}

function _rmdir(dir) {
    var warn = false;
    while (true)
        try {
            fs.rmdirSync(dir);
            return 1;
        } catch (e) {
            if (e.code === 'ENOENT')
                return 0;
            if (e.code === 'EPERM')
                fs.chmodSync(dir, 0o777);

            if (!warn && lignator.log) {
                if (lignator.log === log)
                    lignator.log(`Waiting for '${dir}' to be removed`);
                else
                    lignator.log(dir, e);
                warn = true;
            }
        }
}


function remove(root, removeRoot=true) {
    var files = _readdir(root);
    var lastWarn = -1;
    var count = 0;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var name = path.join(root, file.name);
        if (file.isDirectory())
            count += remove(name, true);
        else
            try {
                fs.unlinkSync(name);
                count += 1;
            } catch (e) {
                if (e.code === 'ENOENT')
                    continue;
                if (e.code === 'EPERM')
                    fs.chmodSync(name, 0o777);

                if (i !== lastWarn && lignator.log) {
                    if (lignator.log === log)
                        lignator.log(`Waiting for '${name}' to be removed`);
                    else
                        lignator.log(name, e);
                    lastWarn = i;
                }
                i -= 1;
            }
    }

    if (removeRoot)
        count += _rmdir(root);

    return count;
}


const log = console.log.bind(console);
const lignator = {
    'remove': remove,
    'log': log
};


module.exports = lignator;
