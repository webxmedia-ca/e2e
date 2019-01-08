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

    OneStop.pageGeneralActivityDetails_WaterAuthorization(false, 'Water Approval', 'Dam Safety');

    OneStop.pageAuthorizationGeneralApplication(
        false,
        require('path').join(__dirname, '/attachments/Water_Activity.zip'),
        null,
        '1',
        '1',
        'Not Required',
        require('path').join(__dirname, '/attachments/AdequacyDecisionDocument.pdf'),
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(2, 'days').format('MM/DD/YYYY'),
        'project description',
        require('path').join(__dirname, '/attachments/AuthorizationRelevantFile.pdf')
    );

    OneStop.pageAuthorizationAdditionalInformationDamSafety(false,
        require('path').join(__dirname, '/attachments/Pond.zip'),
        '1',
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        require('path').join(__dirname, '/attachments/OMS.pdf'),
        new harness.Moment().add(2, 'days').format('MM/DD/YYYY'),
        require('path').join(__dirname, '/attachments/EPP.pdf'),
        new harness.Moment().add(3, 'days').format('MM/DD/YYYY'),
        require('path').join(__dirname, '/attachments/ERP.pdf'),
        'High',
        '1000',
        '1000',
        '30000',
        '30000',
        'Fresh Water',
        require('path').join(__dirname, '/attachments/Dam.zip'),
        [
            {
                'designReportDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'designReportFilePath': require('path').join(__dirname, '/attachments/DesignFile1.pdf'),
                'dsrDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'dsrFilePath': require('path').join(__dirname, '/attachments/DSR1.pdf'),
                'acprDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'acprFilePath': require('path').join(__dirname, '/attachments/ACPR1.pdf'),
                'maxHeight': '1',
                'damMaxCrestElevation': '1',
                'currentCrestElevation': '1',
                'constructionStartDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'constructionEndDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'firstFilingDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY')
            },
            {
                'designReportDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'designReportFilePath': require('path').join(__dirname, '/attachments/DesignFile2.pdf'),
                'dsrDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'dsrFilePath': require('path').join(__dirname, '/attachments/DSR2.pdf'),
                'acprDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'acprFilePath': require('path').join(__dirname, '/attachments/ACPR2.pdf'),
                'maxHeight': '1',
                'damMaxCrestElevation': '1',
                'currentCrestElevation': '1',
                'constructionStartDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'constructionEndDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'firstFilingDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY')
            },
            {
                'designReportDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'designReportFilePath': require('path').join(__dirname, '/attachments/DesignFile3.pdf'),
                'dsrDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'dsrFilePath': require('path').join(__dirname, '/attachments/DSR3.pdf'),
                'acprDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'acprFilePath': require('path').join(__dirname, '/attachments/ACPR3.pdf'),
                'maxHeight': '1',
                'damMaxCrestElevation': '1',
                'currentCrestElevation': '1',
                'constructionStartDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'constructionEndDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
                'firstFilingDate': new harness.Moment().add(1, 'days').format('MM/DD/YYYY')
            }
        ]
    );

    OneStop.pageConfirmationValidationsRules(false);
    OneStop.pageConfirmationOverview(false, 'Application');
});

