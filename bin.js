#!/usr/bin/env node
'use strict';


const lignator = require('./lignator');


var help = false

var args = process.argv.slice(2).map(function(arg) {
    if (arg.match(/^(-+|\/)(h(elp)?|\?)$/))
        help = true;
    if (arg.startsWith('"') || arg.startsWith("'"))
        arg = arg.slice(1);
    if (arg.endsWith('"') || arg.endsWith("'"))
        arg = arg.slice(0, -1);
    return arg;
});

if (help || args.length === 0)
    console.log(`Usage: lignator-remove <path> [<path> ...]

    Deletes all files and folders at "path" recursively.

`);
else
    for (var i = 0; i < args.length; i++) {
        lignator.remove(args[i]);
    }
