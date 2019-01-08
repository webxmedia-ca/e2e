/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../lib/harness');
const OneStop = require('../../../../lib/OneStopApp-base');
const HarnessJson = require('../../../../lib/harness-json');
const expect = require('chai').expect;

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj, configJson, driver;
    configJson = harness.getCommandLineArgs().configJson;

    before(async () => {
        harnessObj = await harness.init();
        driver = harnessObj.driver;
        await OneStop.init(harnessObj, waitShort, waitLong);
        await OneStop.login();
    });

    after(async () => {
        await harnessObj.quit();
    });

    afterEach(async () => {
        await OneStop.afterEachTest(this.ctx.currentTest);
    });

    describe('reports launch', () => {
	    describe('navigate to reports page', () => {
		    OneStop.clickRightSideTopLinks('a[data-event="show:tableau:home"]');//, 'body #primaryContent');
		
		    it('opens a new tab to correct url', async () => {
			    await driver.sleep(waitShort);
			    const handles = await driver.getAllWindowHandles();
                await driver.switchTo().window(handles[1]);
                const currentUrl = await driver.getCurrentUrl();
                const expectedUrl = configJson.tableauBaseExternalUrl +
					'/views/00-ReportMenu';//_1/ReportsMenu'; //this does not match PRD
                expect(currentUrl).to.contain(expectedUrl);
		    });
		
		    it('main menu does not display an error message', async () => {
			    const text = await OneStop.getElementValueByCSS('body');
                expect(text).to.not.contain('error occurred on the server');
		    });
	    });
	    
	    //reading json data files and preparing the required variables for later usage
	    const dataJsonFilePath = require('path').join(__dirname, '/data/data-' +
			harness.getCommandLineArgs().env + '.json');
	    const reportsArray = new HarnessJson(dataJsonFilePath).getJsonData().reportsLinks;

        for (let i = 0; i < reportsArray.length; i++) {
            OneStop.openReportDocuments(configJson.tableauBaseExternalUrl, reportsArray, i);
        }
    });
});
