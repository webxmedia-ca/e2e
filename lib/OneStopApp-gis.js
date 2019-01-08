/**
 * Created by cb5rp on 6/1/2017.
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

const expect = require('chai').expect;

const OneStop = (function () {

    const OneStop = require('./OneStopApp-base');

    let driver
        , By
        , until
        , waitShort
        , waitLong
        , initialized
        , harnessObj
        , username
        , password
        , baseUrl
        , displayName
        , env
        , appType
        , appSubType;

    OneStop.init = (harnessObjIn, waitShortIn, waitLongIn) => {
        OneStop.initBase(harnessObjIn, waitShortIn, waitLongIn);

        const attrs = OneStop.getAttrs();

        driver = attrs.driver;
        By = attrs.By;
        until = attrs.until;
        waitShort = attrs.waitShort;
        waitLong = attrs.waitLong;
        initialized = attrs.initialized;
        harnessObj = attrs.harnessObj;
        username = attrs.username;
        password = attrs.password;
        baseUrl = attrs.baseUrl;
        displayName = attrs.displayName;
        env = attrs.env;
        appType = attrs.appType;
        appSubType = attrs.appSubType;
    };

    OneStop.loginPublic = async () => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function does not login or anything else
                        it only initializes the app and maximizes browser's window
                        accepted parameters and their values: all of these are gathered from the *.config.json file)

        ??????????????????????????????????????????????????????????????????????????????????????????????????????
        ACCEPTED PARAMETER(S) AND VALUES:   none OR all of these are gathered from the *.config.json file)
        ??????????????????????????????????????????????????????????????????????????????????????????????????????
        USAGE:  OneStop.loginPublic(done);
        ------------------------------------------------------------------------------------------------------------- */
        if (!initialized) {
            console.log('OneStopApp not initialized!: Please make a call to init prior to trying to use module.');
        }
        await driver.manage().window().maximize();
    };

    OneStop.openInternalMapViewer = (expectedUrl) => {
        //click the Map link
        OneStop.clickRightSideTopLinks('a[data-event="show:geocortex:map"]');

        //validate the map opens
        it('internal map tab opens to correct url: ' + expectedUrl, async () => {
            expectedUrl = harnessObj.configJson.gisBaseInternalUrl + expectedUrl;
            const handles = await driver.getAllWindowHandles();
            await driver.switchTo().window(handles[1]);

            //wait for the frame and few other objects to load
            await OneStop.waitForObjectLoad('.splash-blurred.region-active', waitLong * 5, 500);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl.toLowerCase()).to.contain(expectedUrl.toLowerCase());

            //wait until splash overlay div is gone from dom
            const elements = await driver.findElements(By.css('.splash-overlay'));
            await driver.wait(until.stalenessOf(elements[0]), waitLong * 10);
        });
    };

    OneStop.closeInternalMapViewer = async () => {
        await driver.close();
        //switch back to main window
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[0]);
    };

    OneStop.openExternalMapViewer = (expectedUrl) => {
        //click the Map link
        OneStop.clickRightSideTopLinks('a[data-event="show:geocortex:map"]', '#geocortex-container');
        //validate the map opens
        it('loads an iframe with gis url', async () => {
            const elements = await OneStop.getElementsByCSS("#geocortex-container");
            expect(elements.length).to.equal(1);
        });

        it('switching to the iframe', async () => {
            //adding handler for the iFrame
            await driver.switchTo().frame(driver.findElement(By.css('#geocortex-container')));

            //wait until splash overlay div is gone from dom
            const elements = await driver.findElements(By.css('.splash-overlay'));
            await driver.wait(until.stalenessOf(elements[0]), waitLong * 10);
        });

        // it('opens the external map to the correct url: ' + expectedUrl, async () => {
        //     // expectedUrl = harnessObj.configJson.gisBaseExternalUrl + expectedUrl;
        //     const currentUrl = await driver.getCurrentUrl();
        //     expect(currentUrl).to.contain(expectedUrl);
        // });

        it('there is no alert dialog displayed', async () => {
            const elements = driver.findElements(By.css('.ShellView .modal-container'));
            if (elements.length > 0) {
                const element = await driver.findElement(By.css('.ShellView .modal-container'));
                const elementText = element.getText();
                if (elementText) {
                    throw "alert dialog displayed when tried to load the map, next is the text: \n" + elementText;
                }
            }
        });
    };

    OneStop.clickMapToolsButtons = (clickToolsButton, toolsSubmenu, expectedCSSLocator, expectedTextValue, closeSideMenu) => {
        if (clickToolsButton) {
            it('tools button exists and has Tools as label', async () => {
                await OneStop.waitForObjectLoad('.CompactToolbarView .flyout-menu-active-tool', waitLong * 4, 500, true);
                const elements = await OneStop.getElementsByCSS('.CompactToolbarView .flyout-menu-active-tool');
                expect(elements.length).to.equal(1);

                const text = await OneStop.getElementValueByCSS('.bound-visible-inline > .tool-label');
                expect(text).to.equal('Tools');
            });

            it('clicking tools button expands/collapses the menu', async () => {
                // await OneStop.waitForObjectLoad('.CompactToolbarView .flyout-menu-active-tool', waitLong * 5, 1000, true);
                //click the Tools button to expand the submenu
                await OneStop.clickElementByCSS('.CompactToolbarView .flyout-menu-active-tool');
                await driver.sleep(500);
            });
        }

        if (toolsSubmenu) {
            it('click the ' + toolsSubmenu + ' submenu', async () => {
                //click the toolsSubmenu submenu button
                await OneStop.clickElementByCSS(toolsSubmenu);
                await driver.sleep(500);
            });

            if (expectedCSSLocator && expectedTextValue) {
                it('brings up ' + expectedTextValue + ' element', async () => {
                    //check to have the required element loaded
                    await OneStop.waitForObjectLoad(expectedCSSLocator, waitLong * 3, 500);
                    //get object's text
                    const text = await OneStop.getElementValueByCSS(expectedCSSLocator);
                    expect(text).to.equal(expectedTextValue);
                    driver.sleep(100);
                });
            }

            if (closeSideMenu) {
                it('clicking ' + expectedTextValue + ' section\'s close button closes the menu', async () => {
                    const closeButton = 'button[title="Close Panel"]';
                    if (expectedTextValue.includes("Plot Coordinates")) {
                        await OneStop.clickElementByCSS('.CoordinatesContainerView ' + closeButton);
                    } else if (expectedTextValue.includes("Query")) {
                        await OneStop.clickElementByCSS('.SimpleQueryBuilderContainerView ' + closeButton);
                    } else if (expectedTextValue.includes("Filter")) {
                        await OneStop.clickElementByCSS('.SimpleFilterBuilderContainerView ' + closeButton);
                    } else if (expectedTextValue.includes('Snappable Layers')) {
                        await OneStop.clickElementByCSS('.DataFrameViewContainer ' + closeButton);
                    } else if (expectedTextValue.includes('Share')) {
                        await OneStop.clickElementByCSS('button[title="Close Share"]');
                    } else if (expectedTextValue.includes('Export a Map Image')) {
                        await OneStop.clickElementByCSS('button[title="Close Export a Map Image"]');
                    } else if (expectedTextValue.includes('Select Desired Styling')) {
                        await OneStop.clickElementByCSS('.style-selector > .form-btns > .button');
                    } else {
                        await OneStop.clickElementByCSS(closeButton);
                    }
                    await driver.sleep(1000);
                });
            }
        }
    };

    OneStop.mapQuickSearchValidation = (quickSearchParameters) => {
        if (quickSearchParameters.clickQuickSearchBtn) {
            it('quick search tab exists', async () => {
                await OneStop.waitForObjectLoad('.tab-inactive > .tab-strip-label', waitLong * 3, waitShort, true);
                const text = await OneStop.getElementValueByCSS('.tab-inactive > .tab-strip-label');
                expect(text).to.equal('Quick Search');
            });

            it('clicking the Quick Search tab opens the Quick Search side menu', async () => {
                let elements;
                await OneStop.waitForObjectLoad('button[title="Quick Search"]', waitLong * 5, waitShort, true);
                elements = await OneStop.getElementsByCSS('.tab-inactive > .tab-strip-label');
                await elements[0].click();
                await driver.sleep(waitShort);
                elements = await OneStop.getElementsByCSS('.view.FindAssetsContainerView.active');
                const element = await elements[0].findElement(
                    By.css('.view-container-view > .panel-header > .bound-visible > .panel-title > .bound-visible-inline')
                );
                const text = await element.getText();
                expect(text).to.equal('Quick Search');
            });
        }

        if (quickSearchParameters.linkToClick && quickSearchParameters.expectedTextValue) {
            it('clicking ' + quickSearchParameters.linkToClick + ' link brings up ' +
                quickSearchParameters.expectedTextValue + ' section', async () => {
                const clickQuickSearchLinkElement = async (element) => {
                    //find the element by its name
                    const element2 = element;
                    const linkText = await element.getText();
                    if (linkText === quickSearchParameters.linkToClick) {
                        await element2.click();

                        //check title text
                        await OneStop.waitForObjectLoad('.view.DataFrameViewContainer.active', waitLong * 15, waitShort, true);
                        const elements = await OneStop.getElementsByCSS('.view.DataFrameViewContainer.active');
                        await OneStop.waitForObjectLoad('.panel-title > .bound-visible-inline', waitLong * 5, waitShort, true);
                        const element = await elements[0].findElement(By.css('.panel-title > .bound-visible-inline'));
                        const elementText = await element.getText();
                        expect(elementText).to.equal(quickSearchParameters.expectedTextValue);
                    }
                };

                const elements = await OneStop.getElementsByCSS('.view.FindAssetsView.active a');
                for (let i = 0; i < elements.length; i++) {
                    await clickQuickSearchLinkElement(elements[i]);
                }
            });

            //if 'quickSearchParameters.resultsGridSectionTitle' exists then
            if (quickSearchParameters.resultsGridSectionTitle) {
                //console.log('quickSearchParameters.searchParameters: ' + quickSearchParameters.searchParameters);
                //if the clicked link is not one of the ones below then do the search and validate
                if (quickSearchParameters.linkToClick !==
                    'Pipeline Licences, Pipeline Licence Installations and Dispositions (AER)' &&
                    quickSearchParameters.linkToClick !== 'Find Assets by Area' &&
                    quickSearchParameters.linkToClick !== 'Assets for Reclamation') { //TODO: Val, fix this crap :) (no data values in machine)

                    let columnTitle;
                    let selectedItemValue = [];

                    if (!quickSearchParameters.searchParameters ||
                        quickSearchParameters.searchParameters.length === 1) {
                        // 1.1 TYPE THE VALUE
                        if (quickSearchParameters.linkToClick === 'Disposition') {
                            it('type the value to search for it', async () => {
                                await OneStop.waitForObjectLoad('input[id^="formitem-"]', waitLong * 5, 1000, true);
                                const element = await driver.findElement(By.css('input[id^="formitem-"]'));
                                await element.click();
                                await driver.sleep(100);
                                await OneStop.setTextFieldValueByCSS('input[id^="formitem-"]', quickSearchParameters.searchParameters[0].valueToSearch);
                            });
                        } else {
                            it('type the value to search for it', async () => {
                                const element = await driver.findElement(By.css('.autocomplete-input input'));
                                await element.click();
                                await driver.sleep(100);
                                //temporary click on a label until the dropdown will be removed from this case (disposition) - next deployment
                                if (!quickSearchParameters.searchParameters) {
                                    await OneStop.setTextFieldValueByCSS('.autocomplete-input input', '1');
                                } else if (quickSearchParameters.searchParameters.length === 1) {
                                    await OneStop.setTextFieldValueByCSS('.autocomplete-input input', quickSearchParameters.searchParameters[0].valueToSearch);
                                    await driver.sleep(500);
                                    await OneStop.clickElementByCSS("div[class^='view View-'] .form-desc");
                                    await driver.sleep(1000);
                                }
                            });
                        }

                        // 1.2 IF AUTOCMPLETE DROPDOWN EXISTS -> RETRIEVE THE 1ST VALUE AND CLICK ON IT TO SELECT IT
                        if (!quickSearchParameters.searchParameters) {
                            it('retrieve the text value of the selected record', async () => {
                                await OneStop.waitForObjectLoad('.autocomplete-menu li:nth-child(1)', waitLong * 20, 500, true);
                                const element = await driver.findElement(By.css('.autocomplete-menu li:nth-child(1)'));
                                const elementText = await element.getText();
                                if (elementText.includes('-')) {
                                    selectedItemValue = elementText.split('-');
                                } else {
                                    selectedItemValue.push(elementText);
                                }
                            });

                            it('select the first value from the dropdown', async () => {
                                const element = await driver.findElement(By.css('.autocomplete-menu li:nth-child(1)'));
                                await element.click();
                                await driver.sleep(500);
                            });

                            // 1.2 IF NOT AUTOCOMPLETE JUST TYPE THE VALUE
                        } else if (quickSearchParameters.searchParameters &&
                            quickSearchParameters.searchParameters.length === 1) {
                            it('set the text value of the selected record', async () => {
                                if (quickSearchParameters.searchParameters[0].valueToSearch.includes('-')) {
                                    selectedItemValue = quickSearchParameters.searchParameters[0].valueToSearch.split('-');
                                } else {
                                    selectedItemValue.push(quickSearchParameters.searchParameters[0].valueToSearch);
                                }
                                await driver.sleep(100);
                            });
                        }
                    }

                    // 2.1 if the 'quickSearchParameters.searchParameters' exists then run the special case(s), else search
                    // IF SPECIAL CASE -> HANDLE IT
                    if (quickSearchParameters.searchParameters && quickSearchParameters.searchParameters.length > 1) {
                        if (quickSearchParameters.expectedTextValue === 'Query by BA Code') {
                            let radioBtnIndex;

                            it('set the text value of the selected record', async () => {
                                selectedItemValue.push(quickSearchParameters.searchParameters[1].queryParameter);
                                await driver.sleep(100);
                            });

                            it('select ' + quickSearchParameters.searchParameters[0].queryLayer + ' as a query layer',
                                async () => {
                                    if (quickSearchParameters.searchParameters[0].queryLayer === 'Pipelines')
                                        radioBtnIndex = 0;
                                    if (quickSearchParameters.searchParameters[0].queryLayer === 'Facility Licences')
                                        radioBtnIndex = 1;
                                    if (quickSearchParameters.searchParameters[0].queryLayer === 'Well Licences (surface hole)')
                                        radioBtnIndex = 2;

                                    //retrieve the index for the radio button
                                    const elements = await driver.findElements(
                                        By.css('div[class^="view View-"] tbody td:nth-child(2) input'));
                                    await elements[radioBtnIndex].click();
                                });

                            it('type ' + quickSearchParameters.searchParameters[1].queryParameter +
                                ' as a query parameter', async () => {
                                await driver.wait(until.elementLocated(
                                    By.css('div[class^="view View-"] input[id^="formitem-"]')), waitLong * 5);
                                const element = await driver.findElement(
                                    By.css('div[class^="view View-"] input[id^="formitem-"]'));
                                await driver.wait(until.elementIsVisible(element), waitLong);
                                await element.clear();
                                await element.sendKeys(quickSearchParameters.searchParameters[1].queryParameter);
                                await driver.sleep(100);
                            });

                            it('specify if it is a spatial search', async () => {
                                (quickSearchParameters.searchParameters[2].isSpatialSearch === 'User Current Map Extent') ?
                                    radioBtnIndex = 3 : radioBtnIndex = 4;

                                const elements = await driver.findElements(
                                    By.css('div[class^="view View-"] tbody td:nth-child(2) input'));
                                await elements[radioBtnIndex].click();
                            });

                            //3.1 CLICK SEARCH BUTTON
                            it('click search button', async () => {
                                await OneStop.clickElementByCSS('div[class^="view View-"] .form-btns button:nth-child(1)');
                            });

                            //3.2 Wait until the loading elements disappear - .loading-img.bound-visible & .status-indicator.anim-zoom-in.region-active
                            it('wait for the map to fully load after the search - top left section\'s loading spinner is gone',
                                async () => {
                                    await OneStop.waitForPageLoad();

                                    //check if the loading spinner on the top left section is displayed and wait for it to go away
                                    let elements = await driver.findElements(By.css('.loading-img.bound-visible'));
                                    if (elements.length > 0) {
                                        await driver.wait(until.stalenessOf(elements[0]), waitLong * 70);
                                        await driver.sleep(waitShort);
                                    }
                                });

                            //3.3 Wait until the loading elements disappear - .loading-img.bound-visible & .status-indicator.anim-zoom-in.region-active
                            it('wait for the map to fully load after the search - bottom loading spinner is gone',
                                async () => {
                                    await OneStop.waitForPageLoad();

                                    //check if the loading spinner on the bottom of the map section is displayed and wait for it to go away
                                    const elements = await driver.findElements(
                                        By.css('.status-indicator.anim-zoom-in.region-active'));
                                    if (elements.length > 0) {
                                        await driver.wait(until.elementIsNotVisible(elements[0]), waitLong * 100);
                                        await driver.sleep(waitShort);
                                    }
                                });
                        }
                    } else {
                        //3.1 CLICK CONTINUE BUTTON
                        it('click continue button', async () => {
                            await OneStop.clickElementByCSS('.workflow-form .form-btns .button:nth-child(1)');
                        });

                        //3.2 Wait until the loading elements disappear - .loading-img.bound-visible & .status-indicator.anim-zoom-in.region-active
                        it('wait for the map to fully load after the search - top left section\'s loading spinner is gone',
                            async () => {
                                await OneStop.waitForPageLoad();

                                //check if the loading spinner on the top left section is displayed and wait for it to go away
                                const elements = await driver.findElements(By.css('.loading-img.bound-visible'));
                                if (elements.length > 0) {
                                    await driver.wait(until.stalenessOf(elements[0]), waitLong * 70);
                                    await driver.sleep(waitShort);
                                }
                            });

                        //3.3 Wait until the loading elements disappear - .loading-img.bound-visible & .status-indicator.anim-zoom-in.region-active
                        it('wait for the map to fully load after the search - bottom loading spinner is gone', async () => {
                            await OneStop.waitForPageLoad();

                            //check if the loading spinner on the bottom of the map section is displayed and wait for it to go away
                            const elements = await driver.findElements(By.css('.status-indicator.anim-zoom-in.region-active'));
                            if (elements.length > 0) {
                                await driver.wait(until.elementIsNotVisible(elements[0]), waitLong * 100);
                                await driver.sleep(waitShort);
                            }
                        });
                    }

                    it('wait for the bottom grid to load', async () => {
                        const elements = driver.findElements(
                            By.css('div[class^="view View-"] .loading-container.bound-visible'));
                        if (elements.length) {
                            await driver.wait(until.elementIsNotVisible(element), waitLong * 70);
                            await driver.sleep(waitShort);
                        }

                        await OneStop.waitForObjectLoad('.bottom-region.region-active', waitLong * 10, 500, true);
                        await OneStop.waitForObjectLoad('.FindAssetsContainerView.active span[title="Quick Search"]',
                            waitLong * 25, 1000, true);
                    });

                    it('bottom grid\'s title is ' + quickSearchParameters.resultsGridSectionTitle, async () => {
                        await OneStop.waitForObjectLoad('.bottom-region.region-active .panel-title', waitLong * 30, 500, true);
                        const element = await driver.findElement(By.css('.bottom-region.region-active .panel-title'));
                        await driver.wait(until.elementIsVisible(element), waitLong * 30);
                        await driver.wait(until.elementIsEnabled(element), waitLong * 20);
                        const elementText = await element.getText();
                        expect(elementText.toLowerCase()).to.contain((quickSearchParameters.resultsGridSectionTitle).toLowerCase());
                    });

                    it('searched ' + selectedItemValue + ' record was returned in the grid', async () => {
                        const findNeededColumnsAndValues = async (requiredColumnsCounter) => {
                            const elements = await driver.findElements(By.css('.bound-visible .results-table th.bound-visible .result-heading'));
                            for (let colsIndex = 0; colsIndex < elements.length; colsIndex++) {
                                await validateGridRecords(elements, requiredColumnsCounter, colsIndex);
                            }
                        };

                        const validateGridRecords = async (elements, requiredColumnsCounter, colsIndex) => {
                            const columnName = await elements[colsIndex].getText();
                            if (columnName === columnTitle[requiredColumnsCounter]) {
                                const elements = await driver.findElements(
                                    By.css('.bound-visible .results-table tbody:nth-child(2) td.bound-visible button'));
                                await driver.wait(until.elementIsVisible(elements[colsIndex]), waitLong * 15);
                                const gridTextValue = await elements[colsIndex].getText();
                                expect(gridTextValue).to.equal(selectedItemValue[requiredColumnsCounter]);
                            }
                        };

                        //A5RD  or 0G30 or 0144 for: Well, Facility and Pipeline Licences by BA Code (INTERNAL)
                        columnTitle = (quickSearchParameters.resultsGridColumnTitle).split('~');
                        for (let requiredColumnsCounter = 0;
                             requiredColumnsCounter < columnTitle.length;
                             requiredColumnsCounter++) {
                            await findNeededColumnsAndValues(requiredColumnsCounter);
                        }
                    });
                } else {
                    it('clicking select by polygon btn shows the \'draw a polygon on the map\' popup', async () => {
                        await driver.sleep(waitLong);
                        await OneStop.clickElementByCSS('.geometry-type-polygon');
                        await OneStop.waitForObjectLoad('.status-msg-container', waitLong, 500, true);
                        const element = await driver.findElement(By.css('.status-msg-container span'));
                        const elementText = await element.getText();
                        expect(elementText).to.equal('Draw a polygon on the map. Double-click or tap to finish.');
                    });

                    it('clicking select by rectangle btn shows the \'draw a rectangle on the map\' popup', async () => {
                        await OneStop.clickElementByCSS('.geometry-type-extent');
                        await OneStop.waitForObjectLoad('.status-msg-container', waitLong, 500, true);
                        const element = await driver.findElement(By.css('.status-msg-container span'));
                        const elementText = await element.getText();
                        expect(elementText).to.equal('Draw a rectangle on the map.');
                    });

                    if (quickSearchParameters.linkToClick ===
                        'Pipeline Licences, Pipeline Licence Installations and Dispositions (AER)' ||
                        quickSearchParameters.linkToClick === 'Assets for Reclamation') {
                        it('clicking select by point btn shows the \'select a point on the map\' popup', async () => {
                            await OneStop.clickElementByCSS('.geometry-type-mappoint');
                            await OneStop.waitForObjectLoad('.status-msg-container', waitLong, 500, true);
                            const element = await driver.findElement(By.css('.status-msg-container span'));
                            const elementText = await element.getText();
                            expect(elementText).to.equal('Select a point on the map.');
                        });

                        it('clicking select by polyline btn shows the \'draw a line on the map\' popup', async () => {
                            await OneStop.clickElementByCSS('.geometry-type-polyline');
                            await OneStop.waitForObjectLoad('.status-msg-container', waitLong, 500, true);
                            const element = await driver.findElement(By.css('.status-msg-container span'));
                            const elementText = await element.getText();
                            expect(elementText).to.equal('Draw a line on the map. Double-click to finish.');
                        });
                    }
                }
            }
        }

        if (quickSearchParameters.clickCloseBtn) {
            it('clicking ' + quickSearchParameters.expectedTextValue + ' side menu close button closes menu', async () => {
                const elements = await OneStop.getElementsByCSS('.view.DataFrameViewContainer.active');
                const element = await elements[0].findElement(By.css('button.close-16'));
                await element.click();
                await driver.sleep(500);
            });
        }
    };

    OneStop.validateLayersList = (menuItem, rootPath, itemSelector, layerLevel) => {

        if (!menuItem.hidden) {
            const endOfPath = '.layer-contents>.display-name';
            let newRootPath = rootPath.replace(' .parent-layer ' + endOfPath,
                '>*[role="treeitem"]') + ' ' + itemSelector + ' ' + endOfPath;
            let menuItemExpander = rootPath.replace(' ' + endOfPath, '') + ' ' +
                itemSelector + ' .layer-item-expander>button';

            if (layerLevel === 0) {

            } else if (layerLevel === 1) {
                newRootPath = newRootPath.replace(' ' + endOfPath, '').replace(' ' + itemSelector,
                    '>div.bound-visible>ul' + itemSelector + '>li>div.layer-info>div' + endOfPath);

                menuItemExpander = newRootPath.replace('.layer-info>div' + endOfPath, '.layer-item-expander > button');
            } else if (layerLevel === 2) {
                newRootPath = rootPath.replace('div.layer-info>div' + endOfPath,
                    'ul>ul' + itemSelector + '>li>div.layer-info>div' + endOfPath);

                menuItemExpander = newRootPath.replace('.layer-info>div' + endOfPath, '.layer-item-expander>button');
            } else if (layerLevel === 3) {
                newRootPath = rootPath.replace('div.layer-info>div' + endOfPath,
                    'ul>ul' + itemSelector + '>li>div.layer-info>div' + endOfPath);
            }

            let menuItemPath = newRootPath;
            let buttonItemPath;

            describe(menuItem.layerName + ' layer', async () => {
                it('layer label is: ' + menuItem.layerName, async () => {
                    const elements = await OneStop.getElementsByCSS(menuItemPath);
                    const text = await elements[0].getText();
                    expect(text).to.equal(menuItem.layerName);
                });

                it('detect if ' + menuItem.layerName + ' layer\'s checkbox is selected and check it', async () => {
                    let layerCheckbox = menuItemPath.replace('>.display-name', ' input[type="checkbox"]');
                    const checkbox = await driver.findElement(By.css(layerCheckbox));
                    const isSelected = await checkbox.isSelected();
                    if (!isSelected) {
                        await driver.findElement(By.css(layerCheckbox)).click();
                    }
                });

                if (layerLevel > 0 && !menuItem.subMenu) {
                    if (!menuItem.exception) {
                        it('click layer actions (right arrow) button', async () => {
                            buttonItemPath = menuItemPath.replace('>div.layer-info>div.layer-contents>.display-name',
                                ' .layer-actions>button');
                            await OneStop.clickElementByCSS(buttonItemPath);
                            await driver.sleep(500);
                        });

                        it('validate the section and correct title is loaded', async () => {
                            const element = await driver.findElement(By.css('.LayerDataContainerView .panel-title span.bound-visible-inline'));
                            const elementText = await element.getText();
                            expect(elementText).to.equal(menuItem.layerName);
                        });

                        it('click x button to close the right side layer action section', async () => {
                            await OneStop.clickElementByCSS('.LayerDataContainerView button[title="Close Panel"]');
                            await driver.sleep(500);
                        });
                    }
                }

                if (menuItem.subMenu && menuItem.subMenu.length > 0) {
                    it('expand layer ' + menuItem.layerName, async () => {
                        const elements = await OneStop.getElementsByCSS(menuItemExpander);

                        //handle the cases where the sub-menu is expanded as default - no click
                        const element = await elements[0].getAttribute('class');
                        if (element.includes('collapsed')) {
                            await elements[0].click();
                            await driver.sleep(100);
                        }
                    });

                    for (let i = 0; i < menuItem.subMenu.length; i++) {
                        if (!menuItem.hidden) {
                            OneStop.validateLayersList(menuItem.subMenu[i], newRootPath, '.layers:nth-child(' + (i + 1) + ')', layerLevel + 1);
                        }
                    }
                }
            });
        } else {
            it(menuItem.layerName + ' layer is hidden', async () => {});
        }
    };

    return OneStop;
})();

module.exports = OneStop;