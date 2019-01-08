/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../../lib/harness');
const OneStop = require('../../../../../lib/OneStopApp-application');

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

    OneStop.pageGeneralContactInformation('automated tester', 'automated.tester@aer.ca', 'Yes');

    OneStop.pageGeneralApplicationInformation(false,
        'N',
        harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType + ' - ' +
        harness.Moment().format(),
        'N'
    );

	OneStop.pageGeneralProposedActivity(false, false, true, true, false, false, 'TRANSMISSION PIPELINE', null);
    
    OneStop.pageGeneralAdditionalInformation(false, 'N', 'N', 'N', 'N', 'N', 'N');

    OneStop.pageGeneralActivityDetails_WaterAuthorization(false, 'Water Approval', 'Reservoir');

    OneStop.pageAuthorizationGeneralApplication(
        false,
        require('path').join(__dirname, '/attachments/Water_Activity.zip'),
        'Y',
        null,
        '1',
        'Not Required',
        require('path').join(__dirname, '/attachments/AdequacyDecisionDocument.pdf'),
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(2, 'days').format('MM/DD/YYYY'),
        'project description',
        require('path').join(__dirname, '/attachments/AuthorizationRelevantFile.pdf')
    );
    OneStop.pageConfirmationValidationsRules(false);

    OneStop.pageConfirmationOverview(false, 'Application');

    // OneStop.actionVerifyBaselineLicensePDF(480000);
});
