/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../../lib/harness');
const OneStop = require('../../../../../lib/OneStopApp-assessment');

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

    OneStop.actionInitiateAssessment(
        '10161',
        'Detailed Operational Assessment(Primary)',
        'Oil Facility',
        'One-site Operational Assessment',
        'SuperUser All');

    OneStop.actionPreAssessmentContactsDates(
        new harness.Moment().add(3, 'weeks').format('MM/DD/YYYY'),
        new harness.Moment().add(4, 'weeks').format('MM/DD/YYYY'),
        new harness.Moment().add(2, 'weeks').format('MM/DD/YYYY'),
        [
            {
                firstName: 'Test',
                lastName: 'User',
                phone: '403 123-4567',
                email: 'test.user@aer.ca'
            },
            {
                firstName: 'Test2',
                lastName: 'User2',
                phone: '403 234-5678',
                email: 'test.user2@aer.ca'
            }
        ]
    );

    // OneStop.actionPreAssessmentRelatedAuthorizations(' ');
    OneStop.actionPreAssessmentDocumentationPrior(
        [
            '10161'
        ]
    );
    OneStop.actionPreAssessmentDocumentationOnSite(
        [
            '10161'
        ]);
    OneStop.actionPreAssessmentReview('test remarks',true);
});
