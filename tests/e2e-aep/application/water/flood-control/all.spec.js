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
    OneStop.pageGeneralActivityDetails(false, 'Water Approval', 'Flood Control');

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

    OneStop.pageAuthorizationWaterBody(false,
        null,
        [
            {name: 'little elbow river'}
        ],
        'N'
    );

    OneStop.pageAuthorizationAdditionalInformationFloodControl(false,
        require('path').join(__dirname, '/attachments/Flood-Control.zip'),
        'Y',
        'A',
        'Y',
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        new harness.Moment().add(2, 'days').format('MM/DD/YYYY'),
        'Y',
        'Y',
        'Y',
        require('path').join(__dirname, '/attachments/AquaticEnvironmentImpact.pdf'),
        'Aquatic Environment Person',
        'Professional Biologist',
        [
            {
                length: '1',
                type: ['berms'],
                activity: "Groynes"
            },
        ],
        'Y',
        'Y',
        'Y',
        'Y',
        'N',
        require('path').join(__dirname, '/attachments/MitigationMeasuresDescription.pdf')
    );

    OneStop.pageConfirmationValidationsRules(false);
    OneStop.pageConfirmationOverview(false, 'Application');
});

