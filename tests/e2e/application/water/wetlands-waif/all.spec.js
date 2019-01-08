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

    OneStop.pageGeneralContactInformation('automated tester', 'automated.tester@aer.ca');
    OneStop.pageGeneralApplicationInformation(false,
        'N',
        harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType + ' - ' +
        harness.Moment().format(),
        'N'
    );
	OneStop.pageGeneralProposedActivity(false, true, false, true, false, false, 'TRANSMISSION PIPELINE', null);
	
    OneStop.pageGeneralAdditionalInformation(false, 'N', 'N', 'N', 'N', 'N', 'N');
    OneStop.pageGeneralActivityDetails_WaterAuthorization(false, 'Water Approval', 'Wetlands');

    OneStop.pageAuthorizationGeneralApplication(
        false,
        require('path').join(__dirname, '/attachments/Water_Activity.zip'),
        null,
        '1',
        '1',
        'Not Required',
        require('path').join(__dirname, '/attachments/AdequacyDecisionDocument.pdf'),
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(1, 'months').format('MM/DD/YYYY'),
        'project description',
        require('path').join(__dirname, '/attachments/AuthorizationRelevantFile.pdf')
    );

    OneStop.pageAuthorizationAdditionalInformationWetlandsWaif(false,
        'WAIF - Oil Sands Exploration',
        require('path').join(__dirname, '/attachments/Wetland.zip'),
        new harness.Moment().subtract(1, 'days').format('MM/DD/YYYY'),
        require('path').join(__dirname, '/attachments/DesktopAssessment.pdf'),
        'waifAssessmentAuthenticator',
        'Professional Biologist',
        require('path').join(__dirname, '/attachments/WAIF_Template.csv'),
        5,
        'Compaction or Padding',
        'N',
        true,
        true,
        '1000',
        true,
        true,
        false,
        'N',
        'N',
        'N',
        'N',
        'N',
        true,
        true,
        'waifJustifyImpactsValue',
        'waifMinimizeAndReclaimValue',
        require('path').join(__dirname, '/attachments/WetlandReclaimationProposal.pdf'),
        require('path').join(__dirname, '/attachments/WetlandMinimizationProposal.pdf'),
        null,   //new harnessObj.Moment().add(1, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(2, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(3, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(4, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(5, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(6, 'days').format('MM/DD/YYYY'),
        ['jan','feb','mar']
    );

    OneStop.pageConfirmationValidationsRules(false);
    OneStop.pageConfirmationOverview(false, 'Application');
});
