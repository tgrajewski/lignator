'use strict';


const fs = require('fs');
const path = require('path');


function _readdir(dir) {
    var warn = !!lignator.log;
    while (true)
        try {
            return fs.readdirSync(dir, {'withFileTypes': true});
        } catch (e) {
            if (e.code === 'ENOENT')
                return [];
            if (e.code === 'EPERM')
                fs.chmodSync(dir, 0o777);

            if (warn) {
                if (lignator.log === log)
                    lignator.log(`Waiting for '${dir}' to be scanned`);
                else
                    lignator.log(dir, e);
                warn = false;
            }
        }
}


function _unlink(name) {
    var warn = !!lignator.log;
    while (true)
        try {
            fs.unlinkSync(name);
            return 1;
        } catch (e) {
            if (e.code === 'ENOENT')
                return 0;
            if (e.code === 'EPERM')
                fs.chmodSync(name, 0o777);

            if (warn) {
                if (lignator.log === log)
                    lignator.log(`Waiting for '${name}' to be removed`);
                else
                    lignator.log(name, e);
                warn = false;
            }
        }
}


function _rmdir(dir) {
    var warn = !!lignator.log;
    while (true)
        try {
            fs.rmdirSync(dir);
            return 1;
        } catch (e) {
            if (e.code === 'ENOENT')
                return 0;
            if (e.code === 'EPERM')
                fs.chmodSync(dir, 0o777);

            if (warn) {
                if (lignator.log === log)
                    lignator.log(`Waiting for '${dir}' to be removed`);
                else
                    lignator.log(dir, e);
                warn = false;
            }
        }
}


function list(root, includeRoot=true) {
    var names = [];
    var files = _readdir(root);
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var name = path.resolve(root, file.name);
        if (file.isDirectory())
            names = names.concat(list(name, false), name + path.sep);
        else
            names.push(name);
    }

    if (includeRoot)
        names.push(path.resolve(root + path.sep));

    return names;
}


function remove(root, removeRoot=true) {
    var files = _readdir(root);
    var count = 0;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var name = path.join(root, file.name);
        if (file.isDirectory())
            count += remove(name, true);
        else
            count += _unlink(name);
    }

    if (removeRoot)
        count += _rmdir(root);

    return count;
}


const log = console.log.bind(console);
const lignator = {
    'list': list,
    'remove': remove,
    'log': log
};


module.exports = lignator;
