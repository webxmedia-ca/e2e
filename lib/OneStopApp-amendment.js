/**
 * Created by cb5rp on 6/1/2017.
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

// const expect = require('chai').expect;

const OneStop = (function () {

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

    OneStop.init = function (harnessObjIn, waitShortIn, waitLongIn) {
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

    OneStop.pageGeneralLicenseInformation = (openApplication,
                                             searchAppType,
                                             searchAppSubType) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('general > licence information', () => {
            OneStop.clickLeftSideMenuItems('generalTab:licenseInfo', '#SelectedLicencePanelHeading');

            it('enter license number', async () => {
                await OneStop.setTextFieldValueByCSS('*[name="authorizationId"]',
                    harnessObj.getMostRecentApplication(searchAppType, searchAppSubType, true).license);
            });

            it('click search', async () => {
                await OneStop.clickElementByCSS('#searchLicencesButton');
                await OneStop.waitForPageLoad();
            });

            it('click add license button', async () => {
                await OneStop.clickElementByCSS('#licence-search-grid .grid .btn-success');
                await OneStop.waitForPageLoad();
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageGeneralAuthorizationInformation = (openApplication,
                                                   searchAppType,
                                                   searchAppSubType) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('general > authorization information', () => {
            OneStop.clickLeftSideMenuItems('generalTab:authorizationInfo', '.authorization-search-container');

            it('enter authorization id', async () => {
                await OneStop.setTextFieldValueByCSS('*[name="authorizationAliasId"]',
                    harnessObj.getMostRecentApplication(searchAppType, searchAppSubType, true).license);
            });

            it('click search', async () => {
                await OneStop.clickElementByCSS('#searchAuthorizationsButton');
                await OneStop.waitForPageLoad();
            });

            it('click add license button', async () => {
                await OneStop.clickElementByCSS('#authorization-search-grid *[data-event="amend:authorization"]');
                await OneStop.waitForPageLoad();
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageLicensingLicenceLevelChanges = (openApplication,
                                                changeEntireYesNoValue,
                                                partialSubstanceYesNoValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('licensing > licence level changes', () => {
            OneStop.clickLeftSideMenuItems('licenseAmendmentTab', '#licenseLevelChangesPanelHeading');

            it('set changeEntireYesNo', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="changeEntireYesNo"]', changeEntireYesNoValue);
            });

            it('set partialSubstanceYesNo', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="partialSubstanceYesNo"]', partialSubstanceYesNoValue);
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageLicensingLineLevelChanges = (openApplication, appTypeIn, h2SValue, levelValue) => {
        describe('licensing > line level changes', () => {
                let amendmentType = appTypeIn.split('-')[1];
                amendmentType = amendmentType.replace(/\w\S*/g, (txt) => {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });

                if (openApplication) {
                    OneStop.openApplicationByLink();
                }

                OneStop.clickLeftSideMenuItems('licenseAmendmentTab:lineChanges', '#lineLevelChangesPanelHeading');

                it('select line level changes > ' + amendmentType, async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="' + amendmentType + '"]');
                });

                it('click the search button', async () => {
                    await OneStop.clickElementByCSS('#searchPanelBody .select-lines-button');
                    await OneStop.waitForPageLoad();
                });

                it('click select all checkbox on pls grid', async () => {
                    await OneStop.clickElementByCSS('.pls-grid .select-all-header-cell input[type="checkbox"]');
                });

                if (amendmentType !== 'Other') {
                    it('change action', async () => {
                        await OneStop.setSelectFieldValueByCSS('#amendmentSelect', amendmentType);
                    });
                }

                it('click the apply action button', async () => {
                    await OneStop.clickElementByCSS('.btn-select-lines');
                    await OneStop.waitForPageLoad();
                });

                if (amendmentType === 'Resumption') {
                    it('change ec value to none', async () => {
                        await OneStop.clickElementByCSS('.btn-save');
                        await driver.sleep(waitShort);
                        await OneStop.setBackGridSelectText('#ps-grid .grid .select-cell.ec', 0, 'None');
                    });

                }

                if (h2SValue != null) {
                    it('change h2S value to: ' + h2SValue, async () => {
                        await OneStop.clickElementByCSS('.btn-save');
                        await driver.sleep(waitShort);
                        await OneStop.setBackGridText('#pls-grid .grid .number-cell.h2sVolume', 0, h2SValue);
                    });
                }

                if (levelValue && levelValue != null) {
                    it('change level value to: ' + levelValue, async () => {
                        await OneStop.clickElementByCSS('.btn-save');
                        await driver.sleep(waitShort);
                        await OneStop.setBackGridSelectText('#pls-grid .select-cell.level', 0, levelValue);
                    });
                }

                OneStop.clickSave();
            }
        );
    }
    ;

    OneStop.pageLicenseAmendmentTechnicalInformation = (openApplication,
                                                        applicableStandardsIndValue,
                                                        h2sReleaseVolumeLevelChgIndValue,
                                                        abandonedRqmtsIndValue,
                                                        discontinuedRqmtsIndValue,
                                                        h2sContentsBlendedIndValue,
                                                        integrityVerifiedIndValue,
                                                        administrativeOversightAttachmentFilePath,
                                                        emergency_plan_zoneValue,
                                                        emergency_plan_zone_dev_cntValue,
                                                        proposedServiceAttachmentFilePath) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('license amendment > technical information', () => {
            OneStop.clickLeftSideMenuItems('licenseAmendmentTab:techEnvInfo', '#participantInvolvementPanelHeading');

            if (applicableStandardsIndValue !== null) {
                it('set applicable_standards_ind value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="applicable_standards_ind"]', applicableStandardsIndValue);
                });
            }

            if (h2sReleaseVolumeLevelChgIndValue !== null) {
                it('set h2s_release_volume_level_chg_ind value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="h2s_release_volume_level_chg_ind"]', h2sReleaseVolumeLevelChgIndValue);
                });
            }

            if (abandonedRqmtsIndValue !== null) {
                it('set abandoned_rqmts_ind', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="abandoned_rqmts_ind"]',
                        abandonedRqmtsIndValue);
                });
            }

            if (discontinuedRqmtsIndValue !== null) {
                it('set discontinued_rqmts_ind', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="discontinued_rqmts_ind"]',
                        discontinuedRqmtsIndValue);
                });
            }

            if (h2sContentsBlendedIndValue !== null) {
                it('set h2s_contents_blended_ind', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="h2s_contents_blended_ind"]',
                        h2sContentsBlendedIndValue);
                });
            }

            if (integrityVerifiedIndValue !== null) {
                it('set integrity_verified_ind', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="integrity_verified_ind"]',
                        integrityVerifiedIndValue);
                });
            }

            if (administrativeOversightAttachmentFilePath !== null) {
                it('attach administrativeOversightAttachment', async () => {
                    await OneStop.setFileUploadByCSS('#administrativeOversightAttachment *[name="fileselect[]"]',
                        administrativeOversightAttachmentFilePath);
                });
            }

            if (emergency_plan_zoneValue && emergency_plan_zoneValue != null) {
                it('enter emergency_plan_zone value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="emergency_plan_zone"]', emergency_plan_zoneValue);
                });
            }

            if (emergency_plan_zone_dev_cntValue != null) {
                it('enter emergency_plan_zone_dev_cnt value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="emergency_plan_zone_dev_cnt"]',
                        emergency_plan_zone_dev_cntValue);
                });
            }

            if (proposedServiceAttachmentFilePath !== null) {
                it('attach proposedServiceAttachment', async () => {
                    await OneStop.setFileUploadByCSS('#proposedServiceAttachment *[name="fileselect[]"]',
                        proposedServiceAttachmentFilePath);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageAuthorizationAmendment = (openApplication,
                                          extendExpiryValue,
                                          newExpiryDateRequestedValue,
                                          amendmentRequestedDescriptionValue,
                                          amendmentRequestedJustificationValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('authorization amendment', () => {
            if (openApplication) {
                it('open general section', async () => {
                    await driver.sleep(waitShort);
                    await OneStop.clickElementByCSS('a[data-id="generalTab"]');
                    await driver.sleep(waitShort);
                });
            }

            it('open authorization amendment section', async () => {
                await driver.sleep(waitShort);
                await OneStop.clickElementByCSS('a[data-id="authorizationAmendmentTab"]');
                await OneStop.waitForPageLoad();
            });

            if (extendExpiryValue !== null) {
                it('set extendExpiry value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="extendExpiry"]', extendExpiryValue);
                });
            }

            if (newExpiryDateRequestedValue !== null) {
                it('set newExpiryDateRequested value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="newExpiryDateRequested"]', newExpiryDateRequestedValue);
                });
            }

            if (amendmentRequestedDescriptionValue !== null) {
                it('set amendmentRequestedDescription value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="amendmentRequestedDescription"]', amendmentRequestedDescriptionValue);
                });
            }

            if (amendmentRequestedJustificationValue !== null) {
                it('set amendmentRequestedJustification value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="amendmentRequestedJustification"]', amendmentRequestedJustificationValue);
                });
            }

            it('click save', async () => {
                await OneStop.clickElementByCSS('.btn-save');
                await driver.sleep(waitShort);
            });
        });
    };

    return OneStop;
})
();

module.exports = OneStop;

//2790 lines