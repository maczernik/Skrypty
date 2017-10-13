const config = require('./../../config');

module.exports = (gulp, args) => {
  'use strict';

    let filesystem = require("fs");
    let basePath = './../';
    let dirs = [];
    let dirFiles = [];
    let imports = [];
    let projectName = "";
    let notSegregate = [];

    gulp.task('setBarrels', () => {
        selectProjectToCreateBarrles();
        return;
    });

    function selectProjectToCreateBarrles() {

        if (config.barrels.createBarrels.length == 0) {
            filesystem.readdirSync(basePath).forEach(function (file) {
                if (config.barrels.exclude.indexOf(file) == -1) {
                    var indexPathArray = [];
                    indexPathArray.push("");
                    indexPathArray = indexPathArray.concat(expandDirectorySearchIndexPath("", basePath + file));
                    indexPathArray.forEach(function (obj) {
                        dirs = [];
                        dirFiles = [];
                        notSegregate = [];
                        projectName = file;
                        setBarrel(basePath + file + obj);
                    });
                }
            });
        } else {
            config.barrels.createBarrels.forEach(function (file) {
                var indexPathArray = [];
                indexPathArray.push("");
                indexPathArray = indexPathArray.concat(expandDirectorySearchIndexPath("", basePath + file));
                indexPathArray.forEach(function (obj) {
                    dirs = [];
                    notSegregate = [];
                    dirFiles = [];
                    projectName = file;
                    setBarrel(basePath + file + obj);
                });

            });
        }
    }

    function expandDirectorySearchIndexPath(dir, projectPath) {

        let resoults = []
        let files = filesystem.readdirSync(projectPath + dir);
        files.forEach(function (file) {
            if (filesystem.lstatSync(projectPath + dir + '/' + file).isDirectory()) {
                resoults = resoults.concat(expandDirectorySearchIndexPath(dir + '/' + file, projectPath));
            }
            if (filesystem.lstatSync(projectPath + dir + '/' + file).isFile()) {
                if (file == "index.ts") {
                    if (dir != "") {
                        resoults.push(dir);
                    }
                }
            }
        });
        return resoults;
    }

    function setBarrel(path) {
        // let importArray = [];
        let files = filesystem.readdirSync(path);
        files.forEach(function (file) {
            if (filesystem.lstatSync(path + '/' + file).isDirectory()) {
                expandChild(path, file);
            }
            if (filesystem.lstatSync(path + '/' + file).isFile()) {
                if (file != "index.ts") {
                    if (file.indexOf('.ts') > -1) {
                        if (isExportInFile(path + '/' + file)) {
                            addToDirFile(path, file);
                        } else {
                        }
                    }
                }
            }
        });
        let message = "";

        //# write file with no segregation

        //Segregate is not working corerectly
        //segregateByExtends();
        notSegregate.forEach(function (line) {
            line = line.replace(".ts", "");
            message += "export * from '" + line + "';\n";
        });
        filesystem.writeFileSync(path + "/index.ts", message);

    }
   
    function segregateByExtends() {

        let changedDirs = dirs.slice();
        let maxx = 0;
        for (let i = 0; i < notSegregate.length; i++) {
            let file = notSegregate[i].slice(notSegregate[i].lastIndexOf("/") + 1);
            let fileName = "A3dSixTexturesModel";
            let minPosition = -1;
            if (file.indexOf(fileName) != -1) console.log(fileName);
            if (imports[file] != undefined) {
                let changed = 0;
                let indexOfMainDir = getIndefOfDir(file);
                
                for (let k = 0; k < imports[file].length; k++) {
                    if (file.indexOf(fileName) != -1) console.log("gvdsfc");
                    let indexOfImportDir = getIndefOfDir(imports[file][k]);
                    if (file.indexOf(fileName) != -1) console.log(imports[file][k]);
                    if (file.indexOf(fileName) != -1) console.log("   : "+indexOfMainDir + "  :  " + indexOfImportDir);
                    if (indexOfImportDir == -1) {
                        continue;
                    }
                    if (indexOfMainDir == -1) {
                        continue;
                    }
                    if (indexOfMainDir == indexOfImportDir) {
                    }
                    if (indexOfMainDir < indexOfImportDir) {
                        if (file.indexOf(fileName) != -1) console.log("    ::"+indexOfImportDir +"--"+ minPosition);
                        if (indexOfImportDir > minPosition) minPosition = indexOfImportDir;
                    }
                }
                if (minPosition != -1) {
                    let tmp = notSegregate[indexOfMainDir];
                    notSegregate.splice(indexOfMainDir, 1);
                    notSegregate.splice(minPosition, 0, tmp);
                    minPosition = -1;
                }
                
            }
            maxx++;
            if (maxx == 2000) {
                break;
            }
        }
    }

    function getIndefOfDir(file) {

        for (let i = 0; i < notSegregate.length; i++) {
            let cfile = notSegregate[i].slice(notSegregate[i].lastIndexOf("./") + 2).toLowerCase();
            if (cfile.indexOf("/"+file.toLowerCase()) != -1) {
                //console.log("    " + cfile);
                return i;
            }
        }
        return -1;
    }
  
    function expandChild(project, path) {

        let fullPath = project + "/" + path;
        let files = filesystem.readdirSync(fullPath);
        if (files.indexOf("index.ts") == -1) {
            files.forEach(function (file) {
                if (filesystem.lstatSync(fullPath + '/' + file).isDirectory()) {
                    expandChild(project, path + "/" + file);
                }
                if (filesystem.lstatSync(fullPath + '/' + file).isFile()) {
                    if (file.indexOf('.ts') > -1) {
                        if (isExportInFile(fullPath + '/' + file)) {
                            addToDirFile(project + "/" + path, file);
                        }
                    }
                }
            });
        } else {
        }
    }

    function isExportInFile(path) {

        let vsFile = filesystem.readFileSync(path, "utf8");
        let wskExport = vsFile.indexOf("export");
        while (wskExport != -1) {
            if (wskExport != -1) {
                let stringBeforExport = vsFile.substring(0, wskExport);
                let wskOfLine = stringBeforExport.lastIndexOf("\n");
                let wskOfLineComment = stringBeforExport.lastIndexOf("//");
                if (wskOfLineComment > wskOfLine) {
                    vsFile = vsFile.substring(wskExport + 6);
                    wskExport = vsFile.indexOf("export");
                } else {
                    return true;
                }
            }
        }
        return false;

    }

    function addToDirFile(path, file) {

        let wsk = path.lastIndexOf("./");
        let clearPath = path;
        if (wsk != -1) {
            clearPath = path.slice(wsk + 2);
            if (clearPath.indexOf(projectName + "/") != -1) {
                clearPath = clearPath.replace(projectName + "/", "");
            }
            if (clearPath.indexOf(projectName) != -1) {
                clearPath = clearPath.replace(projectName, "");
            }
        }
        if (dirFiles[clearPath] == undefined) {
            dirFiles[clearPath] = new Array;
            dirFiles[clearPath].push(file);
            dirs.push(clearPath);
            notSegregate.push(path + "/" + file);
            addimports(path + "/" + file, file);
        } else {
            dirFiles[clearPath].push(file);
            addimports(path + "/" + file, file);
            notSegregate.push(path + "/" + file);
        }
    };

    function addimports(path, file) {

        if (imports[file] == undefined) {
            imports[file] = new Array;
        }
        let readline = require('readline');
        let vsFile = filesystem.readFileSync(path, "utf8");
        vsFile = vsFile.replace(/\ /g, "");
        let pointOfClass = vsFile.indexOf("import");
        let pointOfExport = vsFile.indexOf("export");
        while (pointOfClass != -1) {
            let beginOfPath = vsFile.indexOf("'", pointOfClass + 5);
            let endOfPath = vsFile.indexOf("'", beginOfPath + 1);
            if (pointOfClass != -1) {
                let line = vsFile.slice(beginOfPath, endOfPath).replace(/\ /g, "");
                let pointOfLast = line.lastIndexOf("./");
                if (pointOfLast != -1) {
                    let className = line.slice(pointOfLast + 2, endOfPath);
                    imports[file].push(className + ".ts");
                }
            }
            pointOfClass = vsFile.indexOf("import", pointOfClass + 5);
            if (pointOfExport < pointOfClass) {
                break;
            }
        }
    }
};

