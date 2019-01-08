/**
 * Created by cb7yb on 05/15/2018.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../../lib/harness');
const OneStop = require('../../../../../lib/OneStopApp-notification');

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

	describe('notification > venting: authorization type - well', function () {
		OneStop.pageNotification(
			'Venting',
			'WELL',
			'Y',
			'0',
			'Y',
			'cicNumber',
			'Venting only - Release from unauthorized source (E.g. failure of VRU, PSVs, oil production tanks, etc.)',
			'epeaContraventionCommentsYes - Venting Notification - Well',
			'123456789'
		);
		
		OneStop.pageNotificationVentingGeneralInformation(
			'automated tester',
			'403 123-4567'
		);
		
		OneStop.pageNotificationVentingDetails(
			'50000',
			'3',
			'5',
			'Test',
			'5',
			'ppm',
			new harness.Moment().add(1, 'week').format('MM/DD/YYYY'),
			'12:00',
			new harness.Moment().add(1, 'week').format('MM/DD/YYYY'),
			'15:00',
			'Y',
			'Y',
			'N'
		);
		
		OneStop.pageNotificationComments('comments - venting - well');
		
		OneStop.pageNotificationValidateAndSubmit();
	});
	
	describe('notification > venting: authorization type - pipeline', function () {
		OneStop.pageNotification(
			'Venting',
			'PIPELINE',
			'N',
			'Y',
			'0',
			'Y',
			'cicNumber',
			'Venting only - Release from unauthorized source (E.g. failure of VRU, PSVs, oil production tanks, etc.)',
			'epeaContraventionCommentsYes - Venting Notification - Pipeline'
		);
		
		OneStop.pageNotificationVentingGeneralInformation(
			'automated tester',
			'403 123-4567'
		);
		
		OneStop.pageNotificationVentingDetails(
			'50000',
			'3',
			'5',
			'Test',
			'5',
			'ppm',
			new harness.Moment().add(1, 'week').format('MM/DD/YYYY'),
			'12:00',
			new harness.Moment().add(1, 'week').format('MM/DD/YYYY'),
			'15:00',
			'Y',
			'Y',
			'N'
		);
		
		OneStop.pageNotificationComments('comments - venting - pipeline');
		
		OneStop.pageNotificationValidateAndSubmit();
	});
	
	describe('notification > venting: authorization type - facility', function () {
		OneStop.pageNotification(
			'Venting',
			'FACILITY',
			'N',
			'Y',
			'0',
			'Y',
			'cicNumber',
			'Venting only - Release from unauthorized source (E.g. failure of VRU, PSVs, oil production tanks, etc.)',
			'epeaContraventionCommentsYes - Venting Notification - Facility'
		);
		
		OneStop.pageNotificationVentingGeneralInformation(
			'automated tester',
			'403 123-4567'
		);
		
		OneStop.pageNotificationVentingDetails(
			'50000',
			'3',
			'5',
			'Test',
			'5',
			'ppm',
			new harness.Moment().add(1, 'week').format('MM/DD/YYYY'),
			'12:00',
			new harness.Moment().add(1, 'week').format('MM/DD/YYYY'),
			'15:00',
			'Y',
			'Y',
			'N'
		);
		
		OneStop.pageNotificationComments('comments - venting - facility');
		
		OneStop.pageNotificationValidateAndSubmit();
	});
 
});
