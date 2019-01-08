/**
 * Created by cb5rp on 6/1/2017.
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

// const expect = require('chai').expect;

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
    
	//Common Notification functions ------------------------------------------------------------------------------------
	OneStop.pageNotification = (notificationType,
	                                     authorizationType,
	                                     epeaApprovalValue,
	                                     epeaSearchValue,
	                                     epeaContraventionValue,
	                                     cicNumberValue,
	                                     epeaContraventionReasonValue,
	                                     epeaContraventionCommentsValue,
	                                     serviceRigContractorAndRigNumber) => {
		
		//notificationSearchDialog
		const searchByDialog = (searchButtonCss, dialogTitle, searchFieldCss, searchString) => {
			
			it('> click find button', async () => {
				await OneStop.clickElementByCSS(searchButtonCss);
				await OneStop.waitForPageLoad();
			});
			
			OneStop.confirmModalHeader(dialogTitle);
			
			if (searchFieldCss && searchString) {
				it('> ' + dialogTitle + ' dialog - enter search string: ' + searchString, async () => {
					await OneStop.setTextFieldValueByCSS(searchFieldCss, searchString);
				});
			}
			
			it('> ' + dialogTitle + ' dialog - click search button', async () => {
				await OneStop.clickElementByCSS('.modal-body .btn-search');
				await OneStop.waitForPageLoad();
			});
			
			it('> ' + dialogTitle + ' dialog - select first returned result', async () => {
				const elements = await OneStop.getElementsByCSS('.modal-body .search-results .select-one-row-cell input');
                await elements[0].click();
			});
			
			it('> ' + dialogTitle + ' dialog - click add button', async () => {
				await OneStop.clickElementByCSS('.btn-add');
				await OneStop.waitForPageLoad();
				await driver.sleep(500);
			});
		};
		
		describe('notification > ' + notificationType.toLowerCase() + ' notification', () => {
            before(async () => {
                await driver.sleep(waitShort);
                await OneStop.waitForPageLoad();
            });
			
			OneStop.clickTopMenuItems('Operate', notificationType, '#newSubmissionPanelHeading');
			
			it('> set authorizationType as: ' + authorizationType.toLowerCase(), async () => {
				await OneStop.setButtonRadioFieldValueByCSS('*[name="authorizationType"]', authorizationType);
			});
			
			//set the authorization number (search for it - no search parameter / blank)
			searchByDialog('.btn-search-authorization', 'Search By Authorization');//, '#licenseAuthorizationId', 'test');
			
			it('> set epeaApproval: ' + epeaApprovalValue, async () => {
				await OneStop.setButtonRadioFieldValueByCSS('input[name="epeaApproval"]', epeaApprovalValue);
			});
			
			if (epeaApprovalValue === 'Y') {
				it('> wait for epea approval fields to be displayed', async () => {
					await OneStop.waitForObjectLoad('.btn-search-epea', waitLong, 500, true);
				});
				
				searchByDialog('.btn-search-epea', 'Search By EPEA Approval ID', '#epeaApprovalId', epeaSearchValue);
				
				it('> set epeaContravention: ' + epeaContraventionValue, async () => {
					await OneStop.setButtonRadioFieldValueByCSS('*[name="epeaContravention"]', epeaContraventionValue);
				});
				
				if (epeaContraventionValue === 'Y') {
					it('> set cicNumberValue: ' + cicNumberValue, async () => {
						await OneStop.setTextFieldValueByCSS('*[name="cicNumber"]', cicNumberValue);
					});
					
					it('> set epeaContraventionReason: ' + epeaContraventionReasonValue, async () => {
						await OneStop.setSelectFieldValueByCSS('*[name="epeaContraventionReason"]', epeaContraventionReasonValue);
					});
					
					it('> set epeaContraventionCommentsYes: ' + epeaContraventionCommentsValue, async () => {
						await OneStop.setTextFieldValueByCSS('*[name="epeaContraventionCommentsYes"]', epeaContraventionCommentsValue);
					});
				} else if (epeaContraventionValue === 'N')  {
					it('> set epeaContraventionCommentsNo ' + epeaContraventionCommentsValue, async () => {
						await OneStop.setTextFieldValueByCSS('*[name="epeaContraventionCommentsNo"]', epeaContraventionCommentsValue);
					});
				}
			}
			
			if (authorizationType === 'WELL') {
				// setting this here because another function is used to fill in the Details
				// section and it does not know about the type
				it('> set service rig contractor and rig number in the details section: ' +
					serviceRigContractorAndRigNumber, async () => {
					await OneStop.setTextFieldValueByCSS('*[name="serviceRigNumber"]', serviceRigContractorAndRigNumber);
				});
			}
		});
	};
	
	OneStop.pageNotificationComments = (commentsValue) => {
		describe('notification > comments', () => {
			it('> set comments: ' + commentsValue, async () => {
				await OneStop.setTextFieldValueByCSS('*[name="comments"]', commentsValue);
			});
		});
	};
	
	OneStop.pageNotificationValidateAndSubmit = () => {
		describe('notification > save and submit', () => {
			OneStop.validateAndReport('#validate');
			OneStop.acceptDisclaimer('#disclaimer', '.btn-success');

			it('> click submit', async () => {
				await driver.sleep(waitShort);
				await OneStop.clickElementByCSS('#submit');
				await OneStop.waitForPageLoad();
			});
			
			OneStop.confirmSubmission('Declaration and Disclaimer', 'yes');
			
			OneStop.confirmModalHeader('Submitted Notification');
			
			it('> save notification number', async () => {
				const text = await OneStop.getElementValueByCSS('.modal-info-message');
                let srchStr = 'notification number is ';
                let index = text.search(srchStr);
                let index2 = text.search(',');
                let id = text.slice(index + srchStr.length, index2);
                harnessObj.addApplicationToJSON(id);
			});
			
			//close the submission notification
			it('> close submission notification dialog', async () => {
				await OneStop.clickElementByCSS('.btn-close');
				await OneStop.waitForPageLoad();
			});
		});
	};
	
	//Flaring Notification functions -----------------------------------------------------------------------------------
    OneStop.pageNotificationFlaringGeneralInformation = (licenseeContactNameValue, licenseePhoneNumberValue) => {
        describe('notification > general information', () => {
            it('> set licensee contact name: ' + licenseeContactNameValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="licenseeContactName"]', licenseeContactNameValue);
            });

            it('> set licensee phone number: ' + licenseePhoneNumberValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="licenseePhoneNumber"]', licenseePhoneNumberValue);
            });
        });
    };

    OneStop.pageNotificationFlaringDetails = (estimatedVolumeValue,
                                                estimatedDurationValue,
                                                maxRateValue,
                                                flaringReasonValue,
                                                h2sConcentrationValue,
                                                h2sUnitValue,
                                                startDateValue,
                                                startTimeValue,
                                                endDateValue,
                                                endTimeValue,
                                                publicInNotificationZone,
                                                publicHasBeenNotified,
                                                residentObjections,
                                                flareApprovalNumber) => {
        describe('notification > flaring details', () => {
            it('> set estimatedVolume: ' + estimatedVolumeValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="estimatedVolume"]', estimatedVolumeValue);
            });

            it('> set estimatedDuration: ' + estimatedDurationValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="estimatedDuration"]', estimatedDurationValue);
            });

            it('> set maxRate: ' + maxRateValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="maxRate"]', maxRateValue);
            });

            it('> set flaringReason: ' + flaringReasonValue, async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="flaringVentingReason"]', flaringReasonValue);
            });

            it('> set h2sConcentration: ' + h2sConcentrationValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="h2sConcentration"]', h2sConcentrationValue);
            });

            it('> set h2sUnit: ' + h2sUnitValue, async () => {
                await OneStop.setSelectFieldValueByCSS('*[name="h2sUnit"]', h2sUnitValue);
            });

            it('> set startDate: ' + startDateValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="startDate"]', startDateValue);
            });

            it('> set startTime: ' + startTimeValue, async () => {
                await OneStop.setTimeFieldValueByID('startTime', startTimeValue);
            });

            it('> set endDate: ' + endDateValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="endDate"]', endDateValue);
            });

            it('> set endTime: ' + endTimeValue, async () => {
                await OneStop.setTimeFieldValueByID('endTime', endTimeValue);
            });
            
            //public notification zone
	        it('> set publicIsWithinNotificationZone: ' + publicInNotificationZone, async () => {
		        await OneStop.setButtonRadioFieldValueByCSS('*[name="publicNotificationZone"]', publicInNotificationZone);
	        });
	        
            if (publicInNotificationZone === 'Y') {
                it('> set publicNotified: ' + publicHasBeenNotified, async () => {
		            await OneStop.setButtonRadioFieldValueByCSS('*[name="publicNotified"]', publicHasBeenNotified);
	            });
	            
	            if (publicHasBeenNotified === 'Y') {
		            it('> set residentObjections: ' + residentObjections, async () => {
			            await OneStop.setButtonRadioFieldValueByCSS('*[name="residentObjections"]', residentObjections);
		            });
	            }
            }

            it('> set flareApprovalNumber: ' + flareApprovalNumber, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="flareApprovalNumber"]', flareApprovalNumber);
            });
        });
    };
	
    //Venting Notification functions -----------------------------------------------------------------------------------
	OneStop.pageNotificationVentingGeneralInformation = (companyContactNameValue,
	                                                              companyPhoneNumberValue) => {
		describe('notification > general information', () => {
			it('> set company contact name: ' + companyContactNameValue, async () => {
				await OneStop.setTextFieldValueByCSS('*[name="companyContactName"]', companyContactNameValue);
			});
			
			it('> set company phone number: ' + companyPhoneNumberValue, async () => {
				await OneStop.setTextFieldValueByCSS('*[name="companyContactPhoneNumber"]', companyPhoneNumberValue);
			});
		});
	};
	
	OneStop.pageNotificationVentingDetails = (estimatedVolumeValue,
	                                                   estimatedDurationValue,
	                                                   maxRateValue,
	                                                   ventingReasonValue,
	                                                   h2sConcentrationValue,
	                                                   h2sUnitValue,
	                                                   startDateValue,
	                                                   startTimeValue,
	                                                   endDateValue,
	                                                   endTimeValue,
	                                                   publicInNotificationZone,
	                                                   publicHasBeenNotified,
	                                                   residentObjections) => {
		describe('notification > venting details', () => {
			it('> set estimatedVolume: ' + estimatedVolumeValue, async () => {
				await OneStop.setTextFieldValueByCSS('*[name="estimatedVolume"]', estimatedVolumeValue);
			});
			
			it('> set estimatedDuration: ' + estimatedDurationValue, async () => {
				await OneStop.setTextFieldValueByCSS('*[name="estimatedDuration"]', estimatedDurationValue);
			});
			
			it('> set maxRate: ' + maxRateValue, async () => {
				await OneStop.setTextFieldValueByCSS('*[name="maxRate"]', maxRateValue);
			});
			
			it('> set ventingReason: ' + ventingReasonValue, async () => {
				await OneStop.setSelectFieldValueByCSS('*[name="flaringVentingReason"]', ventingReasonValue);
			});

            it('> set h2sConcentration: ' + h2sConcentrationValue, async () => {
                await OneStop.setTextFieldValueByCSS('*[name="h2sConcentration"]', h2sConcentrationValue);
                await OneStop.clickElementByCSS('*[name="h2sUnit"]'); // clicking away so we bring the warning dialog
                await driver.sleep(500);
            });

            OneStop.confirmAlertDialog('Notify Coordination Information Centre (CIC) immediately, if you have not already done so!');

            it('> set h2sUnit: ' + h2sUnitValue, async () => {
                await driver.sleep(500);
                await OneStop.setSelectFieldValueByCSS('*[name="h2sUnit"]', h2sUnitValue);
            });
			
			it('> set startDate: ' + startDateValue, async () => {
				await OneStop.setTextFieldValueByCSS('*[name="startDate"]', startDateValue);
			});
			
			it('> set startTime: ' + startTimeValue, async () => {
				await OneStop.setTimeFieldValueByID('startTime', startTimeValue);
			});
			
			it('> set endDate: ' + endDateValue, async () => {
				await OneStop.setTextFieldValueByCSS('*[name="endDate"]', endDateValue);
			});
			
			it('> set endTime: ' + endTimeValue, async () => {
				await OneStop.setTimeFieldValueByID('endTime', endTimeValue);
			});
			
			//public notification zone
			it('> set publicIsWithinNotificationZone: ' + publicInNotificationZone, async () => {
				await OneStop.setButtonRadioFieldValueByCSS('*[name="publicNotificationZone"]', publicInNotificationZone);
			});
			
			if (publicInNotificationZone === 'Y') {
				it('> set publicNotified: ' + publicHasBeenNotified, async () => {
					await OneStop.setButtonRadioFieldValueByCSS('*[name="publicNotified"]', publicHasBeenNotified);
				});
				
				if (publicHasBeenNotified === 'Y') {
					it('> set residentObjections: ' + residentObjections, async () => {
						await OneStop.setButtonRadioFieldValueByCSS('*[name="residentObjections"]', residentObjections);
					});
				}
			}
		});
	};

    return OneStop;
})();

module.exports = OneStop;
