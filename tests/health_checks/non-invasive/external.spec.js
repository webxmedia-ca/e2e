/**
 * Created by cb5rp on 5/26/2017.
 */

// The following 2 lines prevent jshint from complaining about some assertion calls
/* jshint -W024 */
/* jshint expr:true */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../lib/harness');
const OneStop = require('../../../lib/OneStopApp-internal');

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj, driver, expect, By, until;

    before(async () => {
        harnessObj = await harness.init();

        driver = harnessObj.driver;
        expect = harnessObj.expect;
        By = harnessObj.By;
        until = harnessObj.until;
        
        await OneStop.init(harnessObj, waitShort, waitLong);
        await OneStop.login();
    });

    after(async () => {
        await harnessObj.quit();
    });

    afterEach(async () => {
        await OneStop.afterEachTest(this.ctx.currentTest);
    });

    describe('non-invasive checks', () => {
        it('logs in successfully', () => {
        });

        it('perform a search', async () => {
            await driver.sleep(waitShort);
            await OneStop.clickElementByCSS('a[data-event="show:workspace:search"]');
            await OneStop.waitForPageLoad(function(){});

            await OneStop.setSelectFieldValueByCSS('*[name="applicationIndustryStatusName"]', 'Approved');
            await OneStop.clickElementByCSS('.application-search');

            await OneStop.waitForPageLoad();

            await driver.findElements(By.css('.results-grid .string-cell'));
        });

        it('open a new application', async () => {
            await driver.get(harnessObj.baseUrl + '/#application');

            await OneStop.waitForPageLoad();

            await driver.wait(until.elementLocated(By.css('#contactInformationPanelHeading')), waitLong);
            await driver.findElement(By.css('#contactInformationPanelHeading'));
        });

        it('open map search', async () => {
            await driver.get(harnessObj.baseUrl + '/#pipeline/geocortex');

            await OneStop.waitForPageLoad();

            await driver.wait(until.elementLocated(By.css('.geocortex')), waitLong);
            await driver.findElement(By.css('.geocortex'));
        });
    });
});