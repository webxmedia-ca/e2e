/**
 * Created by cb5rp on 6/1/2017.
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

// const expect = require('chai').expect;
// const shapeFileWaitInterval = 300000;

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

    OneStop.init = function (harnessObjIn, waitShortIn, waitLongIn) {
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

    const setRole = (roleName) => {
        before(async () => {
            await driver.get(OneStop.getBaseUrl() + '/#workspace/' + roleName);
            await OneStop.waitForPageLoad();
        });
    };

    OneStop.actionInitiateAssessment = (authorizationId,
                                        inspectionTypeValue,
                                        inspectionCategoryValue,
                                        inspectionMethodValue,
                                        leadReviewerValue) => {

        describe('initiate assessment', () => {
            setRole('assessment-coordinator');

            it('open new assessment', async () => {
                await driver.get(OneStop.getBaseUrl() + '/#assessment');
            });

            it('click authorization number search', async () => {
                await OneStop.clickElementByCSS('.btn-search');
                await OneStop.waitForPageLoad();
            });

            it('search by authorization dialog > enter authorization number: '+authorizationId , async () => {
                await OneStop.setTextFieldValueByCSS('#licenseAuthorizationId', authorizationId); //was: *[name="authorizationId"]
            });
	
	        it('search by authorization dialog > select the authorization type - facility license', async () => {
		        await OneStop.setSelectFieldValueByCSS('select[name="authorizationType"]', 'Facility License');
	        });

            it('search by authorization dialog > click search' , async () => {
                await OneStop.clickElementByCSS('.modal-body .btn-search');
                await OneStop.waitForPageLoad();
            });

            it('search by authorization dialog > select results', async () => {
                await OneStop.clickElementByCSS('.search-results .select-all-header-cell');
	            await OneStop.waitForPageLoad();
            });

            it('search by authorization dialog > click add', async () => {
                await OneStop.clickElementByCSS('.modal-footer .btn-add');  //was .modal-body .btn-add
	            await driver.sleep(1000);
	            await OneStop.waitForPageLoad();
            });
            
            it('select all rows from the primary authorizations grid', async () => {
	            await OneStop.clickElementByCSS('.backgrid .select-all-header-cell');
	            await OneStop.waitForPageLoad();
            });
            
            it('select assessment type: '+inspectionTypeValue, async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="inspectionType"]', inspectionTypeValue);
	            await OneStop.waitForPageLoad();
            });

            it('select assessment category: '+inspectionCategoryValue, async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="inspectionCategory"]', inspectionCategoryValue);
	            await OneStop.waitForPageLoad();
            });

            it('select assessment method: '+inspectionMethodValue, async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="inspectionMethod"]', inspectionMethodValue);
	            await OneStop.waitForPageLoad();
            });

            if (leadReviewerValue !== null) {
                it('set lead reviewer: '+leadReviewerValue, async () => {
                    await OneStop.setSelectFieldValueByCSS('.twitter-typeahead input.tt-input', leadReviewerValue);
	                await OneStop.waitForPageLoad();
                });
            }

            it('click submit', async () => {
                await OneStop.clickElementByCSS('.btn-submit');
                await OneStop.waitForPageLoad();
            });
            
            //add error validation
            /*
	        OneStop.checkErrorsExist(false);
            */
            
            //the one below - can it be replaced by the popUpConfirmation or confirmSubmission functions?!
            it('click Yes button on the Confirm Initiate Assessment dialog', async () => {
                // delete this for sure... await driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
	            //PREFERRED PATTERN:
                // await OneStop.confirmSubmission('Confirm Initiate Assessment', 'Yes');
	            // await OneStop.waitForPageLoad();
	            // await driver.sleep(1000);

                await OneStop.clickElementByCSS('.modal-footer .btn-toolbar .btn-yes');
	            await OneStop.waitForPageLoad();
	            await driver.sleep(1000);
            });

            //the one below - can it be replaced by the popUpConfirmation or confirmSubmission functions?!
            it('capture assessment # from confirmation dialog', async () => {
	            //PREFERRED PATTERN:
	            //const text = await OneStop.popUpConfirmation('your assessment number is', 2000, true);
	            //await OneStop.waitForPageLoad();

                const text = await OneStop.getElementValueByCSS('.modal-info-message');
                const srchStr = 'assessment number is ';
                const index = text.search(srchStr);
	            const id = text.slice(index + srchStr.length, text.length - 1);

                harnessObj.addApplicationToJSON(id);
                await OneStop.clickElementByCSS('.modal-dialog .btn-close');
	            await OneStop.waitForPageLoad();
            });
        });
    };

    OneStop.actionPreAssessmentContactsDates = (fromDateValue,
                                                toDateValue,
                                                documentDueDateValue,
                                                contactsArray) => {

        describe('pre assessment > contacts & dates', () => {

            const addPreAssessmentContact = (contactObj, index) => {
                it('click add row', async () => {
                    await OneStop.clickElementByCSS('#contactInformationPanelBody .btn-add-row');
                    await OneStop.waitForPageLoad();
                });

                it('set firstName: '+contactObj.firstName, async () => {
                    const elements = await OneStop.getElementsByCSS('td.firstName');
                    await OneStop.populateGridElementValue(elements[index], contactObj.firstName);
	                await OneStop.waitForPageLoad();
                });

                it('set lastName: '+contactObj.lastName, async () => {
                    const elements = await OneStop.getElementsByCSS('td.lastName');
                    await OneStop.populateGridElementValue(elements[index], contactObj.lastName);
	                await OneStop.waitForPageLoad();
                });

                it('set phone: '+contactObj.phone, async () => {
                    const elements = await OneStop.getElementsByCSS('td.phone');
                    await OneStop.populateGridElementValue(elements[index], contactObj.phone);
	                await OneStop.waitForPageLoad();
                });

                it('set email: '+contactObj.email, async () => {
                    const elements = await OneStop.getElementsByCSS('td.email');
                    await OneStop.populateGridElementValue(elements[index], contactObj.email);
	                await OneStop.waitForPageLoad();
                });
            };

            setRole('assessment-lead-reviewer');

            it('open pre assessment', async () => {
                await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
                    harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
                await OneStop.waitForPageLoad();
            });

            if (fromDateValue != null) {
                it('set fromDate: '+fromDateValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="fromDate"]', fromDateValue);
                });
            }

            if (toDateValue != null) {
                it('set toDate: '+toDateValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="toDate"]', toDateValue);
                });
            }

            if (documentDueDateValue != null) {
                it('set documentDueDate: '+documentDueDateValue, async () => {
                    await OneStop.setTextFieldValueByCSS('*[name="documentDueDate"]', documentDueDateValue);
                });
            }

            if (contactsArray != null) {
                for (let i = 0; i < contactsArray.length; i++) {
                    addPreAssessmentContact(contactsArray[i], i);
                }
            }

            OneStop.clickSave();
        });
    };

    OneStop.actionPreAssessmentRelatedAuthorizations = (relatedAuthorizationId) => {
        describe('pre assessment > add related authorizations', () => {
            // setRole('assessment-lead-reviewer');

            // it('open pre assessment', async () => {
            //     await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
            //         harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
            //     await OneStop.waitForPageLoad();
            // });
            
	        OneStop.clickLeftSideMenuItems('preAssessmentTab:addAuth', "#addAuthPanelHeading");

            it('click add authorization', async () => {
                await OneStop.clickElementByCSS('#addAuthorization');
                await OneStop.waitForPageLoad();
            });

            it('search by authorization dialog > enter authorization number', async () => {
                await OneStop.setTextFieldValueByCSS('#licenseAuthorizationId', relatedAuthorizationId);
            });
	
	        it('search by authorization dialog > select the authorization type - facility license', async () => {
		        await OneStop.setSelectFieldValueByCSS('select[name="authorizationType"]', 'Facility License');
	        });

            it('search by authorization dialog > click search', async () => {
                await OneStop.clickElementByCSS('.modal-body .btn-search');
                await OneStop.waitForPageLoad();
            });

            it('search by authorization dialog > select results', async () => {
                await OneStop.clickElementByCSS('.search-results .select-all-header-cell');
                await OneStop.waitForPageLoad();
            });

            it('search by authorization dialog > click add', async () => {
                await OneStop.clickElementByCSS('.modal-footer .btn-add');  //was .modal-body .btn-add
                await OneStop.waitForPageLoad();
            });

            OneStop.clickSave();
        });
    };

    const addPreAssessmentDocuments = (authId, expectedCssLocator) => {
        OneStop.clickOnTabByText(" Authorization " + authId, expectedCssLocator);

        it('click add', async () => {
            await OneStop.clickElementByCSS('#addFiles');
            await OneStop.waitForObjectLoad('.modal-title', waitShort * 2);
            await OneStop.waitForPageLoad();
        });

        it('select first document', async () => {
            const elements = await OneStop.getElementsByCSS('.modal-body .select-row-cell');
            elements[0].click();
        });

        it('select second document', async () => {
            const elements = await OneStop.getElementsByCSS('.modal-body .select-row-cell');
            elements[1].click();
        });

        it('click add', async () => {
            await OneStop.clickElementByCSS('.modal-body .btn-add');
	        await driver.sleep(500);
            await OneStop.waitForPageLoad();
        });
    };

    OneStop.actionPreAssessmentDocumentationPrior = (authorizationIdsArray) => {
        describe('documentation > prior to assessment', () => {
            // setRole('assessment-lead-reviewer');

            // it('open pre assessment', async () => {
            //     await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
            //         harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
            //     await OneStop.waitForPageLoad();
            // });

	        OneStop.clickLeftSideMenuItems('documentationTab', "#priorDocumentationPanelHeading");

            for (let i = 0; i < authorizationIdsArray.length; i++) {
                addPreAssessmentDocuments(authorizationIdsArray[i], "#priorDocumentationPanelHeading");
            }

            OneStop.clickSave();
        });
    };

    OneStop.actionPreAssessmentDocumentationOnSite = (authorizationIdsArray) => {
        describe('documentation > on-site', () => {
            // setRole('assessment-lead-reviewer');

            // it('open pre assessment', async () => {
            //     await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
            //         harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
            //     await OneStop.waitForPageLoad();
            // });

	        OneStop.clickLeftSideMenuItems('documentationTab:onSiteDocumentation', "#onSiteDocumentationPanelHeading");

            for (let i = 0; i < authorizationIdsArray.length; i++) {
                addPreAssessmentDocuments(authorizationIdsArray[i], "#onSiteDocumentationPanelHeading");
            }

            OneStop.clickSave();
        });
    };

    OneStop.actionPreAssessmentReview = (remarksValue, notifyBoolean) => {
        describe('review', () => {
            // setRole('assessment-lead-reviewer');
            //
            // it('open pre assessment', async () => {
            //     await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
            //         harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
            //     await OneStop.waitForPageLoad();
            // });

	        OneStop.clickLeftSideMenuItems('reviewTab', "#priorDocumentationPanelHeading");
            
            it('set remarks: '+remarksValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="remark"]', remarksValue);
            });

            OneStop.clickSave();

            if (notifyBoolean) {
                it('click notify licensee', async () => {
                    await OneStop.clickElementByCSS('#notify');
                    await OneStop.waitForPageLoad();
                });

                it('click the yes confirmation button', async () => {
                    await OneStop.clickElementByCSS('.modal-footer .btn-toolbar .btn-yes');
                    await OneStop.waitForPageLoad();
                });

                it('click ok in the licensee notified dialog', async () => {
                    await OneStop.waitForObjectLoad('h4.modal-title', waitLong);
                    await OneStop.clickElementByCSS('.btn-close');
                    await OneStop.waitForPageLoad();
                });
            }
        });
    };

    OneStop.actionPostAssessmentAccept = (lookupAppSubType, submit) => {
        /* -----------------------------------------------------------------------------------------------------------------
        DESCRIPTION:  this function will

        ACCEPTED PARAMETER(S) AND VALUES:
        lookupAppSubType:   ?
        submit:             ?

        USAGE:  OneStop.actionPostAssessmentAccept(?, ?);
        ----------------------------------------------------------------------------------------------------------------- */
        describe('accept assessment', () => {
            setRole('assessment-lead-reviewer');

            it('open assessment', async () => {
                await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
                    harnessObj.getMostRecentApplication(lookupAppSubType, appSubType, false).appId);
                await OneStop.waitForPageLoad();
            });

	        OneStop.clickLeftSideMenuItems('reviewTab', "#priorDocumentationPanelHeading");
            
            it('click accept assessment', async () => {
                await OneStop.clickElementByCSS('#accept');
                await OneStop.waitForPageLoad();
            });

            if (submit === true) {
                it('click yes confirmation button', async () => {
                    await OneStop.clickElementByCSS('.modal-dialog .btn-yes');
                    harnessObj.setAppLicenseNumber(lookupAppSubType, appSubType, 'na');
                    await OneStop.waitForPageLoad();
                });
            }
        });
    };

    OneStop.pagePreAssessmentDocumentationPrior = (lookupAppSubType,
                                                            preAssessmentPriorDocumentsArray) => {
        const addPreAssessmentDocumentsPrior = (preAssessmentPriorDocumentsObj) => {
            OneStop.clickOnTabByText(" Authorization " + preAssessmentPriorDocumentsObj.id, "#priorDocumentationPanelHeading");

            it('add documents', async () => {
                const elements = await OneStop.getElementsByCSS('.file-uploader-cell input[type="file"]');
                for (let i = 0; i < elements.length; i++) {
                    if (preAssessmentPriorDocumentsObj.paths[i].toLowerCase().split('-')[0] !== 'na') {
                        await elements[i].sendKeys(preAssessmentPriorDocumentsObj.paths[i]);
                    } else {
                        await markPreAssessmentDocumentPriorNA(i, preAssessmentPriorDocumentsObj.paths[i].toLowerCase().split('-')[1]);
                    }
                    await driver.sleep(waitShort);
                }
            });
        };

        const markPreAssessmentDocumentPriorNA = async (i, comment) => {
            const elements = await OneStop.getElementsByCSS('.notApplicable input[type="checkbox"]');
            await elements[i].click();
            await driver.sleep(500);
            await OneStop.setBackGridText('.string-cell.comments', i, comment);
        };

        describe('pre assessment > documentation > prior to assessment', () => {
            it('open pre assessment', async () => {
                await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
                    harnessObj.getMostRecentApplication(appType, lookupAppSubType, false).appId);
                await OneStop.waitForPageLoad();
            });

	        OneStop.clickLeftSideMenuItems('documentationTab', "#priorDocumentationPanelHeading");
            
            for (let i = 0; i < preAssessmentPriorDocumentsArray.length; i++) {
                addPreAssessmentDocumentsPrior(preAssessmentPriorDocumentsArray[i]);
            }

            OneStop.clickSave();
        });
    };

    OneStop.pagePreAssessmentDocumentationOnSite = (lookupAppSubType, preAssessmentOnSiteDocumentsArray) => {
        const addPreAssessmentDocumentsExternalOnSite = (preAssessmentPriorDocumentsObj) => {
            OneStop.clickOnTabByText(" Authorization " + preAssessmentPriorDocumentsObj.id,
                "#onSiteDocumentationPanelHeading");

            it('acknowledge documents', async () => {
                const elements = await OneStop.getElementsByCSS('.boolean-cell.notApplicable input[type="checkbox"]');
                for (let i = 0; i < elements.length; i++) {
                    if (preAssessmentPriorDocumentsObj.acknowledgements[i] === true) {
                        await markPreAssessmentDocumentOnSiteAcknowledged(i);
                    } else {
                        await OneStop.setBackGridText('.string-cell.comments', i,
                            preAssessmentPriorDocumentsObj.acknowledgements[i]);
                    }
                }
            });
        };

        const markPreAssessmentDocumentOnSiteAcknowledged = async (i) => {
            const elements = await OneStop.getElementsByCSS('.boolean-cell.acknowledgement input[type="checkbox"]');
            elements[i].click();
        };

        describe('pre assessment > documentation > on-site', () => {
            it('open pre assessment', async () => {
                await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
                    harnessObj.getMostRecentApplication(appType, lookupAppSubType, false).appId);
                await OneStop.waitForPageLoad();
            });

	        OneStop.clickLeftSideMenuItems('documentationTab:onSiteDocumentation', "#onSiteDocumentationPanelHeading");

            for (let i = 0; i < preAssessmentOnSiteDocumentsArray.length; i++) {
                addPreAssessmentDocumentsExternalOnSite(preAssessmentOnSiteDocumentsArray[i]);
            }

            OneStop.clickSave();
        });
    };

    OneStop.pagePreAssessmentExternalReview = (lookupAppSubType, submit) => {
        describe('pre assessment > review', () => {
            it('open pre assessment', async () => {
                await driver.get(OneStop.getBaseUrl() + '/#assessment/' +
                    harnessObj.getMostRecentApplication(appType, lookupAppSubType, false).appId);
                await OneStop.waitForPageLoad();
            });

	        OneStop.clickLeftSideMenuItems('reviewTab', "#priorDocumentationPanelHeading");

            it('click accept disclaimer', async () => {
                await OneStop.clickElementByCSS('#disclaimer');
                await OneStop.waitForPageLoad();
            });

            it('click agree button', async () => {
                await OneStop.clickElementByCSS('.modal-dialog .agree');
                await OneStop.waitForPageLoad();
            });

            it('click submit to reviewer', async () => {
                await OneStop.clickElementByCSS('#submit');
                await OneStop.waitForPageLoad();
            });

            if (submit === true) {
                it('submission confirmation prompt appears', async () => {
                    const element = await driver.findElement(By.css('.modal-dialog'));
                    driver.wait(until.elementIsVisible(element), waitLong);
                });

                it('click yes confirmation button', async () => {
                    await OneStop.clickElementByCSS('.modal-dialog .btn-yes');
                    await OneStop.waitForPageLoad();
                });

                it('click ok in the submission confirmation dialog', async () => {
                    await OneStop.clickElementByCSS('.modal-dialog .btn-primary');
                    await OneStop.waitForPageLoad();
                });
            }
        });
    };

    return OneStop;
})();

module.exports = OneStop;
