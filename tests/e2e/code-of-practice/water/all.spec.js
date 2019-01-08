/**
 * Created by cb7yb on 05/14/2018.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../lib/harness');
const OneStop = require('../../../../lib/OneStopApp-external');

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
    });

	OneStop.pageWaterCodeOfPracticeSubmit(
		false,
		'COP (Water Act) - Outfall Structures on Water Bodies',
		1,
		[
			{
				quarterSection: 'North East',
				section: '06',
				township: '32',
				range: '25',
				meridian: '6'//'10W6'
			}
		],
		require('path').join(__dirname, '/attachments/CodeOfPracticeForm.pdf'),
		require('path').join(__dirname, '/attachments/LocationPlan.pdf'),
		require('path').join(__dirname, '/attachments/WAIF(Wetland)COP.pdf')
	);
});

