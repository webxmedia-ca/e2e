/**
 * Created by cb5rp on 6/1/2017.
 */

/* jshint -W024 */
/* jshint -W014 */

const expect = require('chai').expect;

const OneStop = (() => {
    let driver = null
        , By = null
        , until = null
        , waitShort = 2000
        , waitLong = 5000
        , initialized = false
        , harnessObj = null
        , username = ""
        , password = ""
        , baseUrl = ""
        , displayName = ""
        , env = {}
        , appType = ""
        , appSubType = ""
        , failureFatal = false;

    const OneStop = {};

    OneStop.getAttrs = () => {
        const attrs = {};

        attrs.driver = driver;
        attrs.By = By;
        attrs.until = until;
        attrs.waitShort = waitShort;
        attrs.waitLong = waitLong;
        attrs.initialized = initialized;
        attrs.harnessObj = harnessObj;
        attrs.username = username;
        attrs.password = password;
        attrs.baseUrl = baseUrl;
        attrs.displayName = displayName;
        attrs.env = env;
        attrs.appType = appType;
        attrs.appSubType = appSubType;

        return attrs;
    };

    OneStop.initBase = (harnessObjIn, waitShortIn, waitLongIn) => {
        /*
        *   description: initializes the module.
        *
        *   Parameters:
        *       harnessObjIn - the harness object running the module
        *       waitShortIn - the short wait internal
        *       waitLongIn - the long wait interval
        *
        */

        harnessObj = harnessObjIn;

        driver = harnessObj.driver;
        By = harnessObj.By;
        until = harnessObj.until;

        waitShort = waitShortIn ? waitShortIn : waitShort;
        waitLong = waitLongIn ? waitLongIn : waitLong;

        username = harnessObj.username;
        password = harnessObj.password;

        baseUrl = harnessObj.baseUrl;
        appType = harnessObj.getAppType();
        appSubType = harnessObj.getAppSubType();

        failureFatal = harnessObj.failureFatal;

        initialized = true;
    };

    OneStop.init = (harnessObjIn, waitShortIn, waitLongIn) => {
        /*
        *   description: calls init base.  is overridden by other modules on inheritance
        *
        *   Parameters:
        *       harnessObjIn - the harness object running the module
        *       waitShortIn - the short wait internal
        *       waitLongIn - the long wait interval
        *
        */

        OneStop.initBase(harnessObjIn, waitShortIn, waitLongIn);
    };

    OneStop.getBaseUrl = () => {
        return baseUrl;
    };

    OneStop.setBaseUrl = (url) => {
        baseUrl = url;
    };

    OneStop.getDisplayName = () => {
        return displayName;
    };

    OneStop.errorHandler = (err) => {
        console.log("ErrorHandler", err);
    };

    OneStop.afterEachTest = async (test) => {
        if (failureFatal) {
            if (test.state === 'failed') {
                console.log('---------------------------------------------------------------');
                console.log(test.err.stack);
                console.log('END: exiting after failed test');
                console.log('---------------------------------------------------------------');
                await harnessObj.quit();
                process.exit(5);
            }
        }
    };

    OneStop.login = async (overrideUrl) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will run the browser to the given URL (URL is read from the *.config.json file)
                        will type the username and password (from the *.config.json file)
                        will click the "Login" button and wait for the page to load
                        will wait for the Disclaimer popup and hit on the "Agree" button
                        will wait for the default page to load (check for navbar & display name to be displayed/loaded)

        ACCEPTED PARAMETER(S) AND VALUES:   none - all of these are gathered from the *.config.json file)
        USAGE:  OneStop.login(done);
        ----------------------------------------------------------------------------------------------------------------- */
        if (!initialized) {
            console.log('OneStopApp not initialized!: Please make a call to init prior to trying to use module.');
            throw "Not Initialized";
        }

        await driver.manage().window().maximize();

        let url = "";
        if (overrideUrl) {
            url = overrideUrl + '/';
        } else {
            url = baseUrl + '/';
        }

        //run the browser to the specific url
        await driver.get(url);
        await OneStop.waitForPageLoad();

        // Hide the feedback button
        await OneStop.setElementAttributeByCSS('#feedback-button', 'style', 'display:none');

        await driver.findElement(By.name('username')).sendKeys(username);
        await driver.findElement(By.name('password')).sendKeys(password);

        // login user
        await OneStop.clickElementByCSS('.btn-login');
        // await OneStop.waitForPageLoad();

        // wait for the disclaimer to appear
        await OneStop.waitForObjectLoad('.agree', waitLong, 100, true);

        //click on 'I Agree' button in the Disclaimer form
        await OneStop.clickElementByCSS('.agree');
        await OneStop.waitForPageLoad();

        // wait for the navbar to redraw
        await driver.wait(until.elementLocated(By.css('.header-user-info label')), waitLong);

        // store display name
        element = await driver.findElement(By.css('.header-user-info label'));
        await driver.wait(until.elementIsVisible(element), waitShort);
        const text = await element.getText();
        displayName = text.slice(9, text.indexOf('!'));
    };

    OneStop.loginAep = async (env, type) => {
        if (!initialized) {
            console.log('OneStopApp not initialized!: Please make a call to init prior to trying to use module.');
            throw "Not Initialized";
        }

        await driver.manage().window().maximize();

        if (env.includes('cloud')) {
            console.log("cloud login");
            if (type.includes('external')) {
                console.log("external login");
                OneStop.setBaseUrl(harnessObj.configJson.baseUrlExt);
                await OneStop.loginAepCloudExternal(OneStop.getBaseUrl());
            } else if (type.includes('internal')) {
                console.log("internal login");
                OneStop.setBaseUrl(harnessObj.configJson.baseUrlInt);
                await OneStop.loginAepCloudInternal(OneStop.getBaseUrl());
            }
        } else {
            console.log("on-prem login");
            await OneStop.loginAepOnPrem(baseUrl);
        }
    };

    OneStop.loginAepOnPrem = async (url) => {
        //run the browser to the specific url
        await driver.get(url);

        await OneStop.waitForObjectLoad('#signin-eim', waitLong, waitShort, true);

        await driver.findElement(By.name('otds_username')).sendKeys(username);
        await driver.findElement(By.name('otds_password')).sendKeys(password);

        // login user
        await driver.findElement(By.css('input[value="Sign in"].button')).click();

        await OneStop.waitForPageLoad();

        await OneStop.waitForObjectLoad('.agree', waitLong, 100, true);

        //hide the feedback button -- not needed in AEP (uncomment if a case where need to hide it is found
        // OneStop.setElementAttributeByCSS('#feedback-button', 'style', 'display:none');
        await OneStop.waitForPageLoad(async () => {
            await OneStop.setElementAttributeByCSS('#feedback-button', 'style', 'display:none'); // Hide the feedback button
        });

        // wait for the disclaimer to appear
        await driver.wait(until.elementLocated(By.css('.agree')), waitLong);

        //click on 'I Agree' button in the Disclaimer form
        let element = await driver.findElement(By.css('.agree'));
        await driver.wait(until.elementIsVisible(element), waitLong);
        await element.click();
        await OneStop.waitForPageLoad();

        // wait for the navbar to redraw
        await driver.wait(until.elementLocated(By.css('.header-user-info label')), waitLong);

        // store display name
        element = await driver.findElement(By.css('.header-user-info label'));
        await driver.wait(until.elementIsVisible(element), waitShort);
        const text = await element.getText();
        displayName = text.slice(9, text.indexOf('!'));
    };

    OneStop.loginAepCloudExternal = async (url) => {
        //run the browser to the specific url
        await driver.get(url);

        await OneStop.clickElementByCSS('*[data-idp="madi"]');
        await OneStop.waitForObjectLoad('.login-card', waitLong, waitShort, true);

        await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys(username);
        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys(password);

        // login user
        await driver.findElement(By.css('button.btn.btn-primary.btn-lg.mb-3')).click();

        // wait for login to complete
        await driver.sleep(waitShort);
        await OneStop.waitForPageLoad();
        await OneStop.waitForObjectLoad('.agree', waitLong, 100, true);

        await OneStop.waitForPageLoad();

        // hide the feedback button -- not needed in AEP (uncomment if a case where need to hide it is found
        await OneStop.setElementAttributeByCSS('#feedback-button', 'style', 'display:none');

        // wait for the disclaimer to appear
        await driver.wait(until.elementLocated(By.css('.agree')), waitLong);

        //click on 'I Agree' button in the Disclaimer form
        let element = await driver.findElement(By.css('.agree'));
        await driver.wait(until.elementIsVisible(element), waitLong);
        await element.click();
        await OneStop.waitForPageLoad();

        // wait for the navbar to redraw
        await driver.wait(until.elementLocated(By.css('.header-user-info label')), waitLong);

        // store display name
        element = await driver.findElement(By.css('.header-user-info label'));
        await driver.wait(until.elementIsVisible(element), waitShort);
        const text = await element.getText();
        displayName = text.slice(9, text.indexOf('!'));
    };

    OneStop.loginAepCloudInternal = async (url) => {
        // const base64 = require('base-64');

        // add creds onto url
        // url = url.replace('//', '//' + username + ':' + password + '@');
        await driver.get(url);
        await driver.sleep(waitShort);

        // add creds to header
        // const authHeader = "Basic " + base64.encode(username+":"+password);
        // driver.addHeader("Authorization", authHeader);
        // await driver.get(url);
        // await driver.sleep(waitLong);

        // hack alert: have to load login page and then add basic creds onto the login url
        let currentUrl = await driver.getCurrentUrl();
        currentUrl = currentUrl.replace('//', '//' + username + ':' + password + '@');
        await driver.get(currentUrl);
        await driver.sleep(waitShort);

        // try {
        //     // login user
        //     // const alert = await driver.switchTo().alert();
        //
        //     const alert = await driver.switchTo().activeElement();
        //     console.log("alert", alert);
        //
        //     driver.
        //     console.log("username:", username);
        //     console.log("password:", password);
        //
        //     // driver.sendKeys(username);
        //     // driver.sendKeys("\ue004");
        //     // driver.sendKeys(password);
        //     // driver.sendKeys("\ue007");
        //
        //     await driver.sleep(waitLong);
        //
        // } catch (err){
        //     console.log("err", err);
        // }
        //
        // await driver.switchTo().defaultContent();

        await OneStop.waitForPageLoad();

        await OneStop.waitForObjectLoad('.agree', waitLong, 100, true);

        //hide the feedback button -- not needed in AEP (uncomment if a case where need to hide it is found
        // OneStop.setElementAttributeByCSS('#feedback-button', 'style', 'display:none');
        await OneStop.waitForPageLoad(async () => {
            await OneStop.setElementAttributeByCSS('#feedback-button', 'style', 'display:none'); // Hide the feedback button
        });

        // wait for the disclaimer to appear
        await driver.wait(until.elementLocated(By.css('.agree')), waitLong);

        //click on 'I Agree' button in the Disclaimer form
        let element = await driver.findElement(By.css('.agree'));
        await driver.wait(until.elementIsVisible(element), waitLong);
        await element.click();
        await OneStop.waitForPageLoad();

        // wait for the navbar to redraw
        await driver.wait(until.elementLocated(By.css('.header-user-info label')), waitLong);

        // store display name
        element = await driver.findElement(By.css('.header-user-info label'));
        await driver.wait(until.elementIsVisible(element), waitShort);
        const text = await element.getText();
        displayName = text.slice(9, text.indexOf('!'));
    };

    OneStop.popUpConfirmation = async (message, waitDelay) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will wait for a confirmation popup to be displayed
                        will validate that the text within the popup is correct based on the given parameter

        ACCEPTED PARAMETER(S) AND VALUES:
        message:    "any text"
        waitDelay:  5000   - a wait time in miliseconds (5000 = 5 seconds)

        USAGE:  OneStop.popUpConfirmation("the text to be validated", 3000, done);
        ----------------------------------------------------------------------------------------------------------------- */
        await OneStop.waitForPageLoad();
        await OneStop.waitForObjectLoad('.message-success .messenger-message-inner', waitDelay, 1000);
        const value = await OneStop.getElementValueByCSS('.message-success .messenger-message-inner');
        expect(value).to.contain(message);
    };

    OneStop.acceptDisclaimer = (disclaimerButtonCss, actionButtonCss) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will click on the Accept Disclaimer button
                        then will click the action button based on the given parameter

        ACCEPTED PARAMETER(S) AND VALUES:
        disclaimerButtonCss: css for the disclaimer button to click
        actionButtonCss: css for the action button to click

        USAGE:  OneStop.acceptDisclaimer("#disclaimer", ".agree");
        ----------------------------------------------------------------------------------------------------------------- */
        it('click accept disclaimer button', async () => {
            await OneStop.clickElementByCSS(disclaimerButtonCss);
            await OneStop.waitForObjectLoad('.modal-body p', 10000, 500);
        });

        it('click ' + actionButtonCss + ' button', async () => {
            await OneStop.clickElementByCSS('.modal-footer ' + actionButtonCss);
            await OneStop.waitForPageLoad();
        });
    };

    OneStop.confirmSubmission = (headerText, action) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will click the "Yes" or "No" button in a modal dialog (OK, Yes, No)

        ACCEPTED PARAMETER(S) AND VALUES:
        action: "yes" OR "no"   - only one of these values are accepted and will work, non capitals required

        USAGE:  OneStop.confirmSubmission("yes");   OR  OneStop.confirmSubmission("no");
        ----------------------------------------------------------------------------------------------------------------- */
        OneStop.confirmModalHeader(headerText);

        it('click ' + action + ' button', async () => {
            await OneStop.clickElementByCSS('.modal-dialog .btn-' + action);
            await OneStop.waitForPageLoad();
        });
    };

    OneStop.confirmAlertDialog = (confirmationText) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will validate the text from an alert dialog by given text parameter
                        then will click the "Close" button to close the dialog

        ACCEPTED PARAMETER(S) AND VALUES:
        confirmationText:   "Thank you for your submission."

        USAGE:  OneStop.confirmAlertDialog("Thank you for your submission.");
        ----------------------------------------------------------------------------------------------------------------- */
        it('alert dialog appears with text: ' + confirmationText, async () => {
            const text = await OneStop.getElementValueByCSS('.modal-body');
            expect(text).to.equal(confirmationText);

            const elements = await OneStop.getElementsByCSS('.modal-footer .btn-close');
            elements[0].click();
        });
    };

    OneStop.confirmModalHeader = (headerText) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will validate the title text from a modal dialog header

        ACCEPTED PARAMETER(S) AND VALUES:
        headerText:   string

        USAGE:  OneStop.confirmModalHeader("Header Text");
        ----------------------------------------------------------------------------------------------------------------- */
        it('modal dialog appears with header text: ' + headerText, async () => {
            await OneStop.waitForObjectLoad('.modal', waitShort, 500);
            const text = await OneStop.getElementValueByCSS('.modal-title');
            expect(text).to.equal(headerText);
        });
    };

    OneStop.validateDisplayedText = (cssLocator, expectedTextValue) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will validate text of any element

        ACCEPTED PARAMETER(S) AND VALUES:
        cssLocator:         the locator of the object containing the text to be validated
        expectedTextValue:  the expected text value

        USAGE:  OneStop.validateDisplayedText('.license-number-notice', 'Note: This Licence number will not be editable once entered.');
        ----------------------------------------------------------------------------------------------------------------- */
        it('validate the object "' + cssLocator + '" contains "' + expectedTextValue + '" text value', async () => {
            const element = await driver.findElement(By.css(cssLocator));
            const text = await element.getText();
            expect(text.toLowerCase()).to.equal(expectedTextValue.toLowerCase());
        });
    };

    OneStop.waitForPageLoad = async () => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will wait while the ".loading-container" object disappears from the screen

        ACCEPTED PARAMETER(S) AND VALUES:
        callBack:   done

        USAGE:  OneStop.waitForPageLoad(done);
        ----------------------------------------------------------------------------------------------------------------- */
        driver.sleep(500);
        if (await !driver.findElements(By.css('.loading-container')).length) {
            const element = await driver.findElement(By.css('.loading-container'));
            await driver.wait(until.elementIsNotVisible(element), waitLong * 25);
            driver.sleep(waitShort);
        }
    };

    OneStop.waitForObjectLoad = async (cssLocator, waitTimeMilliseconds, minWaitMilliseconds, isEnabled) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will wait until an object appears on the screen and is Visible & Enabled = True

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:             #subheader-container
        waitTimeMilliseconds:   60000   -> 60 seconds
        callback:               done

        USAGE:  OneStop.waitForPageLoad("#subheader-container", 60000, done);
        ----------------------------------------------------------------------------------------------------------------- */
        if (minWaitMilliseconds) await driver.sleep(minWaitMilliseconds);
        let element = await driver.wait(until.elementLocated(By.css(cssLocator)), waitTimeMilliseconds);
        element = await driver.wait(until.elementIsVisible(element), waitTimeMilliseconds);
        if (isEnabled) {
            await driver.wait(until.elementIsEnabled(element), waitTimeMilliseconds);
        }
    };

    OneStop.validateAndReport = (validateButtonCss) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function clicks the validate button and logs any validation errors
                        disappears from the screen

        ACCEPTED PARAMETER(S) AND VALUES:
        validateButtonCss:  the css selector of the validate button

        USAGE:  OneStop.validateAndReport('#validate-btn');
        ----------------------------------------------------------------------------------------------------------------- */
        it('no validation errors exist', async () => {
            await OneStop.waitForPageLoad();
            let elements = await driver.findElements(By.css(validateButtonCss));
            if (elements.length > 0) {
                await driver.wait(until.elementIsVisible(elements[0]), waitLong);
                await driver.wait(until.elementIsEnabled(elements[0]), waitLong);
                await elements[0].click();
                await OneStop.waitForPageLoad();
                // this looks for the .has-error
                elements = await OneStop.findElementsByCSS('.has-error .validation-text');
                if (elements.length > 0) {
                    // elements = await OneStop.findElementsByCSS('.has-error');
                    for (let i = 0; i < elements.length; i++) {
                        await logValidationMessages(elements[i]);
                    }
                    if (elements.length > 0) { // <-- force a failed message if validation errors exist
                        await driver.sleep(1000);
                        expect(elements.length).to.equal(0);
                    }
                }
                // this looks for the .grid-error (mmr functionality contains this - Peace River Manual)
                elements = await OneStop.findElementsByCSS('.grid-error');
                if (elements.length > 0) {
                    for (let i = 0; i < elements.length; i++) {
                        await logValidationMessages(elements[i]);
                    }
                    if (elements.length > 0) { // <-- force a failed message if validation errors exist
                        await driver.sleep(1000);
                        expect(elements.length).to.equal(0);
                    }
                }
            }
        });
    };

    const logValidationMessages = async (elementIn) => {
        let elements, element, text;
        elements = await elementIn.findElements(By.css('.control-label'));
        if (elements.length > 0) {
            if (elements[0]) {
                text = await elements[0].getText();
                console.log('LABEL: ' + text);
            }
        }

        elements = await elementIn.findElements(By.css('.validation-text'));
        if (elements.length > 0) {
            if (elements[0]) {
                text = await elements[0].getText();
                console.log('ERROR: ' + text);
            }
        }

        // if (elementIn) {
        //      element = await element.findElement(By.xpath('..'));
        //     text = await elementIn.getText();
        //     console.log('ERROR: ' + text);
        // }
    };

    let errorMessages = '';
    const logErrorMessages = (elements, errorsCssLocator) => {
        let errorMessage = '';

        return new Promise(() => {
            elements.forEach(async (element) => {
                const labelElement = await element.findElement(By.css('label'));

                if (labelElement) {
                    const labelElementText = await labelElement.getText();
                    //find the error message
                    const validationTextErrorElement = element.findElement(By.css(errorsCssLocator));
                    if (validationTextErrorElement) {
                        const validationTextErrorValue = validationTextErrorElement.getText();
                        //throw 'next text validation error returned: "' + validationTextErrorValue + '"';
                        errorMessage = 'label ' + labelElementText + ': ****************************************************************\nvalidation error: "' + validationTextErrorValue + '"\n';
                        errorMessages = errorMessages + errorMessage;
                    }
                }
            });

            setTimeout(() => {
                if (errorMessages.length > 0) {
                    reject(errorMessages);
                } else if (errorMessages.length === 0) {
                    resolve();
                }
            }, 1000);
        });
    };

    OneStop.checkErrorsExist = (expectedConditions) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will check if an error exists on the screen and will report based on the expectations

        ACCEPTED PARAMETER(S) AND VALUES:
        expectedConditions: boolean (true or false) based on if we expect and error or not

        USAGE:  OneStop.checkErrorsExist(false);
        ----------------------------------------------------------------------------------------------------------------- */
        //1. small bottom right-side popup
        it('check if errors exist in the bottom right popup, expected: ' + expectedConditions, async () => {
            await OneStop.waitForPageLoad();
            const elements = await OneStop.findElementsByCSS('.messenger-first .alert.error');
            if ((expectedConditions === false && elements.length > 0) || (expectedConditions === true && elements.length === 0)) {
                const element = driver.findElement(By.css('.messenger-first .alert.error .messenger-message-inner'));
                const elementText = element.getText();
                throw 'next popup error returned: "' + elementText + '"';
            }
        });

        //2. text validation error within a dialog
        it('check if text validation errors exist, expected: ' + expectedConditions, async () => {
            let elements = await OneStop.findElementsByCSS('.has-error'); // .validation-text
            if ((expectedConditions === false && elements.length > 0) || (expectedConditions === true && elements.length === 0)) {
                elements = await OneStop.findElementsByCSS('.has-error');
                //loop through all elements and retrieve the error message
                await logErrorMessages(elements, '.validation-text')
                    .then(() => {
                        console.log('no errors found');
                    }).catch((errorCollection) => {
                        console.log(errorCollection);
                        throwError(errorCollection);
                    });
            }
        });
    };


    OneStop.clickSave = () => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function clicks the save button and  will wait while the ".loading-container" object
        disappears from the screen

        ACCEPTED PARAMETER(S) AND VALUES:
        none

        USAGE:  OneStop.clickSave();
        ----------------------------------------------------------------------------------------------------------------- */

        OneStop.validateAndReport('#validate-btn'); //clicks validation button if it exists

        it('click save', async () => {
            await OneStop.waitForPageLoad();
            await OneStop.clickElementByCSS('.btn-save');
            await OneStop.waitForPageLoad();
        });
    };

    OneStop.clickOnTabByText = (tabNameToClick, waitObjectCssLocator) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function clicks on a tab button

        ACCEPTED PARAMETER(S) AND VALUES:
        tabNameToClick:         "Authorization" OR "Application Details"    - any text seen in the browser located on a tab
        waitObjectCssLocator:   the css locator of an object to be waited after the click is done
        NOTE: the tabs are always <ul> with <li> and <a> containing a text - the name of the tab usually

        XPath Examples (code builds them like this):
            //li/a[contains(text(), 'Notification')]    //where 'Notification' is the given parameter
            //li/a[text()='Authorization']              //where 'Authorization' is the given parameter

        USAGE:  OneStop.clickOnTabByText('Authorization', 'a[aria-controls="AuthorizationSearchPanelBody"]');
        ----------------------------------------------------------------------------------------------------------------- */
        it('find the ' + tabNameToClick + ' tab and click on it', async () => {
            await OneStop.waitForObjectLoad('ul.nav-tabs', waitLong, 500, true);
            await OneStop.waitForPageLoad();

            const xpath = '//li/a[text()="' + tabNameToClick + '"]';
            await OneStop.clickElementByXPath(xpath);
            await OneStop.waitForPageLoad();
            await OneStop.waitForObjectLoad(waitObjectCssLocator, waitLong * 3, 500, true);
        });
    };

    OneStop.clickTopMenuItems = (menuName, submenuName, expectedCssLocator) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function clicks on a top menu item then a submenu link by their css locators
                        then checks if expected page is loaded

        ACCEPTED PARAMETER(S) AND VALUES:
        menuCssLocator:     the css locator of the menu to be clicked
        subMenuCssLocator:  the css locator of the submenu to be clicked (bottom level if item is no second level)
        expectedCssLocator: the css locator of an element from the expected page to be displayed after the clicks

        NOTE: in case of mouse hover items use the last submenu's locator for 'subMenuCssLocator'

        USAGE:
        //HOME BUTTON
        OneStop.clickTopMenuItems('Home', null, '#workspaceOverduePanelHeading1');

        //ASSESSMENT MENU -> Initiate
        OneStop.clickTopMenuItems('Assessment', 'Initiate', '#initiateInspectionPanelHeading');
        //ASSESSMENT MENU -> Tour Exports
        OneStop.clickTopMenuItems('Assessment', 'Tour Exports', '#TourExportPanelHeading');
        //STATEMENT OF CONCERN MENU
        OneStop.clickTopMenuItems('Statement of Concern', null, '??????????????????????????');
        //INITIATE MENU (no id available for this one) -> New Application
        OneStop.clickTopMenuItems('Initiate', 'New Application', '.pipeline-container');
        //CONSTRUCT MENU -> Water Code of Practice
        OneStop.clickTopMenuItems('Construct', 'Water Code of Practice', '#codeOfPracticePanelHeading');
        //CONSTRUCT MENU -> Tour Submission
        OneStop.clickTopMenuItems('Construct', 'Tour Submission', '#AuthorizationSearchPanelHeading');
        //CONSTRUCT MENU -> Notification -> Pipeline -> New Line
        OneStop.clickTopMenuItems('Construct', 'New Line', '#newNotificationPanelHeading');
        //CONSTRUCT MENU -> Notification -> Pipeline -> Liner Installation
        OneStop.clickTopMenuItems('Construct', 'Liner Installation', '#newNotificationPanelHeading');
        //CONSTRUCT MENU -> Notification -> Pipeline -> Liner Test
        OneStop.clickTopMenuItems('Construct', 'Line Test', '#newNotificationPanelHeading');
        //OPERATE MENU -> Authorization Amendment
        OneStop.clickTopMenuItems('Operate', 'Authorization Amendment', '#contactInformationPanelHeading');
        //OPERATE MENU -> Notification -> Flaring
        OneStop.clickTopMenuItems('Operate', 'Flaring', '#newSubmissionPanelHeading');
        //OPERATE MENU -> Notification -> Venting
        OneStop.clickTopMenuItems('Operate', 'Venting', '#newSubmissionPanelHeading');
        //CLOSE MENU -> Reclamation
        OneStop.clickTopMenuItems('Close', 'Reclamation', '.row.aer-workspace ol .active');
        ----------------------------------------------------------------------------------------------------------------- */
        it('click the ' + menuName + ' menu', async () => {
            //click top level menu
            switch (menuName) {
                case 'Home':
                    await clickTopMenuItem('li>a[data-event="show:workspace"]');  //OR: .header-button-navigation a[data-event="show:workspace"]
                    break;
                case 'Assessment':
                    await clickTopMenuItem('.dropdown.internal-option>a');
                    break;
                case 'Statement of Concern':
                    await clickTopMenuItem('#soc-menu>a');
                    break;
                case 'Initiate':
                    await clickTopMenuItem('.industry-option.can-create-integrated-app>a');
                    break;
                case 'Construct':
                    await clickTopMenuItem('#constructTab>a');
                    break;
                case 'Operate':
                    await clickTopMenuItem('#operateTab>a');
                    break;
                case 'Close':
                    await clickTopMenuItem('.dropdown:last-child>a.dropdown-toggle'); //OR:   .dropdown.industry-option:last-child>a.dropdown-toggle
                    break;
                default:
                    break;
            }
        });

        if (submenuName) {
            //handle submenus with multiple levels
            it('click the ' + submenuName + ' submenu', async () => {
                switch (submenuName) {
                    //Assessment ->
                    case 'Initiate':
                        await clickTopSubMenuItem('.can-create-inspection');    //OR: 'a[data-event="show:inspection:initiate"]'
                        break;
                    case 'Tour Exports':
                        await clickTopSubMenuItem('a[data-event="show:etour-export"]');
                        break;
                    //Initiate ->
                    case 'New Application':
                        await clickTopSubMenuItem('a[data-event="show:application"]');
                        break;
                    //Construct ->
                    case 'Water Code of Practice':
                        await clickTopSubMenuItem('a[data-event="show:water-cop"]');
                        break;
                    case 'Tour Submission':
                        await clickTopSubMenuItem('#tourSubmission>a');    //OR: a[data-event="show:etour-licencesearch"]
                        break;
                    //Construct -> Notification ->
                    case 'New Line':
                        //Notification submenu:
                        await OneStop.mouseHover('#constructGroup>ul>li:last-child>a');
                        //Pipeline submenu:
                        await OneStop.mouseHover('#constructGroup ul:last-child a.dropdown-toggle');  //OR '#constructGroup li>ul:last-child a.dropdown-toggle'
                        //New Line submenu
                        await clickTopSubMenuItem('a[data-event="show:notification:new-construction"]');
                        break;
                    case 'Liner Installation':
                        //Notification submenu:
                        await OneStop.mouseHover('#constructGroup>ul>li:last-child>a');
                        //Pipeline submenu:
                        await OneStop.mouseHover('#constructGroup ul:last-child a.dropdown-toggle');  //OR     '#constructGroup li>ul:last-child a.dropdown-toggle'
                        //Liner Installation submenu
                        await clickTopSubMenuItem('#liner-installation');
                        break;
                    case 'Line Test':
                        //Notification submenu
                        await OneStop.mouseHover('#constructGroup>ul>li:last-child>a');
                        //Pipeline submenu
                        await OneStop.mouseHover('#constructGroup ul:last-child a.dropdown-toggle'); //OR: '#constructGroup li>ul:last-child a.dropdown-toggle'
                        //Line Test submenu
                        await clickTopSubMenuItem('#line-test');
                        break;
                    //Operate ->
                    case 'Methane Emissions':
                        await clickTopSubMenuItem('a[data-event="show:emissions:methane-emissions-manual-landing"]');
                        break;
                    case 'Benzene Emissions':
                        await clickTopSubMenuItem('a[data-event="show:emissions:benzene-emissions-manual"]');
                        break;
                    case 'Emissions Reporting':
                        //clickTopSubMenuItem('a[data-event="show:emissions:peace-river"]');
                        await clickTopSubMenuItem('a[data-event="show:emissions:reporting"]');
                        break;
                    case 'Authorization Amendment':
                        await clickTopSubMenuItem('a[data-event="show:amendment:wizard"]');  //OR: .can-create-integrated-app>a:last-child OR:
                        break;

                    //Operate -> Notification
                    case 'Flaring':
                        //Flaring submenu:
                        await OneStop.mouseHover('#operate-notification');
                        await clickTopSubMenuItem('a[data-event="show:notification:flaring"]');
                        break;
                    case 'Venting':
                        //Venting submenu:
                        await OneStop.mouseHover('#operate-notification');
                        await clickTopSubMenuItem('a[data-event="show:notification:venting"]');
                        break;
                    //Close submenu
                    case 'New Reclamation':
                        await clickTopSubMenuItem('a[data-event="show:reccert:application"]');
                        await driver.sleep(waitShort);
                        break;
                    case 'New ESA Phase 1':
                        await clickTopSubMenuItem('a[data-event="show:reccert:esa1"]');
                        await driver.sleep(waitShort);
                        break;
                    case 'New ESA Phase 2/3':
                        await clickTopSubMenuItem('a[data-event="show:reccert:esa2"]');
                        await driver.sleep(waitShort);
                        break;

                    //Close -> Area Based Closure submenu
                    case 'Proposed':
                        //Proposed submenu:
                        await OneStop.mouseHover('.dropdown.industry-option:last-child>ul>li:nth-child(4)>a');
                        await clickTopSubMenuItem('a[data-id="AREA_BASED_CLOSURE_PROPOSED"]');
                        await driver.sleep(waitShort);
                        break;
                    case 'Confirmed':
                        //Confirmed submenu:
                        await OneStop.mouseHover('.dropdown.industry-option:last-child>ul>li:nth-child(4)>a');
                        await clickTopSubMenuItem('a[data-id="AREA_BASED_CLOSURE_CONFIRMED"]');
                        await driver.sleep(waitShort);
                        break;
                    default:
                        break;
                }
            });
        }

        const clickTopMenuItem = async (menuCssLocator) => {
            await driver.findElement(By.css(menuCssLocator));
            await OneStop.clickElementByCSS(menuCssLocator);
        };

        const clickTopSubMenuItem = async (subMenuCssLocator) => {
            await driver.findElement(By.css(subMenuCssLocator));
            await OneStop.clickElementByCSS(subMenuCssLocator);
        };

        //wait for returned object
        it('wait for "' + expectedCssLocator + '" object to be displayed', async () => {
            if (submenuName !== "Reclamation") {
                await OneStop.waitForPageLoad();
            }
            await OneStop.waitForObjectLoad(expectedCssLocator, waitLong * 5, waitShort);
        });
    };

    OneStop.clickLeftSideMenuItems = (leftSideMenu, expectedCssLocator) => {
        /*
        //OBJECTS - LINKS CSSLocators:
        --- 1st level
        General: - this is selected     a[data-id="generalTab"]
        Confirmation: - disabled        a[data-id="confirmationTab"]

        --- 2nd level
        Contact Information:            a[data-id="generalTab:contactInfo"]         - displayed as default
        Application Information:        a[data-id="generalTab:applicationInfo"]     - displayed as default

        - displayed after clicking on 'General, 'Contact Information' or 'Application Information' links
        Proposed Activity:              a[data-id="generalTab:proposedActivity"]
        Additional Information:         a[data-id="generalTab:additionalInfo"]
        Activity Details:               a[data-id="generalTab:activityDetails"]
        Confirmation:                   *see the locator above

        - displayed after clicking on the 'Confirmation' link
        Validation/Rules                a[data-id="confirmationTab:validationRules"]

        NOTES: -------------------------------------------------------------------------------------------------------------
        if user is on 'Application Information' cannot navigate away until we select the '..want to add the app to an existing proj'
        on other tabs can easily navigate to any/all other tabs

        'Confirmation' can be clicked right away after it gets displayed - after clicking on any other links than 'Application Information'
        - all tabs will become hidden
        - but General will show a warning image):
        - now if navigate to General tab it'll display all other

        --------------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will click on left side menu items (which is expected to be displayed before the click)

        ACCEPTED PARAMETER(S) AND VALUES:
        leftSideTopMenu:    a[data-id="authorizationTab"] - this represents the top level menu's css locator
        leftSideSubMenu:    a[data-id="authorizationTab:authorizationAdditionalInformation"] - this is the submenu css locator
        expectedCssLocator: contactInformationPanelHeading - some css locator for an element to be loaded after a menu item is clicked

        USAGE:  OneStop.clickLeftSideMenuItems('a[data-id="authorizationTab:authorizationAdditionalInformation"]', "#activityDetailsPanelHeading");
                OneStop.clickLeftSideMenuItems('a[data-id="authorizationTab"]', "#activityDetailsPanelHeading");
        ----------------------------------------------------------------------------------------------------------------- */
        //get menu paths ready
        let element = null;
        let elementClass = null;

        leftSideMenu = leftSideMenu.split(':');
        const menuItem = 'a[data-id="' + leftSideMenu[0] + '"]';
        const menuItemActive = '#nav-item-header-' + leftSideMenu[0];

        it('click left side ' + menuItem + ' menu', async () => {
            //click the menu if it is not yet active
            element = await driver.findElement(By.css(menuItemActive));
            elementClass = await element.getAttribute('class');
            if (!elementClass.includes('active-nav-item-header')) {
                //click the main menu
                element = await driver.findElement(By.css(menuItem));
                await driver.wait(until.elementIsVisible(element), waitLong);

                //click leftSideTopMenu
                await OneStop.clickElementByCSS(menuItem);
                await OneStop.waitForPageLoad();
                await driver.sleep(1000);
                await OneStop.waitForPageLoad();
            }
        });

        if (leftSideMenu.length > 1) {
            const subMenuItem = 'a[data-id="' + leftSideMenu[0] + ':' + leftSideMenu[1] + '"]';
            const subMenuItemActive = '#step-row-' + leftSideMenu[1];

            it('click left side ' + subMenuItem + ' sub menu', async () => {
                //click the sub menu if it is not yet active
                element = await driver.findElement(By.css(subMenuItemActive));
                elementClass = await element.getAttribute('class');
                if (!elementClass.includes('active-step-row')) {
                    //click the main menu
                    element = await driver.findElement(By.css(subMenuItem));
                    element = await driver.wait(until.elementIsVisible(element), waitLong);
                    element = await element.getText();
                    const expectedTitle = element;

                    //click leftSideTopMenu
                    await OneStop.clickElementByCSS(subMenuItem);
                    await OneStop.waitForPageLoad();
                    await driver.sleep(1000);
                    await OneStop.waitForPageLoad();
                    element = await driver.findElement(By.css('.wizard-step-heading span:nth-child(2)'));
                    const text = await element.getText();
                    expect(text).to.equal('- ' + expectedTitle);
                }
            });
        }

        if (expectedCssLocator) {
            it('expected ' + expectedCssLocator + ' object loaded after left side menu clicked', async () => {
                await OneStop.waitForObjectLoad(expectedCssLocator, waitLong, 500);
            });
        }
    };

    OneStop.clickRightSideTopLinks = (linkCssLocator, waitObjectCssLocator) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will click on right side top links

        ACCEPTED PARAMETER(S) AND VALUES:
        linkCssLocator:         the css of the link to be clicked
        waitObjectCssLocator:   a css locator for an element to wait for after the click is done

        USAGE:  OneStop.clickRightSideTopLinks('a[data-event="show:workspace:search"]', '#ApplicationSearchPanelHeading');
                OneStop.clickRightSideTopLinks('a[data-event="show:geocortex:map"]', '#???');
        ----------------------------------------------------------------------------------------------------------------- */
        it('click top right side ' + linkCssLocator + ' link', async () => {
            await driver.wait(until.elementLocated(By.css(linkCssLocator)), waitLong * 3);
            await OneStop.clickElementByCSS(linkCssLocator);
            await OneStop.waitForPageLoad();
            if (waitObjectCssLocator) {
                //-- works for gis-external but not for gis-internal (new tab is launched)
                await OneStop.waitForObjectLoad(waitObjectCssLocator, waitLong, waitShort);
            }
        });
    };

    OneStop.mouseHover = async (cssLocator) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will mouse over an element by the given CSS Locator

        ACCEPTED PARAMETER(S) AND VALUES:
        cssLocator:   the css identifier of the element to mouse over

        USAGE:  OneStop.mouseHover('#constructGroup ul:last-child a.dropdown-toggle');
        ----------------------------------------------------------------------------------------------------------------- */
        const elements = await OneStop.findElementsByCSS(cssLocator);
        const actions = driver.actions({bridge: true});
        await actions.move({duration: 5000, origin: elements[0], x: 0, y: 0}).perform();
    };

    OneStop.setTextFieldValueByCSS = async (fieldCss, value) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will look for a text field by the given CSS Locator
                        then it will type the given text into that text field

        ACCEPTED PARAMETER(S) AND VALUES:
        fieldCss:   the css identifier of the text field
        value:      the text value you want to be typed into the field

        USAGE:  OneStop.setTextFieldValueByCSS('*[name="applicant[email]"]', 'testemail@test.com');
        ------------------------------------------------------------------------------------------------------------- */
        await OneStop.waitForObjectLoad(fieldCss, waitLong, 100, true);
        await driver.wait(until.elementLocated(By.css(fieldCss)), waitLong);
        const element = await driver.findElement(By.css(fieldCss));
        await driver.wait(until.elementIsVisible(element), waitShort);
        await element.clear();
        await element.sendKeys(value);
        await driver.sleep(100);
    };

    OneStop.setTimeFieldValueByID = async (fieldId, value) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will look for a time field by the given ID
                        then it will set the value by script

        ACCEPTED PARAMETER(S) AND VALUES:
        fieldId:   the id of the time field
        value:      the text value you want to be typed into the field

        USAGE:  OneStop.setTimeFieldValueByCSS('id', '1200');
        ------------------------------------------------------------------------------------------------------------- */
        await driver.wait(until.elementLocated(By.id(fieldId)), waitLong);
        const element = await driver.findElement(By.id(fieldId));
        await driver.wait(until.elementIsVisible(element), waitShort);
        await driver.executeScript("document.getElementById('" + fieldId + "').setAttribute('value', '" + value + "')");
    };

    OneStop.setTypeAheadValueByCSS = async (fieldCss, value) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    ?! code is same as above - temp function ?!
                        this function will find a text field by the given CSS Locator
                        then it will type the given text into that text field

        ACCEPTED PARAMETER(S) AND VALUES:
        fieldCss:   the css identifier of the text field
        value:      the text value you want to be typed into the field

        USAGE:  OneStop.setTypeAheadValueByCSS("*[name="applicant[email]"]", "testemail@test.com");
        ------------------------------------------------------------------------------------------------------------- */
        await OneStop.waitForObjectLoad(fieldCss, waitLong, 100, true);
        await driver.wait(until.elementLocated(By.css(fieldCss)), waitLong);
        const element = await driver.findElement(By.css(fieldCss));
        await driver.wait(until.elementIsVisible(element), waitLong);
        await element.clear();
        await element.sendKeys(value);
        await driver.sleep(100);
    };

    OneStop.setFileUploadByCSS = async (fieldCss, value) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will find the "Attach Files..." button
                        then it will find above button's input field -> *[name="fileselect[]"]
                        and will insert/type the path to your file into that input and find the file
                        - this will attach it

        ACCEPTED PARAMETER(S) AND VALUES:
        fieldCss:   #uploadAttachment *[name="fileselect[]"]'   - this is the value used usually
        value:      require('path').join(__dirname, '/attachments/SIRAttachment.pdf'), true

        NOTE:   before running this function please make sure that your folder and file(s) exist
        USAGE:  OneStop.setFileUploadByCSS('#uploadAttachment *[name="fileselect[]"]', attachmentPath);
                OneStop.setFileUploadByCSS('#uploadAttachment *[name="fileselect[]"]',
                require('path').join(__dirname, '/attachments/SIRAttachment.pdf'), true);
        ------------------------------------------------------------------------------------------------------------- */
        await driver.wait(until.elementLocated(By.css(fieldCss)), waitLong);
        const element = await driver.findElement(By.css(fieldCss));
        await element.sendKeys(value);
        await driver.sleep(waitShort);
        await OneStop.waitForPageLoad();
    };

    OneStop.setSelectFieldValueByCSS = async (fieldCss, txtValue) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will find a dropdown list by the given CSS Locator
                        then it will type the given text into list's field

        ACCEPTED PARAMETER(S) AND VALUES:
        fieldCss:   '.reason-for-sir'   - the css identifier of the text field
        txtValue:   "Clarification"     - the text value you want to be selected from the dropdown
                    NOTE: the value should match an existing item

        USAGE:  OneStop.setSelectFieldValueByCSS('.reason-for-sir', 'value to be typed');
        ------------------------------------------------------------------------------------------------------------- */
        await OneStop.waitForObjectLoad(fieldCss, waitLong * 3, 100, true);
        await driver.wait(until.elementLocated(By.css(fieldCss)), waitLong);
        const element = await driver.findElement(By.css(fieldCss));
        await driver.wait(until.elementIsVisible(element), waitShort);
        await element.click();
        await driver.sleep(100);
        await element.sendKeys(txtValue);
        await element.sendKeys('\n');
        await driver.sleep(waitShort);
    };

    OneStop.setSelectDropDownValueByCSS = async (cssLocator, txtValue) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will find a dropdown list by the given CSS Locator
                        then it will look for expected value and click it if found
                        NOTE: no click will be done if the value is not found and there is no handler for that

        ACCEPTED PARAMETER(S) AND VALUES:
        fieldCss:   '.reason-for-sir'   - the css identifier of the dropdown
        txtValue:   "Clarification"     - the text value you want to be selected from the dropdown
                    NOTE: the value should match an existing item otherwise nothing will be selected

        USAGE:  OneStop.setSelectDropDownValueByCSS('select[name="parentCondition"]', baseSelectedParentCondition);
        ------------------------------------------------------------------------------------------------------------- */

        let element = null;

        const selectDropdownValue = async (elements, i) => {
            //var elementsLength = elements.length;
            element = await driver.wait(until.elementIsVisible(elements[i]), waitShort);
            element = await driver.wait(until.elementIsEnabled(element), waitShort);
            const dropDownText = await element.getText();
            // 2. if the element matches the needed value then click on it
            if (dropDownText === txtValue) {
                await element.click();
                await driver.sleep(500);
                i = elements.length;
                return i;
            }
        };

        //var loopsCounter = 0;
        await OneStop.waitForObjectLoad(cssLocator, waitLong * 3, 100, true);
        await driver.wait(until.elementLocated(By.css(cssLocator)), waitLong);
        element = await driver.findElement(By.css(cssLocator));
        await driver.wait(until.elementIsVisible(element), waitShort);
        //1st click the dropdown object
        await element.click();
        await driver.sleep(100);

        //in a loop - search for the element to be selected and select it if found
        const dropDownElements = await driver.findElements(By.css(cssLocator + '>option'));
        // 1. read the values of all dropdown elements
        for (let i = 0; i < dropDownElements.length; i++) {
            await selectDropdownValue(dropDownElements, i);
        }
    };

    OneStop.setButtonRadioFieldValueByCSS = async (fieldCss, value) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will find a radio button(s) by the given CSS Locator
                        then it will click on the one matching the value - will select it

        ACCEPTED PARAMETER(S) AND VALUES:
        fieldCss:   '*[name="developmentType"]' - the css identifier of the text field
        value:      'TRANSMISSION PIPELINE'     - the value of the radio button you want to select

        USAGE:  OneStop.setButtonRadioFieldValueByCSS('*[name="developmentType"]', 'TRANSMISSION PIPELINE');
        ------------------------------------------------------------------------------------------------------------- */
        let element;
        const cssPath = fieldCss + "[value='" + value + "']";
        await OneStop.waitForObjectLoad(cssPath, waitLong, 100, true);
        await driver.wait(until.elementLocated(By.css(cssPath)), waitLong);
        element = await driver.findElement(By.css(cssPath));
        element = await element.findElement(By.xpath('..'));
        await element.click();
        await driver.sleep(100);
    };

    OneStop.setButtonCheckboxByCSS = async (fieldCss) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will find a checkbox by the given CSS Locator
                        then it will click on it to select

        ACCEPTED PARAMETER(S) AND VALUES:
        fieldCss:   *[name="privateLand"]   - the css identifier of the check box

        USAGE:  OneStop.setButtonCheckboxByCSS('*[name="privateLand"]');
        ------------------------------------------------------------------------------------------------------------- */
        let inputElement;
        await OneStop.waitForObjectLoad(fieldCss, waitLong, 100, true);
        await driver.wait(until.elementLocated(By.css(fieldCss)), waitLong);
        inputElement = await driver.findElement(By.css(fieldCss));
        inputElement = await driver.wait(until.elementIsVisible(inputElement), waitShort);
        const element = await inputElement.findElement(By.xpath('..'));
        const elementClass = await element.getAttribute('class');
        if (!elementClass.includes('active')) {
            await element.click();
        }

        //this piece is for those places where there is no active class added to the checkbox
        const inputSelected = await inputElement.isSelected();
        if (inputSelected !== true) {
            await inputElement.click();
        }
    };

    OneStop.getElementValueByCSS = async (elementCss) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will look for an object by given CSS Locator
                        then it will retrieve its text value

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:   '.modal-body'   - the css identifier of the object

        USAGE:  OneStop.getElementValueByCSS('.modal-body');
        ------------------------------------------------------------------------------------------------------------- */
        await driver.wait(until.elementLocated(By.css(elementCss)), waitLong);
        return await driver.findElement(By.css(elementCss)).getText();
    };

    OneStop.findElementsByCSS = async (elementCss) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will look for multiple objects having the same css locator by a given CSS Locator
                        then it will return these objects into an array - they can later be used for anything needed
                        if no objects are found it'll return a blank array

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:   *[type="checkbox"]   - the css identifier for the checkbox objects - not necessarily unique

        USAGE:  OneStop.findElementsByCSS('*[type="checkbox"]');
        ------------------------------------------------------------------------------------------------------------- */
        return await driver.findElements(By.css(elementCss));
    };

    OneStop.getElementsByCSS = async (elementCss) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will look for multiple objects having the same css locator by given CSS Locator
                        then it will return these objects or time out if the elements are not found

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:   *[type="checkbox"]   - the css identifier for the checkbox objects - not necessarily unique

        USAGE:  OneStop.getElementValueByCSS('*[type="checkbox"]');
        ------------------------------------------------------------------------------------------------------------- */
        await driver.wait(until.elementLocated(By.css(elementCss)), waitLong);
        return await driver.findElements(By.css(elementCss));
    };

    OneStop.setElementAttributeByCSS = async (elementCss, attr, value) => {
        const element = await driver.findElement(By.css(elementCss));
        await driver.executeScript("arguments[0].setAttribute('" + attr + "', '" + value + "')", element);
    };

    OneStop.hideElementByCSS = async (elementCss) => {
        const element = await driver.findElement(By.css(elementCss));
        await driver.executeScript("arguments[0].setAttribute('style', 'display:none')", element);
    };

    OneStop.clickElementByCSS = async (elementCss) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will look for an object by given CSS Locator
                        then it will wait for it to become Visible and Enabled
                        then it will click on it

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:   .preset   - the css identifier for the object to be clicked - must be unique

        USAGE:  OneStop.clickElementByCSS('.preset');
        ------------------------------------------------------------------------------------------------------------- */
        await OneStop.waitForObjectLoad(elementCss, waitLong, 100, true);
        await driver.wait(until.elementLocated(By.css(elementCss)), waitLong);
        const element = await driver.findElement(By.css(elementCss));
        await driver.wait(until.elementIsVisible(element), waitLong);
        await driver.wait(until.elementIsEnabled(element), waitLong);
        await element.click();
    };

    OneStop.clickElementByXPath = async (elementXPath) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will look for an object by given XPath
                        then it will wait for it to become Visible and Enabled
                        then it will click on it

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:   .preset   - the css identifier for the object to be clicked - must be unique

        USAGE:  OneStop.clickElementByCSS('.preset');
        ----------------------------------------------------------------------------------------------------------------- */
        await driver.wait(until.elementLocated(By.xpath(elementXPath)), waitLong);
        const element = await driver.findElement(By.xpath(elementXPath));
        await driver.wait(until.elementIsVisible(element), waitLong);
        await driver.wait(until.elementIsEnabled(element), waitLong);
        await element.click();
    };

    OneStop.setBackGridSelectCheckboxes = async (elementCss, index, values) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will
                        then it will

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:     .preset     - the css identifier for the object to be clicked - must be unique
        index:          1           - the index of cell to be clicked (column number, start @ 0)
        values:         1           - array of values to be clicked

        USAGE:  OneStop.setBackGridSelect('.preset', 1, 1);
        ------------------------------------------------------------------------------------------------------------- */
        let elements;
        await driver.wait(until.elementLocated(By.css(elementCss)), waitLong);
        elements = await driver.findElements(By.css(elementCss));
        await elements[index].click();
        await driver.sleep(200);

        const selectElement = elements[index].findElements(By.css('select'));
        selectElement[0].click();

        let inputElements;
        for (let i = 0; i < values.length; i++) {
            inputElements = await selectElement.findElements(By.css('input[value="' + values[i] + '"]'));
            inputElements[0].click();
        }
    };

    OneStop.setBackGridSelectText = async (elementCss, index, selectText) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will
                        then it will

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:     .preset     - the css identifier for the object to be clicked - must be unique
        index:          1           - the index of cell to be clicked
        selectText:    string       - the string of the value to be selected from the drop down

        USAGE:  OneStop.setBackGridSelect('.preset', 1, 1);
        ------------------------------------------------------------------------------------------------------------- */
        let elements;
        await driver.wait(until.elementLocated(By.css(elementCss)), waitLong);
        elements = await driver.findElements(By.css(elementCss));
        await elements[index].click();
        await driver.sleep(300);
        elements = await elements[index].findElements(By.css('select'));
        if (elements.length === 0) throw elementCss + ": no backgrid select option input found";
        await elements[0].click();
        await elements[0].sendKeys(selectText);
        await elements[0].sendKeys('\n');
    };

    OneStop.setBackGridText = async (elementCss, index, keys) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will
                        then it will

        ACCEPTED PARAMETER(S) AND VALUES:
        elementCss:     .preset     - the css identifier for the object to be clicked - must be unique
        index:          1           - the index of
        key:            ?           - the ?!

        USAGE:  OneStop.setBackGridText('.preset', 1, 1);
        ------------------------------------------------------------------------------------------------------------- */
        let elements;
        await OneStop.waitForObjectLoad(elementCss, waitLong, 100);
        await driver.wait(until.elementLocated(By.css(elementCss)), waitLong);
        elements = await driver.findElements(By.css(elementCss));
        await elements[index].click();
        await driver.sleep(500);
        elements = await elements[index].findElements(By.css('input'));
        if (elements.length < 1) throw elementCss + ": no backgrid text input found";
        await elements[0].clear();
        if (keys !== "") {
            await elements[0].sendKeys(keys);
            await elements[0].sendKeys('\n');
        }
    };

    OneStop.populateGridElementValue = async (element, value) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will
                        then it will

        ACCEPTED PARAMETER(S) AND VALUES:
        element:    ?????????   - the ?! for the object to be clicked - must be unique
        value:      "any text"  - the value of

        USAGE:  OneStop.populateGridElementValue(elements[i], "value to be typed");
                OneStop.populateGridElementValue(elements[i], wetlandReplacementGridValuesArray[i]);
        ------------------------------------------------------------------------------------------------------------- */
        await element.click();
        const element2 = await element.findElement(By.css('input'));
        await element2.clear();
        await element2.sendKeys(value);
    };

    OneStop.openApplicationByLink = () => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    this function will
                        then it will

        ACCEPTED PARAMETER(S) AND VALUES:
        element:    ?????????   - the ?! for the object to be clicked - must be unique
        value:      "any text"  - the value of

        USAGE:  OneStop.populateGridElementValue(elements[i], "value to be typed");
                OneStop.populateGridElementValue(elements[i], wetlandReplacementGridValuesArray[i]);
        ------------------------------------------------------------------------------------------------------------- */

        before(async () => {
            await driver.sleep(waitShort);
            const appTypeParsed = appType.split('-');
            await driver.get(OneStop.getBaseUrl() + '/#' + appTypeParsed[0] + '/' +
                harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
            await OneStop.waitForPageLoad();
        });
    };

    OneStop.openReportDocuments = (tableauBaseInternalUrl, reportsArray, i) => {
        describe('validate "' + reportsArray[i].name + '" report', () => {
            it('open the report', async () => {
                await driver.get(tableauBaseInternalUrl + reportsArray[i].url);
            });

            it('the report page is loaded', async () => {
                await OneStop.waitForObjectLoad('.tab-dashboard:nth-child(1)', waitLong * 20, waitShort, true);
            });

            it('there is no error and the title is ' + reportsArray[i].expectedTitle, async () => {
                const text = await OneStop.getElementValueByCSS('body');
                expect(text).to.not.contain('Resource not found');
                expect(text).to.not.contain('Unable to connect to the data source.');
                expect(text).to.not.contain('Try Again');
                expect(text).to.contain(reportsArray[i].expectedTitle);
            });
        });
    };

    OneStop.searchForAnApplicationByIdAndSelectAnAction = (applicationId, actionToBeDone, expectedCssLocator) => {
        describe('search for application id ' + applicationId + ' and select next action ' + actionToBeDone, () => {
            //navigate to Search page (click search link)
            OneStop.clickRightSideTopLinks('a[data-event="show:workspace:search"]', '#ApplicationSearchPanelHeading');

            it('type the application id ' + applicationId + ' and click the search button', async () => {
                //type Application ID
                await OneStop.setTextFieldValueByCSS('#eventId', applicationId);

                //click Search btn
                await OneStop.clickElementByCSS('.application-search');
                await OneStop.waitForPageLoad();
            });

            //check if the record(s) were returned  -- has an it
            OneStop.validateDisplayedText(
                '#ApplicationResultsPanelBody tbody tr:nth-child(1)>td.applicationParsed',
                applicationId
            );

            if (actionToBeDone && expectedCssLocator) {
                it('select the ' + actionToBeDone + ' from the dropdown and validate that the expected object ' +
                    expectedCssLocator + ' is displayed', async () => {
                    //click the Actions and select one
                    await OneStop.setSelectDropDownValueByCSS(
                        '#ApplicationResultsPanelBody tbody tr>td.editable',
                        actionToBeDone
                    );
                    await OneStop.waitForPageLoad();

                    //validate that expected screen is loaded after the action was selected
                    await OneStop.waitForObjectLoad(expectedCssLocator, waitLong, 500, true);
                });
            }
        });
    };


    /* -------------------------------------------------------------------------------------------------------------- */
    /* ------------------------------------------- these are still in test ------------------------------------------ */
    /* SEARCH FOR APP ID / AUTHORIZATION ID / etc..  IN THE APPLICATION */
    /* -------------------------------------------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------------------------------------------- */
    OneStop.searchForApplicationByAnyField = async (applicationId, appStatus, receiveDateBetween,
                                                    receiveDateAnd, locationValues) => {
        //navigate to Search page (click search link)
        OneStop.clickRightSideTopLinks('a[data-event="show:workspace:search"]', '#ApplicationSearchPanelHeading');

        //set Status
        if (appStatus) {
            await OneStop.setSelectDropDownValueByCSS('applicationIndustryStatusName', appStatus);
        }

        //type Application ID
        if (applicationId) {
            await OneStop.setTextFieldValueByCSS('#eventId', applicationId);
        }

        //type Received Date Between
        if (receiveDateBetween) {
            await OneStop.setTextFieldValueByCSS('#dateReceivedAfter', receiveDateBetween);
        }

        //type Received Date And
        if (receiveDateAnd) {
            await OneStop.setTextFieldValueByCSS('#dateReceivedBefore', receiveDateAnd);
        }

        //type Location values
        if (locationValues && locationValues.length === 6) {
            await OneStop.setTextFieldValueByCSS('#quarter', locationValues[0]);
            await OneStop.setTextFieldValueByCSS('#lsd', locationValues[1]);
            await OneStop.setTextFieldValueByCSS('#sec', locationValues[2]);
            await OneStop.setTextFieldValueByCSS('#twp', locationValues[3]);
            await OneStop.setTextFieldValueByCSS('#rge', locationValues[4]);
            await OneStop.setTextFieldValueByCSS('#m', locationValues[5]);
        }

        //click Search btn
        await OneStop.clickElementByCSS('.application-search');
        await OneStop.waitForPageLoad();

        //check if the record(s) were returned
        //---------- not ready
    };

    OneStop.searchForAnAuthorization = () => {
        //navigate to Search page - click top right side Search menu

    };

    OneStop.searchForCodesOfPracticeNotice = () => {

    };

    OneStop.searchForASubmission = () => {

    };

    let authorizationId = '';
    OneStop.findTheAuthorizationIdByApplicationId = (applicationId) => {
        //find the application by it's ID and select view from the dropdown
        OneStop.searchForAnApplicationByIdAndSelectAnAction(applicationId, 'View', '#PanelHeading');

        describe('retrieve the activity id for the application ' + applicationId, () => {
            //find and retrieve the Activity ID
            it('find the activity id and retrieve/store it', async () => {
                const elements = await OneStop.getElementsByCSS(
                    '#ProposedWaterPanelBody .proposed-water-grid tbody .applicationAssignment'
                );
                const elementText = await elements[0].getText();
                if (elementText.length > 0) {
                    authorizationId = elementText;
                    console.log('authorizationId ' + authorizationId);
                } else {
                    throw "activity id not found - not longer than 0";
                }
            });
        });

        return authorizationId;
    };

    return OneStop;
})();

module.exports = OneStop;