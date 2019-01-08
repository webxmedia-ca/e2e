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
	const dataJsonFilePath = require('path').join(__dirname, '/data/benzeneSubmissionsGridValues.json');
	const benzeneEmissionsValues = new HarnessJson(dataJsonFilePath).getJsonData();
	
	// reportingFacility - exists
	/*
	const benzeneEmissionsValues = [
		{
			reportingFormat: "Manual Entry",
			manualEntries: {
				methaneEmissions: {
					reportingYear: "January 1,2018 - December 31,2018",
					reportingFacility: 'ABBT0052210'
				},
				licenseeInformation: {
					managerResponsible: "test managerResponsibilities",
					licenseeRepresentative: "test licenseeRepresentative",
					licenseePhoneNumber: "4034034033"
				}
			}
		}
	];
	*/
	
	/*
	// reportingFacility - not exists
	var benzeneEmissionsValues = [
		{
			reportingFormat: "Manual Entry",
			manualEntries: {
				methaneEmissions: {
					reportingYear: "January 1,2018 - December 31,2018"
				},
				licenseeInformation: {
					managerResponsible: "test managerResponsibilities",
					licenseeRepresentative: "test licenseeRepresentative",
					licenseePhoneNumber: "4034034033"
				}
			}
		}
	];
	*/
	OneStop.pageMethaneBenzeneEmissionsNewSubmission(false, 'benzene');
	
	OneStop.pageEmissionReportingBenzeneEmissionsManual(benzeneEmissionsValues);
	
	const newDehydratorValues = benzeneEmissionsValues.individualDehydratorValues;
	//this one is not fully done - Dehydrator data for all submissions is entered through Directive 039
	OneStop.pageManualEntryDehydrators(newDehydratorValues);
	
	OneStop.pageValidationRulesSubmitAndValidateBenzeneEmissions(benzeneEmissionsValues);
	
	OneStop.pageSubmissionEmissionsValidateBenzeneSubmission('received', 'submitted');
});