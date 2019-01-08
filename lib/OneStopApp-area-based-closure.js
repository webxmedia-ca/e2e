/**
 * Created by cb5rp on 6/1/2017.
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

// const expect = require('chai').expect;

const shapeFileWaitInterval = 300000;

const OneStop = (() => {

    const OneStop = require('./OneStopApp-external');

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
        OneStop.initExternal(harnessObjIn, waitShortIn, waitLongIn);

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

    OneStop.pageClosureSubmissionContactInformation = (openApplication, contactNameValue, emailValue, primaryContact) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('navigate to close menu > area based closure > proposed submenu', () => {
            OneStop.clickTopMenuItems('Close', 'Proposed', '#contactInformationPanelHeading');
        });

        describe('closure submission > contact information', () => {
            it('set applicant[contactName]: ' + contactNameValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="applicant[contactName]"]', contactNameValue);
            });

            it('set applicant[email]: ' + emailValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="applicant[email]"]', emailValue);
            });

            it('select primary contact ' + primaryContact, async () => {
                await OneStop.setSelectDropDownValueByCSS('*[name="applicant[primaryContact]"]', primaryContact);
                await driver.sleep(500);
            });
        });
    };

    OneStop.pageClosureSubmissionProjectInformationPart1 = (
        openApplication,
        serviceProviderValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('closure submission > project information (part 1)', () => {
            it('set serviceProvider', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="serviceProvider"]', serviceProviderValue);
            });
        });
    };

    OneStop.pageClosureSubmissionProjectInformationPart2 = (openApplication,
                                                            shapefilePath,
                                                            yearValue,
                                                            quarterValue,
                                                            projectNameValue,
                                                            ALL_CLOSURE_ACTIVITIESValue,
                                                            ENVIRONMENTAL_SITE_ASMT_PH1_PH2Value,
                                                            FACILITY_ABANDONMENTValue,
                                                            PIPELINE_ABANDONMENTValue,
                                                            RECLAMATION_OF_SITESValue,
                                                            REMEDIATIONValue,
                                                            WELL_ABANDONMENTValue,
                                                            specialAccessValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('closure submission proposed  > project information (part 2)', () => {
            describe('area-based closure proposed > attach files', () => {
                it('attach shape file', async () => {
                    await OneStop.setFileUploadByCSS('#shapefileUpload input[type="file"]', shapefilePath);
                    await driver.sleep('500');
                });

                it('submit shape file', async () => {
                    await OneStop.clickElementByCSS('#submitShapefile');
                });

                it('shows a success popup message', async () => {
                    await OneStop.popUpConfirmation('Shapefile submitted for processing', waitLong);
                });

                it('wait for shape file to be processed', async () => {
                    await OneStop.waitForObjectLoad('#mapToolsPanelBody #showMap', shapeFileWaitInterval, waitShort, true);
                });
            });

            describe('area-based closure proposed > project details', () => {
                it('set year', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="year"]', yearValue);
                });

                it('set quarter', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="quarter"]', quarterValue);
                });

                it('enter project name', async () => {
                    await OneStop.setTextFieldValueByCSS('#projectName', projectNameValue);
                });

                if (WELL_ABANDONMENTValue === 'Y') {
                    it('set WELL ABANDONMENT', async () => {
                        await OneStop.setButtonCheckboxByCSS('*[name="WELL ABANDONMENT"]');
                    });
                }

                if (FACILITY_ABANDONMENTValue === 'Y') {
                    it('set FACILITY ABANDONMENT', async () => {
                        await OneStop.setButtonCheckboxByCSS('*[name="FACILITY ABANDONMENT"]');
                    });
                }

                if (PIPELINE_ABANDONMENTValue === 'Y') {
                    it('set PIPELINE ABANDONMENT', async () => {
                        await OneStop.setButtonCheckboxByCSS('*[name="PIPELINE ABANDONMENT"]');
                    });
                }

                if (ENVIRONMENTAL_SITE_ASMT_PH1_PH2Value === 'Y') {
                    it('set ENVIRONMENTAL_SITE_ASMT_PH1_PH2', async () => {
                        await OneStop.setButtonCheckboxByCSS('*[name="ENVIRONMENTAL_SITE_ASMT_PH1_PH2"]');
                    });
                }

                if (REMEDIATIONValue === 'Y') {
                    it('set REMEDIATION', async () => {
                        await OneStop.setButtonCheckboxByCSS('*[name="REMEDIATION"]');
                    });
                }

                if (RECLAMATION_OF_SITESValue === 'Y') {
                    it('set RECLAMATION OF SITES', async () => {
                        await OneStop.setButtonCheckboxByCSS('*[name="RECLAMATION OF SITES"]');
                    });
                }

                if (ALL_CLOSURE_ACTIVITIESValue === 'Y') {
                    it('set ALL CLOSURE ACTIVITIES', async () => {
                        await OneStop.setButtonCheckboxByCSS('*[name="ALL CLOSURE ACTIVITIES"]');
                    });
                }

                it('set specialAccess', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="specialAccess"]', specialAccessValue);
                });

                OneStop.validateAndReport('.btn.validate');

                it('click save button', async () => {
                    await OneStop.clickElementByCSS('#save');
                    await OneStop.waitForPageLoad();
                });
            });
        });
    };

    OneStop.pageClosureSubmissionConfirmation = (openApplication) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('area-based closure proposed > submit the closure', () => {
            it('click submit', async () => {
                // await driver.sleep(waitLong);
                await OneStop.clickElementByCSS('#submit');
            });

            OneStop.confirmSubmission('Confirm Submission', 'yes');

            it('click ok in the dialog', async () => {
                await OneStop.waitForObjectLoad('h4.modal-title', waitLong, 500, true);
                await OneStop.clickElementByCSS('.btn-close');
                await OneStop.waitForPageLoad();
            });
        });
    };

    return OneStop;
})();

module.exports = OneStop;
