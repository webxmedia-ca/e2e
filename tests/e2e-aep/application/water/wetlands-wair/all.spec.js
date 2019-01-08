/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../../lib/harness');
const OneStop = require('../../../../../lib/OneStop-AEP/external');

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj = null;

    before(async () => {
        harnessObj = await harness.init();
        await OneStop.init(harnessObj, waitShort, waitLong);
        await OneStop.loginAep(harness.getCommandLineArgs().env, 'external');
    });

    after(async () => {
        await harnessObj.quit();
    });

    afterEach(async () => {
        await OneStop.afterEachTest(this.ctx.currentTest);
    });

    OneStop.pageGeneralContactInformation('automated tester', 'automated.tester@aer.ca');
    OneStop.pageGeneralActivityDetails(false, 'Water Approval', 'Wetlands');

    OneStop.pageAuthorizationGeneralApplication(
        false,
        require('path').join(__dirname, '/attachments/Water_Activity.zip'),
        true,
        false,
        'N',
        '1',
        '1',
        'Not Required',
        require('path').join(__dirname, '/attachments/AdequacyDecisionDocument.pdf'),
        'N',
        'N',
        'N',
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(5, 'years').add(2, 'days').format('MM/DD/YYYY'),
        'project description',
        require('path').join(__dirname, '/attachments/AuthorizationRelevantFile.pdf')
    );

    OneStop.pageAuthorizationAdditionalInformationWetlandsWair(
        false,
        'WAIR',
        require('path').join(__dirname, '/attachments/Wetland.zip'),
        'Y',
        require('path').join(__dirname, '/attachments/OwnershipDecision.pdf'),
        'Y',
        require('path').join(__dirname, '/attachments/AbwretaResults.pdf'),
        new harness.Moment().subtract(1, 'days').format('MM/DD/YYYY'),
        require('path').join(__dirname, '/attachments/FieldAssessmentDocument.pdf'),
        [
            {
                name: 'authenticating professional',
                employer: 'professional employer',
                designation: 'Professional Biologist'
            }
        ],
        require('path').join(__dirname, '/attachments/WAIR_Template.csv'),
        true,
        true,
        true,
        'waifMinimizeAndReclaim',
        require('path').join(__dirname, '/attachments/WairInLieuFee.pdf'),
        require('path').join(__dirname, '/attachments/WairPermitteeResponsible.pdf'),
        require('path').join(__dirname, '/attachments/WairWetlandReclamation.pdf'),
        [
            {
                RWVAU: '5',
                replacementArea: '1',
                replacementRate: '1.5',
                replacementCost: '1.5'
            },
            {
                RWVAU: '12',
                replacementArea: '2',
                replacementRate: '2.5',
                replacementCost: '5'
            }
        ],
        new harness.Moment().add(2, 'months').format('MM/DD/YYYY'),
        new harness.Moment().add(2, 'months').add(1, 'days').format('MM/DD/YYYY'),
        ['JAN', 'FEB', 'MAR']
    );

    OneStop.pageConfirmationValidationsRules(false);
    OneStop.pageConfirmationOverview(false, 'Application');
});

