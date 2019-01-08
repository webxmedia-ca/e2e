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
    const OneStopGrid = require('../lib/OneStop/Grid');

    let webDriver
        , driver
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

        var attrs = OneStop.getAttrs();

        webDriver = attrs.webDriver;
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

    OneStop.openInternalApplicationBySearch = async (appId) => {
        await driver.get(OneStop.getBaseUrl() + '/#workspace/search');

        await OneStop.waitForPageLoad();
        await OneStop.setElementAttributeByCSS('#feedback-button', 'style', 'display:none'); // Hide the feedback button

        // let page load
        await OneStop.waitForPageLoad();

        // enter the appid
        await OneStop.setTextFieldValueByCSS('*[name="applicationId"]', appId);

        //click the application search button
        await OneStop.clickElementByCSS('.btn-search');

        // let page load
        await OneStop.waitForPageLoad();

        // click the open button
        await OneStop.clickElementByCSS('button[data-event="show:application:submitted"]');

        // let page load
        await OneStop.waitForPageLoad();
    };

    OneStop.actionAssignLeadReviewer = () => {
        describe('assign lead reviewer', () => {
            before(async () => {
                await driver.get(OneStop.getBaseUrl() + '/#workspace/business-administrator');
                await OneStop.waitForPageLoad();
                const appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                await OneStop.openInternalApplicationBySearch(appId);
            });

            //click on Collaboration and Actions tab
            OneStop.clickOnTabByText("Collaboration and Actions", "#AssessmentRulesPanelHeading");

            it('select action', async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="selectAction"]', 'Assign Lead Reviewer');
            });

            it('enter current user display name', async () => {
                await OneStop.setTypeAheadValueByCSS('.action-section.LEAD_REV-action .tt-input', OneStop.getDisplayName());
                await OneStop.clickElementByCSS('#ActionsPanelBody>div>div>div:nth-child(1) label:nth-child(1)');
            });

            it('click the save button', async () => {
                await OneStop.clickElementByCSS('#action-save');
                await OneStop.waitForPageLoad();
            });

            it('shows a success popup message', async () => {
                await OneStop.popUpConfirmation('Successfully assigned lead reviewer', waitLong);
            });
        });
    };

    OneStop.actionAssignDecisionMaker = () => {
        describe('assign decision maker', () => {
            before(async () => {
                await driver.get(OneStop.getBaseUrl() + '/#workspace/business-administrator');
                await OneStop.waitForPageLoad();
                const appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                await OneStop.openInternalApplicationBySearch(appId);
            });

            //click on Collaboration and Actions tab
            OneStop.clickOnTabByText('Collaboration and Actions', '#AssessmentRulesPanelHeading');

            it('select action', async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="selectAction"]', 'Assign Decision maker');
            });

            it('enter current user display name', async () => {
                await OneStop.setTypeAheadValueByCSS('.action-section.DEC_MAKER-action .tt-input', OneStop.getDisplayName());
                await OneStop.clickElementByCSS('#ActionsPanelBody>div>div>div:nth-child(5) label:nth-child(1)');
                await driver.sleep(100);
            });

            it('click the save button', async () => {
                await OneStop.clickElementByCSS('#action-save');
                await OneStop.waitForPageLoad();
            });

            it('shows a success popup message', async () => {
                await OneStop.popUpConfirmation('Successfully assigned decision maker', waitLong);
            });
        });
    };

    OneStop.actionAssignReviewer = (reviewReason,
                                    reviewAssignerComments,
                                    reviewDueDate) => {
        describe('assign reviewer', () => {
            before(async () => {
                await driver.get(OneStop.getBaseUrl() + '/#workspace/lead-reviewer');
                await OneStop.waitForPageLoad();
                const appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                await OneStop.openInternalApplicationBySearch(appId);
            });

            //click on Collaboration and Actions tab
            OneStop.clickOnTabByText('Collaboration and Actions', '#AssessmentRulesPanelHeading');

            it('enter reviewer name', async () => {
                await OneStop.setTextFieldValueByCSS('#userDisplayNameDFilter', OneStop.getDisplayName());
            });

            it('reviewer is not already assigned', async () => {
                await OneStop.getElementValueByCSS('.reviewer-grid .grid .multi-button-cell')
                    .then((value) => {
                        expect(value).to.not.contain('Already Assigned');
                    });
            });

            it('click the select button', async () => {
                await OneStop.clickElementByCSS('button[data-event="reviewer:select"]');
                await driver.sleep(waitShort);
                await OneStop.clickElementByCSS('button[data-event="reviewer:select"]');
                await driver.sleep(waitShort);
            });

            it('select reason', async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="reason"]', reviewReason);
            });

            it('enter comments', async () => {
                await OneStop.setTextFieldValueByCSS('*[name="comments"]', reviewAssignerComments);
            });

            it('enter due date', async () => {
                await OneStop.setTextFieldValueByCSS('*[name="dueDate"]', reviewDueDate);
                await OneStop.clickElementByCSS('#referral-comments');
            });

            it('click the make referral button', async () => {
                await OneStop.clickElementByCSS('#make-referral');
                await OneStop.waitForPageLoad();
            });

            it('shows a success popup message', async () => {
                await OneStop.popUpConfirmation('Successfully created referral', waitLong);
            });
        });
    };

    OneStop.actionCompleteReview = (recommendation,
                                    comments) => {
        describe('complete review', () => {
            before(async () => {
                await driver.get(OneStop.getBaseUrl() + '/#workspace/reviewer');
                await OneStop.waitForPageLoad();
            });

            it('accept assignment', async () => {
                await OneStop.clickElementByCSS('button[data-event="reviewer:accept"]');
                await OneStop.waitForPageLoad();

                await OneStop.getElementValueByCSS('.the-grid .grid .multi-button-cell')
                    .then(function (value) {
                        expect(value).to.contain('In Progress');
                    });
            });

            it('open application', async () => {
                const appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                await OneStop.openInternalApplicationBySearch(appId);
            });

            //click on Collaboration and Actions tab
            OneStop.clickOnTabByText('Collaboration and Actions', '#AssessmentRulesPanelHeading');

            it('select the recommend action', async () => {
                await OneStop.clickElementByCSS('.referrals-grid .dropdown-toggle');
                await OneStop.clickElementByCSS('a[data-action="recommend"]');
                await OneStop.waitForPageLoad();
            });

            it('select issue certificate', async () => {
                await OneStop.setSelectFieldValueByCSS('#recommendationSelect', recommendation);
            });

            it('enter comments', async () => {
                await OneStop.setTextFieldValueByCSS('#additionalComments', comments);
            });

            it('click make recommendation', async () => {
                await OneStop.clickElementByCSS('.modal-footer .btn-save');
                await OneStop.waitForPageLoad();
            });

            it('shows a success popup message', async () => {
                await OneStop.popUpConfirmation('Recommendation submitted', waitLong);
            });
        });
    };

    OneStop.actionMakeFinalRecommendation = (recommendation,
                                             comments) => {
        describe('make final recommendation', () => {
            before(async () => {
                await driver.get(OneStop.getBaseUrl() + '/#workspace/lead-reviewer');
                await OneStop.waitForPageLoad();
                const appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                await OneStop.openInternalApplicationBySearch(appId);
            });

            OneStop.clickOnTabByText('Recommendations and Decisions', '#RecAndDecPanelHeading');

            it('select recommendation', async () => {
                await OneStop.setSelectFieldValueByCSS('#fin-rec-select', recommendation);
            });

            it('enter comments', async () => {
                await OneStop.setTextFieldValueByCSS('*[name="addComments"]', comments);
            });

            it('click the make final recommendation button', async () => {
                await OneStop.clickElementByCSS('#finalRecSubmit');
                await OneStop.waitForPageLoad();
            });
        });
    };

    OneStop.actionMakeFinalDecision = function (decision,
                                                comments) {
        describe('make final decision', () => {
            before(async () => {
                await driver.get(OneStop.getBaseUrl() + '/#workspace/decision-maker');
                await OneStop.waitForPageLoad();
                const appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                await OneStop.openInternalApplicationBySearch(appId);
            });

            //click on Recommendations and Decisions tab
            OneStop.clickOnTabByText('Recommendations and Decisions', '#RecAndDecPanelHeading');

            it('select recommendation', async () => {
                await OneStop.setSelectFieldValueByCSS('#fin-dec-select', decision);
            });

            it('enter comments', async () => {
                await OneStop.setTextFieldValueByCSS('#fin-dec-comments', comments);
            });

            it('click the issue decision button', async () => {
                await OneStop.clickElementByCSS('#finalDecSubmit');
                await OneStop.waitForPageLoad();
            });

            it('click the yes confirmation button', async () => {
                await driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
                await OneStop.clickElementByCSS('.modal-footer .btn-toolbar .btn-yes');
            });
        });
    };

    OneStop.actionVerifyLicensePDF = (waitInterval) => {
        describe('verify license pdf generated', () => {
            before(async () => {
                await driver.sleep(waitInterval);
                await driver.get(OneStop.getBaseUrl() + '/#' + appType + '/' + harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
                await OneStop.waitForPageLoad();
            });

            //click on Recommendations and Decisions tab
            OneStop.clickOnTabByText('Recommendations and Decisions', '#RecAndDecPanelHeading');

            it('pdf link exists', async () => {
                await OneStop.waitForPageLoad();
                await driver.wait(until.elementLocated(By.css('.files-collection .file-name')), waitLong * 5);
                await driver.findElements(By.css('.files-collection .file-name'))
                    .then(async (elements) => {
                        expect(elements.length >= 1).to.be.true;

                        //get the license number
                        await driver.findElements(By.css('.authorization-table td'))
                            .then(async (elements) => {
                                await elements[1].getText()
                                    .then(function (text) {
                                        //write the license number
                                        harnessObj.setAppLicenseNumber(appType, appSubType, text);
                                    });
                            });
                    });
            });
        });
    };

    OneStop.actionAddNewSIR = (sirSubject, sirQuestion, sirReason, sirDateDue, displayContactInfo, attachmentPath) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:  this function will set the role to Lead Review
                      will navigate to 'Collaboration and Actions' tab
                      will click on the 'New SIR' button
                      will fill in the form using the values of given arguments
                      will submit the Create New SIR form

        ACCEPTED PARAMETER(S) AND VALUES:
        sirSubject:             "any text"
        sirQuestion:            "any text"
        sirReason:              "Clarification" -> should be a value which exists within the dropdown
        displayContactInfo:     "Yes" / "No" / null
        attachmentPath:         require('path').join(__dirname, '/attachments/SIRAttachment.pdf')

        USAGE:  OneStop.actionAddNewSIR("testSubject", "testQuestion", "Clarification", "Yes",
                    require('path').join(__dirname, '/attachments/SIRAttachment.pdf'), true);
        ------------------------------------------------------------------------------------------------------------- */
        describe('add new sir', () => {
            before(async () => {
                await driver.get(OneStop.getBaseUrl() + '/#workspace/lead-reviewer');
                await OneStop.waitForPageLoad();
                const appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                await OneStop.openInternalApplicationBySearch(appId);
            });

            //click on Collaboration and Actions tab
            OneStop.clickOnTabByText("Collaboration and Actions", "div#AssessmentRulesPanelHeading");

            //click the 'New SIR' button to open the popup
            it('click on new sir button', async () => {
                await OneStop.clickElementByCSS('.panel-body .btn-new-sir');
                await OneStop.waitForPageLoad();
            });

            //Start: fill in the form -------------------->
            //1. type the Subject value
            it('type the subject value: ' + sirSubject, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="subject"]', sirSubject);
            });

            //2. type todays date +1 day within Response Required By field
            it('set the response required by value', async () => {
                await OneStop.setTextFieldValueByCSS('#sirDueDate', sirDateDue);
            });

            //3. type the Question value
            it('type the question value: ' + sirQuestion, async () => {
                //type the values
                await OneStop.setTextFieldValueByCSS('#requestDescription', sirQuestion);
            });

            //4. select the 'Reason for SIR' value
            it('select the reason for sir value: ' + sirReason, async () => {
                await OneStop.setSelectFieldValueByCSS('.reason-for-sir', sirReason);
            });

            //5. set the Display Contact Info (accepted parameters: Yes / No)
            if (displayContactInfo !== null) {
                it('set display contact info to: ' + displayContactInfo, async () => {
                    await OneStop.setButtonRadioFieldValueByCSS('*[name="isContactInfoDisplay"]', displayContactInfo.charAt(0)); // Y or N
                });
            }

            //6. attach one file
            if (attachmentPath !== null) {
                const filePathExploded = attachmentPath.split('\\');
                it('attach sir document file: ' + filePathExploded.pop(), async () => {
                    await OneStop.setFileUploadByCSS('#uploadAttachment *[name="fileselect[]"]', attachmentPath);
                    await OneStop.waitForPageLoad();
                });
            }
            //<-------------------- End: fill in the form

            //7. click Send to Applicant button
            it('click send to applicant button', async () => {
                await OneStop.clickElementByCSS('.modal-footer .btn-sir-submit');
                await driver.sleep(3000);
                await OneStop.waitForPageLoad();
            });
            //NOTE: here there is no success popup to be tested
        });
    };

    OneStop.actionValidateConditionsTitlesMatchSectionValues = (conditionsTabValues) => {
        /* -------------------------------------------------------------------------------------------------------------
        DESCRIPTION:    while on the Conditions tab next happens in a loop:
=======
        
		// let page load
		OneStop.waitForPageLoad(function () {
		});
		
		// enter the appid
		OneStop.setTextFieldValueByCSS('*[name="applicationId"]', appId);
		
		//click the application search button
		OneStop.clickElementByCSS('.btn-search');
		
		// let page load
		OneStop.waitForPageLoad(function() {
		});
		
		// click the open button
		OneStop.clickElementByCSS('button[data-event="show:application:submitted"]');
		
		// let page load
		OneStop.waitForPageLoad(function() {
		});
	};
	
	OneStop.actionAssignLeadReviewer = function() {
		describe('assign lead reviewer', function() {
			before(function (done) {
				driver.get(OneStop.getBaseUrl() + '/#workspace/business-administrator');
				OneStop.waitForPageLoad(function() {
					var appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
					OneStop.openInternalApplicationBySearch(appId);
					done();
				});
			});
			
			//click on Collaboration and Actions tab
			OneStop.clickOnTabByText("Collaboration and Actions", "#AssessmentRulesPanelHeading");
			
			it('select action', function(done) {
				OneStop.setSelectFieldValueByCSS('*[name="selectAction"]', 'Assign Lead Reviewer');
				done();
			});
			
			it('enter current user display name', function(done) {
				OneStop.setTypeAheadValueByCSS('.action-section.LEAD_REV-action .tt-input', OneStop.getDisplayName());
				OneStop.clickElementByCSS('#ActionsPanelBody>div>div>div:nth-child(1) label:nth-child(1)');
				done();
			});
			
			it('click the save button', function(done) {
				OneStop.clickElementByCSS('#action-save');
				driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
				done();
			});
			
			it('shows a success popup message', function(done) {
				OneStop.popUpConfirmation('Successfully assigned lead reviewer', waitLong, done);
			});
		});
	};
	
	OneStop.actionAssignDecisionMaker = function () {
		describe('assign decision maker', function() {
			before(function (done) {
				driver.get(OneStop.getBaseUrl() + '/#workspace/business-administrator');
				OneStop.waitForPageLoad(function () {
					var appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
					OneStop.openInternalApplicationBySearch(appId);
					done();
				});
			});
			
			//click on Collaboration and Actions tab
			OneStop.clickOnTabByText('Collaboration and Actions', '#AssessmentRulesPanelHeading');
			
			it('select action', function(done) {
				OneStop.setSelectFieldValueByCSS('*[name="selectAction"]', 'Assign Decision maker');
				done();
			});
			
			it('enter current user display name', function(done) {
				OneStop.setTypeAheadValueByCSS('.action-section.DEC_MAKER-action .tt-input', OneStop.getDisplayName());
				OneStop.clickElementByCSS('#ActionsPanelBody>div>div>div:nth-child(5) label:nth-child(1)');
				driver.sleep(100);
				done();
			});
			
			it('click the save button', function(done) {
				OneStop.clickElementByCSS('#action-save');
				driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
				done();
			});
			
			it('shows a success popup message', function(done) {
				OneStop.popUpConfirmation('Successfully assigned decision maker', waitLong, done);
			});
		});
	};
	
	OneStop.actionAssignReviewer = function (reviewReason,
	                                         reviewAssignerComments,
	                                         reviewDueDate) {
		describe('assign reviewer', function() {
			before(function (done) {
				driver.get(OneStop.getBaseUrl() + '/#workspace/lead-reviewer');
				OneStop.waitForPageLoad(function () {
					var appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
					OneStop.openInternalApplicationBySearch(appId);
					done();
				});
			});
			
			after(function (done) {
				done();
			});
			
			//click on Collaboration and Actions tab
			OneStop.clickOnTabByText('Collaboration and Actions', '#AssessmentRulesPanelHeading');
			
			it('enter reviewer name', function(done) {
				OneStop.setTextFieldValueByCSS('#userDisplayNameDFilter', OneStop.getDisplayName());
				done();
			});
			
			it('reviewer is not already assigned', function(done) {
				OneStop.getElementValueByCSS('.reviewer-grid .grid .multi-button-cell')
					.then(function (value) {
						expect(value).to.not.contain('Already Assigned');
						done();
					});
			});
			
			it('click the select button', function(done) {
				OneStop.clickElementByCSS('button[data-event="reviewer:select"]');
				driver.sleep(waitShort);
				OneStop.clickElementByCSS('button[data-event="reviewer:select"]');
				driver.sleep(waitShort);
				done();
			});
			
			it('select reason', function(done) {
				OneStop.setSelectFieldValueByCSS('*[name="reason"]', reviewReason);
				done();
			});
			
			it('enter comments', function(done) {
				OneStop.setTextFieldValueByCSS('*[name="comments"]', reviewAssignerComments);
				done();
			});
			
			it('enter due date', function(done) {
				OneStop.setTextFieldValueByCSS('*[name="dueDate"]', reviewDueDate);
				OneStop.clickElementByCSS('#referral-comments');
				done();
			});
			
			it('click the make referral button', function(done) {
				OneStop.clickElementByCSS('#make-referral');
				driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
				done();
			});
			
			it('shows a success popup message', function(done) {
				OneStop.popUpConfirmation('Successfully created referral', waitShort, done);
			});
		});
	};
	
	OneStop.actionCompleteReview = function (recommendation,
	                                         comments) {
		describe('complete review', function() {
			before(function (done) {
				driver.get(OneStop.getBaseUrl() + '/#workspace/reviewer');
				driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
				done();
			});
			
			after(function (done) {
				done();
			});
			
			it('accept assignment', function(done) {
				OneStop.clickElementByCSS('button[data-event="reviewer:accept"]');
				OneStop.waitForPageLoad(function () {
				});
				
				OneStop.getElementValueByCSS('.the-grid .grid .multi-button-cell')
					.then(function (value) {
						expect(value).to.contain('In Progress');
						done();
					});
			});
			
			it('open application', function(done) {
				var appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
				OneStop.openInternalApplicationBySearch(appId);
				done();
			});
			
			//click on Collaboration and Actions tab
			OneStop.clickOnTabByText('Collaboration and Actions', '#AssessmentRulesPanelHeading');
			
			it('select the recommend action', function(done) {
				OneStop.clickElementByCSS('.referrals-grid .dropdown-toggle');
				OneStop.clickElementByCSS('a[data-action="recommend"]');
				OneStop.waitForPageLoad(done);
			});
			
			it('select issue certificate', function(done) {
				OneStop.setSelectFieldValueByCSS('#recommendationSelect', recommendation);
				done();
			});
			
			it('enter comments', function(done) {
				OneStop.setTextFieldValueByCSS('#additionalComments', comments);
				done();
			});
			
			it('click make recommendation', function(done) {
				OneStop.clickElementByCSS('.modal-footer .btn-save');
				driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
				done();
			});
			
			it('shows a success popup message', function(done) {
				OneStop.popUpConfirmation('Recommendation submitted', waitShort, done);
			});
		});
	};
	
	OneStop.actionMakeFinalRecommendation = function (recommendation,
	                                                  comments) {
		describe('make final recommendation', function() {
			before(function (done) {
				driver.get(OneStop.getBaseUrl() + '/#workspace/lead-reviewer');
				driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
				var appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
				OneStop.openInternalApplicationBySearch(appId);
				done();
			});
			
			after(function (done) {
				done();
			});
			
			OneStop.clickOnTabByText('Recommendations and Decisions', '#RecAndDecPanelHeading');
			
			it('select recommendation', function(done) {
				OneStop.setSelectFieldValueByCSS('#fin-rec-select', recommendation);
				done();
			});
			
			it('enter comments', function(done) {
				OneStop.setTextFieldValueByCSS('*[name="addComments"]', comments);
				done();
			});
			
			it('click the make final recommendation button', function(done) {
				OneStop.clickElementByCSS('#finalRecSubmit');
				driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong);
				done();
			});
		});
	};
	
	OneStop.actionMakeFinalDecision = function (decision, comments) {
		describe('make final decision', function() {
			before(function (done) {
				driver.get(OneStop.getBaseUrl() + '/#workspace/decision-maker');
				OneStop.waitForPageLoad(function () {
					var appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
					OneStop.openInternalApplicationBySearch(appId);
					done();
				});
			});
			
			after(function (done) {
				done();
			});
			
			//click on Recommendations and Decisions tab
			OneStop.clickOnTabByText('Recommendations and Decisions', '#RecAndDecPanelHeading');
			
			it('select recommendation', function(done) {
				OneStop.setSelectFieldValueByCSS('#fin-dec-select', decision);
				done();
			});
			
			it('enter comments', function(done) {
				OneStop.setTextFieldValueByCSS('#fin-dec-comments', comments);
				done();
			});
			
			it('click the issue decision button', function(done) {
				OneStop.clickElementByCSS('#finalDecSubmit');
				OneStop.waitForPageLoad(done);
			});
			
			it('click the yes confirmation button', function(done) {
				driver.wait(until.elementIsNotVisible(driver.findElement(By.css('.loading-container'))), waitLong * 3);
				OneStop.clickElementByCSS('.modal-footer .btn-toolbar .btn-yes');
				done();
			});
		});
	};
	
	OneStop.actionVerifyLicensePDF = function (waitInterval) {
		describe('verify license pdf generated', function() {
			before(function (done) {
				driver.sleep(waitInterval).then(function () {
					driver.get(OneStop.getBaseUrl() + '/#' + appType + '/' + harnessObj.getMostRecentApplication(appType, appSubType, false).appId);
					OneStop.waitForPageLoad(done);
				});
			});
			
			after(function (done) {
				done();
			});
			
			//click on Recommendations and Decisions tab
			OneStop.clickOnTabByText('Recommendations and Decisions', '#RecAndDecPanelHeading');
			
			it('pdf link exists', function(done) {
				//OneStop.clickElementByCSS('a[data-id="recs"]');   //clicks the 'Recommendations and Decisions' tab (already done above)
				OneStop.waitForPageLoad(function () {
					driver.wait(until.elementLocated(By.css('.files-collection .file-name')), waitLong * 10);
					driver.findElements(By.css('.files-collection .file-name'))
						.then(function (elements) {
							expect(elements.length >= 1).to.be.true;
							
							//get the license number
							driver.findElements(By.css('.authorization-table td'))
								.then(function (elements) {
									elements[1].getText()
										.then(function (text) {
											//write the license number
											harnessObj.setAppLicenseNumber(appType, appSubType, text);
											done();
										});
								});
						});
				});
			});
		});
	};
	
	OneStop.actionAddNewSIR = function (sirSubject, sirQuestion, sirReason, displayContactInfo, attachmentPath) {
		/* -------------------------------------------------------------------------------------------------------------
		DESCRIPTION:  this function will set the role to Lead Review
					  will navigate to 'Collaboration and Actions' tab
					  will click on the 'New SIR' button
					  will fill in the form using the values of given arguments
					  will submit the Create New SIR form
		
		ACCEPTED PARAMETER(S) AND VALUES:
		sirSubject:             "any text"
		sirQuestion:            "any text"
		sirReason:              "Clarification" -> should be a value which exists within the dropdown
		displayContactInfo:     "Yes" / "No" / null
		attachmentPath:         require('path').join(__dirname, '/attachments/SIRAttachment.pdf')
		
		USAGE:  OneStop.actionAddNewSIR("testSubject", "testQuestion", "Clarification", "Yes",
					require('path').join(__dirname, '/attachments/SIRAttachment.pdf'), true);
		------------------------------------------------------------------------------------------------------------- */
		describe('add new sir', function() {
			before(function (done) {
				//Lead Reviewer
				driver.get(OneStop.getBaseUrl() + '/#workspace/lead-reviewer');
				//  https://onestopuat.aer.ca/onestop/#workspace/lead-reviewer
				
				OneStop.waitForPageLoad(function () {
					var appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
					OneStop.openInternalApplicationBySearch(appId);
					done();
				});
			});
			
			after(function (done) {
				done();
			});
			
			//click on Collaboration and Actions tab
			OneStop.clickOnTabByText("Collaboration and Actions", "div#AssessmentRulesPanelHeading");
			
			//click the 'New SIR' button to open the popup
			it('click on new sir button', function(done) {
				OneStop.clickElementByCSS('.panel-body .btn-new-sir');
				OneStop.waitForPageLoad(done);
			});
			
			//Start: fill in the form -------------------->
			//1. type the Subject value
			it('type the subject value: ' + sirSubject, function(done) {
				OneStop.setTextFieldValueByCSS('*[name="subject"]', sirSubject);
				done();
			});
			
			//2. type todays date +1 day within Response Required By field
			it('set the response required by value', function(done) {
				OneStop.setTextFieldValueByCSS('#sirDueDate', new harnessObj.Moment().add(1, 'days').format('MM/DD/YYYY'));
				done();
			});
			
			//3. type the Question value
			it('type the question value: ' + sirQuestion, function(done) {
				//type the values
				OneStop.setTextFieldValueByCSS('#requestDescription', sirQuestion);
				done();
			});
			
			//4. select the 'Reason for SIR' value
			it('select the reason for sir value: ' + sirReason, function(done) {
				OneStop.setSelectFieldValueByCSS('.reason-for-sir', sirReason);
				done();
			});
			
			//5. set the Display Contact Info (accepted parameters: Yes / No)
			if (displayContactInfo !== null) {
				it('set display contact info to: ' + displayContactInfo, function(done) {
					OneStop.setButtonRadioFieldValueByCSS('*[name="isContactInfoDisplay"]', displayContactInfo.charAt(0)); // Y or N
					done();
				});
			}
			
			//6. attach one file
			if (attachmentPath !== null) {
				var filePathExploded = attachmentPath.split('\\');
				it('attach sir document file: ' + filePathExploded.pop(), function(done) {
					OneStop.setFileUploadByCSS('#uploadAttachment *[name="fileselect[]"]', attachmentPath);
					OneStop.waitForPageLoad(done);
				});
			}
			//<-------------------- End: fill in the form
			
			//7. click Send to Applicant button
			it('click send to applicant button', function(done) {
				OneStop.clickElementByCSS('.modal-footer .btn-sir-submit');
				driver.sleep(3000);
				OneStop.waitForPageLoad(done);
			});
			//NOTE: here there is no success popup to be tested
		});
	};
	
	OneStop.actionValidateConditionsTitlesMatchSectionValues = function(conditionsTabValues) {
		/* -------------------------------------------------------------------------------------------------------------
		DESCRIPTION:    while on the Conditions tab next happens in a loop:
>>>>>>> dev
                        - retrieve the values from Section column of Sections grid
                        - click on the View button of each row
                        - check the title of the 2nd grid (Conditions - ...) to match the values retrieved from Sections grid
                        - then retrieves every record from Conditions grid - Condition Statement column (one by one)
                        - clicks the Parameter button and retrieves the Condition value from the text area
                        - compares both values above to match

        ACCEPTED PARAMETER(S) AND VALUES:
            conditionsTabValues:    this is a json array with 2 dimensions
            e.g.: ---
            var conditionsTabValues = [
                {
                    section: 'APPROVAL CERTIFICATE',
                    conditionStatement:
                        [
                            {
                                statementValue: 'Pursuant to the Water Act, R.S.A. 2000, c. W-3, as amended, an approval is issued to the Approval Holder for the following activity:'
                            },
                            {
                                statementValue: '(a) placing, constructing, operating, maintaining, removing, disturbing works, in or on any land, water or water body;'
                            }
                            {
                                statementValue: '(e) draining groundwater for the purpose of remediation subject to the attached terms and conditions.'
                            }
                        ]
                }
            ]
        --> 'section' should match Sections grid - section column values
        --> 'statementValue' should match Conditions grid - Condition Statement column values

        USAGE:  OneStop.actionValidateConditionsTitlesMatchSectionValues(conditionsTabValues);
        ------------------------------------------------------------------------------------------------------------- */
        if (conditionsTabValues.length > 0) {
            describe('validate conditions tab values from both grids', () => {
                let gridSectionsObj = null;
                let gridConditionsObj = null;
                let sectionName;
                let conditionsGridStatementText, conditionsStatementArrayValue;

                before(async () => {
                    await driver.get(OneStop.getBaseUrl() + '/#workspace/lead-reviewer');
                    await OneStop.waitForPageLoad();
                    const appId = harnessObj.getMostRecentApplication(appType, appSubType, false).appId;
                    await OneStop.openInternalApplicationBySearch(appId);
                });

                const retrieveSectionValue = (rowIndex) => {
                    let arrayIndex = rowIndex;
                    rowIndex = rowIndex % 5;
                    it('sections grid - retrieve the value of Section column, row ' +
                        (rowIndex + 1) + ' - and click View button for ' + conditionsTabValues[arrayIndex].section,
                        async () => {
                            await OneStop.waitForObjectLoad('.sections-grid', waitLong);
                            const elements = await OneStop.getElementsByCSS('.sections-grid td.section');
                            const rowCount = await gridSectionsObj.getRowCount();
                            const subIndex = rowIndex % rowCount;
                            const sectionValue = await elements[subIndex].getText();
                            sectionName = sectionValue;
                            expect(sectionValue).to.equal(conditionsTabValues[arrayIndex].section);
                            await driver.sleep(100);
                            //click View button
                            await clickSectionsViewBtn(rowIndex);
                            //re-initiate the Conditions grid, old way -> initConditionsGrid(done);
                            gridConditionsObj = new OneStopGrid('.conditions-grid', harnessObj);
                        });
                };

                const clickSectionsViewBtn = async (buttonIndex) => {
                    const elements = await OneStop.getElementsByCSS('.sections-grid tbody td>button');
                    await elements[buttonIndex].click();
                    await driver.sleep(1000);
                };

                const validateConditionsTitle = (rowIndex) => {
                    const arrayIndex = rowIndex;
                    rowIndex = rowIndex % 5;
                    it('conditions grid - the title of the grid is equal to Conditions - ' + conditionsTabValues[arrayIndex].section, async () => {
                        await OneStop.waitForObjectLoad('#conditionsPanelHeading', waitLong, 500, true);
                        await driver.wait(until.elementLocated(By.css('#conditionsPanelHeading')), waitLong * 2);
                        const element = await driver.findElement(By.css('#conditionsPanelHeading span'));
                        const title = await element.getText();
                        expect(title).to.equal(sectionName);

                        //switch the Sections' grid pages if needed
                        const rowCount = await gridSectionsObj.getRowCount();
                        if ((rowIndex + 1) === rowCount && !gridSectionsObj.isOnLastPage()) {
                            gridSectionsObj.clickNext();
                        }
                    });
                };

                const retrieveConditionsStatementValue = (conditionStatementValues, rowIndex) => {
                    const arrayIndex = rowIndex;
                    rowIndex = rowIndex % 10;
                    it('conditions grid - the value from the condition statement column, row ' + (rowIndex + 1) +
                        ' (index ' + rowIndex + ') matches the value of array\'s parameter', async () => {
                        await OneStop.waitForObjectLoad('.conditions-grid', waitLong, 100, true);
                        const elements = await OneStop.getElementsByCSS('.conditions-grid td.statement');
                        await driver.sleep(500);
                        const rowCount = await gridConditionsObj.getRowCount();
                        const subIndex = rowIndex % rowCount;
                        const conditionsGridStatementValue = await elements[subIndex].getText();

                        //trim the values - remove all spaces, tabs, new lines, etc..
                        conditionsGridStatementText = conditionsGridStatementValue.replace(/\s/g, '');
                        conditionsStatementArrayValue = (conditionStatementValues[arrayIndex].statementValue).replace(/\s/g, '');
                        expect(conditionsGridStatementText).to.equal(conditionsStatementArrayValue);
                    });
                };

                const clickParametersBtn = (buttonIndex) => {
                    buttonIndex = buttonIndex % 10;
                    it('conditions grid - click parameters button on row ' + (buttonIndex + 1) +
                        ' (index ' + buttonIndex + ')', async () => {
                        await OneStop.waitForObjectLoad('#conditionsPanelHeading', waitLong, 100, true);
                        const elements = await OneStop.getElementsByCSS('.conditions-grid button[data-event="edit:parameters"]');
                        await elements[buttonIndex].click();
                        await driver.sleep(500);
                    });
                };

                const validateConditionsStatementValuesMatch = (rowIndex) => {
                    rowIndex = rowIndex % 10;
                    it('conditions grid - the condition statement matches the one from the grid, row ' + (rowIndex + 1),
                        async () => {
                            //retrieve the value from the modal popup
                            await OneStop.waitForObjectLoad('.modal-dialog', waitLong, 100, true);
                            // await driver.wait(until.elementLocated(By.css('.modal-dialog')), waitLong);
                            const element = await driver.findElement(By.css('textarea[name="statement"]'));
                            let modalConditionText = await element.getText();
                            //trim the value - remove all spaces, tabs, new lines, etc..
                            modalConditionText = modalConditionText.replace(/\s/g, '');
                            //compare the value from the modal vs the one from the grid
                            expect(modalConditionText).to.equal(conditionsGridStatementText);

                            //close the modal popup
                            const cancelButton = await OneStop.findElementsByCSS('.btn-params-cancel');
                            await cancelButton[0].click();
                            await driver.sleep(500);
                            const rowCount = await gridConditionsObj.getRowCount();
                            if ((rowIndex + 1) === rowCount && !gridConditionsObj.isOnLastPage()) {
                                await gridConditionsObj.clickNext();
                                await driver.sleep(1000);
                            }
                        });


                };

                let baseSelectedParentCondition, selectedParentCondition1, selectedParentCondition2;
                let statementValue;
                let addConditionButtonExists;
                const addNewConditionsRecord = (casesCounter) => {
                    //var addConditionButtonExists;
                    it('conditions grid > check if add condition button exists', async () => {
                        const addConditionBtns = await driver.findElements(By.css('.btn-add-condition'));
                        if (addConditionBtns.length > 0) {
                            addConditionButtonExists = await addConditionBtns[0].isDisplayed();
                        }
                    });

                    //if(!harnessObj.getEnv().includes('aep')) {
                    it('conditions grid > click add condition button', async () => {
                        if (addConditionButtonExists === true) {
                            const elements = await OneStop.findElementsByCSS('.btn-add-condition');
                            await elements[0].click();
                            await driver.sleep(500);
                            OneStop.confirmModalHeader('Add New Condition');
                        }
                    });

                    it('conditions grid > add new condition modal - select first parent condition value', async () => {
                        if (addConditionButtonExists === true) {
                            //1. find 1st element and set up the base value of the 'baseSelectedParentCondition' variable
                            if (casesCounter === 0) {
                                const firstDropDownElement = await driver.findElement(
                                    By.css('select[name="parentCondition"] option:nth-child(2)'));
                                const firstDropDownValue = await firstDropDownElement.getText();
                                baseSelectedParentCondition = firstDropDownValue;   // -> 1 OR 2 OR *

                                //1.1 select the first element from the list - by typing
                                await OneStop.setSelectDropDownValueByCSS('select[name="parentCondition"]',
                                    firstDropDownValue);

                                //1.2 update the value of select record from 1 to 1.100 (or * to *.100)
                                baseSelectedParentCondition = firstDropDownValue + '.100';  //1.100 OR 2.100 OR *.100

                                //2. select the updated 'baseSelectedParentCondition' variable
                                // & update the value of 'selectedParentCondition1' or/and 'selectedParentCondition2'
                                // for later usage
                            } else if (casesCounter > 0) {
                                if (casesCounter === 1) {
                                    await OneStop.setSelectDropDownValueByCSS('select[name="parentCondition"]',
                                        baseSelectedParentCondition);
                                    selectedParentCondition1 = baseSelectedParentCondition + '.' +
                                        casesCounter;    //*.100.1 & *.100.2
                                } else if (casesCounter === 2 || casesCounter === 3) {
                                    await OneStop.setSelectDropDownValueByCSS('select[name="parentCondition"]',
                                        baseSelectedParentCondition + '.1');
                                    selectedParentCondition2 = baseSelectedParentCondition + '.1.' +
                                        (casesCounter - 1);    //*.100.1.1 & *.100.2.1
                                } else if (casesCounter === 4) {
                                    await OneStop.setSelectDropDownValueByCSS('select[name="parentCondition"]',
                                        baseSelectedParentCondition);
                                    selectedParentCondition1 = baseSelectedParentCondition + '.' +
                                        (casesCounter - 2);    //*.100.1 & *.100.2
                                } else {
                                    throw "this is a wrong case, no such item can be selected, casesCounter: " +
                                    casesCounter + '\n' + error;
                                }
                            } else {
                                throw "this is a wrong case, no such item can be selected, casesCounter: " +
                                casesCounter + '\n' + error;
                            }
                        }
                    });

                    it('conditions grid > add new condition modal - type the statement value', async () => {
                        if (addConditionButtonExists === true) {
                            statementValue = 'new test statement added by automation ' +
                                Math.floor((Math.random() * 100) + 1);
                            await OneStop.setTextFieldValueByCSS('textarea[name="statement"]', statementValue);
                        }
                    });

                    it('conditions grid > add new condition modal - click add condition and check for no errors',
                        async () => {
                        if (addConditionButtonExists === true) {
                            //click the Add Condition button
                            const element = await driver.findElement(By.css('.modal-footer .btn-add-condition'));
                            await element.click();
                            await driver.sleep(1000);
                        }
                    });

                    it('conditions grid - check no error is displayed in the bottom right popup', async () => {
                        if (addConditionButtonExists === true) {
                            await OneStop.waitForPageLoad();
                            const elements = await OneStop.findElementsByCSS('.messenger-first .alert.error');
                            if (elements.length > 0) {
                                const element = await driver.findElement(
                                    By.css('.messenger-first .alert.error .messenger-message-inner'));
                                const elementText = await element.getText();
                                throw 'next popup error returned: "' + elementText + '"';
                            }
                        }
                    });
                };

                const checkNewlyAddedConditionExists = (casesCounter) => {
                    it('conditions grid - check the new condition record matches selected values', async () => {
                        if (addConditionButtonExists === true) {
                            //navigate to the last conditions grid page of current conditions
                            await gridConditionsObj.clickLast();
                            let myRowsCounter = await gridConditionsObj.getRowCount();

                            //check that the Number value
                            const elementNumber = await driver.findElement(By.css('.conditions-grid tr:nth-child(' +
                                myRowsCounter + ')>td:nth-child(4)'));
                            const elementNumberText = await elementNumber.getText();
                            if (casesCounter === 0) {
                                //check that the Number value of last created record matches the value of
                                // parentCondition inserted at the creation
                                expect(elementNumberText).to.equal(baseSelectedParentCondition);
                            } else if (casesCounter === 1) {
                                expect(elementNumberText).to.equal(selectedParentCondition1);
                            } else if (casesCounter === 2 || casesCounter === 3) {
                                expect(elementNumberText).to.equal(selectedParentCondition2);
                            } else if (casesCounter === 4) {
                                expect(elementNumberText).to.equal(selectedParentCondition1);
                            } else {
                                throw "this is a wrong case, no such item can be selected, casesCounter: " +
                                casesCounter + '\n' + error;
                            }

                            //check that the Conditions Statement value of last created record matches the value of
                            // parentCondition inserted at the creation
                            const elementConditionsStatement = await driver.findElement(
                                By.css('.conditions-grid tr:nth-child(' + myRowsCounter + ')>td:nth-child(5)'));
                            const elementConditionsStatementValue = await elementConditionsStatement.getText();
                            expect(elementConditionsStatementValue).to.equal(statementValue);
                        }
                    });
                };

                //click on Conditions tab
                OneStop.clickOnTabByText('Conditions', '.condition-tabs.active');

                describe('validate Sections and Conditions grids', () => {

                    //initiate Sections grid first
                    before(async () => {
                        gridSectionsObj = new OneStopGrid('.sections-grid', harnessObj);
                    });

                    //loop through all rows of Sections grid within Section column, get the values,
                    // click View link for each row and
                    // check that the title of the Conditions grid matches the value of the Section
                    // column for which the View was clicked
                    for (let i = 0; i < conditionsTabValues.length; i++) {
                        retrieveSectionValue(i);
                        validateConditionsTitle(i);

                        //loop through all rows of Conditions grid within Conditions Statement column, get the values,
                        // click Parameter link for each row and
                        // check that the content of the Condition Statement grid matches the values retrieved from the
                        // Condition text area
                        for (let j = 0; j < conditionsTabValues[i].conditionStatement.length; j++) {
                            retrieveConditionsStatementValue(conditionsTabValues[i].conditionStatement, j);//, conditionsStatementValues);
                            clickParametersBtn(j);
                            validateConditionsStatementValuesMatch(j);

                            // if (j === (conditionsTabValues[i].conditionStatement.length - 1)) {
                            //     //!!! NOTE - this code below will only work well on a brand new application where there
                            //     // were no new conditions added previously
                            //     //loop through this 5 times so 5 different cases are handled (this is how many we have)
                            //     //will create and check next conditions records
                            //     // *.100 / *.100.1 / *.100.2 / *.100.1.1 / *.100.1.2
                            //     for (let casesCounter = 0; casesCounter < 5; casesCounter++) {
                            //         addNewConditionsRecord(casesCounter);
                            //         checkNewlyAddedConditionExists(casesCounter);
                            //     }
                            // }
                        }
                    }
                });
            });
        } else {
            console.log('There are no values within the Sections & Conditions grids, data array\'s length is: ' +
                conditionsTabValues.length + '\n- nothing to validate');
        }
    };

    return OneStop;
})();

module.exports = OneStop;