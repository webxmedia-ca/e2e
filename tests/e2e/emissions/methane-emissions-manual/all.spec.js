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
	const dataJsonFilePath = require('path').join(__dirname, '/data/methaneSubmissionsGridValues.json');
	const methaneEmissionsValues = new HarnessJson(dataJsonFilePath).getJsonData();
	
	// reportingFacility - exists
	/*
	// reportingFacility - not exists
	var methaneEmissionsValues = [
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
	//navigate
	OneStop.pageMethaneBenzeneEmissionsNewSubmission(false, 'methane');
	
	/*
	const methaneEmissionsValues = [
		{
			reportingFormat: "Manual Entry",
			manualEntries: {
				methaneEmissions: {
					reportingYear: "January 1,2018 - December 31,2018",
					reportingFacility: "ABBT0052210"
				},
				tanks: {
					massMethane: "123",
					totalVolume: "321"
				},
				routineVenting: {
					massMethane: "123",
					totalVolume: "321",
					highBleedCount: "3",
					lowBleedCount: "1",
					pumpCount: "1"
				},
				compressors: {
					massMethane: "123",
					totalVolume: "321",
					addCompressorValues: {
						LLDLocation: "",
						installationYear: "2017",
						compressorType: "Reciprocating",
						throwCount: "15",
						sealType: null,
						sealVentControl: "Yes",
						ratedPower: "100",
						annualVentVolume: "999",
						massMethaneTonnes: "12345",
						pressurizedTimeHours: "asdasd",
						serialNumber: "!@#!@#"
					}
				},
				fugitives: {
					massMethane: "123",
					totalVolume: "321"
				}
			}
		}
	];
	// OneStop.createNewMethaneSubmissionEmissions(methaneEmissionsValues)
	*/
	
	//create a new methane submissions emissions
	OneStop.pageEmissionReportingMethaneEmissionsManual(methaneEmissionsValues);
	
	OneStop.pageManualEntryFacilityInformation();
	
	OneStop.pageManualEntryDehydrators(methaneEmissionsValues.individualDehydratorValues);  //this one is not done - Dehydrator data for all submissions is entered through Directive 039
	
	OneStop.pageManualEntryTanks(false, methaneEmissionsValues.manualEntries.tanks);
	
	OneStop.pageManualEntryRoutineVenting(false, methaneEmissionsValues.manualEntries.routineVenting);
	
	OneStop.pageManualEntryCompressors(false, methaneEmissionsValues.manualEntries.compressors);
	
	OneStop.pageManualEntryFugitives(false, methaneEmissionsValues.manualEntries.fugitives);
	
	OneStop.pageFleetCalculations(false);
	
	
	/*} else if (methaneEmissionsValues.reportingFormat === 'CSV Upload') {
		OneStop.pageBulkLoadCompressor(false);
		//--->
		OneStop.pageFleetCalculations(false);*/
	
});
