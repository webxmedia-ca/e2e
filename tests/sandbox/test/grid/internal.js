var waitShort = 4000;
var waitLong = 8000;

var harness = require('../../../../lib/harness');
var harnessObj = harness.init();

var OneStop = require('../../../../lib/OneStopApp-internal');
OneStop.init(harnessObj, waitShort, waitLong);

var screenCapCount = 0;
var test = harnessObj.test;
var it = test.it;
var describe = test.describe;
var before = test.before;
var after = test.after;

var driver = harnessObj.driver;
var expect = harnessObj.expect;
var By = harnessObj.By;
var until = harnessObj.until;

describe('OneStop.GRID FUNCTIONALITY TESTS', function () {
	before(function (done) {
		OneStop.login(done);
	});

	describe('Search for Tours)', function () {

		it('Go to assessment-coordinator workspace)', function (done) {
			driver.get(OneStop.getBaseUrl() + '/#workspace/assessment-coordinator');
			OneStop.waitForPageLoad(done);
		});

		it('click Search Button (Map:Reports:Search)', function (done) {
			OneStop.clickElementByCSS('a[data-event="show:workspace:search"]');
			OneStop.waitForPageLoad(done);
		});

		it('get last tour submission from applicationJSON)', function (done) {
			var lic_sub = new harnessObj.getMostRecentApplication('tour', 'external', false).appId;
			authorizationID = lic_sub.substring(0, lic_sub.indexOf("-", 0));
			submissionID = lic_sub.substring(lic_sub.indexOf("-", 0) + 1);
			console.log('lic_sub:' + lic_sub + '\nauthorizationID: ' + authorizationID);
			done();
		});

		it('click Tour tab', function (done) {
			OneStop.clickElementByCSS('a[data-id="tour"]');
			OneStop.waitForPageLoad(done);
		});

		it('enter authorization number', function (done) {
			OneStop.setTextFieldValueByCSS('#licenseAuthorizationNumber', authorizationID);
			OneStop.waitForPageLoad(done);
		});

		// it('enter authorization number(s) [comma-delimited]', function (done) {
		//    var licenceList = getTourLicenceData();
		//    OneStop.setTextFieldValueByCSS('#licenceList', CommaDelimitedAuthorizationLists);
		//    OneStop.waitForPageLoad(done);
		// });

		it('click search', function (done) {
			OneStop.clickElementByCSS('.btn-search');
			OneStop.waitForPageLoad(done);
		});
	});


	var moment = require('moment');
	var grid = require('../../../../lib/OneStop/Grid');
	var GRID1 = new grid('#TourResultsPanelBody .search-results', harnessObj);
	GRID1.toggleDebug();

	describe('Test GRID CLASS Navigation', function () {

		var lastPg = null;

		it('TEST: getActivePage()', function (done) {
			console.log('TEST: getActivePage():');
			GRID1.getActivePage().then(function (value) {
				lastPg = value;
				console.log('TEST: getActivePage():' + lastPg);
				done();
			});
		});
		it('TEST: clickNext()', function (done) {
			console.log('TEST: clickNext() from pg ' + lastPg);
			GRID1.clickNext().then(function (value) {//From page 1 to 2
				lastPg = value;
				console.log('TEST: clickNext() went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickNext(3)', function (done) {
			console.log('TEST: clickNext(3) from pg ' + lastPg);
			GRID1.clickNext(3).then(function (value) {//From page 2 to 5
				lastPg = value;
				console.log('TEST: clickNext(3) went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickLast()', function (done) {
			console.log('TEST: clickLast() from pg ' + lastPg);
			GRID1.clickLast().then(function (value) {//From page 5 to maxPg
				lastPg = value;
				console.log('TEST: clickLast() went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickPrev()', function (done) {
			console.log('TEST: clickPrev() from pg ' + lastPg);
			GRID1.clickPrev().then(function (value) {//From maxPg to maxPg-1
				lastPg = value;
				console.log('TEST: clickPrev() went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickPrev(2)', function (done) {
			console.log('TEST: clickPrev(2) from pg ' + lastPg);
			GRID1.clickPrev(2).then(function (value) {//From maxPg-1 to maxPg-3
				lastPg = value;
				console.log('TEST: clickPrev(2) went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickFirst()', function (done) {
			console.log('TEST: clickFirst() from pg ' + lastPg);
			GRID1.clickFirst().then(function (value) {//From maxPg-3 to page 1
				lastPg = value;
				console.log('TEST: clickFirst() went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickPage(5)', function (done) {
			console.log('TEST: clickPage(5) from pg ' + lastPg);
			GRID1.clickPage(5).then(function (value) {//From page 1 to page 5
				lastPg = value;
				console.log('TEST: clickPage(5) went to page ' + lastPg);
				done();
			});
		});
		it('TEST: getGridElement(3,3)', function (done) {
			console.log('TEST: getGridElement(3,3) from pg ' + lastPg);
			GRID1.getGridElement(3, 3).then(function (element) {//ON page 5
				element.getAttribute('textContent').then (function(value){
					console.log('TEST: getGridElement(3,3) Page: '+lastPg+' value: ' + value);
					done();
				});
			});
		});
		it('TEST: clickPage(15)', function (done) {
			console.log('TEST: clickPage(15) from pg ' + lastPg);
			GRID1.clickPage(15).then(function (value) {//From page 5 to page 15
				lastPg = value;
				console.log('TEST: clickPage(15) went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickPage(3)', function (done) {
			console.log('TEST: clickPage(3) from pg ' + lastPg);
			GRID1.clickPage(3).then(function (value) {//From page 15 to page 3
				lastPg = value;
				console.log('TEST: clickPage(3) went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickPage(11)', function (done) {
			console.log('TEST: clickPage(11) from pg ' + lastPg);
			GRID1.clickPage(11).then(function (value) {//From page 3 to page 11
				lastPg = value;
				console.log('TEST: clickPage(11) went to page ' + lastPg);
				done();
			});
		});
		it('TEST: clickPage(7)', function (done) {
			console.log('TEST: clickPage(7) from pg ' + lastPg);
			GRID1.clickPage(7).then(function (value) {//From page 11 to page 7
				lastPg = value;
				console.log('TEST: clickPage(7) went to page ' + lastPg);
				done();
			});
		});
		it('TEST: getActivePage()', function (done) {
			console.log('TEST: getActivePage() from pg ' + lastPg);
			GRID1.getActivePage().then(function (value) {//ON page 7
				lastPg = value;
				console.log('TEST: getActivePage() from pg ' + lastPg + '==' + value);
				done();
			});
		});
		it('TEST: getRowCount()', function (done) {
			console.log('TEST: getRowCount() from pg ' + lastPg);
			GRID1.getRowCount().then(function (value) {//should be 5
				console.log('TEST: getRowCount() pg ' + lastPg + '==' + value);
				done();
			});
		});
		it('TEST: getColCount', function (done) {
			console.log('TEST: getColCount pg ' + lastPg);
			GRID1.getColCount().then(function (value) {//should be 10
				console.log('TEST: getColCount pg ' + lastPg + '==' + value);
				done();
			});
		});
		it('TEST: clickPage(25)', function (done) {
			console.log('TEST: clickPage(25) from pg ' + lastPg);
			GRID1.clickPage(25).then(function (value) {//From page 11 to page 25
				lastPg = value;
				console.log('TEST: clickPage(25) went to page ' + lastPg);
				done();
			});
		});
		it('Test OUT OF RANGE clickPage(102): EXPECT FAIL', function (done) {
			GRID1.clickPage(102);// SHOULD FAIL OR AT LEAST STOP AT LAST PAGE & WARN
			done();
		});
		it('Test OUT OF RANGE clickPage(0): EXPECT FAIL', function (done) {
			GRID1.clickPage(0);// SHOULD FAIL OR AT LEAST STOP AT FIRST PAGE & WARN
			done();
		});
		it('Test OUT OF RANGE clickPage(abc): EXPECT FAIL', function (done) {
			GRID1.clickPage('abc');// SHOULD FAIL
			done();
		});
		it('Test OUT OF RANGE clickPage(undefined): EXPECT FAIL', function (done) {
			GRID1.clickPage(undefined);// SHOULD FAIL
			done();
		});
		it('Test OUT OF RANGE clickPage(): EXPECT FAIL', function (done) {
			GRID1.clickPage();// EXPECT FAIL
			done();
		});
	});


	describe('Test GRID CLASS COLUMN SORTING: GRID 1 ', function () {

		it('Get COLUMN HEADERS', function (done) {
			GRID1.getColHdrs().then(function (colHdrs) {
				console.log('ColHdrs.length: ' + colHdrs.length);
				colHdrs.forEach(function(hdr){
					console.log(hdr);
				});
				done();
			});
		});


		it('Sort GRID: Authorization Number, desc', function (done) {
			//GRID1.toggleDebug();
			GRID1.sortGrid('Authorization Number', 'desc').then(function () {
				done();
			});
		});
		it('Sort GRID: Submission ID, desc', function (done) {
			GRID1.sortGrid('Submission ID', 'desc').then(function () {
				done();
			});
		});
		it('Sort GRID: Well Identifier, desc, displayUwi', function (done) {
			GRID1.sortGrid('Well Identifier', 'desc', 'displayUwi').then(function () {
				done();
			});
		});
		it('Sort GRID: Well Identifier, asc', function (done) {
			GRID1.sortGrid('Well Identifier', 'asc', 'wellIdentifier').then(function () {
				done();
			});
		});
		it('Sort GRID: Confidentiality Flag, desc', function (done) {
			GRID1.sortGrid('confidentiality Flag', 'desc').then(function () {
				done();
			});
		});
		it('Sort GRID: Tour Type(s), desc', function (done) {
			GRID1.sortGrid('Tour Type(s)', 'desc').then(function () {
				done();
			});
		});
		it('Sort GRID: Tour Start Date, desc', function (done) {
			GRID1.sortGrid('tour Start Date', 'desc').then(function () {
				done();
			});
		});
		it('Sort GRID: Tour End Date, desc', function (done) {
			GRID1.sortGrid('tour End Date', 'desc').then(function () {
				done();
			});
		});
		it('Sort GRID: Well Identifier, default', function (done) {
			GRID1.sortGrid('Well Identifier', 'default', 'wellIdentifier').then(function () {
				done();
			});
		});
	});

	describe('Test GRID CLASS GRID DATA: GRID 1 ', function () {
		it('Get GRID DATA', function (done) {
			//GRID1.toggleDebug();
			var timeStamp = moment();
			GRID1.getGridData().then(function (data) {
				console.log('ALL PAGES took:'+moment().diff(timeStamp,'milliseconds', true)+' milliseconds\n\n');
				for (var i = 0; i < data.length; i++) {
					console.log('\n.header:' + data[i].header +
						'\n.value:' + data[i].value +
						'\n.page:' + data[i].page +
						'\n.row:' + data[i].row +
						'\n.col:' + data[i].col);
				}
				done();
			});
		});
	});

	var GRID2 = new grid('#ExportListPanelBody .export-list', harnessObj);
	GRID2.toggleDebug();

	describe('Test GRID CLASS: GRID 2', function () {

		it('Get COLUMN HEADERS', function (done) {
			GRID2.getColHdrs().then(function (colHdrs) {
				console.log('ColHdrs.length: ' + colHdrs.length);
				colHdrs.forEach(function(hdr){
					console.log(hdr);
				});
				done();
			});
		});

		it('GRID2 DATA', function (done) {
			GRID2.getGridData().then(function (data) {
				console.log(data);
				console.log('data.length: ' + data.length);

				for (var i = 0; i < data.length; i++) {
					console.log('\n.header:' + data[i].header +
						'\n.value:' + data[i].value +
						'\n.page:' + data[i].page +
						'\n.row:' + data[i].row +
						'\n.col:' + data[i].col);
				}
				done();
			});
		});

	});

});
