/**
 * Created by cb5rp on 5/26/2017.
 */

var OneStop = require('../../../../lib/OneStopApp');
// var Moment = require('moment');
var jsonfile = require('jsonfile');

var expect = require('chai').expect,
    test = require('selenium-webdriver/testing'),
    webDriver = require('selenium-webdriver');

// load the chromedriver
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var By = webDriver.By;
var until = webDriver.until;
var waitShort = 2000;
var waitLong = 5000;

OneStop.getCommandLineArgs();
var configJsonFilePath = './tests/config/' + OneStop.getEnv() + '.config.json';
var configJson = jsonfile.readFileSync(configJsonFilePath);

var jiraTicketNumber = 'TEST-74 - 001';

test.describe(jiraTicketNumber + ' - User can login - (' + OneStop.getEnv() + ') ' + configJson.baseUrl, function () {
    var driver;

    test.before(function (done) {
        driver = new webDriver.Builder()
            .withCapabilities(webDriver.Capabilities.chrome())
            .build();
        driver.manage().deleteAllCookies();

        OneStop.init(webDriver, driver, By, until, waitShort, waitLong, configJson);
        OneStop.login(done);
    });

    test.after(function () {
        driver.sleep(waitShort);
        driver.quit();
    });

    test.describe('login external user', function () {
        test.it('displays username', function (done) {
            driver.findElement(By.css('.navbar-right label')).then(function (element) {
                driver.wait(until.elementIsVisible(element), waitShort);
                element.getText().then(function (text) {
                    var displayName = text.slice(9, text.indexOf('!'));
                    expect(displayName).to.equal(OneStop.getDisplayName());
                    done();
                });
            });
        });

        test.it('does not display username', function (done) {
            driver.findElement(By.css('.navbar-right label')).then(function (element) {
                driver.wait(until.elementIsVisible(element), waitShort);
                element.getText().then(function (text) {
                    var displayName = text.slice(9, text.indexOf('!'));
                    expect(displayName).to.not.equal(OneStop.getDisplayName());
                    done();
                });
            });
        });
    });
});
