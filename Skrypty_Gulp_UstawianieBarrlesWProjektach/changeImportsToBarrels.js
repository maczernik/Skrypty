const config = require('./../../config');


module.exports = (gulp, args) => {
  'use strict';

    let filesystem = require("fs");
    let basePath = './../';
    let projectNames = [];

    gulp.task('changeImportsToBarrels', () => {

        getNamesOfBarreledProjects(basePath);
        changeImportsInSelectedProject(basePath);

        return;
    });

    function getNamesOfBarreledProjects(basePath) {

        if (config.barrels.createBarrels.length == 0) {
            filesystem.readdirSync(basePath).forEach(function (file) {
                if (config.barrels.exclude.indexOf(file) == -1) {
                    projectNames.push(file);
                }
            });
        } else {
            projectNames = config.barrels.createBarrels;
        }
    }

    function changeImportsInSelectedProject(basePath) {

        if (config.barrels.include.length == 0) {
            filesystem.readdirSync(basePath).forEach(function (file) {
                if (config.barrels.exclude.indexOf(file) == -1) {
                    expandSolutionProject(basePath + file, 1, file);
                }
            });
        } else {
            config.barrels.include.forEach(function (file) {
                expandSolutionProject(basePath + file, 1, file);
            });
        }
    }

    // Expand solution project and launches changeSolutionImports() for each .ts file
    function expandSolutionProject(path, dirLevel, executedProjectName) {

        dirLevel += 1;
        let files = filesystem.readdirSync(path);
        files.forEach(function (file) {
            if (filesystem.lstatSync(path + "/" + file).isDirectory()) {
                expandSolutionProject(path + "/" + file, dirLevel, executedProjectName);
            }
            if (filesystem.lstatSync(path + '/' + file).isFile()) {
                if (file.indexOf('.ts') > -1) {
                    //Action for single .ts file!!
                    changeSolutionImports(path + "/" + file, dirLevel, executedProjectName)
                }
            }
        });
    }

    //Change impports with source path to imports from barrels. Used Import in removed from file
    //New imports are added  under last '///<reference..' or on begin of file.
    //Barrels are created for imports from this same projects and for each other project.
    function changeSolutionImports(path, dirLevel, executedProjectName) {

        //if (path.indexOf("Models3D") != -1) {
        let readline = require('readline');
        let fileLinesContent = [];
        let imports = [];
        let expanded = [];
        let message = "";
        let fileWasChanged = 0;
        let rl = readline.createInterface({
            input: filesystem.createReadStream(path)
        });
        rl.on('line', function (line) {
            //Create table from file content
            fileLinesContent.push(line);
        }).on('close', function () {
            let lastIndexOfReff = -1;

            //Search ///<reference...
            for (let i = 0; i < fileLinesContent.length; i++) {
                let line = fileLinesContent[i];
                if (line.indexOf("<reference path") != -1) {
                    lastIndexOfReff = i;
                }
                if (line.indexOf("import") != -1) {
                    break;
                }
            }

            //Check expands, expands class should be imported befor base class. Imports not changed
            for (let i = 0; i < fileLinesContent.length; i++) {
                let line = fileLinesContent[i];
                let pointOfBegin = line.indexOf("extends");
                if (pointOfBegin != -1) {
                    pointOfBegin += 7;
                    let pointOfClose = line.indexOf("implements", pointOfBegin);

                    if (pointOfClose == -1) {
                        pointOfClose = line.indexOf("}", pointOfBegin);
                    }

                    let message = line.slice(pointOfBegin, pointOfClose).replace(/\ /g, "");
                    pointOfClose = message.indexOf("<");

                    if (pointOfClose != -1) {
                        message = message.slice(0, pointOfClose).replace(/\ /g, "");
                    }

                    expanded.push(message);
                }
            }
            //Check base barrel and search base imports. 

            //#region Change imports to files in this same project. Not working corectly, imports in files should be imported befor import of this file in barrel.
            if (projectNames.indexOf(executedProjectName) != -1) {
                if (fileLinesContent.indexOf("//Barrel.v1.00 Base") == -1) {
                    imports = getBaseImportsFromFile(fileLinesContent, dirLevel, expanded);
                    //Add base barrel import
                    if (imports.length != 0) {
                        setImportForBaseBarrel(fileLinesContent, imports, dirLevel, lastIndexOfReff);
                        fileWasChanged = 1;
                    }
                }
            }

            //check projects barrels and search imports
            projectNames.forEach(function (barrelName) {
                imports = [];
                if (fileLinesContent.indexOf("//Barrel.v1.00 " + barrelName) == -1) {
                    imports = getImportsFromSingleBarrel(fileLinesContent, dirLevel, barrelName, expanded);
                }
                //Add barrel import
                if (imports.length != 0) {
                    setImportForSingleBarrle(fileLinesContent, imports, dirLevel, barrelName, lastIndexOfReff);
                    fileWasChanged = 1;
                }
            });

            //Write to file
            if (fileWasChanged == 1) {
                message = "";
                for (let i = 0; i < fileLinesContent.length; i++) {
                    message += fileLinesContent[i] + "\n";
                }
                filesystem.writeFile(path, message, 'utf8');
            }
        });
    }
    // }

    function setImportForBaseBarrel(fileLinesContent, imports, dirLevel, lastIndexOfReff) {

        let wsk = -1;
        let message = "";
        message += "//Barrel.v1.00 Base\n";
        message += "import { \n" + "    ";
        let amoundOfLineContent = 0;
        for (let i = 0; i < imports.length; i++) {
            amoundOfLineContent += imports[i].length;
            if (amoundOfLineContent > 125) {
                message += imports[i] + ",\n" + "    ";;
                amoundOfLineContent = 0;
            } else {
                message += imports[i] + ",";
            }
        }
        let phase = "'./";
        for (let i = 1; i < dirLevel - 1; i++) {
            phase += "../";
        }
        message += "\n} from " + phase + "index';\n";
        if (lastIndexOfReff == -1) {
            fileLinesContent.unshift(message);
        } else {
            fileLinesContent.splice(lastIndexOfReff + 1, 0, message);
        }
    }

    function setImportForSingleBarrle(fileLinesContent, imports, dirLevel, barrelName, lastIndexOfReff) {

      let wsk = -1;
        let message = "";
        message += "//Barrel.v1.00 " + barrelName + "\n";
        message += "import { \n" + "    ";
        let amoundOfLineContent = 0;
        for (let i = 0; i < imports.length; i++) {
            amoundOfLineContent += imports[i].length;
            if (amoundOfLineContent > 125) {
                message += imports[i] + ",\n" + "    ";
                amoundOfLineContent = 0;
            } else {
                message += imports[i] + ",";
            }
        }
        let phase = "'./";
        for (let i = 1; i < dirLevel; i++) {
            phase += "../";
        }
        message += "\n} from " + phase + barrelName + "/index';\n";

        if (lastIndexOfReff == -1) {
            fileLinesContent.unshift(message);
        } else {
            fileLinesContent.splice(lastIndexOfReff + 1, 0, message);
        }
    }

    function getBaseImportsFromFile(fileLinesContent, dirLevel, expanded) {

        let imports = []
        for (let i = 0; i < fileLinesContent.length; i++) {
            let multiLine = 1;
            let line = fileLinesContent[i];
            if (line == undefined) break;
            if (fileLinesContent[i - 1] != undefined) {
                if (fileLinesContent[i - 1].indexOf("Barrel.v1.00") != -1) {
                    continue;
                }
            }
            if (line.indexOf("//") != -1) {
                if (line.indexOf("import") >= line.indexOf("//")) {
                    continue;
                }
            }
            if ((line.search("import") != -1) && ((line.search("from") != -1))) {
            } else if (line.search("import") != -1) {
                for (let j = 1; j < fileLinesContent.length; j++) {
                    line += fileLinesContent[i + j];
                    if (fileLinesContent[i + j] != undefined) {
                        multiLine += 1;
                        if (fileLinesContent[i + j].indexOf("from") != -1) {
                            break;
                        }
                    }
                }
            } else line = "";
            let phase = "'./";
            for (let j = 1; j < dirLevel; j++) {
                if (j != 0) {
                    let wsk = line.search(phase);
                    if (wsk != -1) {
                        wsk += phase.length;
                        if (line[wsk] != ".") {
                            let start = line.search("{");
                            let end = line.search("}");
                            if ((start != -1) && ((end != -1))) {
                                //if (expanded.indexOf(line.slice(start + 1, end).replace(/\ /g, "")) == -1) {
                                for (let k = 0 ; k < multiLine ; k++) {
                                    fileLinesContent.splice(i, 1);
                                }
                                i = i - multiLine;
                                imports.push(line.slice(start + 1, end).replace(/\ /g, ""));
                                break;
                                // }
                            }
                        }
                    }
                }
                phase += "../";
            }
        }
        return imports;
    }

    function getImportsFromSingleBarrel(fileLinesContent, dirLevel, barrelName, expanded) {

      let imports = []
        for (let i = 0; i <= fileLinesContent.length; i++) {
            let multiLine = 1;
            let line = fileLinesContent[i];
            if (line == undefined) {
                break;
            }

            if (fileLinesContent[i - 1] != undefined) {
                if (fileLinesContent[i - 1].indexOf("Barrel.v1.00") != -1) {
                    if (fileLinesContent[i - 1].indexOf("import") == -1) {
                        continue;
                    }
                }
            }
            if (line.indexOf("//") != -1) {
                if (line.indexOf("import") >= line.indexOf("//")) {
                    continue;
                }
            }

            if ((line.search("import") != -1) && ((line.search("from") != -1))) {

            } else if (line.search("import") != -1) {
                for (let j = 1; j < fileLinesContent.length; j++) {
                    line += fileLinesContent[i + j];
                    if (fileLinesContent[i + j] != undefined) {
                        multiLine += 1;
                        if (fileLinesContent[i + j].indexOf("from") != -1) {
                            break;
                        }
                    }
                }
            } else {
                continue;
            }
            let phase = "'./";
            let wsk = line.search("/" + barrelName + "/");
            if (wsk != -1) {
                let start = line.search("{");
                let end = line.search("}");
                if ((start != -1) && ((end != -1))) {
                    // if (expanded.indexOf(line.slice(start + 1, end).replace(/\ /g, "")) == -1) {
                    for (let k = 0 ; k < multiLine ; k++) {
                        fileLinesContent.splice(i, 1);
                    }
                    i = i - multiLine;
                    imports.push(line.slice(start + 1, end).replace(/\ /g, ""));
                    // }
                }
            }
        }
        return imports;
    }
};
