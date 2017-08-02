var APP;


(function() {
    var PIDD = function() {};
    var exec, shellScript, isMac;
    exec = require('child_process').execSync;
    // alert(shellScript);

    isMac = process.platform === 'darwin';
    if (isMac) {
        // on Mac the extensions PID is CEPHtmlEngine Helper
        // it's PPID is CEPHtmlEngine
        // whose PPID is the host app
        shellScript = 'ps -o ppid= {{pid}}';
        PIDD.prototype.pid = ('' + exec(shellScript.replace(/{{pid}}/, exec(shellScript.replace(/{{pid}}/, process.pid))))).replace(/\n/, '');
        PIDD.prototype.restart = function() {
            var appPath, shellScript;
            appPath = decodeURI(window.__adobe_cep__.getSystemPath('hostApplication'));
            appPath = appPath.replace(/file:\/\//, '').replace(/Contents\/MacOS\/.+/, '');
            shellScript = 'kill -9 {{pid}}; sleep 1; open -n "{{appPath}}"'.replace(/{{pid}}/, PIDD.prototype.pid).replace(/{{appPath}}/, appPath);
            exec(shellScript);
            return;
        };
    } else { // is Windows
        // on windows the extensions PID is CEPHtmlEngine.exe
        // the extensions PPID is the host app (there is no CEPHtmlEngine.exe helper)
        shellScript = 'wmic process where (processid={{pid}}) get parentprocessid';
        PIDD.prototype.pid = ('' + exec(shellScript.replace(/{{pid}}/, process.pid))).replace(/\D/g, '');
        PIDD.prototype.restart = function() {
            var appPath, shellScript;
            appPath = decodeURI(window.__adobe_cep__.getSystemPath('hostApplication'));
            appPath = appPath.replace(/file:\/\/\//, '').replace(/Contents\/MacOS\/.+/, '');
            shellScript = 'Taskkill /PID {{pid}} /F | "{{appPath}}"'.replace(/{{pid}}/, PIDD.prototype.pid).replace(/{{appPath}}/, appPath);
            exec(shellScript);
            return;
        };
    }


    APP = new PIDD();
    return PIDD.prototype.pid;
})();