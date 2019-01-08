/**
 * Created by cb7yb on 5/10/2018.
 * Preconditions:
 * - npm run e2e-aep:application:water-wetlands-waif -- --env=dev-aep
 * Then:
 * - npm run e2e-aep:internal:water-wetlands-waif -- --env=dev-aep
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../../lib/harness');
const OneStop = require('../../../../../lib/OneStopApp-internal');

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj = null;

    before(async () => {
        harnessObj = await harness.init();
        configJson = harnessObj.configJson;
        driver = harnessObj.driver;
        await OneStop.init(harnessObj, waitShort, waitLong);
        await OneStop.loginAep(harness.getCommandLineArgs().env, 'internal');
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
        require('path').join(__dirname, '/attachments/SIRAttachment.pdf'),
        true
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