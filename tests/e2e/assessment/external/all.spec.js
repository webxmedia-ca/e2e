/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../lib/harness');
const OneStop = require('../../../../lib/OneStopApp-assessment');

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

    OneStop.pagePreAssessmentDocumentationPrior(
        'internal',
        [
            {
                id: '10161',
                paths: [
                    require('path').join(__dirname, '/attachments/10161_Attachment1.pdf'),
                    'na-none available'
                ]
            }
        ]
    );

    OneStop.pagePreAssessmentDocumentationOnSite(
        'internal',
        [
            {
                id: '10161',
                acknowledgements: [
                    true,
                    true
                ]
            }
        ]
    );

    OneStop.pagePreAssessmentExternalReview('internal', true);
});
