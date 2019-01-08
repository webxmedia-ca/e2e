/**
 * Created by cb5rp on 10/12/2017.
 */

/* jshint -W024 */
/* jshint expr:true */
/* jshint laxcomma:true */

const testHarness = (function () {
    const {Builder, By, Key, until, webdriver} = require('selenium-webdriver');
    const fsextra = require('fs-extra')
        , expect = require('chai').expect
        , Moment = require('moment')
        , HarnessJson = require("./harness-json");

    let driver = null
        , env = null
        , role = null
        , appType = null
        , appSubType = null
        , browserClient = null
        , failureFatal = false
        , username = null
        , password = null
        , baseUrl = null
        , configJson = null
        , applicationsJson = null
        , profilePath = 'C:\\tmp\\profile-' + Math.random()
        , chromePluginPath = null
        , appId = null;

    const getCommandLineArgs = function () {
        const commandLineArgs = require('command-line-args');
        const commandLineOptionDefinitions = [
            {name: 'ui', type: String},
            {name: 'recursive', type: String},
            {name: 'timeout', type: Number},
            {name: 'slow', type: Number},
            {name: 'reporter', type: String},
            {name: 'env', type: String},
            {name: 'role', type: String},
            {name: 'appType', type: String},
            {name: 'appSubType', type: String},
            {name: 'browserClient', type: String},
            {name: 'username', type: String},
            {name: 'password', type: String},
            {name: 'failureFatal', type: String},
            {name: 'chromePluginPath', type: String}
        ];

        const options = commandLineArgs(commandLineOptionDefinitions);

        let errMsg = '';

        if (!options.env) errMsg = 'Please provide the --env argument';
        else if (!options.role) errMsg = 'Please provide the --role argument';
        else if (!options.appType) errMsg = 'Please provide the --appType argument';
        else if (!options.appSubType) errMsg = 'Please provide the --appSubType argument';
        else if (!options.browserClient) errMsg = 'Please provide the --browserClient argument';

        if (errMsg) {
            console.log('<<< ERROR: ' + errMsg + ' >>>');
            process.exit(1);
        }

        env = options.env;
        role = options.role;
        appType = options.appType;
        appSubType = options.appSubType;
        browserClient = options.browserClient;
        chromePluginPath = options.chromePluginPath;

        if (options.failureFatal){
            failureFatal = true;
        }

        if (options.username) {
            username = options.username;
        } else {
            //look up username if available
            if (env !== 'all') {
                const harnessJsonObj = new HarnessJson('./config/' + getEnv() + '.config.json');
                options.configJson = harnessJsonObj.getJsonData();
                options.username = harnessJsonObj.getJsonData()[role].credentials.username;
            }
        }

        if (options.password) {
            password = options.password;
        }

        return options;
    };

    const getBrowserClient = function getBrowserClient() {
        return browserClient;
    };

    const getEnv = function () {
        return env;
    };

    const getAppType = function () {
        return appType;
    };

    const getAppSubType = function () {
        return appSubType;
    };

    const getAppId = function () {
        return appId;
    };

    const takeScreenCapture = function (fileName) {
        driver.takeScreenshot().then(function (data) {
            const stream = require('fs').createWriteStream('./screen-caps/' + fileName);
            stream.write(new Buffer(data, 'base64'));
            stream.end();
            console.log('Screen capture saved: ' + fileName);
        });
    };

    function loadApplicationsJSON() {
        const appJsonObj = new HarnessJson('./config/' + getEnv() + '.applications.json');
        applicationsJson = appJsonObj.getJsonData();
    }

    function addApplication(appId) {
        console.log('Application ID: ' + appId);

        const maxResultsSize = 50;

        if (!applicationsJson.results) applicationsJson.results = [];

        applicationsJson.results.push({
            "appId": appId,
            "type": appType,
            "subType": appSubType,
            "date": Moment().format()
        });

        //maintain the max results size
        applicationsJson.results = applicationsJson.results.slice(-maxResultsSize);

        saveApplicationsJSON();
    }

    function saveApplicationsJSON() {
        // jsonFile.writeFileSync(this._jsonDataFilePath, applicationsJson);
        const appJsonObj = new HarnessJson('./config/' + getEnv() + '.applications.json');
        appJsonObj.saveJsonData(applicationsJson);
    }

    function getMostRecentApplication(type, subType, approved) {
        const result = applicationsJson.results.filter(function (obj) {
            return obj.type === type && obj.subType === subType && (approved ? obj.hasOwnProperty('license') : !obj.hasOwnProperty('license'));
        });

        if (result.length < 1) console.log('Error: No recent application found.');

        return result[result.length - 1];
    }

    function setAppLicenseNumber(searchType, searchSubType, licenseNumber) {
        const appId = getMostRecentApplication(searchType, searchSubType, false).appId;
        for (let i = 0, len = applicationsJson.results.length; i < len; i++) {
            if (applicationsJson.results[i].appId === appId) {
                applicationsJson.results[i].license = licenseNumber;
                i = len;
            }
        }
        saveApplicationsJSON();
    }

    const init = async () => {
        getCommandLineArgs();

        switch (getBrowserClient().toLowerCase()) {
            case 'chrome':
                let chrome = require('selenium-webdriver/chrome');
                const chromeOpts = {
                    'args': [
                        '--user-data-dir=' + profilePath,   // directory where the browser stores the user profile
                        '--disable-breakpad',               // disables error dumps
                        // '--disable-extensions',             // disables browser extensions
                        // '--disable-plugins',                // disables browser plugins
                        '--disable-infobars',               // disables the info bar at top of browser
                        '--disable-gpu',                    // disables gpu logs
                        '--disable-popup-blocking',          // disables popup blocking
                        // '--headless',                       // runs browser in headless mode
                        // '--window-size=800,600',            // sets the initial window size. provided as string in the format "800,600"
                        // '--window-position=1,1',            // specify the initial window position: --window-position=x,y
                        '--start-maximized',                // starts browser maximized
                        '--log-level=3'                     // sets the minimum log level. valid values are from 0 to 3: INFO = 0, WARNING = 1, LOG_ERROR = 2, LOG_FATAL = 3
                    ]
                };

                const chromeOptions = new chrome.Options();
                chromeOptions.addArguments(chromeOpts.args);

                if (chromePluginPath) {
                    chromePluginPath = __dirname + chromePluginPath;
                    console.log('adding chrome extension:', chromePluginPath);
                    const plugin = fsextra.readFileSync(chromePluginPath, {encoding: 'base64'});
                    chromeOptions.addExtensions(plugin);
                }

                driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

                driver.manage().deleteAllCookies();
                // driver.manage().window().setSize(1900, 1200);  // Sets browser window size

                break;
            default:
                console.log('Error: ' + getBrowserClient() + ' not configurable. Exiting.');
                process.exit(0);
        }

        if (getEnv() !== 'all') {
            const harnessJsonObj = new HarnessJson('./config/' + getEnv() + '.config.json');
            configJson = harnessJsonObj.getJsonData();
        }

        // load config details from json
        if (env !== 'all') {
            baseUrl = configJson.baseUrl;

            if (!username) username = configJson[role].credentials.username;
            if (!password) password = configJson[role].credentials.password;

            loadApplicationsJSON();
        }

        return {
            driver: driver
            , expect: expect
            , By: By
            , until: until
            , configJson: configJson
            , role: role
            , baseUrl: baseUrl
            , username: username
            , password: password
            , failureFatal: failureFatal
            , init: init
            , takeScreenCapture: takeScreenCapture
            , getEnv: getEnv
            , getAppType: getAppType
            , getAppSubType: getAppSubType
            , addApplicationToJSON: addApplication
            , getMostRecentApplication: getMostRecentApplication
            , setAppLicenseNumber: setAppLicenseNumber
            , quit: quit
            , getAppId: getAppId
        };
    };

    const closeWindow = function () {
        try {
            driver.sleep(2000);
            driver.close();
        } catch (err) {
            console.log("harness.close error", err);
        }
    };

    const quit = async () => {
        try {
            if (driver) {
                await closeWindow();
                await driver.sleep(1000);
                await driver.quit();

                const fs = require('fs-extra');
                await fs.remove(profilePath)
                    .then(function () {
                        console.log('cleanup profile: ' + profilePath);
                    })
                    .catch(function (err) {
                        console.log('cleanup profile error', err);
                    });

                await driver.sleep(1000);
            }
        } catch (err) {
            console.log("harness.quit error", err);
        }
    };

    return {
        init: init
        , getCommandLineArgs: getCommandLineArgs
        , getEnv: getEnv
        , getAppType: getAppType
        , getAppSubType: getAppSubType
        , Moment: Moment
        , HarnessJson: HarnessJson
    };
})();

module.exports = testHarness;
