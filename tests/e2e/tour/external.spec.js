/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../lib/harness');
const OneStop = require('../../../lib/OneStopApp-tour');

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

    OneStop.pageTourSubmission(
        ['preset', 'fracturing', 'downholeAbandon'],
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(2, 'months').format('MM/DD/YYYY'),
        [
            require('path').join(__dirname, '/attachments/Attachment1.pdf'),
            require('path').join(__dirname, '/attachments/Attachment2.pdf')
        ]
    );

	OneStop.pageTourSubmissionAmend(
		[
			require('path').join(__dirname, '/attachments/Attachment3.pdf'),
			require('path').join(__dirname, '/attachments/Attachment4.pdf')
		]
	);
});
