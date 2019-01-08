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

    before(async () => {
        harnessObj = await harness.init();
        configJson = harnessObj.configJson;
        driver = harnessObj.driver;
        await OneStop.init(harnessObj, waitShort, waitLong);
        await OneStop.loginAep(harness.getCommandLineArgs().env, 'internal');
    });

    after(async () => {
        await harnessObj.quit();
    });

    afterEach(async () => {
        await OneStop.afterEachTest(this.ctx.currentTest);
    });

    //reading json data files and preparing the required variables for later usage
    const dataJsonFilePath = require('path').join(__dirname, '/data/data-' + harness.getCommandLineArgs().env + '.json');
    const mapToolsMenu = new HarnessJson(dataJsonFilePath).getJsonData().toolsMenu;
    const layersList = new HarnessJson(dataJsonFilePath).getJsonData().layersList;
    const quickSearchParameters = new HarnessJson(dataJsonFilePath).getJsonData().quickSearchLinks;

    describe('open map from map nav link', () => {
        OneStop.openInternalMapViewer('/internal/index.html');
    });

    describe('verify toolbar menu', () => {
        for (let i = 0; i < mapToolsMenu.length; i++) {
            OneStop.clickMapToolsButtons(mapToolsMenu[i].clickToolsButton, mapToolsMenu[i].toolsSubmenuToClick, mapToolsMenu[i].expectedCSS, mapToolsMenu[i].expectedText, mapToolsMenu[i].closeSideMenu);
        }
    });

    describe('verify quick search', () => {
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
});