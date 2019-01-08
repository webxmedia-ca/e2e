/**
 * Created by cb5rp on 6/1/2017.
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

const expect = require('chai').expect;

const shapeFileWaitInterval = 300000;

const OneStop = (() => {
    const OneStop = require('./OneStopApp-external');

    let driver = null
        , By = null
        , until = null
        , waitShort = null
        , waitLong = null
        , initialized = null
        , harnessObj = null
        , username = null
        , password = null
        , baseUrl = null
        , displayName = null
        , env = null
        , appType = null
        , appSubType = null;

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

    OneStop.actionVerifyBaselineLicensePDF = (waitInterval) => {
        describe('verify baseline license pdf generated', () => {
            before(async () => {
                await driver.sleep(waitInterval);
                await driver.get(OneStop.getBaseUrl() + '/#' + appType + '/' +
                    harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
                await OneStop.waitForPageLoad();
            });

            OneStop.clickOnTabByText("Documents", ".content-container");

            it('pdf link exists', async () => {
                let elements;
                await driver.wait(until.elementLocated(By.css('.files-collection .file-view .file-name')),
                    waitLong * 30);
                elements = await driver.findElements(By.css('.files-collection .file-view .file-name'));
                expect(elements.length > 0).to.be.true;

                //get the license number
                elements = await driver.findElements(By.css('.authorization-table td'));
                const text = await elements[1].getText();

                //write the license number
                harnessObj.setAppLicenseNumber(appType, appSubType, text);
            });
        });
    };

    OneStop.actionVerifyCreatedApplication = () => {
        let appId;

        describe('verify application ' +
            harnessObj.getMostRecentApplication(harnessObj.getAppType,
                harnessObj.getAppSubType, true).appId + ' created', () => {

            before(async () => {
                appId = harnessObj.getMostRecentApplication(harnessObj.getAppType, harnessObj.getAppSubType, true).appId;
            });

            OneStop.clickTopMenuItems('Home', null, '#recentActivityHeading');

            it('check app id ' + appId + ' exists', async () => {

            });
        });
    };

    OneStop.pageGeneralActivityDetails_PipelineLicense = (openApplication,
                                                          applicationTypeOptionValue,
                                                          applicationPurposeOptionValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('general > activity details - pipeline license', () => {
            OneStop.clickLeftSideMenuItems('generalTab:activityDetails', "#ProposedLicencesPanelBody");

            it('add a pipeline license row', async () => {
                await OneStop.clickElementByCSS('.btn-add-proposed-licence');
            });

            it('add application type: ' + applicationTypeOptionValue, async () => {
                await OneStop.setBackGridSelectText('.proposed-licences-grid td.select-cell.editable', 0, applicationTypeOptionValue);
                await OneStop.waitForPageLoad();
            });

            it('add application purpose: ' + applicationPurposeOptionValue, async () => {
                await OneStop.setBackGridSelectText('.proposed-licences-grid td.select-cell.editable', 1, applicationPurposeOptionValue);
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageGeneralActivityDetails_WaterAuthorization = (openApplication,
                                                             applicationTypeOptionIndex,
                                                             applicationPurposeOptionIndex) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('general > activity details - water authorizations', () => {
            OneStop.clickLeftSideMenuItems('generalTab:activityDetails', "#ProposedWaterPanelBody");

            it('add a water authorizations row', async () => {
                await OneStop.clickElementByCSS('.btn-add-proposed-water');
            });

            it('add application type', async () => {
                await OneStop.setBackGridSelectText('.proposed-water-grid td.select-cell.editable', 0, applicationTypeOptionIndex);
                await OneStop.waitForPageLoad();
            });

            it('add application purpose', async () => {
                await OneStop.setBackGridSelectText('.proposed-water-grid td.select-cell.editable', 1, applicationPurposeOptionIndex);
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageAuthorizationGeneralApplication = (openApplication,
                                                   attachmentPath,
                                                   landOwnerValue,
                                                   dispositionNumberValue,
                                                   firstNationsConsultationNumberValue,
                                                   acoAdequacyStatusValue,
                                                   adequacyDecisionDocPath,
                                                   startDateValue,
                                                   endDateValue,
                                                   projectDescriptionValue,
                                                   relevantFilePath) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('authorization > general application', () => {
            OneStop.clickLeftSideMenuItems('authorizationTab', "#activityDetailsPanelHeading");

            it('attach shape file', async () => {
                await OneStop.setFileUploadByCSS('#shapeFileUpload input[type="file"]', attachmentPath);
            });

            it('submit shape file', async () => {
                await OneStop.clickElementByCSS('#submitShapeFile');
            });

            it('shows a success popup message', async () => {
                await OneStop.popUpConfirmation('Shapefile submitted for processing', waitLong);
            });

            it('wait for shape file to be processed', async () => {
                await driver.wait(until.elementLocated(By.css('.shape-file-container #mapIt')), shapeFileWaitInterval);
                await OneStop.waitForPageLoad();
            });

            if (landOwnerValue !== null) {
                it('set landOwnerValue index', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="landOwner"]', landOwnerValue);
                });
            }

            if (dispositionNumberValue !== null) {
                it('set dispositionNumber value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="dispositionNumber"]', dispositionNumberValue);
                });
            }

            if (firstNationsConsultationNumberValue !== null) {
                it('set firstNationsConsultationNumber value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="firstNationsConsultationNumber"]', firstNationsConsultationNumberValue);
                });
            }

            if (acoAdequacyStatusValue !== null) {
                it('set aocAdequacyStatus select', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="aocAdequacyStatus"]', acoAdequacyStatusValue);
                });
            }

            if (adequacyDecisionDocPath !== null) {
                it('attach adequacy decision document file', async () => {
                    await OneStop.setFileUploadByCSS('#adequacyDecisionUpload input[type="file"]', adequacyDecisionDocPath);
                });
            }

            if (startDateValue !== null) {
                it('set startDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="startDate"]', startDateValue);
                    //click on the label of this field in order to close the calendar popup
                    await OneStop.clickElementByCSS('#activityDetailsPanelBody div:nth-child(7)>label');
                    await driver.sleep(100);
                });
            }

            if (endDateValue !== null) {
                it('set endDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="endDate"]', endDateValue);
                    //click on the label of this field in order to close the calendar popup
                    await OneStop.clickElementByCSS('#activityDetailsPanelBody div:nth-child(8)>label');
                    await driver.sleep(100);
                });
            }

            if (projectDescriptionValue !== null) {
                it('set projectDescription value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="projectDescription"]', projectDescriptionValue);
                });
            }

            if (relevantFilePath !== null) {
                it('attach relevant file', async () => {
                    await OneStop.setFileUploadByCSS('#relevantFilesUpload input[type="file"]', relevantFilePath);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageAuthorizationAdditionalInformationReservoir = (openApplication,
                                                               shapeFilePath,
                                                               groundwaterBoolean,
                                                               surfaceWaterBoolean,
                                                               otherBoolean,
                                                               liveStorageCapacityValue,
                                                               dissolvedGroundwaterValue,
                                                               chlorideValue,
                                                               surfaceRunoffValue,
                                                               otherReservoirContentsValue,
                                                               linedReservoirValue,
                                                               linerMaterialValue,
                                                               // composite liner fields
                                                               compstBoxThicknessValue,
                                                               compstMineralComponentValue,
                                                               // Compact Clay Layer (Engineered Clay Liner)(CLL) fields
                                                               boxMaterialTypeValue,
                                                               boxThicknessValue,
                                                               boxHydraConductValue,
                                                               // Geosynthetic Clay Layer (GCL) fields
                                                               reinforcedBoolean,
                                                               nonreinforcedBoolean,
                                                               laminateBoolean,
                                                               boxSynGeoThicknessValue,
                                                               leakageRemovalValue,
                                                               relatedNumberTypeValue,
                                                               applicationsArray,
                                                               maximumHeightValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('authorization > additional information (reservoir)', () => {
            OneStop.clickLeftSideMenuItems('authorizationTab:authorizationAdditionalInformation', "#reservoirContentsPanelHeader");

            const addAppRow = () => {
                it('click add row', async () => {
                    await OneStop.clickElementByCSS('.btn-add-app-number');
                });
            };

            if (shapeFilePath) {
                it('attach shape file', async () => {
                    await OneStop.setFileUploadByCSS('#shapeFileUpload input[type="file"]', shapeFilePath);
                });

                it('submit shape file', async () => {
                    await OneStop.clickElementByCSS('#submitShapeFile');
                });

                it('shows a success popup message', async () => {
                    await OneStop.popUpConfirmation('Shapefile submitted for processing', waitLong);
                });

                it('wait for shape file to be processed', async () => {
                    await driver.wait(until.elementLocated(By.css('.shape-file-container #mapIt')), shapeFileWaitInterval);
                    await OneStop.waitForPageLoad();
                });
            }

            if (groundwaterBoolean) {
                it('set groundwater', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="groundwater"]');
                });
            }

            if (surfaceWaterBoolean) {
                it('set surfaceWater', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="surfaceWater"]');
                });
            }

            if (otherBoolean) {
                it('set other', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="other"]');
                });
            }

            if (dissolvedGroundwaterValue !== null) {
                it('set dissolvedGroundwater value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="dissolvedGroundwater"]', dissolvedGroundwaterValue);
                });
            }

            if (chlorideValue !== null) {
                it('set chloride value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="chloride"]', chlorideValue);
                });
            }

            if (surfaceRunoffValue !== null) {
                it('set surfaceRunoff value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="surfaceRunoff"]', surfaceRunoffValue);
                });
            }

            if (otherReservoirContentsValue !== null) {
                it('set otherReservoirContents value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="otherReservoirContents"]', otherReservoirContentsValue);
                });
            }

            if (linedReservoirValue !== null) {
                it('set linedReservoir value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="linedReservoir"]', linedReservoirValue);
                });
            }

            if (linerMaterialValue !== null) {
                it('set linerMaterial value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="linerMaterial"]', linerMaterialValue);
                });
            }

            // composite liner fields
            if (compstBoxThicknessValue !== null) {
                it('set compstBoxThickness value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="compstBoxThickness"]', compstBoxThicknessValue);
                });
            }

            if (compstMineralComponentValue !== null) {
                it('set compstMineralComponent value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="compstMineralComponent"]',
                        compstMineralComponentValue);
                });
            }

            // Compact Clay Layer (Engineered Clay Liner)(CLL) fields
            if (boxMaterialTypeValue !== null) {
                it('set boxMaterialType value', async () => {
                    const cssPath = '#ccBoxMatType';
                    const elements = await driver.findElements(By.css(cssPath));
                    await driver.wait(until.elementIsVisible(elements[1]), waitShort);
                    await OneStop.setTextFieldValueByCSS(cssPath, boxMaterialTypeValue);
                });
            }

            if (boxThicknessValue !== null) {
                it('set boxThickness value', async () => {
                    const cssPath = '.primary-liner-container .COMPACT_CLAY_LAYER input[name="boxThickness"]';
                    await OneStop.setTextFieldValueByCSS(cssPath, boxThicknessValue);
                });
            }

            if (boxHydraConductValue !== null) {
                it('set boxHydraConduct value', async () => {
                    const cssPath = '.primary-liner-container .COMPACT_CLAY_LAYER input[name="boxHydraConduct"]';
                    await OneStop.setTextFieldValueByCSS(cssPath, boxHydraConductValue);
                });
            }

            // Geosynthetic Clay Layer (GCL) fields
            if (reinforcedBoolean) {
                it('set reinforced', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="reinforced"]');
                });
            }

            if (nonreinforcedBoolean) {
                it('set nonreinforced', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="nonreinforced"]');
                });
            }

            if (laminateBoolean) {
                it('set laminate', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="laminate"]');
                });
            }

            if (boxSynGeoThicknessValue !== null) {
                it('set boxSynGeoThickness value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="boxSynGeoThickness"]', boxSynGeoThicknessValue);
                });
            }

            if (leakageRemovalValue !== null) {
                it('set leakageRemoval value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="leakageRemoval"]', leakageRemovalValue);
                });
            }

            if (relatedNumberTypeValue !== null) {
                it('set relatedNumberType value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="relatedNumberType"]', relatedNumberTypeValue);
                });
            }

            if (applicationsArray !== null) {
                for (let i = 0; i < applicationsArray.length; i++) {
                    addAppRow();
                }

                it('populate application number values', async () => {
                    const elements = await OneStop.getElementsByCSS(
                        '#applicationNumberGrid .backgrid td.applicationNumber'
                    );
                    for (let i = 0; i < elements.length; i++) {
                        await OneStop.populateGridElementValue(elements[i], applicationsArray[i].appNum);
                    }
                });

                it('populate application type values', async () => {
                    const elements = await OneStop.getElementsByCSS(
                        '#applicationNumberGrid .backgrid td.applicationType'
                    );
                    for (let i = 0; i < elements.length; i++) {
                        await OneStop.populateGridElementValue(elements[i], applicationsArray[i].appType);
                    }
                });
            }

            if (liveStorageCapacityValue !== null) {
                it('set liveStorageCapacity value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="liveStorageCapacity"]', liveStorageCapacityValue);
                });
            }

            if (maximumHeightValue !== null) {
                it('set maximumHeight value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="maximumHeight"]', maximumHeightValue);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageAuthorizationAdditionalInformationDamSafety = (openApplication,
                                                               pondShapeFilePath,
                                                               pondLifeValue,
                                                               omsDateValue,
                                                               omsFilePath,
                                                               eppDateValue,
                                                               eppFilePath,
                                                               erpDateValue,
                                                               erpFilePath,
                                                               consequenceClassificationValue,
                                                               fullSupplyLevelElevationValue,
                                                               freeboardValue,
                                                               liveStorageCapacityValue,
                                                               totalStorageCapacityValue,
                                                               fluidTypeValue,
                                                               damShapeFilePath,
                                                               damInformationArray) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('authorization > additional information (dam safety)', () => {
            OneStop.clickLeftSideMenuItems('authorizationTab:authorizationAdditionalInformation', "#pondInformationPanelHeader");

            if (pondShapeFilePath) {
                it('attach shape file', async () => {
                    await OneStop.setFileUploadByCSS('#shapeFileUpload input[type="file"]', pondShapeFilePath);
                });

                it('submit pond shape file', async () => {
                    await OneStop.clickElementByCSS('#submitShapeFile');
                });

                it('shows a success popup message', async () => {
                    await OneStop.popUpConfirmation('Shapefile submitted for processing', waitLong);
                });

                it('wait for shape file to be processed', async () => {
                    await driver.wait(
                        until.elementLocated(By.css('.pond-shape-file-container #mapIt')),
                        shapeFileWaitInterval);
                    await OneStop.waitForPageLoad();
                });
            }

            // Dam Fields
            if (pondLifeValue !== null) {
                it('set pondLife value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="pondLife"]', pondLifeValue);
                });
            }

            if (omsDateValue !== null) {
                it('set omsDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="omsDate"]', omsDateValue);
                    await OneStop.clickElementByCSS('#pondInformationPanelBody div:nth-child(4) label');
                    await driver.sleep(100);
                });
            }

            if (omsFilePath !== null) {
                it('set omsFilePath value', async () => {
                    await OneStop.setFileUploadByCSS('#operationManualUpload input[type="file"]', omsFilePath);
                });
            }

            if (eppDateValue !== null) {
                it('set eppDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="eppDate"]', eppDateValue);
                    await OneStop.clickElementByCSS('#pondInformationPanelBody div:nth-child(6) label');
                    await driver.sleep(100);
                });
            }

            if (eppFilePath !== null) {
                it('set eppFilePath value', async () => {
                    await OneStop.setFileUploadByCSS('#emergencyPreparednessUpload input[type="file"]', eppFilePath);
                });
            }

            if (erpDateValue !== null) {
                it('set erpDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="erpDate"]', erpDateValue);
                    await OneStop.clickElementByCSS('#pondInformationPanelBody div:nth-child(8) label');
                    await driver.sleep(100);
                });
            }

            if (erpFilePath !== null) {
                it('set erpFilePath value', async () => {
                    await OneStop.setFileUploadByCSS('#emergencyResponseUpload input[type="file"]', erpFilePath);
                });
            }

            if (consequenceClassificationValue !== null) {
                it('set consequenceClassification value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="consequenceClassification"]', consequenceClassificationValue);
                });
            }

            if (fullSupplyLevelElevationValue !== null) {
                it('set fullSupplyLevelElevation value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="fullSupplyLevelElevation"]', fullSupplyLevelElevationValue);
                });
            }

            if (freeboardValue !== null) {
                it('set freeboard value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="freeboard"]', freeboardValue);
                });
            }

            if (liveStorageCapacityValue !== null) {
                it('set liveStorageCapacity value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="liveStorageCapacity"]', liveStorageCapacityValue);
                });
            }

            if (totalStorageCapacityValue !== null) {
                it('set totalStorageCapacity value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="totalStorageCapacity"]', totalStorageCapacityValue);
                });
            }

            if (fluidTypeValue !== null) {
                it('set fluidType value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="fluidType"]', fluidTypeValue);
                });
            }

            if (damShapeFilePath !== null) {
                it('attach shape file', async () => {
                    await OneStop.setFileUploadByCSS('.dam-shape-file-container #shapeFileUpload input[type="file"]', damShapeFilePath);
                });

                it('submit dam shape file', async () => {
                    await OneStop.clickElementByCSS('.dam-shape-file-container #submitShapeFile');
                });

                it('shows a success popup message', async () => {
                    await OneStop.popUpConfirmation('Shapefile submitted for processing', waitLong);
                });

                it('wait for dam shape file to be processed', async () => {
                    await driver.wait(until.elementLocated(By.css('.dam-shape-file-container #mapIt')),
                        shapeFileWaitInterval);
                    await OneStop.waitForPageLoad();
                });
            }

            if (damInformationArray !== null) {
                it('wait until dam information table populates', async () => {
                    await driver.wait(until.elementLocated(By.css('*[data-event="open-dam"]')), shapeFileWaitInterval);
                    await OneStop.waitForPageLoad();
                });

                it('enter dam table data', async () => {
                    const completeDamInformation = async (element, damInfo) => {
                        await element.click();
                        await OneStop.setTextFieldValueByCSS('*[name="designReportDate"]', damInfo.designReportDate);
                        await OneStop.setFileUploadByCSS('#designReportUpload input[type="file"]', damInfo.designReportFilePath);
                        await OneStop.setTextFieldValueByCSS('*[name="dsrDate"]', damInfo.dsrDate);
                        await OneStop.setFileUploadByCSS('#dsrUpload input[type="file"]', damInfo.dsrFilePath);
                        await OneStop.setTextFieldValueByCSS('*[name="acprDate"]', damInfo.acprDate);
                        await OneStop.setFileUploadByCSS('#acprUpload input[type="file"]', damInfo.acprFilePath);
                        await OneStop.setTextFieldValueByCSS('*[name="maxHeight"]', damInfo.maxHeight);
                        await OneStop.setTextFieldValueByCSS('*[name="damMaxCrestElevation"]', damInfo.damMaxCrestElevation);
                        await OneStop.setTextFieldValueByCSS('*[name="currentCrestElevation"]', damInfo.currentCrestElevation);
                        await OneStop.setTextFieldValueByCSS('*[name="constructionStartDate"]', damInfo.constructionStartDate);
                        await OneStop.setTextFieldValueByCSS('*[name="constructionEndDate"]', damInfo.constructionEndDate);
                        await OneStop.setTextFieldValueByCSS('*[name="firstFilingDate"]', damInfo.firstFilingDate);
                        await OneStop.clickElementByCSS('.modal-footer .btn-save');
                    };

                    const elements = await OneStop.getElementsByCSS('*[data-event="open-dam"]');
                    for (let i = 0; i < damInformationArray.length; i++) {
                        await completeDamInformation(elements[i], damInformationArray[i]);
                        await driver.sleep(waitShort);
                    }
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageAuthorizationAdditionalInformationWetlandsWaif = (openApplication,
                                                                  associatedActivityValue,
                                                                  shapeFilePath,
                                                                  desktopAssessmentDateValue,
                                                                  desktopAssessmentFilePath,
                                                                  waifAssessmentAuthenticatorValue,
                                                                  waifProfessionalDesignationValue,
                                                                  waifTemplateCsvFilePath,
                                                                  vegetationImpactValue,
                                                                  impactTypeValue,
                                                                  rareSpeciesValue,
                                                                  mineralBoolean,
                                                                  organicBoolean,
                                                                  maxSoilDepthValue,
                                                                  groundwaterBoolean,
                                                                  surfaceWaterBoolean,
                                                                  otherBoolean,
                                                                  groundwaterRechargeValue,
                                                                  impactDrainageIndex,
                                                                  waterLevelImpactValue,
                                                                  waterVolImpactValue,
                                                                  waterQualityImpactValue,
                                                                  waifWetlandReclaimBoolean,
                                                                  waifWetlandMinBoolean,
                                                                  waifJustifyImpactsValue,
                                                                  waifMinimizeAndReclaimValue,
                                                                  waifWetlandReclamationFilePath,
                                                                  waifWetlandMinimizationFilePath,
                                                                  waifReclamationTimelineValue,
                                                                  constructionStartDateValue,
                                                                  constructionEndDateValue,
                                                                  operationsStartDateValue,
                                                                  operationsEndDateValue,
                                                                  reclamationStartDateValue,
                                                                  reclamationEndDateValue,
                                                                  monthsAffectedArray) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('authorization > additional information (wetlands waif)', () => {
            OneStop.clickLeftSideMenuItems('authorizationTab:authorizationAdditionalInformation', "#wetlandsPanelHeader");

            if (associatedActivityValue !== null) {
                it('set associated activity value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="associatedActivity"]', associatedActivityValue);
                });
            }

            if (shapeFilePath) {
                it('attach shape file', async () => {
                    await OneStop.setFileUploadByCSS('#shapeFileUpload input[type="file"]', shapeFilePath);
                });

                it('submit shape file', async () => {
                    await OneStop.clickElementByCSS('#submitShapeFile');
                });

                it('shows a success popup message', async () => {
                    await OneStop.popUpConfirmation('Shapefile submitted for processing', waitLong);
                });

                it('wait for shape file to be processed', async () => {
                    await driver.wait(
                        until.elementLocated(By.css('.shape-file-container #mapIt')),
                        shapeFileWaitInterval);
                    await OneStop.waitForPageLoad();
                });
            }

            if (desktopAssessmentDateValue !== null) {
                it('set desktopAssessmentDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="desktopAssessmentDate"]', desktopAssessmentDateValue);
                });
            }

            if (desktopAssessmentFilePath !== null) {
                it('attach desktop assessment file', async () => {
                    await OneStop.setFileUploadByCSS(
                        '#desktopAssessmentUpload input[type="file"]', desktopAssessmentFilePath);
                });
            }

            if (waifAssessmentAuthenticatorValue !== null) {
                it('set waifAssessmentAuthenticator value', async () => {
                    await OneStop.setTextFieldValueByCSS(
                        '*[name="waifAssessmentAuthenticator"]', waifAssessmentAuthenticatorValue);
                });
            }

            if (waifProfessionalDesignationValue !== null) {
                it('set waifProfessionalDesignation value', async () => {
                    await OneStop.setSelectFieldValueByCSS(
                        '*[name="waifProfessionalDesignation"]', waifProfessionalDesignationValue);
                });
            }

            if (waifTemplateCsvFilePath !== null) {
                it('attach waif template csv file', async () => {
                    await OneStop.setFileUploadByCSS('#fileInputsWAIF', waifTemplateCsvFilePath);
                });
            }

            if (vegetationImpactValue !== null) {
                it('set vegetationImpact value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="vegetationImpact"]', vegetationImpactValue);
                });
            }

            if (impactTypeValue !== null) {
                it('set impactType value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="impactType"]', impactTypeValue);
                });
            }

            if (rareSpeciesValue !== null) {
                it('set rareSpecies value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="rareSpecies"]', rareSpeciesValue);
                });
            }

            if (mineralBoolean) {
                it('set mineral', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="mineral"]');
                });
            }

            if (organicBoolean) {
                it('set organic', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="organic"]');
                });
            }

            if (maxSoilDepthValue !== null) {
                it('set maxSoilDepth value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="maxSoilDepth"]', maxSoilDepthValue);
                });
            }

            if (groundwaterBoolean) {
                it('set groundwater', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="groundwater"]');
                });
            }

            if (surfaceWaterBoolean) {
                it('set surfaceWater', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="surfaceWater"]');
                });
            }

            if (otherBoolean) {
                it('set other', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="other"]');
                });
            }

            if (groundwaterRechargeValue !== null) {
                it('set groundwaterRecharge value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="groundwaterRecharge"]', groundwaterRechargeValue);
                });
            }

            if (impactDrainageIndex !== null) {
                it('set impactDrainage value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="impactDrainage"]', impactDrainageIndex);
                });
            }

            if (waterLevelImpactValue !== null) {
                it('set waterLevelImpact index', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="waterLevelImpact"]', waterLevelImpactValue);
                });
            }

            if (waterVolImpactValue !== null) {
                it('set waterVolImpact value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="waterVolImpact"]', waterVolImpactValue);
                });
            }

            if (waterQualityImpactValue !== null) {
                it('set waterQualityImpact value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="waterQualityImpact"]', waterQualityImpactValue);
                });
            }

            if (waifWetlandReclaimBoolean) {
                it('set waif_wetland_reclaim', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="waif_wetland_reclaim"]');
                });
            }

            if (waifWetlandMinBoolean) {
                it('set waif_wetland_min', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="waif_wetland_min"]');
                });
            }

            if (waifJustifyImpactsValue !== null) {
                it('set waifJustifyImpacts value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="waifJustifyImpacts"]', waifJustifyImpactsValue);
                });
            }

            if (waifMinimizeAndReclaimValue !== null) {
                it('set waifMinimizeAndReclaim value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="waifMinimizeAndReclaim"]', waifMinimizeAndReclaimValue);
                });
            }

            if (waifWetlandReclamationFilePath !== null) {
                it('attach waifWetlandReclamation file', async () => {
                    await OneStop.setFileUploadByCSS('#waifWetlandReclamation *[name="fileselect[]"]', waifWetlandReclamationFilePath);
                });
            }

            if (waifWetlandMinimizationFilePath !== null) {
                it('attach waifWetlandMinimization file', async () => {
                    await OneStop.setFileUploadByCSS('#waifWetlandMinimization *[name="fileselect[]"]', waifWetlandMinimizationFilePath);
                });
            }

            if (waifReclamationTimelineValue !== null) {
                it('set waifReclamationTimeline value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="waifReclamationTimeline"]', waifReclamationTimelineValue);
                });
            }

            if (constructionStartDateValue !== null) {
                it('set constructionStartDate value', async () => {
                    // await OneStop.setTextFieldValueByCSS('*[name="constructionStartDate"]', constructionStartDateValue);
                });
            }

            if (constructionEndDateValue !== null) {
                it('set constructionEndDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="constructionEndDate"]', constructionEndDateValue);
                });
            }

            if (operationsStartDateValue !== null) {
                it('set operationsStartDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="operationsStartDate"]', operationsStartDateValue);
                });
            }

            if (operationsEndDateValue !== null) {
                it('set operationsEndDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="operationsEndDate"]', operationsEndDateValue);
                });
            }

            if (monthsAffectedArray !== null) {
                it('set months affected', async () => {
                    for (let i = 0; i < monthsAffectedArray.length; i++) {
                        await OneStop.setButtonCheckboxByCSS('*[name="' + monthsAffectedArray[i] + '"]');
                    }
                });
            }

            if (reclamationStartDateValue !== null) {
                it('set reclamationStartDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="reclamationStartDate"]', reclamationStartDateValue);
                });
            }

            if (reclamationEndDateValue !== null) {
                it('set reclamationEndDate value', async () => {
                    // await OneStop.setTextFieldValueByCSS('*[name="reclamationEndDate"]', reclamationEndDateValue);
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageAuthorizationAdditionalInformationWetlandsWair = (openApplication,
                                                                  associatedActivityValue,
                                                                  shapeFilePath,
                                                                  goaSubmissionValue,
                                                                  fieldAssessmentDateValue,
                                                                  fieldAssessmentFilePath,
                                                                  wairConductorValue,
                                                                  wairAssessmentAuthenticatorValue,
                                                                  wairProfessionalDesignationValue,
                                                                  wairTemplateCsvFilePath,
                                                                  vegetationImpactValue,
                                                                  impactTypeValue,
                                                                  rareSpeciesValue,
                                                                  impactsVegetationAdditionalInfo,
                                                                  mineralBoolean,
                                                                  organicBoolean,
                                                                  maxSoilDepthValue,
                                                                  impactsSoilsAdditionalInfo,
                                                                  groundwaterBoolean,
                                                                  surfaceWaterBoolean,
                                                                  otherBoolean,
                                                                  groundwaterRechargeValue,
                                                                  impactDrainageValue,
                                                                  waterLevelImpactValue,
                                                                  waterVolImpactValue,
                                                                  waterQualityImpactValue,
                                                                  impactsWaterHydrologyAdditionalInfo,
                                                                  wair_inlieu_fee_payBoolean,
                                                                  wair_resp_replBoolean,
                                                                  wair_wetland_reclaimBoolean,
                                                                  wair_wetland_minBoolean,
                                                                  avoidanceInvestigationFilePath,
                                                                  wairJustifyImpactsValue,
                                                                  wairMinimizeAndReclaimValue,
                                                                  wairReclamationTimelineValue,
                                                                  wairInLieuFeeFilePath,
                                                                  wairPermitteeResponsibleFilePath,
                                                                  wairWetlandReclamationFilePath,
                                                                  wairWetlandMinimizationFilePath,
                                                                  wetlandReplacementGridValuesArray,
                                                                  constructionStartDateValue,
                                                                  constructionEndDateValue,
                                                                  operationsStartDateValue,
                                                                  operationsEndDateValue,
                                                                  reclamationStartDateValue,
                                                                  reclamationEndDateValue,
                                                                  monthsAffectedArray) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('authorization > additional information (wetlands wair)', () => {
            OneStop.clickLeftSideMenuItems('authorizationTab:authorizationAdditionalInformation', "#wetlandsPanelHeader");

            if (associatedActivityValue !== null) {
                it('set associated activity value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="associatedActivity"]', associatedActivityValue);
                });
            }

            if (shapeFilePath) {
                it('attach shape file', async () => {
                    await OneStop.setFileUploadByCSS('#shapeFileUpload input[type="file"]', shapeFilePath);
                });

                it('submit shape file', async () => {
                    await OneStop.clickElementByCSS('#submitShapeFile');
                });

                it('shows a success popup message', async () => {
                    await OneStop.popUpConfirmation('Shapefile submitted for processing', waitLong);
                });

                it('wait for shape file to be processed', async () => {
                    await driver.wait(
                        until.elementLocated(By.css('.shape-file-container #mapIt')), shapeFileWaitInterval);
                    await OneStop.waitForPageLoad();
                });
            }

            if (goaSubmissionValue !== null) {
                it('set goaSubmission value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="goaSubmission"]', goaSubmissionValue);
                });
            }

            if (fieldAssessmentDateValue !== null) {
                it('set fieldAssessmentDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="fieldAssessmentDate"]', fieldAssessmentDateValue);
                });
            }

            if (fieldAssessmentFilePath !== null) {
                it('attach field assessment file', async () => {
                    await OneStop.setFileUploadByCSS(
                        '#fieldAssessmentUpload input[type="file"]', fieldAssessmentFilePath);
                });
            }

            if (wairConductorValue !== null) {
                it('set wairConductor value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="wairConductor"]', wairConductorValue);
                });
            }

            if (wairAssessmentAuthenticatorValue !== null) {
                it('set wairAssessmentAuthenticator value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="wairAssessmentAuthenticator"]', wairAssessmentAuthenticatorValue);
                });
            }

            if (wairProfessionalDesignationValue !== null) {
                it('set wairProfessionalDesignation value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="wairProfessionalDesignation"]', wairProfessionalDesignationValue);
                });
            }

            if (wairTemplateCsvFilePath !== null) {
                it('attach wair template csv file', async () => {
                    await OneStop.setFileUploadByCSS('#fileInputsWAIR', wairTemplateCsvFilePath);
                });
            }

            if (vegetationImpactValue !== null) {
                it('set vegetationImpact value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="vegetationImpact"]', vegetationImpactValue);
                });
            }

            if (impactTypeValue !== null) {
                it('set impactType value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="impactType"]', impactTypeValue);
                });
            }

            if (rareSpeciesValue !== null) {
                it('set rareSpecies value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="rareSpecies"]', rareSpeciesValue);
                });
            }

            // additional information for Impacts - Wetland Vegetation section
            if (impactsVegetationAdditionalInfo !== null) {
                it('set impacts - wetlands vegetation additional info value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="wetlandVegAddInfo"]', impactsVegetationAdditionalInfo);
                });
            }


            if (mineralBoolean) {
                it('set mineral', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="mineral"]');
                });
            }

            if (organicBoolean) {
                it('set organic', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="organic"]');
                });
            }

            if (maxSoilDepthValue !== null) {
                it('set maxSoilDepth value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="maxSoilDepth"]', maxSoilDepthValue);
                });
            }

            // additional information for Impacts - Wetland Soils section
            if (impactsSoilsAdditionalInfo !== null) {
                it('set impacts - wetlands soils additional info value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="wetlandSoilAddInfo"]', impactsSoilsAdditionalInfo);
                });
            }

            if (groundwaterBoolean) {
                it('set groundwater', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="groundwater"]');
                });
            }

            if (surfaceWaterBoolean) {
                it('set surfaceWater', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="surfaceWater"]');
                });
            }

            if (otherBoolean) {
                it('set other', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="other"]');
                });
            }

            if (groundwaterRechargeValue !== null) {
                it('set groundwaterRecharge value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="groundwaterRecharge"]', groundwaterRechargeValue);
                });
            }

            if (impactDrainageValue !== null) {
                it('set impactDrainage value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="impactDrainage"]', impactDrainageValue);
                });
            }

            if (waterLevelImpactValue !== null) {
                it('set waterLevelImpact value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="waterLevelImpact"]', waterLevelImpactValue);
                });
            }

            if (waterVolImpactValue !== null) {
                it('set waterVolImpact value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="waterVolImpact"]', waterVolImpactValue);
                });
            }

            if (waterQualityImpactValue !== null) {
                it('set waterQualityImpact value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="waterQualityImpact"]', waterQualityImpactValue);
                });
            }

            // additional information for Impacts - Wetland Water and Hydrology section
            if (impactsWaterHydrologyAdditionalInfo !== null) {
                it('set impacts - wetlands soils additional info value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="wetlandWaterAddInfo"]', impactsWaterHydrologyAdditionalInfo);
                });
            }

            if (wair_inlieu_fee_payBoolean) {
                it('set wair_inlieu_fee_pay', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="wair_inlieu_fee_pay"]');
                });
            }

            if (wair_resp_replBoolean) {
                it('set wair_resp_repl', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="wair_resp_repl"]');
                });
            }

            if (wair_wetland_reclaimBoolean) {
                it('set wair_wetland_reclaim', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="wair_wetland_reclaim"]');
                });
            }

            if (wair_wetland_minBoolean) {
                it('set wair_wetland_min', async () => {
                    await OneStop.setButtonCheckboxByCSS('*[name="wair_wetland_min"]');
                });
            }

            if (avoidanceInvestigationFilePath !== null) {
                it('attach avoidance investigation file', async () => {
                    await OneStop.setFileUploadByCSS('#avoidanceInvestigation input[type="file"]', avoidanceInvestigationFilePath);
                });
            }

            if (wairJustifyImpactsValue !== null) {
                it('set wairJustifyImpacts value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="wairJustifyImpacts"]', wairJustifyImpactsValue);
                });
            }

            if (wairMinimizeAndReclaimValue !== null) {
                it('set wairMinimizeAndReclaim value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="wairMinimizeAndReclaim"]', wairMinimizeAndReclaimValue);
                });
            }

            if (wairReclamationTimelineValue !== null) {
                it('set wairReclamationTimeline value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="wairReclamationTimeline"]', wairReclamationTimelineValue);
                });
            }

            if (wairInLieuFeeFilePath !== null) {
                it('attach in-lieu fee payment agreement file', async () => {
                    await OneStop.setFileUploadByCSS('#wairInLieuFee input[type="file"]', wairInLieuFeeFilePath);
                });
            }

            if (wairPermitteeResponsibleFilePath !== null) {
                it('attach permittee responsible replacement proposal file', async () => {
                    await OneStop.setFileUploadByCSS('#wairPermitteeResponsible input[type="file"]', wairPermitteeResponsibleFilePath);
                });
            }

            if (wairWetlandReclamationFilePath !== null) {
                it('attach wetland reclamation file', async () => {
                    await OneStop.setFileUploadByCSS('#wairWetlandReclamation input[type="file"]', wairWetlandReclamationFilePath);
                });
            }

            if (wairWetlandMinimizationFilePath !== null) {
                it('attach wetland minimization file', async () => {
                    await OneStop.setFileUploadByCSS('#wairWetlandMinimization input[type="file"]', wairWetlandMinimizationFilePath);
                });
            }

            if (wetlandReplacementGridValuesArray !== null) {
                it('populate wetlandReplacementGrid values', async () => {
                    const elements = await OneStop.getElementsByCSS('#wetlandReplacementGrid .backgrid td.editable');
                    for (let i = 0; i < elements.length; i++) {
                        await OneStop.populateGridElementValue(elements[i], wetlandReplacementGridValuesArray[i]);
                    }
                });
            }

            if (reclamationStartDateValue !== null) {
                it('set reclamationStartDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="reclamationStartDate"]', reclamationStartDateValue);
                });
            }

            if (reclamationEndDateValue !== null) {
                it('set reclamationEndDate value', async () => {
                    // await OneStop.setTextFieldValueByCSS('*[name="reclamationEndDate"]', reclamationEndDateValue);
                });
            }

            if (constructionStartDateValue !== null) {
                it('set constructionStartDate value', async () => {
                    // await OneStop.setTextFieldValueByCSS('*[name="constructionStartDate"]', constructionStartDateValue);
                });
            }

            if (constructionEndDateValue !== null) {
                it('set constructionEndDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="constructionEndDate"]', constructionEndDateValue);
                });
            }

            if (operationsStartDateValue !== null) {
                it('set operationsStartDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="operationsStartDate"]', operationsStartDateValue);
                });
            }

            if (operationsEndDateValue !== null) {
                it('set operationsEndDate value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="operationsEndDate"]', operationsEndDateValue);
                });
            }

            if (monthsAffectedArray !== null) {
                it('set months affected', async () => {
                    for (let i = 0; i < monthsAffectedArray.length; i++) {
                        await OneStop.setButtonCheckboxByCSS('*[name="' + monthsAffectedArray[i] + '"]');
                    }
                });
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageLicensingGeneralApplication = (openApplication,
                                               participantInvolvementMetValue,
                                               residenceDistanceValue,
                                               temporarySurfacePipelineValue,
                                               requestForTwoYearsLicenceExpiry) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('licensing > general application', () => {
            OneStop.clickLeftSideMenuItems('licensingTab', "#participantInvolvementRequirementsPanelHeading");

            it('set participantInvolvementMet value', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="participantInvolvementMet"]', participantInvolvementMetValue);
                await driver.sleep(500);
            });

            it('set residenceDistance value', async () => {
                await OneStop.setTextFieldValueByCSS('*[name="residenceDistance"]', residenceDistanceValue);
                await driver.sleep(500);
            });

            it('set temporarySurfacePipeline value', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="temporarySurfacePipeline"]', temporarySurfacePipelineValue);
                await driver.sleep(500);
            });

            if (requestForTwoYearsLicenceExpiry) {
                it('set request for 2 year license expiry', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="expiryTerm"]', requestForTwoYearsLicenceExpiry);
                    await driver.sleep(500);
                });

                if (requestForTwoYearsLicenceExpiry === '2') {
                    OneStop.confirmSubmission('2 Year Licence Commitment', 'success');
                }
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageLicensingLineInstallation = (openApplication,
                                             attachmentPath,
                                             substanceOneValue,
                                             substanceTwoValue,
                                             substanceThreeValue,
                                             h2sValue,
                                             psAttachmentPathValue,
                                             plsAttachmentPathValue,
                                             rowAttachmentPathValue,
                                             pipeLocAttachmentPathValue) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('licensing > line / installation detail', () => {
            OneStop.clickLeftSideMenuItems('licensingTab:segementInstallationId', "#shapeFileUploadPanelHeading");

            it('attach shape file', async () => {
                await OneStop.setFileUploadByCSS('*[name="fileselect[]"]', attachmentPath);
                await driver.sleep(100);
            });

            it('submit shape file', async () => {
                await OneStop.clickElementByCSS('#submitShapeFile');
            });

            it('shows a success popup message', async () => {
                await OneStop.popUpConfirmation('Shapefile submitted for processing', waitLong * 3);
            });

            it('wait for shape file to be processed', async () => {
                //wait up to 8 mins for shape file to process
                await driver.wait(
                    until.elementLocated(By.css('#pipeSpecificationPanelHeading')), shapeFileWaitInterval);
                await OneStop.waitForPageLoad();
            });

            if (substanceOneValue !== '') {
                it('set substanceOne value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="substanceOne"]', substanceOneValue);
                });
            }

            if (substanceTwoValue !== '') {
                it('set substanceTwo value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="substanceTwo"]', substanceTwoValue);
                });
            }

            if (substanceThreeValue !== '') {
                it('set substanceTwo value', async () => {
                    await OneStop.setSelectFieldValueByCSS('*[name="substanceThree"]', substanceThreeValue);
                });
            }

            it('set h2s value', async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="h2s"]', h2sValue);
            });

            if (psAttachmentPathValue !== '') {
                it('attach filePS', async () => {
                    await OneStop.setFileUploadByCSS('*[name="filePS"]', psAttachmentPathValue);
                });
            }

            if (plsAttachmentPathValue !== '') {
                it('attach filePLS', async () => {
                    await OneStop.setFileUploadByCSS('*[name="filePLS"]', plsAttachmentPathValue);
                });
            }

            it('attach docROW', async () => {
                await OneStop.setFileUploadByCSS('#rightOfWayUpload *[name="fileselect[]"]', rowAttachmentPathValue);
            });

            it('attach docPipeLoc', async () => {
                await OneStop.setFileUploadByCSS('#pipelineLocationUpload *[name="fileselect[]"]', pipeLocAttachmentPathValue);
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageLicensingTechnicalInformation = (openApplication,
                                                 meetCsaZ662Value,
                                                 meetSourCsaZ662ReqsValue,
                                                 absaRegistrationRequiredValue,
                                                 h2sStreamBlendingValue,
                                                 levelChangeValue,
                                                 h2sGasInjectionValue,
                                                 transportationUtilityCorridorValue,
                                                 maxPlanningZoneValue,
                                                 surfaceDevelopmentNumberValue,
                                                 proposed_service_attachment_value) => {

        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('licensing > technical information', () => {
            OneStop.clickLeftSideMenuItems('licensingTab:technicalEnvironmentalInfo', "#technicalConsiderationsPanelHeading");

            it('set csa_z662_standards_ind value', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="csa_z662_standards_ind"]', meetCsaZ662Value);
            });

            it('set csa_z662_sour_ind value', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="csa_z662_sour_ind"]', meetSourCsaZ662ReqsValue);
            });

            it('set absa_registered_ind_na value', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="absa_registered_ind_na"]', absaRegistrationRequiredValue);
            });

            it('set h2s_contents_blended_ind value', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="h2s_contents_blended_ind"]', h2sStreamBlendingValue);
            });

            if (levelChangeValue !== null) {
                it('set h2s_release_volume_level_chg_ind value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS(
                        '*[name="h2s_release_volume_level_chg_ind"]',
                        levelChangeValue
                    );
                });
            }

            if (h2sGasInjectionValue !== null) {
                it('set inject_h2s_ind value', async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="inject_h2s_ind"]', h2sGasInjectionValue);
                });
            }

            it('set calgary_edmonton_ind value', async () => {
                await OneStop.setButtonRadioFieldValueByCSS(
                    '*[name="calgary_edmonton_ind"]',
                    transportationUtilityCorridorValue
                );
            });

            if (maxPlanningZoneValue !== null) {
                it('set emergency_plan_zone value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="emergency_plan_zone"]', maxPlanningZoneValue);
                });
            }

            if (surfaceDevelopmentNumberValue !== null) {
                it('set emergency_plan_zone_dev_cnt value', async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="emergency_plan_zone_dev_cnt"]', surfaceDevelopmentNumberValue);
                });
            }

            if (proposed_service_attachment_value !== null) {
                it('attach proposed_service_attachment file', async () => {
                    await OneStop.setFileUploadByCSS('#proposed_service_attachment input[type="file"]', proposed_service_attachment_value);
                });
            }

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

            OneStop.clickLeftSideMenuItems('licenseAmendmentTab', "#licenseLevelChangesPanelHeading");

            it('set changeEntireYesNo', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="changeEntireYesNo"]', changeEntireYesNoValue);
            });

            it('set partialSubstanceYesNo', async () => {
                await OneStop.setButtonRadioFieldValueByCSS('*[name="partialSubstanceYesNo"]', partialSubstanceYesNoValue);
            });

            OneStop.clickSave();
        });
    };

    OneStop.pageLicensingLineLevelChanges = (openApplication) => {
        describe('licensing > line level changes', () => {
            let amendmentType = appType.split('-')[1];
            amendmentType = amendmentType.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            OneStop.clickLeftSideMenuItems('licenseAmendmentTab:lineChanges', "#lineLevelChangesPanelHeading");

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

            if (amendmentType === 'Abandonment') {
                it('change h2s value to blank', async () => {
                    await OneStop.clickElementByCSS('.btn-save');
                    await driver.sleep(waitShort);
                    await OneStop.setBackGridText('#pls-grid .grid .number-cell.h2sVolume', 0, '\n');
                    await driver.sleep(waitShort);
                });
            }

            if (amendmentType === 'Resumption') {
                it('change ec value to none', async () => {
                    await OneStop.clickElementByCSS('.btn-save');
                    await driver.sleep(waitShort);
                    await OneStop.setBackGridSelect('#ps-grid .grid .select-cell.ec', 0, 2);
                    await driver.sleep(waitShort);
                });
            }

            OneStop.clickSave();
        });
    };

    const landActivityIDValues = [];  //this global variable is used within the function below and the one afterwards
    OneStop.pageGeneralActivityDetailsLand = (openApplication,
                                               attachmentPathSketchSurveyShapefile,
                                               publicLandDispositionValues,
                                               attachmentPathSketchSurveyAssociationPdfFile) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('general > activity details - upload sketch/survey shapefile', () => {
            OneStop.clickLeftSideMenuItems('generalTab:activityDetails', '.disposition-container');

            it('attach a survey plan shape file', async () => {
                await OneStop.setFileUploadByCSS('#shapefileUpload input[type="file"]', attachmentPathSketchSurveyShapefile);
            });

            it('submit the shape file', async () => {
                await OneStop.clickElementByCSS('#submitShapefile');
            });

            it('shows a success popup message', async () => {
                await OneStop.popUpConfirmation('Processing Shapefile');
            });

            it('wait for the shape file to be processed - public land disposition grid should show the records', async () => {
                await OneStop.waitForPageLoad();
                const element = await driver.wait(until.elementLocated(By.css('.shape-loading-wheel')), waitShort);
                await driver.wait(until.elementIsNotVisible(element), shapeFileWaitInterval);
                await OneStop.waitForPageLoad();
            });
        });

        //function 1
        const checkDispositionTypeValues = (publicLandDispositionValues, rowIndex) => {
            it('public land dispositions grid - disposition type column on row# ' + (rowIndex + 1) +
                ' contains the correct value: ' + publicLandDispositionValues[rowIndex].dispositionType, async () => {
                //validate the values of the Public Land Disposition grid, Disposition Type column are correct
                //.proposed-disposition-grid .backgrid tbody>tr:nth-child(i) td:nth-child(2)
                const elementText = await OneStop.getElementValueByCSS(
                    '.proposed-disposition-grid .backgrid tbody>tr:nth-child(' + (rowIndex + 1) + ')>td:nth-child(2)'
                );
                expect(elementText).to.equal(publicLandDispositionValues[rowIndex].dispositionType);
            });
        };

        //function 2
        const selectPurposeAndActivityValues = (publicLandDispositionValues, rowIndex) => {
            it('public land dispositions grid - select the purpose values on row# ' + rowIndex + ': ' +
                publicLandDispositionValues[rowIndex].purpose, async () => {
                await OneStop.setBackGridSelectText('.proposed-disposition-grid tr:nth-child(' + (rowIndex + 1) +
                    ') td.select-cell.editable', 0, publicLandDispositionValues[rowIndex].purpose);
            });

            it('public land dispositions grid - select the activity values on row# ' + rowIndex + ': ' +
                publicLandDispositionValues[rowIndex].activity, async () => {
                await OneStop.setBackGridSelectText('.proposed-disposition-grid tr:nth-child(' + (rowIndex + 1) +
                    ') td.select-cell.editable', 1, publicLandDispositionValues[rowIndex].activity);
            });
        };

        //function 4 (fnc 3 call inside)
        const addDispositionNumbers = (parentDispositionsValues, rowIndex) => {
            //4.1 click Add Row
            it('public land dispositions grid - parent disposition(s) modal - add a new parent disposition row',
                async () => {
                    await OneStop.clickElementByCSS('.btn-add-disp');
                });

            it('public land dispositions grid - parent disposition(s) modal - type the disposition number ' +
                parentDispositionsValues[rowIndex].dispositionNumber, async () => {
                //4.2 type the Disposition Number
                await OneStop.setBackGridText('#dispGrid tr:nth-child(' + (rowIndex + 1) +
                    ') .string-cell.dispositionNumber', 0, parentDispositionsValues[rowIndex].dispositionNumber);
                await OneStop.clickElementByCSS('.modal-title'); //click outside of the grid so we can find the inserted value
            });

            it('public land dispositions grid - parent disposition(s) modal - check that added number is correct',
                async () => {
                    //4.3 check that the value inserted in the grid equals the one from the array
                    const element = await driver.findElement(By.css('#dispGrid tbody tr:nth-child(' + (rowIndex + 1) + ')>td:nth-child(2)'));
                    const elementText = await element.getText();
                    expect(elementText).to.equal(parentDispositionsValues[rowIndex].dispositionNumber);
                });
        };

        //function 3 - this contains the call to the function 4 ---
        const addParentDispositions = (publicLandDispositionValues, rowIndex) => {
            it('public land dispositions grid - click manage button on row# ' + (rowIndex + 1), async () => {
                const elements = await OneStop.getElementsByCSS(
                    '.proposed-disposition-grid .backgrid tbody>tr:nth-child(' + (rowIndex + 1) + ')>td:nth-child(5)'
                );
                elements[0].click();
            });

            it('parent disposition(s) modal and grid is loaded for row# ' + (rowIndex + 1), async () => {
                //2.check that Parent Dispositions popup is loaded
                await OneStop.confirmModalHeader('Parent Dispositions');

                //3.check that Parent Disposition(s) grid is displayed
                await OneStop.waitForObjectLoad('#dispGrid', waitLong, 100, true);
            });

            if (publicLandDispositionValues[rowIndex].parentDispositions.length > 0) {
                for (let j = 0; j < publicLandDispositionValues[rowIndex].parentDispositions.length; j++) {
                    addDispositionNumbers(publicLandDispositionValues[rowIndex].parentDispositions, j);
                }
            }

            it('parent disposition(s) modal - click save', async () => {
                //4. click Save btn
                await OneStop.clickElementByCSS('.modal .btn-save');
                await OneStop.waitForPageLoad();
            });
        };

        //function 5
        // retrieve the activity ids for later usage
        const retrieveActivityIdValues = (rowIndex) => {
            it('public land dispositions grid - activity id column - retrieve row# ' + (rowIndex + 1) +
                ' activity id\'s value and write them to landActivityIDValues.json file', async () => {
                const element = await driver.findElement(
                    By.css('.proposed-disposition-grid .backgrid tbody>tr:nth-child(' + (rowIndex + 1) + ') td:nth-child(6)')
                );
                const elementText = await element.getText();
                landActivityIDValues.push(elementText);
            });
        };

        describe('general > activity details - fill in the public land dispositions grid', () => {
            it('validate that public land dispositions grid is displayed', async () => {
                //check the grid is present
                await OneStop.waitForObjectLoad('.proposed-disposition-grid .backgrid', waitLong, 100, true);
            });

            for (let i = 0; i < publicLandDispositionValues.length; i++) {
                //function 1 call
                checkDispositionTypeValues(publicLandDispositionValues, i);

                //function 2 call
                selectPurposeAndActivityValues(publicLandDispositionValues, i);

                //function 3 call (function 4 is called inside this one) -- this is not a functionality anymore
                // - was removed (but left it commented in case it comes back later)
                //addParentDispositions(publicLandDispositionValues, i);
            }

            it('upload a sketch/survey plan pdf file', async () => {
                await OneStop.setFileUploadByCSS('#surveyPlanUpload input[type="file"]', attachmentPathSketchSurveyAssociationPdfFile);
                await OneStop.waitForPageLoad();
            });

            //function 5 call
            for (let activityIdIndex = 0; activityIdIndex < 4; activityIdIndex++) {
                retrieveActivityIdValues(activityIdIndex);
            }

            OneStop.clickSave();
        });
    };

    OneStop.pageDispositionSiteDetailsAddDimensionsData = (dimensionsGridValues) => {

        const clickDimensionsTabs = (index) => {
            let tabIsActive;
            let tabName;

            it('dimensions grid - check if disposition tab is active', async () => {
                const element = await driver.findElement(By.css('.disposition-tabs ul.nav-tabs>li:nth-child(' + (index + 1) + ')'));
                tabName = await element.getText();
                tabIsActive = await element.getAttribute('class');
            });

            it('find the top tab #' + index + 1 + ' and click on it', async () => {
                if (!tabIsActive.includes('active')) {
                    await OneStop.waitForObjectLoad('ul.nav-tabs', waitLong, 500, true);
                    await driver.wait(until.elementLocated(By.xpath('//li/a[text()=" ' + tabName + '"]')), waitLong);
                    await OneStop.clickElementByXPath('//li/a[text()=" ' + tabName + '"]');
                    await OneStop.waitForPageLoad();
                    await OneStop.waitForObjectLoad('#dimensionsPanelHeading', waitLong * 3, 500, true);
                }
            });
        };

        const addDimensions = (dimensionsValues, index) => {
            //fill in the values
            //1. select the shapeType from the dropdown
            it('dimensions grid - select the shape of disposition type as ' + dimensionsValues.shapeType, async () => {
                await OneStop.setSelectDropDownValueByCSS('#dispositionShape', dimensionsValues.shapeType);
                await driver.sleep(300);
            });
            
            if (dimensionsValues.shapeType === 'Variable Width') {
	            //click addRow
	            it('dimensions grid - add a new row', async () => {
		            await OneStop.clickElementByCSS('.add-variable-width-row');
		            await driver.sleep(500);
	            });
	
	            // type the length value
	            it('dimensions grid - type the length(ha) value', async () => {
		            await OneStop.setBackGridText('#variableWidthGrid tbody tr:nth-child(' + (index + 1) +
			            ') td.length', 0, dimensionsValues.length);
		            await driver.sleep(100);
	            });
	
	            // type the width value
	            it('dimensions grid - type the width(ha) value', async () => {
		            await OneStop.setBackGridText('#variableWidthGrid tbody tr:nth-child(' + (index + 1) +
			            ') td.width', 0, dimensionsValues.width);
		            await driver.sleep(100);
	            });
            }
            
            //2. type the total area value
            it('dimensions grid - type the total area(ha) value', async () => {
                await OneStop.setBackGridText('#dimensionGrid  tbody tr:nth-child(' + (index + 1) + ') td.totalArea', 0,
                    dimensionsValues.totalArea);
                await driver.sleep(100);
            });

            //3. type the new cut value
            it('dimensions grid - type the new cut(ha) value', async () => {
                await OneStop.setBackGridText('#dimensionGrid tbody tr:nth-child(' + (index + 1) + ') td.newCut', 0,
                    dimensionsValues.newCut);
                await driver.sleep(100);
            });

            //4. type the existing cut value
            it('dimensions grid - type the existing cut(ha) value', async () => {
                await OneStop.setBackGridText('#dimensionGrid tbody tr:nth-child(' + (index + 1) +
                    ') td.existingCut', 0, dimensionsValues.existingCut);
                await driver.sleep(100);
            });
        };
        
        describe('disposition > site details - fill in the dimensions grid of each disposition id', () => {
            //navigate to Dispositions - Site Details tab
            OneStop.clickLeftSideMenuItems('dispositionTab:siteDetails', '#siteLocationPanelHeading');
            
            //this piece might need some changes based on the functionality changes
            for (let i = 0; i < dimensionsGridValues.length; i++) {
                //1. click the top tabs if not active
                clickDimensionsTabs(i);

                //2. fill in the grid
                for (let j = 0; j < dimensionsGridValues[i].dimensions.length; j++) {
                    addDimensions(dimensionsGridValues[i].dimensions[j], j);
                }

                OneStop.clickSave();
            }
        });
    };

    OneStop.pageDispositionLand = (openApplication) => {
        if (openApplication) {
            OneStop.openApplicationByLink();
        }

        describe('disposition > land', () => {
            // not done - errors on this page - not loading...

            //navigate to Dispositions - Site Details tab
            OneStop.clickLeftSideMenuItems('dispositionTab:siteDetails', '#siteLocationPanelHeading');

            //stopped here - could not continue due to app's errors
        });

    };
// END --- LAND ****************************************************************************************************

	return OneStop;
})();

module.exports = OneStop;
