/**
 * Created by cb5rp on 6/1/2017.
 * Modified by cb840 on 5/10/2018 - OneStop.pageTourSubmissionAmend
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

const expect = require('chai').expect;

const OneStop = (() => {

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

    OneStop.pageTourSubmission = (tourTypeArray,
                                  startDateValue,
                                  endDateValue,
                                  attachmentsPathsArray) => {
        describe('new tour submission', () => {

            it('click construct menu item', async () => {
                await OneStop.clickElementByCSS('#constructTab>a');
            });

            it('click tour submission menu item', async () => {
                await OneStop.clickElementByCSS('.tour-option>a');
            });

            it('click search button', async () => {
                await OneStop.clickElementByCSS('#AuthorizationSearchPanelBody .btn-search');
                await OneStop.waitForPageLoad();
            });

            it('create a new tour from first authorization result', async () => {
                await OneStop.setBackGridSelectText('.search-results .select-cell.editable', 0, 'Notification');
            });

            it('click tour submission button', async () => {
                await OneStop.clickElementByCSS('#eTour-button');
                await OneStop.waitForPageLoad();
            });

            it('click new tour submission button', async () => {
                await OneStop.clickElementByCSS('#newEtour');
                await OneStop.waitForPageLoad();
            });

            if (tourTypeArray !== null) {
                for (let i = 0; i < tourTypeArray.length; i++) {
                    selectTourType(tourTypeArray[i]);
                }
            }

            if (startDateValue !== null) {
                it('enter startDate', async () => {
                    await OneStop.setTextFieldValueByCSS('#startDate', startDateValue);
                });
            }

            if (endDateValue !== null) {
                it('enter endDate', async () => {
                    await OneStop.setTextFieldValueByCSS('#endDate', endDateValue);
                });
            }

            it('select all uwis ', async () => {
                await OneStop.clickElementByCSS('.select-all-header-cell input');
            });

            if (attachmentsPathsArray !== null) {
                for (let i2 = 0; i2 < attachmentsPathsArray.length; i2++) {
                    attachTourDocument(attachmentsPathsArray[i2]);
                }
            }

            OneStop.acceptDisclaimer('.acceptDisclaimer', '.agree');

            it('click save and submit', async () => {
                await OneStop.clickElementByCSS('#submit-btn');
                await OneStop.waitForPageLoad();
            });

            OneStop.confirmSubmission('Confirm Submission', 'yes');

            OneStop.confirmAlertDialog('Thank you for your submission.');

            it('capture the Licence and submissionID of Tour', async () => {
                let submissionID, licence;
                await driver.sleep(500);

                await OneStop.clickElementByCSS('a[title="Last"]');
                await driver.sleep(500);

                submissionID = await driver.findElement(By.css('tr:last-child td.sortable.submissionId')).getAttribute("textContent");
                console.log('Submission ID:' + submissionID);

                licence = await OneStop.getElementValueByCSS('#subheader-level-two');
                harnessObj.addApplicationToJSON(licence + '-' + submissionID);
            });

        });
    };

    OneStop.pageTourSubmissionAmend = (attachmentsPathsArray) => {
        describe('Amend the last Tour submission', () => {
            let authorizationID, submissionID;
            it('get last submission from applicationJSON:', async () => {
                const app_sub = new harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                authorizationID = app_sub.substring(0, app_sub.indexOf("-", 0));
                submissionID = app_sub.substring(app_sub.indexOf("-", 0) + 1);
            });

            it('click Search nav link:', async () => {
                await OneStop.clickElementByCSS('a[data-event="show:workspace:search"]');
                await OneStop.waitForPageLoad();
            });

            it('click Authorization tab:', async () => {
                await OneStop.clickElementByCSS('a[data-id="authorization"]');
                await OneStop.waitForPageLoad();
            });

            it('set Authorization Number:', async () => {
                await OneStop.setTextFieldValueByCSS('#licenseAuthorizationId', authorizationID);
                await OneStop.waitForPageLoad();
            });

            it('click search button', async () => {
                await OneStop.clickElementByCSS('#AuthorizationSearchPanelBody .btn-search');
                await OneStop.waitForPageLoad();
            });

            it('select submission action dropdown', async () => {
                await OneStop.setBackGridSelectText('.search-results .select-cell.editable', 0, 'Notification');
            });

            it('click tour submission button', async () => {
                await OneStop.clickElementByCSS('#eTour-button');
            });

            it('click "Last Page" pagination button', async () => {
                await OneStop.clickElementByCSS('a[title="Last"]');
                await OneStop.waitForPageLoad();
            });

            it('select the Last Row', async () => {
                await OneStop.clickElementByCSS('tbody tr:last-child');
                await OneStop.waitForPageLoad();
            });

            it('click Amend button', async () => {
                await OneStop.clickElementByCSS('#amend');
                await OneStop.waitForPageLoad();
            });

            it('Wait for Amendment confirmation prompt to appear...', async () => {
                await driver.sleep(waitShort);
                await driver.wait(until.elementIsVisible(driver.findElement(By.css('.modal-dialog'))), waitLong * 2);
                await OneStop.waitForPageLoad();
            });

            it('click yes confirmation button', async () => {
                await driver.sleep(waitShort);
                await OneStop.clickElementByCSS('.modal-dialog .btn-yes');
                await OneStop.waitForPageLoad();
            });

            //---------------------------------------------------------
            // NOTE: ONLY the attachments are modifiable on Tour Amendments
            //---------------------------------------------------------
            let numFiles = 0;

            it('remove last attachment in the list', async () => {
                const elements = await OneStop.getElementsByCSS('a.delete');
                numFiles = elements.length;
                await elements[elements.length - 1].click();
                await OneStop.waitForPageLoad();
            });

            it('verify files were deleted (by count only!)', async () => {
                const elements = await OneStop.getElementsByCSS('a.delete');
                expect(elements.length.toString()).to.equal((numFiles - 1).toString());
                numFiles = elements.length;
            });

            // UPLOAD attachment(s)
            if (attachmentsPathsArray !== null) {
                for (let i2 = 0; i2 < attachmentsPathsArray.length; i2++) {
                    attachTourDocument(attachmentsPathsArray[i2]);
                }
            }

            it('verify files were uploaded (by count only!)', async () => {
                await driver.sleep(1000);
                const elements = await OneStop.getElementsByCSS('a.delete');
                expect(elements.length.toString()).to.equal((numFiles + 2).toString());
            });

            it('click Accept Disclaimer button', async () => {
                await OneStop.clickElementByCSS('#disclaimerButton');
                await driver.sleep(waitShort);
            });

            it('click I Agree button', async () => {
                await OneStop.clickElementByCSS('.modal-dialog .agree');
                await OneStop.waitForPageLoad();
            });

            it('click submit', async () => {
                await OneStop.clickElementByCSS('#save');
                await OneStop.waitForPageLoad();
            });

            it('click confirm amendment Yes button', async () => {
                await OneStop.clickElementByCSS('.modal-dialog .btn-yes');
                await OneStop.waitForPageLoad();
            });

            OneStop.confirmAlertDialog('Thank you for amending this Tour submission.');
        });

    };

    const selectTourType = (tourType) => {
        it('select tour type: ' + tourType, async () => {
            await OneStop.clickElementByCSS('*[name="' + tourType + '"]');
        });
    };

    const attachTourDocument = (attachmentPath) => {
        const filePathExploded = attachmentPath.split('\\');
        it('attach document: ' + filePathExploded.pop(), async () => {
            await OneStop.setFileUploadByCSS('#attachmentsUpload *[name="fileselect[]"]', attachmentPath);
            await OneStop.waitForPageLoad();
        });
    };

    return OneStop;
})();

module.exports = OneStop;
