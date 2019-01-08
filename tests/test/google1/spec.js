/**
 * Created by valeriu.jecov on 10/18/2018.
 * NOTE: THIS TEST IS NOT YET DONE
 */

const waitShort = 2000;
const waitLong = 5000;
const harness = require('../../../lib/harness');
const HarnessJson = require('../../../lib/harness-json');
const OneStop = require('../../../lib/OneStopApp-base');
// const expect = require('chai').expect;

//temp - so I can use driver. actions in the test here
// UcLaw.init(harness.init, waitShort, waitLong);
const driver = OneStop.getAttrs().driver;
//temp - so I can use driver. actions

// describe('user: ' + harness.getCommandLineArgs().role + ' / env - ' + harness.getCommandLineArgs().env +
//   ' / browserstack - ' + harness.getCommandLineArgs().browserStack, function () {
// 	let harnessObj = null;

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj = null;

	before(async () => {
		harnessObj = await harness.init();
		await OneStop.init(harnessObj, waitShort, waitLong);
		await OneStop.login();
	});

	after(async () => {
		await harnessObj.quit();
	});

	afterEach(async () => {
		await OneStop.afterEachTest(this.ctx.currentTest);
		// await OneStop.afterEachTest(this.ctx.currentTest.title);
		// await OneStop.afterEachTest(this.ctx.currentTest.state);
	});

	//reading json data files and preparing the required variables for later usage
	const dataJsonFilePath = require('path').join(__dirname, '/data/data.json');

	const newPageValues = new HarnessJson(dataJsonFilePath).getJsonData().createBasicPage;
	// OneStop.createBasicPage(newPageValues);

	describe('click Delete tab', () => {
		OneStop.clickOnTabByText('Delete', 'input[value="Delete"]');
	});

	describe('describe: a group of steps within the test2', () => {
		it('it: a step in the test2', async () => {

		});

		it('it: another step in the test2', async () => {

		});

		it('it: another step in the test2', async () => {

		});
	});
});
