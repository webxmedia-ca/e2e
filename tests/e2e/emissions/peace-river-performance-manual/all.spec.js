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
	const dataJsonFilePath = require('path').join(__dirname, '/data/peaceRiverPerformance_ManualEntry_data.json');
	const peaceRiverEmissionsValues = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverEmissionsValues;
	
	OneStop.pageEmissionsReportingPeaceRiver(false, peaceRiverEmissionsValues);
	
	//var annualPerformanceValues = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverEmissionsManualEntryAnnualPerformanceValues[0].annualPerformanceValues;
	OneStop.pageManualEntryAnnualPerformance(false);
	
	//the function below is not yet done - the skeleton is built - needs to be finished by adding the functions
	OneStop.pageManualEntryRequirements(false, 'test');
	
	
	
	/*
	const peaceRiverValidationRules = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverValidationRules;
	const submissionReferenceId = OneStop.pageOverviewValidationsRules(peaceRiverValidationRules);
	
	// //------------ TESTING THE OUTPUT OF THE FUNCTION ABOVE --------------------------
	// describe('submission reference id existence', function (submissionReferenceId) {
	// 	it('submissionReferenceId', function (done) {
	// 		console.log('submissionReferenceId: ' + submissionReferenceId);
	// 		done();
	// 	});
	// });
	// //---------------------------------------------------------------------------------
	
	const emissionsSubmissionData = new HarnessJson(dataJsonFilePath).getJsonData().emissionsSubmissionValues;
	//NOTE (data related):
	//  if "leakAddressedWithinRequiredTimeframe": "No" --> "ruleResults": "Additional Review"
	//  elseif "leakAddressedWithinRequiredTimeframe": "Yes" --> "ruleResults": "Baseline Review"
	OneStop.pageSubmitEmissions(emissionsSubmissionData);
	
	OneStop.pageSubmissionEmissionsValidateSubmission();
	*/
});
