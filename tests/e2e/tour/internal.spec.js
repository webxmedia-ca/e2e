/**
 * Created by cb5rp on 5/26/2017.
 */

var waitShort = 2000;
var waitLong = 5000;

var harness = require('../../../lib/harness');
var harnessObj = harness.init();

var OneStop = require('../../../lib/OneStopApp-tour');
OneStop.init(harnessObj, waitShort, waitLong);

var screenCapCount = 0;
var test = harnessObj.test;

test.describe(harnessObj.getAppType() + ':' + harnessObj.getAppSubType() + ' - (' + harnessObj.getEnv() + ')', function () {
    test.before(function (done) {
        OneStop.login(done);
    });

    test.after(function () {
        harnessObj.quit();
    });

    afterEach(async () => {
        await OneStop.afterEachTest(this.ctx.currentTest);
    });

    OneStop.pageTourBatchExport();

});
