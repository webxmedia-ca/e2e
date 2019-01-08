/**
 * Created by cb5rp on 5/26/2017.
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

	describe('notification > flare: authorization type - well', function () {
		OneStop.pageNotification(
			'Flaring',
			'WELL',
			'Y',
			'0',
			'Y',
			'cicNumber',
			'Flaring - Flare design or system not operating as required (e.g. wind guard ,ignitor, pilot light).',
			'epeaContraventionCommentsYes - flaring notification - well',
			'123456789'
		);
		
		OneStop.pageNotificationFlaringGeneralInformation(
			'automated tester',
			'403 123-4567'
		);
		
		OneStop.pageNotificationFlaringDetails(
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
			'N',
			'12345678'
		);
		
		OneStop.pageNotificationComments('comments - flaring - well');
		
		OneStop.pageNotificationValidateAndSubmit();
	});
	
	describe('notification > flare: authorization type - pipeline', function () {
		OneStop.pageNotification(
			'Flaring',
			'PIPELINE',
			'Y',
			'0',
			'N',
			null,
			null,
			'epeaContraventionCommentsYes - flaring notification - pipeline',
			null
		);
		
		OneStop.pageNotificationFlaringGeneralInformation(
			'automated tester',
			'403 123-4567'
		);
		
		OneStop.pageNotificationFlaringDetails(
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
			'N',
			'12345678'
		);
		
		OneStop.pageNotificationComments('comments - flaring - pipeline');
		
		OneStop.pageNotificationValidateAndSubmit();
	});
	
	describe('notification > flare: authorization type - facility', function () {
		OneStop.pageNotification(
			'Flaring',
			'FACILITY',
			'N',
			null,
			null,
			null,
			null,
			null,
			null
		);
		
		OneStop.pageNotificationFlaringGeneralInformation(
			'automated tester',
			'403 123-4567'
		);
		
		OneStop.pageNotificationFlaringDetails(
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
			'N',
			'12345678'
		);
		
		OneStop.pageNotificationComments('comments - flaring - facility');
		
		OneStop.pageNotificationValidateAndSubmit();
	});
});
