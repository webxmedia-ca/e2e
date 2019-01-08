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
	const dataJsonFilePath = require('path').join(__dirname, '/data/peaceRiverEmissions_CSVEntry_data.json');
	const peaceRiverEmissionsPreconditionValues = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverEmissionsPreconditionValues;
	const peaceRiverValidationRules = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverValidationRules;
	const peaceRiverEmissionsValues = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverEmissionsValues;
	const peaceRiverBulkUploadValues = new HarnessJson(dataJsonFilePath).getJsonData().peaceRiverEmissionsBulkUploadValues;
	const attachmentFolderPath = require('path').join(__dirname, '') + '/attachments/';
	
	//building the preconditions (manual entry used later to create the CSV)
	// NOTE: for CSV we need a record with the DRAFT status - here we're creating it
	describe('building the manual draft record - it is used for csv upload later', () => {
		//if the record already exists in the system it'll clean up the Licensee Information field (set them to blank)
		OneStop.pageEmissionsReportingPeaceRiver(false, peaceRiverEmissionsPreconditionValues);
		
		//the one below will read and store the submissionReferenceId & amendmentNumber (rules validation is disabled)
		OneStop.pageOverviewValidationsRules(peaceRiverValidationRules);
		
		//check the created record exists and has the status = Draft
		OneStop.pageSubmissionEmissionsValidateSubmission('draft');
	});
	
	describe('upload the csv file and validate', () => {
		//creating the CSV record - this should updated the values of the record created above
		OneStop.pageEmissionsReportingPeaceRiver(false, peaceRiverEmissionsValues);
		OneStop.pageBulkUploadCsvFile(false, peaceRiverBulkUploadValues, attachmentFolderPath);
		
		//here, after the CSV upload is complete we need to go back and find the created record then click the View/Edit icon
		//then we need to go into the record and find the License Information fields (throught manual workflow) and validate
		// that those fields contain the values from the csv file
		//1. click view in the recent submissions grid
		//2. navigate to Emissions Reporting -> Peace River Emissions tab
		//3. check the Peace River Emissions & Licensee Information sections have the correct data (as per JSON & CSV)
		OneStop.pageSubmissionEmissionsPeaceRiverValidateCsvValuesAreCorrect(
			peaceRiverEmissionsPreconditionValues[0],
			peaceRiverBulkUploadValues[0].uploadedCsvLicenseeInformation);
		
	});
	
	//not needed - same processes as within the manual test cases
	//NOTE: the JSON file has the data already - in order to run this piece just remove the commented lines below
	//      the function exists and should run smooth - does it well for the manual test
	/*
	describe('now submit the record', () => {
		const emissionsSubmissionData = new HarnessJson(dataJsonFilePath).getJsonData().emissionsSubmissionValues;
		OneStop.pageSubmitEmissions(emissionsSubmissionData);
		
		OneStop.pageSubmissionEmissionsValidateSubmission('under review', 'submitted');
	});
	*/
});
