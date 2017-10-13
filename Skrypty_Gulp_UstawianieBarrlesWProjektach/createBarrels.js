const config = require('./../../config');

module.exports = (gulp, args) => {
  'use strict';

    let filesystem = require("fs");
    let basePath = './../';

    gulp.task('createBarrels', () => {
        selectProjectToCreateBarrles()
        return;
    });

    function selectProjectToCreateBarrles() {

        if (config.barrels.createBarrels.length == 0) {
            filesystem.readdirSync(basePath).forEach(function (file) {
                if (config.barrels.exclude.indexOf(file) == -1) {
                    var indexArray = [];
                    createTsFile(basePath + file);
                    indexArray.push("");
                    //     Expand barells by every dir
                    //     indexArray = indexArray.concat(expandDirectory("", basePath + file));
                    addIndexToVS(basePath + file + '/' + file, indexArray);
                }
            });
        } else {
            config.barrels.createBarrels.forEach(function (file) {
                var indexArray = [];
                createTsFile(basePath + file);
                indexArray.push("");
                // Expand barells by every dir
                // indexArray = indexArray.concat(expandDirectory("", basePath + file));
                addIndexToVS(basePath + file + '/' + file, indexArray);
            });
        }
    }

    function createTsFile(dir) {

        filesystem.writeFileSync(dir + "/index.ts", "");
    }

    function addIndexToVS(dir, project) {

        let vsFile = filesystem.readFileSync(dir + ".csproj", "utf8");
        let wsk = vsFile.search("<TypeScriptCompile ")
        let message = "";
        let line = ""
        project.forEach(function (obj) {
            if (obj == "") line = '<TypeScriptCompile Include= "index.ts" />\r\n    ';
            else line = '<TypeScriptCompile Include="' + obj + '\\index.ts" />\r\n    ';

            if (vsFile.indexOf(line) == -1) message += line;
        });
        if (message != "") filesystem.writeFileSync(dir + '.csproj', vsFile.substr(0, wsk) + message + vsFile.substr(wsk), 'utf8');
    }
  
    function expandDirectory(dir, projectPath) {

        let amoundOfTsFiles = 0;
        let resoults = [];
        let files = filesystem.readdirSync(projectPath + dir);
        files.forEach(function (file) {
            if (filesystem.lstatSync(projectPath + dir + '/' + file).isDirectory()) {
                resoults = resoults.concat(expandDirectory(dir + '/' + file, projectPath));
            }
            if (filesystem.lstatSync(projectPath + dir + '/' + file).isFile()) {
                if (file.indexOf('.ts') > -1) {
                    amoundOfTsFiles++;
                }
            }
        });
        if (amoundOfTsFiles > 4) {
            if (dir != "") {
                createTsFile(projectPath + dir);
                if (dir[0] == "/") {
                    resoults.push(dir.slice(1).replace("/", "\\"));
                } else resoults.push(dir);
            }
        }
        return resoults;
    }
};

