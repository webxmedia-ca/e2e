/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../../lib/harness');
const OneStop = require('../../../../../lib/OneStopApp-amendment');

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

    OneStop.pageGeneralContactInformation('automated tester', 'automated.tester@aer.ca');
    OneStop.pageGeneralApplicationInformation(false,
        'N',
        harness.getCommandLineArgs().appType + ':' +
        harness.getCommandLineArgs().appSubType + ' - ' +
        harness.Moment().format(),
        'N'
    );
    OneStop.pageGeneralProposedActivity(false, false, true, true, false, false, 'TRANSMISSION PIPELINE', 'PIPELINE');
    
    OneStop.pageGeneralAdditionalInformation(false, 'N', 'N', 'N', 'N', 'N', 'N');
    OneStop.pageGeneralLicenseInformation(false, 'application', harness.getCommandLineArgs().appSubType);

    OneStop.pageLicensingLicenceLevelChanges(false, 'N', 'N');
    OneStop.pageLicensingLineLevelChanges(false, harness.getCommandLineArgs().appType, null, 'LEVEL 1');
    OneStop.pageLicenseAmendmentTechnicalInformation(false, 'Y', null, null, 'Y', null, null, null, 100, 1, null);

    OneStop.pageConfirmationValidationsRules(false);
    OneStop.pageConfirmationOverview(false, 'Amendment');
});
