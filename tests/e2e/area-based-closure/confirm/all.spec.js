/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../lib/harness');
const OneStop = require('../../../../lib/OneStopApp-area-based-closure');

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
	
	OneStop.pageClosureSubmissionContactInformation(false, 'automated tester', 'automated.tester@aer.ca', 'Yes');
	
    OneStop.pageClosureSubmissionProjectInformationPart1(false, 'Y', 'AREA_BASED_CLOSURE_PROPOSED' );
    
    OneStop.pageClosureSubmissionProjectInformationPart2(
        false,
        require('path').join(__dirname, '/attachments/Shapefile.zip'),
        new harness.Moment().add(1, 'year').format('YYYY'),
        'Q2',
        harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType + ' - ' +
        new harness.Moment().format(),
        'Y',
        'Y',
        'Y',
        'Y',
        'Y',
        'Y',
        'Y',
        'Y'
    );

    OneStop.pageClosureSubmissionConfirmation(false);
});
