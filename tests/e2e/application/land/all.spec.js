/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../lib/harness');
const OneStop = require('../../../../lib/OneStopApp-application');
const HarnessJson = require('../../../../lib/harness-json');

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
	
	//reading json data files and preparing the required variables for later usage
	const dataJsonFilePath = require('path').join(__dirname, '/data/newLandValues.json');
	const jsonData = new HarnessJson(dataJsonFilePath).getJsonData();
	const contactInfo = jsonData.contactInformation;
	const appInfo = jsonData.applicationInformation;
	const proposedActivity = jsonData.proposedActivity;
	const additionalInfo = jsonData.additionalInfo;
	const activityInfo = jsonData.activityInfo;
	const dimensionsGridValues = activityInfo.dimensionsGridValues;
	

	OneStop.pageGeneralContactInformation(contactInfo.applicantName, contactInfo.applicantEmail);
 
	OneStop.pageGeneralApplicationInformation(false,
		appInfo.addAppToExistingProject,
		harness.getCommandLineArgs().appType + ':' +
		harness.getCommandLineArgs().appSubType + ' - ' +
		harness.Moment().format(),
		appInfo.areThereExistingAuthorizations
	);

	OneStop.pageGeneralProposedActivity(false,
		proposedActivity.locatedOnPublicLand,
		proposedActivity.locatedOnPrivateLand,
		proposedActivity.activitiesPipelines,
		proposedActivity.activitiesWells,
		proposedActivity.activitiesFacilities,
		proposedActivity.associatedWith,
		proposedActivity.typeOfAmendment
	);

	OneStop.pageGeneralAdditionalInformation(false,
		additionalInfo.outstandingConcerns,
		additionalInfo.requiresEPEAApproval,
		additionalInfo.willSubmitEPEACodeOfPReg,
		additionalInfo.willSubmitWACofPNotifications,
		additionalInfo.requiresWaterActApproval,
		additionalInfo.requiresWaterActLicense
	);

	OneStop.pageGeneralActivityDetailsLand(false,
		require('path').join(__dirname, activityInfo.sketchSurveyShapefileUploadPath),
		activityInfo.dispositionValues,
		activityInfo.sketchSurveyAssociationFileUploadPath
	);

	//we need next parameters - this might need to be updated - changed the json data structure and
	// might not fully match: to do when have access to the functionality (shapefile is the correct
	// one which works so the functionality can be reached)
	//openApplication           -   false/true
	//siteLocationValues        -   array.length = 5
	//dimensionsValues          -   array.length = 6
	OneStop.pageDispositionSiteDetailsAddDimensionsData(
        dimensionsGridValues
	);
});
