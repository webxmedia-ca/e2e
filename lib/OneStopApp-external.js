/**
 * Created by cb5rp on 6/1/2017.
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

    OneStop.initExternal = (harnessObjIn, waitShortIn, waitLongIn) => {
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

    OneStop.pageGeneralContactInformation = (name,
                                             email,
                                             primaryContactValue) => {
        describe('general > contact information', () => {
            before(async () => {
                await driver.get(OneStop.getBaseUrl() + '/#' + appType.split('-')[0]);
                await OneStop.waitForPageLoad();
            });

            after(async () => {
                const value = await OneStop.getElementValueByCSS('#subheader-level-two');
                harnessObj.addApplicationToJSON(value);
            });

            it('enter name', async () => {
                await OneStop.waitForObjectLoad('*[name="applicant[contactName]"]', waitLong, 500, true);
                await OneStop.setTextFieldValueByCSS('*[name="applicant[contactName]"]', name);
            });

            it('enter email', async () => {
                await OneStop.setTextFieldValueByCSS('*[name="applicant[email]"]', email);
            });

            if (primaryContactValue && primaryContactValue != null) {
                it('enter primary contact value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="applicant[primaryContact]"]', primaryContactValue);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageGeneralApplicationInformation = (openApplication,
                                                 integrationChoiceValue,
                                                 projectName,
                                                 existingApprovalsValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('general > application information', () => {
            OneStop.clickLeftSideMenuItems('generalTab:applicationInfo', '#applicationInformationPanelHeading');

            it('set existing project', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="integrationChoice"]', integrationChoiceValue);
            });

            it('enter project name', async () => {
                await OneStop.setTextFieldValueByCSS('#new-application-integration-name', projectName);
            });

            if (existingApprovalsValue !== null) {
                it('set existing authorizations', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('input[name="existingApprovals"]', existingApprovalsValue);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageGeneralProposedActivity = (openApplication,
                                           publicLandBoolean,
                                           privateLandBoolean,
                                           proposedPipelinesActivity,
                                           proposedWellsActivity,
                                           proposedFacilitiesActivity,
                                           developmentTypeValue,
                                           integratedAmendmentTypeValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('general > proposed activity', () => {
            OneStop.clickLeftSideMenuItems('generalTab:proposedActivity', "#proposedActivityPanelHeading");

            if (publicLandBoolean) {
                it('set activity to public land', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="publicLand"]');
                });
            }

            if (privateLandBoolean) {
                it('set activity to private land', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="privateLand"]');
                });
            }

            if (proposedPipelinesActivity) {
                it('check pipelines', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="proposedPipelinesActivity"]');
                });
            }

            if (proposedWellsActivity) {
                it('check wells', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="proposedWellsActivity"]');
                });
            }

            if (proposedFacilitiesActivity) {
                it('check wells', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="proposedFacilitiesActivity"]');
                });
            }

            it('set association', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="developmentType"]', developmentTypeValue);
            });

            if (integratedAmendmentTypeValue !== null) {
                it('check type of amendment', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="integratedAmendmentType"]', integratedAmendmentTypeValue);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageGeneralAdditionalInformation = (openApplication,
                                                stakeholderConcernsValue,
                                                epeaApprovalValue,
                                                epeaCodeOfPracticeNotificationValue,
                                                waterActNotificationSubmittedValue,
                                                waterActApprovalRequiredValue,
                                                waterActLicenceValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('general > additional information', () => {
            OneStop.clickLeftSideMenuItems('generalTab:additionalInfo', "#additionalInformationPanelHeading");

            it('set stakeholder concerns', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="stakeholderConcerns"]', stakeholderConcernsValue);
            });

            it('set epeaApproval', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="epeaApproval"]', epeaApprovalValue);
            });

            it('set epeaCodeOfPracticeNotification', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="epeaCodeOfPracticeNotification"]', epeaCodeOfPracticeNotificationValue);
            });

            it('set waterActNotificationSubmitted', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="waterActNotificationSubmitted"]', waterActNotificationSubmittedValue);
            });

            it('set waterActApprovalRequired', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="waterActApprovalRequired"]', waterActApprovalRequiredValue);
            });

            it('set waterActLicence', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="waterActLicence"]', waterActLicenceValue);
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageConfirmationValidationsRules = (openApplication, pause) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('confirmation > validations / rules', () =>{
            OneStop.clickLeftSideMenuItems('confirmationTab:validationRules');

            it('no validation / rule failures exist', async () => {
                let element = await driver.wait(until.elementLocated(By.css('.validationFailed-grid')), waitLong * 30);
                element = await driver.wait(until.elementIsVisible(element), waitLong * 5);
                const elements = await element.findElements(By.css('button[data-event="view:validationError"]'));
                expect(elements.length).to.equal(0);
            });

            if (pause) {
                it('pause for display', async () => {
                    await driver.sleep(pause);
                });
            }
        });
    };

    OneStop.pageConfirmationOverview = (openApplication, applicationType) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('confirmation > overview', () => {
            OneStop.clickLeftSideMenuItems('confirmationTab:overview', "#overviewPanelHeading");

            OneStop.acceptDisclaimer('#disclaimerButton', '.agree');

            it('click save and submit application', async () => {
                await OneStop.clickElementByCSS('.btn-submit-application');
                await OneStop.waitForPageLoad();
            });

            OneStop.confirmSubmission('Confirm ' + applicationType + ' Submission', 'yes');
            OneStop.confirmModalHeader(applicationType + ' Submitted');

            it('click ok in the dialog', async () => {
                await OneStop.waitForObjectLoad('h4.modal-title', waitLong);
                await OneStop.clickElementByCSS('.btn-close');
                await OneStop.waitForPageLoad();
            });
        });
    };

    OneStop.pageWaterCodeOfPracticeSubmit = (openApplication,
                                             codeOfPracticeValue,
                                             gridIndex,
                                             legalLandGridValues,
                                             codeOfPracticeFormPDF,
                                             locationPlanPDF,
                                             waifWetlandCopPDF) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('navigate to construct menu -> water code of practice submenu', () => {
            OneStop.clickTopMenuItems('Construct', 'Water Code of Practice', '#codeOfPracticePanelHeading');
        });

        describe('add a new code of practice', () => {
            it('set code of practice value', async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="codeOfPractice"]', codeOfPracticeValue);
            });

            it('add new legal land description row', async () => {
                await OneStop.clickElementByCSS('.btn-add-lld');
                // await driver.sleep(100);
            });

            it('set 1/4 section', async () => {
                await OneStop.setBackGridSelectText('#codeOfPracticePanelBody #lldGrid td.renderable', 1,
                    legalLandGridValues[0].quarterSection);
            });

            it('set section', async () => {
                await OneStop.setBackGridText('#codeOfPracticePanelBody #lldGrid td.section', 0,
                    legalLandGridValues[0].section);
            });

            it('set township', async () => {
                await OneStop.setBackGridText('#codeOfPracticePanelBody #lldGrid td.township', 0,
                    legalLandGridValues[0].township);
            });

            it('set range', async () => {
                await OneStop.setBackGridText('#codeOfPracticePanelBody #lldGrid td.range', 0,
                    legalLandGridValues[0].range);
            });

            it('set meridian', async () => {
                await OneStop.setBackGridText('#codeOfPracticePanelBody #lldGrid td.meridian', 0,
                    legalLandGridValues[0].section);
            });

            it('select grid checkbox', async () => {
                await OneStop.setButtonCheckboxByCSS('#codeOfPracticePanelBody #lldGrid .select-all-header-cell');
            });

            it('attach code of practice form (pdf)', async () => {
                await OneStop.setFileUploadByCSS('#copForm input[type="file"]', codeOfPracticeFormPDF);
            });

            it('attach location plan (pdf)', async () => {
                await OneStop.setFileUploadByCSS('#locationPlan input[type="file"]', locationPlanPDF);
            });

            it('attach waif (wetland) cop (pdf)', async () => {
                await OneStop.setFileUploadByCSS('#waifCop input[type="file"]', waifWetlandCopPDF);
            });

            it('submit cop', async () => {
                await OneStop.clickElementByCSS('.btn-submit');
            });

            /*
            OneStop.checkErrorsExist(false);
            */

            OneStop.confirmSubmission('Declaration and Disclaimer', 'success');

            OneStop.confirmSubmission('Water Code of Practice Submission Successful', 'no');
        });

    };

    return OneStop;
})();

module.exports = OneStop;
