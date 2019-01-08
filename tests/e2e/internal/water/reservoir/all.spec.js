/**
 * Created by cb5rp on 5/26/2017.
 * Preconditions:
 * - npm run e2e:application:pipeline-additional -- --env=uat
 * - npm run e2e:internal:pipeline-additional -- --env=uat
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../../lib/harness');
const OneStop = require('../../../../../lib/OneStopApp-internal');
const HarnessJson = require('../../../../../lib/harness-json');

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

    OneStop.actionAssignLeadReviewer();

    OneStop.actionAssignDecisionMaker();

    OneStop.actionAddNewSIR(
        "testSubject",
        "testQuestion",
        "Clarification",
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'),
        "Yes",
        require('path').join(__dirname, '/attachments/SIRAttachment.pdf')
    );

    //reading json data files and preparing the required variables for later usage
    // const dataJsonFilePath = require('path').join(__dirname, '/data/data-' + harness.getCommandLineArgs().env + '.json');
    // const conditionsTabValues = new HarnessJson(dataJsonFilePath).getJsonData().sectionsConditionsValues;
    // OneStop.actionValidateConditionsTitlesMatchSectionValues(conditionsTabValues);

    OneStop.actionAssignReviewer('Technical', 'Technical - Automated test',
        new harness.Moment().add(1, 'days').format('MM/DD/YYYY'));

    OneStop.actionCompleteReview('Issue Certificate', 'Automated Test reviewer comments');

    OneStop.actionMakeFinalRecommendation('Approved', 'Automated Final Recommendation comments');

    OneStop.actionMakeFinalDecision('Approved', 'Automated Final Decision comments');

    OneStop.actionVerifyLicensePDF(60000);
});
