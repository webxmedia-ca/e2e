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
    OneStop.pageGeneralActivityDetails(false, 'Water Approval', 'Excavation');

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

    // OneStop.pageAuthorizationWaterBody(false,
    //     'SURFACE WATER',
    //     [
    //         {name: 'elbow river'}
    //     ],
    //     'N');

    OneStop.pageAuthorizationAdditionalInformationExcavation(false,
        require('path').join(__dirname, '/attachments/Excavation.zip'),
        [
            {
                volume: 1,
                length: 1,
                width: 1,
                depth: 1,
                area: 1,
                slope: "1:1"
            }
        ],
        true,
        true,
        true,
        true,
        true,
        'otherDescription',
        true,
        true,
        'Y',
        [
            {
                eapaNumber: '123456',
                date: new harness.Moment().add(1, 'days').format('MM/DD/YYYY')
            }
        ]
    );

    OneStop.pageConfirmationValidationsRules(false);
    OneStop.pageConfirmationOverview(false, 'Application');
});

