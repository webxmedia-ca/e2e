/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../lib/harness');
const OneStop = require('../../../../lib/OneStopApp-emmissions');
const HarnessJson = require('../../../../lib/harness-json');

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj;

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

    //reading json data files and preparing the required variables for later usage
    const dataJsonFilePath = require('path').join(__dirname, '/data/peaceRiverEmissions_ManualEntry_data.json');

    const peaceRiverEmissionsValues = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverEmissionsValues;
    OneStop.pageEmissionsReportingPeaceRiver(false, peaceRiverEmissionsValues);

    const peaceRiverEmissionsManualEntryDetailsValues =
        new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverEmissionsManualEntryDetailsValues;
    OneStop.pageManualEntryDetails(false, peaceRiverEmissionsManualEntryDetailsValues);

    // //------------ TESTING THE RULES - THIS PIECE OF CODE MIGHT NEED TO BE REVIEWED ---------------------------------
    ///// because those change dynamically and I could not figure out the way it does it - Michelle was busy too
    const peaceRiverValidationRules = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverValidationRules;
	//NOTE (data related):
	//  if "leakAddressedWithinRequiredTimeframe": "No" --> "ruleResults": "Additional Review"
	//  elseif "leakAddressedWithinRequiredTimeframe": "Yes" --> "ruleResults": "Baseline Review"
	OneStop.pageOverviewValidationsRules(peaceRiverValidationRules);

    const emissionsSubmissionData = new HarnessJson(dataJsonFilePath).getJsonData().emissionsSubmissionValues;
    OneStop.pageSubmitPeaceRiverEmissions(emissionsSubmissionData);

    OneStop.pageSubmissionEmissionsValidatePeaceRiverSubmission('under review', 'submitted');
});
