/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 5000;

const harness = require('../../../../lib/harness');
const HarnessJson = require('../../../../lib/harness-json');
const OneStop = require('../../../../lib/OneStopApp-gis');
const expect = require('chai').expect;

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj, configJson, driver;
    let dataJsonFilePath, mapToolsMenu, layersList, quickSearchParameters;

    before(async () => {
        harnessObj = await harness.init();
        configJson = harnessObj.configJson;
        driver = harnessObj.driver;
        await OneStop.init(harnessObj, waitShort, waitLong);
        await OneStop.loginAep(harness.getCommandLineArgs().env, 'external');
    });

    after(async () => {
        await harnessObj.quit();
    });

    afterEach(async () => {
        await OneStop.afterEachTest(this.ctx.currentTest);
    });

    describe('open map from map nav link', function () {
        OneStop.openExternalMapViewer('/#pipeline/geocortex');
    });

    //reading json data files and preparing the required variables for later usage
    dataJsonFilePath = require('path').join(__dirname, '/data/data-' + harness.getCommandLineArgs().env + '.json');
    mapToolsMenu = new HarnessJson(dataJsonFilePath).getJsonData().toolsMenu;
    layersList = new HarnessJson(dataJsonFilePath).getJsonData().layersList;
    quickSearchParameters = new HarnessJson(dataJsonFilePath).getJsonData().quickSearchLinks;

    describe('verify toolbar menu', function () {
        for (let i = 0; i < mapToolsMenu.length; i++) {
            OneStop.clickMapToolsButtons(mapToolsMenu[i].clickToolsButton, mapToolsMenu[i].toolsSubmenuToClick, mapToolsMenu[i].expectedCSS, mapToolsMenu[i].expectedText, mapToolsMenu[i].closeSideMenu);
        }
    });

    describe('verify quick search', function () {
        for (let i = 0; i < quickSearchParameters.length; i++) {
            OneStop.mapQuickSearchValidation(quickSearchParameters[i]);
        }
    });

    describe('verify layers menu', () => {
        it('click layers tab opens left side layers section', async () => {
            const elements = await OneStop.getElementsByCSS('button[title="Layers"]');
            await elements[0].click();
            await driver.sleep(1000);
        });

        it('layer menu contains expected number of main layers', async () => {
            const elements = await OneStop.getElementsByCSS('.parent-layer > .layer-contents');
            expect(elements.length).to.equal(layersList.length);
        });

        for (let topLayersIndex = 0; topLayersIndex < layersList.length; topLayersIndex++){
            OneStop.validateLayersList(layersList[topLayersIndex],
                '.layer-list ul:nth-child(' + (topLayersIndex + 1) + ')', '.parent-layer', 0);
        }

        describe('layers list', () => {
            it('show legend item shows layer legend', async () => {
                let elements = await OneStop.getElementsByCSS(
                    '.panel-header.bound-visible > .bound-visible > .panel-header-button.menu-button.bound-visible');
                await elements[0].click();
                elements = await OneStop.getElementsByCSS(
                    '.smart-panel-hoisted-menu-inline.bound-visible > div > .list-menu.bound-visible > .list-menu-item');
                await elements[0].click();
                elements = await OneStop.getElementsByCSS('.layer-list.legend.bound-visible');
                expect(elements.length).to.equal(1);
            });
        });
    });

	// describe('verify layers menu', function () {
	// 	it('click layers tab opens left side layers section', function(done) {
	// 		OneStop.getElementsByCSS('button[title="Layers"]')
	// 			.then(function(elements) {
	// 				elements[0].click()
	// 					.then(function() {
	// 						driver.sleep(1000)
	// 							.then(function() {
	// 								done();
	// 							});
	// 					});
	// 			});
	// 	});
	//
	// 	it('layer menu contains expected number of main layers', function (done) {
	// 		OneStop.getElementsByCSS('.parent-layer > .layer-contents')
	// 			.then(function(elements){
	// 				expect(elements.length).to.equal(layersList.length);
	// 				done();
	// 			});
	// 	});
	//
	// 	for (var topLayersIndex = 0; topLayersIndex < layersList.length; topLayersIndex++){
	// 		OneStop.validateLayersList(layersList[topLayersIndex], '.layer-list ul:nth-child(' + (topLayersIndex + 1) + ')', '.parent-layer', 0);
	// 	}
	//
	// 	describe('layers list', function() {
	// 		it('show legend item shows layer legend', function (done) {
	// 			OneStop.getElementsByCSS('.panel-header.bound-visible > .bound-visible > .panel-header-button.menu-button.bound-visible')
	// 				.then(function (elements) {
	// 					elements[0].click();
	// 					OneStop.getElementsByCSS('.smart-panel-hoisted-menu-inline.bound-visible > div > .list-menu.bound-visible > .list-menu-item')
	// 						.then(function (elements) {
	// 							elements[0].click();
	// 							OneStop.getElementsByCSS('.layer-list.legend.bound-visible')
	// 								.then(function (elements) {
	// 									expect(elements.length).to.equal(1);
	// 									done();
	// 								});
	// 						});
	// 				});
	// 		});
	// 	});
	// });
});