var waitShort = 2000;
var waitLong = 5000;

var Harness = require('../../../lib/harness');
var harnessObj = Harness.init();

var OneStop = require('../../../lib/OneStopApp-external');
OneStop.init(harnessObj, waitShort, waitLong);

var screenCapCount = 0;
var test = harnessObj.test;

var driver = harnessObj.driver;

test.describe(harnessObj.getAppType() + ':' + harnessObj.getAppSubType() + ' - (' + harnessObj.getEnv() + ')', function () {
	test.before(function (done) {
		OneStop.login(done);
	});
	
	test.after(function () {
		harnessObj.quit();
	});

    test.it('test harness-json', function (done) {
        var HarnessJson = require('../../../lib/harness-json');
        
        // var configJson = new HarnessJson("./config/" + harnessObj.getEnv() + ".config.json");
        console.log(new HarnessJson("./config/" + harnessObj.getEnv() + ".config.json").getJsonData().baseUrl);
        done();
    });
});