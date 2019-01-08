/**
 * Created by cb5rp on 6/1/2017.
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

// const expect = require('chai').expect;

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

    OneStop.pageAssetInformationAssets = (openApplication,
                                          assetObjectArray,
                                          associatedActivityArray) => {
        const addAsset = (asset, index) => {
            it('click add asset row', async () => {
                await OneStop.clickElementByCSS('.btn-add-asset');
            });

            it('enter qtr: ' + asset.qtr, async () => {
                await OneStop.setTextFieldValueByCSS('.search-assets #quarter', asset.qtr);
            });

            it('enter lsd: ' + asset.lsd, async () => {
                await OneStop.setTextFieldValueByCSS('.search-assets #lsd', asset.lsd);
            });

            it('enter sec: ' + asset.sec, async () => {
                await OneStop.setTextFieldValueByCSS('.search-assets #sec', asset.sec);
            });

            it('enter twp: ' + asset.twp, async () => {
                await OneStop.setTextFieldValueByCSS('.search-assets #twp', asset.twp);
            });

            it('enter rge: ' + asset.rge, async () => {
                await OneStop.setTextFieldValueByCSS('.search-assets #rge', asset.rge);
            });

            it('enter mer: ' + asset.mer, async () => {
                await OneStop.setTextFieldValueByCSS('.search-assets #m', asset.mer);
            });

            it('click search', async () => {
                await OneStop.clickElementByCSS('.search-assets .btn-search');
                await OneStop.waitForPageLoad();
            });

            it('click select all results', async () => {
                await OneStop.clickElementByCSS('.search-assets .select-all-header-cell');
            });

            it('click add assets', async () => {
                await OneStop.clickElementByCSS('.modal-footer .btn-save');
                await driver.sleep(1000);
            });

            it('set construction practice: ' + asset.constructionPractice, async () => {
                await OneStop.setBackGridSelectText('.asset-info-grid .select-cell', (index * 2),
                    asset.constructionPractice);
            });

            it('set primary asset: ' + asset.primaryAsset, async () => {
                await OneStop.setBackGridSelectText('.asset-info-grid .select-cell', (index * 2) + 1,
                    asset.primaryAsset);
            });
        };

        const addAssociatedActivity = (activity, index) => {
            it('click add asset row', async () => {
                await OneStop.clickElementByCSS('.btn-add-associated-activity');
            });

            it('enter activity type: ' + activity.type, async () => {
                await OneStop.setBackGridSelectText(
                    '#activitiesGridContainer tbody tr:nth-child(' + (index + 1) + ') td.select-cell',
                    0,
                    activity.type
                );
            });

            if (activity.other !== "") {
                it('enter activity type other: ' + activity.other, async () => {
                    await OneStop.setBackGridText(
                        '#activitiesGridContainer tbody tr:nth-child(' + (index + 1) + ') td.otherActivityDescription',
                        0,
                        activity.other
                    );
                });
            }

            if (activity.llds.length > 0) {
                it('click activity edit button', async () => {
                    await OneStop.clickElementByCSS('#activitiesGridContainer tbody tr:nth-child(' + (index + 1) +
                        ') .btn-lld-cell');
                });

                for (let i = 0; i < activity.llds.length; i++) {
                    addAssociatedActivityLLD(activity.llds[i], i);
                }

                it('click activity edit done button', async () => {
                    await OneStop.clickElementByCSS('.modal-footer .btn-done');
                    await driver.sleep(1000);
                });

                it('set construction practice: ' + activity.constructionPractice, async () => {
                    await OneStop.setBackGridSelectText('.associated-activity-grid .select-cell', index + 1, activity.constructionPractice);
                });
            }
        };

        const addAssociatedActivityLLD = (lld, index) => {
            it('click activity edit add button', async () => {
                await OneStop.clickElementByCSS('.lld-editor .btn-add');
	            await driver.sleep(100);
            });

            it('enter lsd: ' + lld.lsd, async () => {
                await OneStop.setBackGridText(
                    '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.lsd',
                    0,
                    lld.lsd
                );
                await driver.sleep(100);
                await OneStop.clickElementByCSS('.modal-title');
            });

            it('enter quarter: ' + lld.qtr, async () => {
                await OneStop.setBackGridText(
                    '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.quarter',
                    0,
                    lld.qtr
                );
                await driver.sleep(100);
                await OneStop.clickElementByCSS('.modal-title');
            });

            it('enter section: ' + lld.sec, async () => {
                await OneStop.setBackGridText(
                    '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.section',
                    0,
                    lld.sec
                );
                await driver.sleep(100);
                await OneStop.clickElementByCSS('.modal-title');
            });

            it('enter township: ' + lld.twp, async () => {
                await OneStop.setBackGridText(
                    '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.township',
                    0,
                    lld.twp
                );
                await driver.sleep(100);
                await OneStop.clickElementByCSS('.modal-title');
            });

            it('enter range: ' + lld.rge, async () => {
                await OneStop.setBackGridText(
                    '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.range',
                    0,
                    lld.rge
                );
                await driver.sleep(100);
                await OneStop.clickElementByCSS('.modal-title');
            });

            it('enter meridian: ' + lld.mer, async () => {
                await OneStop.setBackGridText(
                    '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.meridian',
                    0,
                    lld.mer
                );
                await driver.sleep(100);
                await OneStop.clickElementByCSS('.modal-title');
            });
        };

        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('asset information > assets', () => {
            OneStop.clickLeftSideMenuItems('assetInfoTab', "#AssetTabAssetInfoViewPanelBody");

            for (let i = 0; i < assetObjectArray.length; i++) {
                addAsset(assetObjectArray[i], i);
            }

            for (let i2 = 0; i2 < associatedActivityArray.length; i2++) {
                addAssociatedActivity(associatedActivityArray[i2], i2);
            }

            OneStop.clickSave();
        });
    };

    // OneStop.pageAssetInformationAssociatedActivities = (openApplication,
    //                                                     associatedActivityArray) => {
    //     const addAssociatedActivity = (activity, index) => {
    //         it('click add asset row', async () => {
    //             await OneStop.clickElementByCSS('.btn-add-associated-activity');
    //         });
    //
    //         it('enter activity type: ' + activity.type, async () => {
    //             await OneStop.setBackGridSelectText(
    //                 '#activitiesGridContainer tbody tr:nth-child(' + (index + 1) + ') td.select-cell',
    //                 0,
    //                 activity.type
    //             );
    //         });
    //
    //         if (activity.other !== "") {
    //             it('enter activity type other: ' + activity.other, async () => {
    //                 await OneStop.setBackGridText(
    //                     '#activitiesGridContainer tbody tr:nth-child(' + (index + 1) + ') td.otherActivityDescription',
    //                     0,
    //                     activity.other
    //                 );
    //             });
    //         }
    //
    //         if (activity.llds.length > 0) {
    //             it('click activity edit button', async () => {
    //                 await OneStop.clickElementByCSS('#activitiesGridContainer tbody tr:nth-child(' + (index + 1) +
    //                     ') .btn-lld-cell');
    //             });
    //
    //             for (let i = 0; i < activity.llds.length; i++) {
    //                 addAssociatedActivityLLD(activity.llds[i], i);
    //             }
    //
    //             it('click activity edit done button', async () => {
    //                 await OneStop.clickElementByCSS('.modal-footer .btn-done');
    //             });
    //         }
    //     };
    //
    //     const addAssociatedActivityLLD = (lld, index) => {
    //         it('click activity edit add button', async () => {
    //             await OneStop.clickElementByCSS('.lld-editor .btn-add');
    //         });
    //
    //         it('enter lsd: ' + lld.lsd, async () => {
    //             await OneStop.setBackGridText(
    //                 '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.lsd',
    //                 0,
    //                 lld.lsd
    //             );
    //             await driver.sleep(100);
    //             await OneStop.clickElementByCSS('.modal-title');
    //         });
    //
    //         it('enter quarter: ' + lld.qtr, async () => {
    //             await OneStop.setBackGridText(
    //                 '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.quarter',
    //                 0,
    //                 lld.qtr
    //             );
    //             await driver.sleep(100);
    //             await OneStop.clickElementByCSS('.modal-title');
    //         });
    //
    //         it('enter section: ' + lld.sec, async () => {
    //             await OneStop.setBackGridText(
    //                 '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.section',
    //                 0,
    //                 lld.sec
    //             );
    //             await driver.sleep(100);
    //             await OneStop.clickElementByCSS('.modal-title');
    //         });
    //
    //         it('enter township: ' + lld.twp, async () => {
    //             await OneStop.setBackGridText(
    //                 '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.township',
    //                 0,
    //                 lld.twp
    //             );
    //             await driver.sleep(100);
    //             await OneStop.clickElementByCSS('.modal-title');
    //         });
    //
    //         it('enter range: ' + lld.rge, async () => {
    //             await OneStop.setBackGridText(
    //                 '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.range',
    //                 0,
    //                 lld.rge
    //             );
    //             await driver.sleep(100);
    //             await OneStop.clickElementByCSS('.modal-title');
    //         });
    //
    //         it('enter meridian: ' + lld.mer, async () => {
    //             await OneStop.setBackGridText(
    //                 '.lld-editor tbody tr:nth-child(' + (index + 1) + ') td.meridian',
    //                 0,
    //                 lld.mer
    //             );
    //             await driver.sleep(100);
    //             await OneStop.clickElementByCSS('.modal-title');
    //         });
    //     };
    //
    //     if (openApplication) {
    //         OneStop.openApplicationByLink();
    //     }
    //
    //     describe('asset information > associated activities', () => {
    //         OneStop.clickLeftSideMenuItems('assetInfoTab:associatedActivities', "#AssetTabAssociatedActivityViewPanelBody");
    //
    //         for (let i = 0; i < associatedActivityArray.length; i++) {
    //             addAssociatedActivity(associatedActivityArray[i], i);
    //         }
    //
    //         OneStop.clickSave();
    //     });
    // };

    OneStop.pageAssetInformationRelatedSubmissions = (openApplication,
                                                      relatedSubmissionsArray) => {
        const addRelatedSubmission = (submission) => {
            it('click add asset row', async () => {
                await OneStop.clickElementByCSS('.btn-add-related-submissions');
            });

            it('enter search operator: ' + submission.operator, async () => {
                await OneStop.setTextFieldValueByCSS('.modal-body *[name="OperatorName"', submission.operator);
            });

            it('click search', async () => {
                await OneStop.clickElementByCSS('.btn-search');
            });

            it('select first result', async () => {
                await OneStop.clickElementByCSS('.search-results tr:nth-child(1) .select-row-cell');
            });

            it('click add submissions', async () => {
                await OneStop.clickElementByCSS('.modal-footer .btn-save');
            });
        };

        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('asset information > associated activities', () => {
            OneStop.clickLeftSideMenuItems('assetInfoTab:relatedSubmissions', "#AssetTabRelatedSubmissionsViewPanelBody");

            if (relatedSubmissionsArray && relatedSubmissionsArray.length) {
                it('set hasSubmissions to yes', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="hasSubmissions"]', 'Y');
                });

                for (let i = 0; i < relatedSubmissionsArray.length; i++) {
                    addRelatedSubmission(relatedSubmissionsArray[i]);
                }
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageAssetInformationRelatedSubmissions = (openApplication,
                                                      relatedSubmissionsArray) => {
        const addRelatedSubmission = (submission) => {
            it('click add asset row', async () => {
                await OneStop.clickElementByCSS('.btn-add-related-submissions');
            });

            it('enter search operator: ' + submission.operator, async () => {
                await OneStop.setTextFieldValueByCSS('.modal-body *[name="OperatorName"', submission.operator);
            });

            it('click search', async () => {
                await OneStop.clickElementByCSS('.btn-search');
            });

            it('select first result', async () => {
                await OneStop.clickElementByCSS('.search-results tr:nth-child(1) .select-row-cell');
            });

            it('click add submissions', async () => {
                await OneStop.clickElementByCSS('.modal-footer .btn-save');
            });
        };

        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('asset information > associated activities', () => {
            OneStop.clickLeftSideMenuItems(
                "assetInfoTab:relatedSubmissions",
                "#AssetTabRelatedSubmissionsViewPanelBody");

            if (relatedSubmissionsArray && relatedSubmissionsArray.length) {
                it('set hasSubmissions to yes', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="hasSubmissions"]', 'Y');
                });

                for (let i = 0; i < relatedSubmissionsArray.length; i++) {
                    addRelatedSubmission(relatedSubmissionsArray[i]);
                }
            }
            OneStop.clickSave();
        });
    };

    OneStop.pageAssetInformationDispositionCancellations = (openApplication,
                                                            publicLandDispositionCancelledValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('asset information > disposition cancellations', () => {
            OneStop.clickLeftSideMenuItems(
                "assetInfoTab:dispositionCancellations",
                "#AssetTabDispositionCancellationViewPanelBody"
            );

            it('set publicLandDispositionCancelled', async () => {
                await OneStop.setButtonRadioFieldValueByCSS(
                    '*[name="publicLandDispositionCancelled"]',
                    publicLandDispositionCancelledValue);
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageSiteInformationSiteIdentification = (openApplication,
                                                     hasEpeaApprovalValue,
                                                     epeaNumberValue,
                                                     publicLandBoolean,
                                                     privateLandBoolean,
                                                     specialAreasBoolean,
                                                     parksProtectedAreasBoolean,
                                                     publicLandExceptionValue,
                                                     countyIdValue,
                                                     totalLandAreaInAcresValue,
                                                     areaOfWetlandDisturbedValue,
                                                     areaReclaimedToWetlandValue,
                                                     surveyPlanFilePath) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('site information > site identification', () => {
            OneStop.clickLeftSideMenuItems('siteInfoTab', "#SiteInfoSiteIdentificationViewPanelBody");

            if (hasEpeaApprovalValue !== null) {
                it('select hasEpeaApproval', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="hasEpeaApproval"]', hasEpeaApprovalValue);
                });

                if (hasEpeaApprovalValue === "Y" && epeaNumberValue !== null) {
                    it('set epeaNumber value', async () => {
                        await OneStop.setTextFieldValueByCSS('*[name="epeaNumber"]', epeaNumberValue);
                    });
                }
            }

            if (publicLandBoolean) {
                it('select publicLand', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="publicLand"]');
                });
            }

            if (privateLandBoolean) {
                it('select privateLand', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="privateLand"]');
                });
            }

            if (specialAreasBoolean) {
                it('select specialAreas', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="specialAreas"]');
                });
            }

            if (parksProtectedAreasBoolean) {
                it('select parksProtectedAreas', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="parksProtectedAreas"]');
                });
            }

            if (publicLandExceptionValue !== null) {
                it('set publicLandException value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="publicLandException"]', publicLandExceptionValue);
                });
            }

            if (countyIdValue !== null) {
                it('set countyId value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="countyId"]', countyIdValue);
                });
            }

            if (totalLandAreaInAcresValue !== null) {
                it('set totalLandAreaInAcres value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="totalLandAreaInAcres"]', totalLandAreaInAcresValue);
                });
            }

            if (areaOfWetlandDisturbedValue !== null) {
                it('set areaOfWetlandDisturbed value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="areaOfWetlandDisturbed"]', areaOfWetlandDisturbedValue);
                });
            }

            if (areaReclaimedToWetlandValue !== null) {
                it('set areaReclaimedToWetland value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="areaReclaimedToWetland"]', areaReclaimedToWetlandValue);
                });
            }

            if (surveyPlanFilePath !== null) {
                it('attach surveyPlanFilePath', async () => {
                    await OneStop.setFileUploadByCSS('.survey-plan *[name="fileselect[]"]', surveyPlanFilePath);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageSiteInformationAdditionalCertificatesAttached = (openApplication,
                                                                 certObjectArray) => {
        const addCertificate = (certificate, index) => {
            it('click add additional certificate row', async () => {
                await OneStop.clickElementByCSS('.btn-add-additional-certificate');
            });

            it('enter certificate number: ' + certificate.number, async () => {
                await OneStop.setBackGridText(
                    '.other-certificates-grid tbody tr:nth-child(' + (index + 1) + ') td.number',
                    0,
                    certificate.number
                );
            });

            it('enter certificate type: ' + certificate.type, async () => {
                await OneStop.setBackGridSelectText(
                    '.other-certificates-grid tbody tr:nth-child(' + (index + 1) + ') td.select-cell',
                    0,
                    certificate.type
                );
            });

            it('enter certificate comment: ' + certificate.comments, async () => {
                await OneStop.setBackGridText(
                    '.other-certificates-grid tbody tr:nth-child(' + (index + 1) + ') td.comments',
                    0,
                    certificate.comments
                );
            });
        };

        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('site information > additional certificates attached', () => {
            OneStop.clickLeftSideMenuItems('siteInfoTab:additionalCertificatesAttached', "#SiteInfoAdditionalCertificatesViewPanelBody");

            if (certObjectArray && certObjectArray.length) {
                it('set hasCertificates to yes', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="hasCertificates"]', 'Y');
                });

                for (let i = 0; i < certObjectArray.length; i++) {
                    addCertificate(certObjectArray[i], i);
                }
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageSiteInformationPreviousRefusedCancelled = (openApplication,
                                                           hasSitePreviouslyRefusedValue,
                                                           refusalReasonIdValue,
                                                           previouslyCertifiedAndCancelledValue,
                                                           cancelledReasonIdValue,
                                                           prevRefusalOrCancellationDetailIdValue,
                                                           howAddressedOtherValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('site information > previously refused applications or cancelled certificates', () => {

            OneStop.clickLeftSideMenuItems('siteInfoTab:previouslyRefusedApplications', "#SiteInfoPreviouslyRefusedViewPanelBody");

            if (hasSitePreviouslyRefusedValue !== null) {
                it('set hasSitePreviouslyRefused: ' + hasSitePreviouslyRefusedValue, async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="hasSitePreviouslyRefused"]',
                        hasSitePreviouslyRefusedValue);
                });

                if (hasSitePreviouslyRefusedValue === "Y") {
                    if (refusalReasonIdValue !== null) {
                        it('set refusalReasonId: ' + refusalReasonIdValue, async () => {
                            await OneStop.setSelectFieldValueByCSS('*[name="refusalReasonId"]', refusalReasonIdValue);
                        });
                    }
                }
            }

            if (previouslyCertifiedAndCancelledValue !== null) {
                it('set previouslyCertifiedAndCancelled: ' + previouslyCertifiedAndCancelledValue, async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="previouslyCertifiedAndCancelled"]',
                        previouslyCertifiedAndCancelledValue);
                });

                if (previouslyCertifiedAndCancelledValue === "Y") {
                    if (cancelledReasonIdValue !== null) {
                        it('set cancelledReasonId: ' + cancelledReasonIdValue, async () => {
                            await OneStop.setSelectFieldValueByCSS('*[name="cancelledReasonId"]', cancelledReasonIdValue);
                        });
                    }
                }
            }

            if (hasSitePreviouslyRefusedValue === "Y" || previouslyCertifiedAndCancelledValue === "Y") {
                if (prevRefusalOrCancellationDetailIdValue !== null) {
                    it('set prevRefusalOrCancellationDetailId: ' + prevRefusalOrCancellationDetailIdValue, async () => {
                        await OneStop.setSelectFieldValueByCSS('*[name="prevRefusalOrCancellationDetailId"]',
                            prevRefusalOrCancellationDetailIdValue);
                    });

                    if (prevRefusalOrCancellationDetailIdValue === "OTHER") {
                        if (howAddressedOtherValue !== null) {
                            it('set howAddressedOther: ' + howAddressedOtherValue, async () => {
                                await OneStop.setTextFieldValueByCSS('*[name="howAddressedOther"]',
                                    howAddressedOtherValue);
                            });
                        }
                    }
                }
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageSiteInformationPartialOverlapping = (openApplication,
                                                     overlappingExemptionRequiredValue,
                                                     supportingDocFilePath,
                                                     publicLandPartialReclamationValue,
                                                     supportingDocPublicLandFilePath,
                                                     amendmentSubmittedValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('site information > partial reclaimation or overlapping exemption', () => {

                OneStop.clickLeftSideMenuItems('siteInfoTab:partialReclamation', "#SiteInfoPartialReclamationViewPanelBody");

                if (overlappingExemptionRequiredValue !== null) {
                    it('set overlappingExemptionRequired: ' + overlappingExemptionRequiredValue, async () => {
                        await OneStop.setButtonRadioFieldValueByCSS('*[name="overlappingExemptionRequired"]',
                            overlappingExemptionRequiredValue);
                    });

                    if (overlappingExemptionRequiredValue === "Y") {
                        if (supportingDocFilePath !== null) {
                            it('set supportingDocFilePath: ' + supportingDocFilePath, async () => {
                                await OneStop.setFileUploadByCSS('.supporting-doc *[name="fileselect[]"]',
                                    supportingDocFilePath);
                            });
                        }
                    }
                }

                if (publicLandPartialReclamationValue !== null) {
                    it('set publicLandPartialReclamation: ' + publicLandPartialReclamationValue, async () => {
                        await OneStop.setButtonRadioFieldValueByCSS('*[name="publicLandPartialReclamation"]',
                            publicLandPartialReclamationValue);
                    });

                    if (publicLandPartialReclamationValue === "Y") {

                        if (supportingDocPublicLandFilePath !== null) {
                            it('set supportingDocFilePath: ' + supportingDocPublicLandFilePath, async () => {
                                await OneStop.setFileUploadByCSS('.supporting-doc-public-land *[name="fileselect[]"]',
                                    supportingDocPublicLandFilePath);
                            });
                        }

                        if (amendmentSubmittedValue !== null) {
                            it('set amendmentSubmitted: ' + amendmentSubmittedValue, async () => {
                                await OneStop.setButtonRadioFieldValueByCSS('*[name="amendmentSubmitted"]',
                                    amendmentSubmittedValue);
                            });
                        }
                    }
                }

                OneStop.clickSave();
            }
        );
    };

    OneStop.pageEnvironmentalSiteAssessmentPhase1Summary = (openApplication) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('environmental site assessment > phase 1 summary', () => {
            OneStop.clickLeftSideMenuItems('esaTab', "#ESAPhase1ViewPanelBody");
            OneStop.clickSave();
        });
    };

    OneStop.pageEnvironmentalSiteAssessmentPhase23Summary = (openApplication) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('environmental site assessment > phase 2/3 summary', () => {
            OneStop.clickLeftSideMenuItems('esaTab:phase2Summary', "#ESAPhase2ViewPanelBody");
            OneStop.clickSave();
        });
    };

    OneStop.pageStakeholderInformationOperator = (openApplication) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('stakeholder information > operator', () => {
            OneStop.clickLeftSideMenuItems('stakeholderInfoTab', "#OperatorViewPanelBody");
            OneStop.clickSave();
        });
    };

    OneStop.pageStakeholderInformationLandOwnerOccupants = (openApplication,
                                                            contactsArray,
                                                            interviewDetailsArray,
                                                            attachmentArray) => {
        const addContactInformation = (contact, index) => {
            it('click add contact', async () => {
                await OneStop.clickElementByCSS('.btn-add-contact');
                await driver.sleep(500);
            });

            it('enter communicationPreference: ' + contact.communicationPreference, async () => {
                await OneStop.setBackGridSelectText(".contact-info-grid tbody td.select-cell",
                    (index * 2) + 1,
                    contact.communicationPreference);
            });

            it('enter email: ' + contact.email, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.email", index, contact.email);
            });

            it('enter country: ' + contact.country, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.country", index, contact.country);
            });

            it('enter postalZipCode: ' + contact.postalZipCode, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.postalZipCode", index, contact.postalZipCode);
            });

            it('enter province: ' + contact.province, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.province", index, contact.province);
            });

            it('enter city: ' + contact.city, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.city", index, contact.city);
            });

            it('enter address: ' + contact.address, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.address", index, contact.address);
            });

            it('enter phone: ' + contact.phone, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.phone", index, contact.phone);
            });

            it('enter contactName: ' + contact.contactName, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.contactName", index, contact.contactName);
            });

            it('enter companyName: ' + contact.companyName, async () => {
                await OneStop.setBackGridText(".contact-info-grid tbody td.companyName", index, contact.companyName);
            });

            it('enter type: ' + contact.type, async () => {
                await OneStop.setBackGridSelectText(".contact-info-grid tbody td.select-cell", index * 2, contact.type);
            });
        };

        const addInterviewDetails = (interview, index) => {
            it('click add interview', async () => {
                await OneStop.clickElementByCSS('.btn-add-interview');
            });

            it('enter type: ' + interview.type, async () => {
                await OneStop.setBackGridSelectText(".interview-grid tbody td.select-cell", index * 2, interview.type);
            });

            it('enter comments: ' + interview.comments, async () => {
                await OneStop.setBackGridSelectText(".interview-grid tbody td.select-cell", (index * 2) + 1, interview.comments);
            });

            it('enter interviewee: ' + interview.interviewee, async () => {
                await OneStop.setBackGridText(".interview-grid tbody td.interviewee", index, interview.interviewee);
            });

            it('enter date: ' + interview.date, async () => {
                await OneStop.setBackGridText(".interview-grid tbody td.moment-cell", index, interview.date);
            });

            it('enter interviewer: ' + interview.interviewer, async () => {
                await OneStop.setBackGridText(".interview-grid tbody td.interviewer", index, interview.interviewer);
            });

            it('enter other: ' + interview.intervieweeCommentOther, async () => {
                await OneStop.setBackGridText(".interview-grid tbody td.intervieweeCommentOther", index, interview.intervieweeCommentOther);
            });
        };

        const addAttachment = (attachment) => {
            it('click add attachment', async () => {
                await OneStop.clickElementByCSS('.btn-add-attachment');
            });

            it('add attachment: ' + attachment.path, async () => {
                await OneStop.setFileUploadByCSS('.modal-body .document-select *[name="fileselect[]"]',
                    attachment.path);
            });

            it('enter document type: ' + attachment.type, async () => {
                await OneStop.setSelectFieldValueByCSS(".modal-body #documentType", attachment.type);
            });

            it('enter comments: ' + attachment.comments, async () => {
                await OneStop.setTextFieldValueByCSS('.modal-body *[name="comments"]', attachment.comments);
            });

            it('click add document', async () => {
                await OneStop.clickElementByCSS('.modal-footer .btn-save');
                await driver.sleep(500);
            });
        };

        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('stakeholder information > land owner and occupants', () => {
            OneStop.clickLeftSideMenuItems('stakeholderInfoTab:landownerOccupants', "#ContactInfoPanelBody");

            if (contactsArray && contactsArray.length) {
                for (let i = 0; i < contactsArray.length; i++) {
                    addContactInformation(contactsArray[i], i);
                }
            }

            if (interviewDetailsArray && interviewDetailsArray.length) {
                it('set opportunity to yes', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="opportunity"]', 'Y');
                });

                for (let i2 = 0; i2 < interviewDetailsArray.length; i2++) {
                    addInterviewDetails(interviewDetailsArray[i2], i2);
                }
            }

            if (attachmentArray && attachmentArray.length) {
                for (let i3 = 0; i3 < attachmentArray.length; i3++) {
                    addAttachment(attachmentArray[i3]);
                }
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageReclamationInformationDates = (openApplication,
                                               surveyDateValue,
                                               constructionDateValue,
                                               abandonmentDateValue,
                                               dateReclamationCompletedValue,
                                               finalAssessmentSoilValue,
                                               finalAssessmentVegetationValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('reclamation information > dates', () => {
            OneStop.clickLeftSideMenuItems('reclamationInfoTab:dates', "#ReclamationInfoDateViewPanelBody");

            if (surveyDateValue !== null) {
                it('set surveyDate: ' + surveyDateValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="surveyDate"]', surveyDateValue);
                });
            }

            if (constructionDateValue !== null) {
                it('set constructionDate: ' + constructionDateValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="constructionDate"]', constructionDateValue);
                });
            }

            if (abandonmentDateValue !== null) {
                it('set abandonmentDate: ' + abandonmentDateValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="abandonmentDate"]', abandonmentDateValue);
                });
            }

            if (dateReclamationCompletedValue !== null) {
                it('set dateReclamationCompleted: ' + dateReclamationCompletedValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="dateReclamationCompleted"]', dateReclamationCompletedValue);
                });
            }

            if (finalAssessmentSoilValue !== null) {
                it('set finalAssessmentSoil: ' + finalAssessmentSoilValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="finalAssessmentSoil"]', finalAssessmentSoilValue);
                });
            }

            if (finalAssessmentVegetationValue !== null) {
                it('set finalAssessmentVegetation: ' + finalAssessmentVegetationValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="finalAssessmentVegetation"]', finalAssessmentVegetationValue);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageReclamationInformationCriteriaCategoryUsed = (openApplication,
                                                              criteriaCategoriesArray,
                                                              criteriaChangedValue,
                                                              consentDropdownIdValue,
                                                              consentAttachmentFilePath) => {
        const enableCategory = (category) => {
            it('enable category: ' + category.name, async () => {
                await OneStop.setButtonCheckboxByCSS('*[name="' + category.name + '"]');
            });

            it('select ' + category.name + ' criteria: ' + category.criteria, async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="' + category.name + 'Selection"]', category.criteria);
            });
        };

        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('reclamation information > criteria category used', () => {
            OneStop.clickLeftSideMenuItems(
                'reclamationInfoTab:criteriaCategory',
                "#ReclamationInfoCriteriaUsedViewPanelBody"
            );

            if (criteriaCategoriesArray && criteriaCategoriesArray.length > 0) {
                for (let i = 0; i < criteriaCategoriesArray.length; i++) {
                    enableCategory(criteriaCategoriesArray[i]);
                }
            }

            it('set criteriaChanged: ' + criteriaChangedValue, async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="criteriaChanged"]', 'Y');
            });

            it('set consentDropdownId: ' + consentDropdownIdValue, async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="consentDropdownId"]', consentDropdownIdValue);
            });

            it('set consentAttachmentFilePath: ' + consentAttachmentFilePath, async () => {
                await OneStop.setFileUploadByCSS('#consentAttachment *[name="fileselect[]"]', consentAttachmentFilePath);
            });

            OneStop.clickSave();
        });
    };

    return OneStop;
})();

module.exports = OneStop;
