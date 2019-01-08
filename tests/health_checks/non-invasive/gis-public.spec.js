/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../lib/harness');
const OneStop = require('../../../lib/OneStopApp-gis');

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj, driver, expect, By, until, configJson;

    before(async () => {
        harnessObj = await harness.init();

        driver = harnessObj.driver;
        expect = harnessObj.expect;
        By = harnessObj.By;
        until = harnessObj.until;
        configJson = harnessObj.configJson;

        await OneStop.init(harnessObj, waitShort, waitLong);
        await OneStop.loginPublic();
    });

    after(async () => {
        await harnessObj.quit();
    });

    afterEach(async () => {
        await OneStop.afterEachTest(this.ctx.currentTest);
    });

    describe('open map from url', () => {
        it('open direct link', async () => {
            await driver.get(configJson.gisBasePublicUrl + '/Onestop/Public/index.html');
	        await OneStop.waitForObjectLoad('.modal-container.terms-of-use', waitLong * 5, waitLong);
        });

        it('click i accept button', async () => {
            await OneStop.clickElementByCSS('*[value="I Accept"]');
        });

        it('opens expected url', async () => {
            const currentUrl = await driver.getCurrentUrl();
            const expectedUrl = configJson.gisBasePublicUrl + '/Onestop/Public/index.html';
            expect(currentUrl).to.equal(expectedUrl);
        });
    });

    describe('additional validations', () => {
        describe('check tools button', () => {
            it('tools button exists and has Tools as label', async () => {
                await OneStop.waitForObjectLoad('.CompactToolbarView .flyout-menu-active-tool',
                    waitLong * 4, 500, true);
                const elements = await OneStop.getElementsByCSS('.CompactToolbarView .flyout-menu-active-tool');
                expect(elements.length).to.equal(1);

                const text = await OneStop.getElementValueByCSS('.bound-visible-inline > .tool-label');
                expect(text).to.equal('Tools');
            });

            it('clicking tools button expands/collapses the menu', async () => {
                await OneStop.waitForObjectLoad('.CompactToolbarView .flyout-menu-active-tool',
                    waitLong * 5, 1000, true);

                //click the Tools button to expand the submenu
                await OneStop.clickElementByCSS('.CompactToolbarView .flyout-menu-active-tool');
                await driver.sleep(500);
            });
        });

        describe('check quick search', () => {
            it('quick search tab exists', async () => {
                await OneStop.waitForObjectLoad('.tab-inactive > .tab-strip-label', waitLong * 3, waitShort, true);
                const text = await OneStop.getElementValueByCSS('.tab-inactive > .tab-strip-label');
                expect(text).to.equal('Quick Search');
            });

            it('clicking the Quick Search tab opens the Quick Search side menu', async () => {
                await OneStop.waitForObjectLoad('button[title="Quick Search"]',waitLong * 5, waitShort, true);
                let elements = await OneStop.getElementsByCSS('.tab-inactive > .tab-strip-label');
                await elements[0].click();
                await driver.sleep(waitShort);

                elements = await OneStop.getElementsByCSS('.view.FindAssetsContainerView.active');
                const element = await elements[0].findElement(
                    By.css(
                        '.view-container-view > .panel-header > .bound-visible > .panel-title > .bound-visible-inline'
                    ));

                const text = await element.getText();
                expect(text).to.equal('Quick Search');
            });
        });

        describe('check layers', () => {
            it('click layers tab opens left side layers section', async () => {
                const elements = await OneStop.getElementsByCSS('button[title="Layers"]');
                await elements[0].click();
                await driver.sleep(1000);
            });

            it('layers list - show legend item shows layer legend', async () => {
                let elements = await OneStop.getElementsByCSS('.panel-header.bound-visible > .bound-visible > ' +
                    '.panel-header-button.menu-button.bound-visible');
                await elements[0].click();

                elements = await OneStop.getElementsByCSS('.smart-panel-hoisted-menu-inline.bound-visible > div > ' +
                    '.list-menu.bound-visible > .list-menu-item');
                await elements[0].click();

                elements = await OneStop.getElementsByCSS('.layer-list.legend.bound-visible');
                expect(elements.length).to.equal(1);
            });
        });
    });
});