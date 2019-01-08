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
        harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType + ' - ' + harness.Moment().format(),
        'N'
    );
    OneStop.pageGeneralProposedActivity(false, false, true, true, false, false, 'TRANSMISSION PIPELINE', null);
    OneStop.pageGeneralAdditionalInformation(false, 'N', 'N', 'N', 'N', 'N', 'N');
    OneStop.pageGeneralActivityDetails_PipelineLicense(false, "Pipeline", "New Construction - New License Number");

    OneStop.pageLicensingGeneralApplication(false, 'Y', 10.0, 'N', 1);
    OneStop.pageLicensingLineInstallation(
        false,
        require('path').join(__dirname, '/attachments/S01_Seg_Risk_1_1.zip'),
        'Steam',
        'Sour Natural Gas',
        '',
        10.6,
        require('path').join(__dirname, '/attachments/Pipeline_PS_Demo2.csv'),
        require('path').join(__dirname, '/attachments/Pipeline_PLS_Demo2.' + harness.getCommandLineArgs().env + '.csv'),
        require('path').join(__dirname, '/attachments/RightOfWay.pdf'),
        require('path').join(__dirname, '/attachments/PipelineLocation.pdf')
    );
    OneStop.pageLicensingTechnicalInformation(
        false,
        'Y',
        'Y',
        'Y',
        'Y',
	    'N',
        'N',
	    'N',
        '2',
        '2',
        require('path').join(__dirname, '/attachments/ProposedServiceAttachment.pdf')
    );

    OneStop.pageConfirmationValidationsRules(false);
    OneStop.pageConfirmationOverview(false, 'Application');
});
