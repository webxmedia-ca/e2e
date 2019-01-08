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

    let webDriver = null
        , driver = null
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

//>>>>>> METHANE / BENZENE EMISSIONS >>>>>>-----------------------------------------------------------------------------
    OneStop.pageMethaneBenzeneEmissionsNewSubmission = (openApplication, submissionType) => {
    //this function is used to open the Methane / Benzene pages
        describe('navigate to create a new ' + submissionType + ' emissions submission', () => {
            if (openApplication) {
                OneStop.openApplicationByLink();
            }
	
	        describe('navigate to emissions reporting page', () => {
		        // OneStop.clickTopMenuItems('Operate', 'Methane Emissions', '#submissionsPanelHeading');
		        OneStop.clickTopMenuItems('Operate', 'Emissions Reporting', '#peaceRiverType');
	        });
	
	        describe('navigate to emissions reporting > ' + submissionType + ' emissions tab', () => {
	            if (submissionType === 'methane') {
		            //navigate to leftside Emissions - Methane tab
		            OneStop.clickLeftSideMenuItems('emissionsReportingTab:methaneEmissions',
			            '#step-row-methaneEmissions.active-step-row');
		            
		            ///////////cannot continue because the 'Search/Create New Submission' btn is not working
		            it(submissionType + ' submissions > click search/create new submission button', async () => {
			            await OneStop.clickElementByCSS('#createSubmission');
			            await OneStop.waitForObjectLoad('#step-row-methaneEmissions.active-step-row', waitLong * 3, 500, true);
			            await OneStop.waitForPageLoad();
		            });
                } else if (submissionType === 'benzene') {
		            //navigate to leftside Emissions - Benzene tab
		            OneStop.clickLeftSideMenuItems('emissionsReportingTab:benzeneEmissions',
			            '#step-row-benzeneEmissions.active-step-row');
		            it(submissionType + ' submissions > click search/create new submission button', async () => {
			            await OneStop.clickElementByCSS('#createSubmission');
			            await OneStop.waitForPageLoad();
			            await OneStop.waitForObjectLoad('#step-row-benzeneEmissions.active-step-row', waitLong * 3, 500, true);
		            });
	            } else {
	                throw submissionType + ' is not an option';
                }
	        });
        });
    };
	
	OneStop.pageManualEntryDehydrators = (dehydratorValues) => {
		describe('manual entry > dehydrators', () => {
			
			OneStop.clickLeftSideMenuItems('manualEntryTab');
			
			it('if reporting period has already been submitted click the amend submission button', async () => {
				await driver.sleep(500);
				const elements = await OneStop.findElementsByCSS('.modal-dialog');
				if (elements.length > 0) {
					await OneStop.clickElementByCSS('button[class*=amend]:not([style*="none"])');
					await OneStop.waitForPageLoad();
				}
			});
			
			OneStop.clickLeftSideMenuItems('manualEntryTab:dehydrators', '#dehydratorsPanelHeading');
			
			//***************************** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *****************************
			//next piece - might be available only for benzene - cannot check the difference with the methane as it
			// is not working for now
			// NOTE: there is no Add btn in the methane's Recent Submissions grid
            describe('add a new dehydrators row', () => {
	            it('click the add row button within the dehydrators grid', async () => {
                    await OneStop.clickElementByCSS('.btn-add-row');
		            await OneStop.waitForPageLoad();
	            });
	
	            // const authorizationId = facilityInformationValues[0];
	            // const facilityId = facilityInformationValues[1];
	            describe('validate correct data is displayed', () => {
	            	//validate the modal is loaded
		            OneStop.confirmModalHeader('Individual Dehydrator Inventory Form');
		            
		            it('the authorization id is the correct one', async () => {
			            const element = await driver.findElement(By.css('input[name="authorizationAliasId"]'));
			            const elementValue = await element.getAttribute('value');
			            expect(elementValue).to.equal(facilityInformationValues[0]);
		            });
		            
	                it('the facility id is the correct one', async () => {
			            const element = await driver.findElement(By.css('input[name="reportingFacility"]'));
			            const elementValue = await element.getAttribute('value');
			            expect(elementValue).to.equal(facilityInformationValues[1]);
		            });
	            });
// !!!!!!!!!!!!! the step(s) -- not sure this should be part of methane yet - app not working, cannot check
	            describe('fill in the form individual dehydrator inventory form', () => {
		            const uniqueSiteId = dehydratorValues.uniqueSiteId + (Math.floor((Math.random() * 100) + 1));
		            it('type the unique site id field as ' + uniqueSiteId, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="siteId"]', uniqueSiteId);
		            });
		
		            const uniqueDehydratorId = dehydratorValues.uniqueHydratorId + (Math.floor((Math.random() * 1000) + 1));
		            it('type the unique dehydrator id field as ' + uniqueDehydratorId, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="glycolDehydratorSerial"]', uniqueDehydratorId);
		            });
		
		            let nrOfDehydratorsOnSite = dehydratorValues.nrOfDehydratorsOnSite;
		            it('type the number of dehydrators on site field as ' + dehydratorValues.nrOfDehydratorsOnSite, async () => {
		            	if(dehydratorValues.nrOfDehydratorsOnSite) {
				            await OneStop.setTextFieldValueByCSS('input[name="countDehydOnSite"]', nrOfDehydratorsOnSite);
			            } else {
				            nrOfDehydratorsOnSite = Math.floor((Math.random() * 9) + 1);
				            await OneStop.setTextFieldValueByCSS('input[name="countDehydOnSite"]', nrOfDehydratorsOnSite);
			            }
		            });
		
		            //// location fields
		            it('type the surface location lsd field as ' + dehydratorValues.surfaceLocationValues.subdivision, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="legalLandDescription[subdivision]"]',
				            dehydratorValues.surfaceLocationValues.subdivision);
		            });
		
		            it('type the surface location sec field as ' + dehydratorValues.surfaceLocationValues.section, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="legalLandDescription[section]"]',
				            dehydratorValues.surfaceLocationValues.section);
		            });
		
		            it('type the surface location twp field as ' + dehydratorValues.surfaceLocationValues.township, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="legalLandDescription[township]"]',
				            dehydratorValues.surfaceLocationValues.township);
		            });
		
		            it('type the surface location rge field as ' + dehydratorValues.surfaceLocationValues.range, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="legalLandDescription[range]"]',
				            dehydratorValues.surfaceLocationValues.range);
		            });
		
		            it('type the surface location m field as ' + dehydratorValues.surfaceLocationValues.meridian, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="legalLandDescription[meridian]"]',
				            dehydratorValues.surfaceLocationValues.meridian);
		            });
		
		            it('type the distance to nearest surface development field as ' +
			            dehydratorValues.distanceToNearestSurfaceDevelopment, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="distanceToNearSurfaceDev"]',
				            dehydratorValues.distanceToNearestSurfaceDevelopment);
		            });
		
		            it('set the notification completed to ' + dehydratorValues.notificationCompleted, async () => {
			            await OneStop.setSelectDropDownValueByCSS('select[name="notificationInd"]',
				            dehydratorValues.notificationCompleted);
		            });
		
		            it('set the installation type to ' + dehydratorValues.installationType, async () => {
			            await OneStop.setSelectDropDownValueByCSS('select[name="installationType"]',
				            dehydratorValues.installationType);
		            });
		
		            it('set the process type to ' + dehydratorValues.processType, async () => {
			            await OneStop.setSelectDropDownValueByCSS('select[name="processType"]',
				            dehydratorValues.processType);
		            });
		
		            it('set the dehydrator operating status to ' + dehydratorValues.dehydratorOperatingStatus, async () => {
			            await OneStop.setSelectDropDownValueByCSS('select[name="operatingStatus"]',
				            dehydratorValues.dehydratorOperatingStatus);
		            });
		
		            it('set the year of installation or relocation to ' + dehydratorValues.yearOfInstallationOrRelocation, async () => {
			            await OneStop.setSelectDropDownValueByCSS('#installationDate',
				            dehydratorValues.yearOfInstallationOrRelocation);
		            });
		
		            it('type the site limit where multiple dehydrators on site as ' +
			            dehydratorValues.siteLimitWhereMultipleDehydratorsOnSite, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="benzeneSiteLimit"]',
				            dehydratorValues.siteLimitWhereMultipleDehydratorsOnSite);
		            });
		
		            it('type the gas flow rate to dehydrators on site as ' + dehydratorValues.gasFlowRateToDehydrator, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="gasFlowRate"]',
				            dehydratorValues.gasFlowRateToDehydrator);
		            });
		
		            it('type the glycol circulation rate as ' + dehydratorValues.glycolCirculationRate, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="glycolCirculationRate"]',
				            dehydratorValues.glycolCirculationRate);
		            });
		
		            it('type the wet gas water content as ' + dehydratorValues.wetGasWaterContent, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="wetGasWaterContent"]',
				            dehydratorValues.wetGasWaterContent);
		            });
		
		            it('type the benzene concentration (dehydrator inlet gas) as ' + dehydratorValues.benzeneConcentration, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="benzeneConcentration"]',
				            dehydratorValues.benzeneConcentration);
		            });
		
		            it('type the number of operating days as ' + dehydratorValues.nrOfOperatingDays, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="numberOfOperatingDays"]',
				            dehydratorValues.nrOfOperatingDays);
		            });
		
		            it('type the methane emissions as ' + dehydratorValues.methaneEmissions, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="methaneMass"]', dehydratorValues.methaneEmissions);
		            });
		
		            it('type the annual benzene emissions before control as ' + dehydratorValues.annualBenzeneEmissionsBeforeControl, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="benzeneEmissionBeforeControl"]',
				            dehydratorValues.annualBenzeneEmissionsBeforeControl);
		            });
		
		            it('type the annual benzene emissions after control as ' + dehydratorValues.annualBenzeneEmissionsAfterControl, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="benzeneEmissionAfterControl"]',
				            dehydratorValues.annualBenzeneEmissionsAfterControl);
		            });
		
		            it('type the cumulative benzene emissions for multiple dehydrators on site as ' +
			            dehydratorValues.cumulativeBenzeneEmissionsForMultipleDehydratorsOnSite, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="benzeneSiteCumulativeEmission"]',
				            dehydratorValues.cumulativeBenzeneEmissionsForMultipleDehydratorsOnSite);
		            });
		
		            if (dehydratorValues.primaryControl !== 'No Control') {
			            //1. primary control
			            //select the primary control value in the dropdown
			            it('set the primary control to ' + dehydratorValues.primaryControl, async () => {
				            await OneStop.setSelectDropDownValueByCSS('select[name="primaryDehydControl"]',
					            dehydratorValues.primaryControl);
			            });
			
			            //type the efficiency %
			            it('type the primary efficiency % as ' + dehydratorValues.primaryControlEfficiency, async () => {
				            await OneStop.setTextFieldValueByCSS('input[name="primaryDehydControlEfficiency"]',
					            dehydratorValues.primaryControlEfficiency);
			            });
			
			            // if Other then type the Other Control
			            if (dehydratorValues.primaryControl === 'Other') {
				            it('type the describe other primary control as ' + dehydratorValues.primaryControlOther, async () => {
					            await OneStop.setTextFieldValueByCSS('textarea[name="primaryOtherControl"]',
						            dehydratorValues.primaryControlOther);
				            });
			            }
			
			            if (dehydratorValues.secondaryControl) {
				            //2. secondary control
				            //select the secondary control value in the dropdown
				            it('set the secondary control to ' + dehydratorValues.secondaryControl, async () => {
					            await OneStop.setSelectDropDownValueByCSS('select[name="secondaryDehydControl"]',
						            dehydratorValues.secondaryControl);
				            });
				
				            //type the efficiency %
				            it('type secondary efficiency % as ' + dehydratorValues.secondaryControlEfficiency, async () => {
					            await OneStop.setTextFieldValueByCSS('input[name="secondaryDehydControlEfficiency"]',
						            dehydratorValues.secondaryControlEfficiency);
				            });
				
				            // if Other then type the Other Control
				            if (dehydratorValues.secondaryControl === 'Other') {
					            it('type the describe other secondary control as ' + dehydratorValues.secondaryControlOther, async () => {
						            await OneStop.setTextFieldValueByCSS('textarea[name="secondaryOtherControl"]',
							            dehydratorValues.secondaryControlOther);
					            });
				            }
				
				            //3. third control
				            //select the third control value in the dropdown
				            it('set the third control to ' + dehydratorValues.thirdControl, async () => {
					            await OneStop.setSelectDropDownValueByCSS('select[name="thirdDehydControl"]',
						            dehydratorValues.thirdControl);
				            });
				
				            //type the efficiency %
				            it('type third efficiency % as ' + dehydratorValues.thirdControlEfficiency, async () => {
					            await OneStop.setTextFieldValueByCSS('input[name="thirdDehydControlEfficiency"]',
						            dehydratorValues.thirdControlEfficiency);
				            });
				
				            // if Other then type the Other Control
				            if (dehydratorValues.thirdControl === 'Other') {
					            it('type the describe other third control as ' + dehydratorValues.thirdControlOther, async () => {
						            await OneStop.setTextFieldValueByCSS('textarea[name="thirdOtherControl"]',
							            dehydratorValues.thirdControlOther);
					            });
				            }
			            }
		            }
		            
		            if (dehydratorValues.emissionDeterminationMethod.massBalance === 'Yes') {
			            it('select the emission determination methods as mass balance - ' +
				            dehydratorValues.emissionDeterminationMethod.massBalance, async () => {
				            await OneStop.setButtonCheckboxByCSS('input[name="MASS_BALANCE"]');
			            });
		            }
		
		            if (dehydratorValues.emissionDeterminationMethod.simulationTool === 'Yes') {
			            it('select the emission determination methods as simulation tool - ' +
				            dehydratorValues.emissionDeterminationMethod.simulationTool, async () => {
				            await OneStop.setButtonCheckboxByCSS('input[name="GRI_GLYCALC"]');
			            });
		            }
		
		            if (dehydratorValues.emissionDeterminationMethod.stackSampling === 'Yes') {
			            it('select the emission determination methods as stack sampling - ' +
				            dehydratorValues.emissionDeterminationMethod.stackSampling, async () => {
				            await OneStop.setButtonCheckboxByCSS('input[name="STOCK_SAMPLING"]');
			            });
		            }
		
		            if (dehydratorValues.emissionDeterminationMethod.totalCaptureTesting === 'Yes') {
			            it('select the emission determination methods as total capture testing - ' +
				            dehydratorValues.emissionDeterminationMethod.totalCaptureTesting, async () => {
				            await OneStop.setButtonCheckboxByCSS('input[name="TCT"]');
			            });
		            }
		
		            it('type the date of emissions testing or stack sampling as ' +
			            dehydratorValues.dateOfEmissionsTestingOrStackSampling, async () => {
			            await OneStop.setTextFieldValueByCSS('input[name="lastEmissionSiteTestDate"]',
				            dehydratorValues.dateOfEmissionsTestingOrStackSampling);
		            });
		
		            it('type the comments as ' + dehydratorValues.comments, async () => {
			            await OneStop.setTextFieldValueByCSS('textarea[name="benzeneComment"]', dehydratorValues.comments);
		            });
		
		            it('click the calculate benzene limits button', async () => {
			            await OneStop.clickElementByCSS('#calculateBenzeneLimitsButton');
			            await OneStop.waitForPageLoad();
		            });
		            
		            //calculate results section is auto-populated based on given data and directive 039
		            it('----- NOT YET DONE --- mass methane-emissions-manual (tonnes) value is correct', async () => {
			            //Dehydrator data for all submissions is entered through Directive 039
			            //the values come from when a benzene-emissions-manual emissions is created
			            console.log('Dehydrator data for all submissions is entered through Directive 039');
		            });
		
		            it('----- NOT YET DONE --- total volume (e3m3) value is correct', async () => {
			            //Dehydrator data for all submissions is entered through Directive 039
			            //the values come from when a benzene-emissions-manual emissions is created
			            console.log('Dehydrator data for all submissions is entered through Directive 039');
		            });
		
		            it('click the add dehydrator button', async () => {
			            await OneStop.clickElementByCSS('.btn-save-dehydrator');
			            await OneStop.waitForPageLoad();
			            //check if the dialog is gone
			            await driver.sleep(1000);
			            const elements = await driver.findElements(By.css('.modal-dialog'));
			            if (elements.length > 0) {
			            	throw 'the modal dialog is still displayed, it seems there are validation errors so it did not close'
			            }
		            });
		            
		            //check the new dehydrator is displayed in the dehydrators grid
		            //facilityId                -   #dehydratorGrid tbody>tr:nth-child(1)>td.reportingFacility
		            //uniqueSiteId              -   #dehydratorGrid tbody>tr:nth-child(1)>td.siteId
		            //uniqueDehydratorId        -   #dehydratorGrid tbody>tr:nth-child(1)>td.glycolDehydratorSerial
		            //nrOfDehydratorsOnSite     -   #dehydratorGrid tbody>tr:nth-child(1)>td.countDehydOnSite
		            let createdDehydratedRowNr;
		            it('facility id & uniques site id are displayed in the dehydrators grid', async () => {
		            	for (let i = 0; i < 10; i++) {
				            const elementFacilityId = await driver.findElement(By.css('#dehydratorGrid tbody>tr:nth-child(' +
					            (i + 1) + ')>td.reportingFacility'));
				            const facilityIdText = await elementFacilityId.getText();
				            const elementUniqueSiteId = await driver.findElement(By.css('#dehydratorGrid tbody>tr:nth-child(' +
					            (i + 1) + ')>td.siteId'));
				            const uniqueSiteIdText = await elementUniqueSiteId.getText();
				            
				            if (facilityIdText === facilityInformationValues[1] && uniqueSiteIdText === uniqueSiteId) {
					            expect(facilityIdText).to.equal(facilityInformationValues[1]);
					            expect(uniqueSiteIdText).to.equal(uniqueSiteIdText);
					
					            createdDehydratedRowNr = i + 1; //the row nr containing the created record
					            i = 10;
					            break;
				            } else if (i === 10 && facilityIdText !== facilityInformationValues[1] && uniqueSiteIdText !== uniqueSiteId) {
				            	throw "created dehydrator not found \n facilityId: " +  facilityInformationValues[1] +
					            "\n uniquesSiteId: " + uniqueSiteIdText;
				            }
			            }
		            });
		
		            it('uniques dehydrator id is displayed in the dehydrators grid', async () => {
			            const elementUniqueDehydratorId = await driver.findElement(By.css('#dehydratorGrid tbody>tr:nth-child(' +
				            (createdDehydratedRowNr) + ')>td.glycolDehydratorSerial'));
			            const uniqueDehydratorIdText = await elementUniqueDehydratorId.getText();
			            expect(uniqueDehydratorIdText).to.equal(uniqueDehydratorId);
		            });
		
		            it('number of dehydrators is displayed in the dehydrators grid', async () => {
			            const elementNrOfDehydratorsOnSiteText = await driver.findElement(By.css('#dehydratorGrid tbody>tr:nth-child(' +
				            (createdDehydratedRowNr) + ')>td.countDehydOnSite'));
			            const nrOfDehydratorsOnSiteText = await elementNrOfDehydratorsOnSiteText.getText();
			            expect(nrOfDehydratorsOnSiteText).to.equal(nrOfDehydratorsOnSite);
		            });
	            });
	
	            describe('save and validate that no errors are displayed', () => {
		            OneStop.clickSave();
	            });
            });
			//***************************** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *****************************
		});
	};
//<<<<<< METHANE / BENZENE EMISSIONS <<<<<<-----------------------------------------------------------------------------


//>>>>>> METHANE EMISSIONS >>>>>>---------------------------------------------------------------------------------------
    /*
    OneStop.createNewMethaneSubmissionEmissions = (methaneValues) => {
	    /*var amendmentType = appType.split('-')[1];
			amendmentType = amendmentType.replace(/\w\S*!/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});*/
    /*
	    OneStop.pageEmissionReportingMethaneEmissions(false, methaneValues);
	    OneStop.pageManualEntryFacilityInformation(false);
	
	    if (methaneValues[0].reportingFormat === 'Manual Entry') {
		    OneStop.pageManualEntryDehydrators(false);  //this one is not done
		    OneStop.pageManualEntryTanks(false, methaneValues[0].manualEntries.tanks);
		    OneStop.pageManualEntryRoutineVenting(false, methaneValues[0].manualEntries.routineVenting);
		    OneStop.pageManualEntryCompressors(false, methaneValues[0].manualEntries.compressors);
		    OneStop.pageManualEntryFugitives(false, methaneValues[0].manualEntries.fugitives);
		    OneStop.pageFleetCalculations(false);
	    } else if (methaneValues[0].reportingFormat === 'CSV Upload') {
		    OneStop.pageBulkLoadCompressor(false);
		    //--->
		    OneStop.pageFleetCalculations(false);
	    } else {
		    throw 'methane-emissions-manual - chosen ' + methaneValues[0].reportingFormat +
		    ' reporting format is wrong, only "Manual Entry" either "CSV Upload" options are available';
	    }
    };
    */
    
    let facilityInformationValues = []; //this array is filled in through 'pageEmissionReportingMethaneEmissions' and/or
    // 'pageEmissionReportingBenzeneEmissions' used within 'pageManualEntryFacilityInformation'
    OneStop.pageEmissionReportingMethaneEmissionsManual = (emissionValues) => {
        describe('emissions reporting > methane emissions', () => {

            it('select reporting format - ' + emissionValues.reportingFormat, async () => {
                await OneStop.setSelectFieldValueByCSS('#reportingFormat', emissionValues.reportingFormat);
            });

            if (emissionValues.reportingFormat === 'Manual Entry') {
                let reportingYear = emissionValues.manualEntries.methaneEmissions.reportingYear;
                let reportingFacility = emissionValues.manualEntries.methaneEmissions.reportingFacilityId;
                reportingFacility = reportingFacility ? emissionValues.manualEntries.methaneEmissions.reportingFacilityId : '1';
                //console.log(reportingFacility);

                it('select reporting year > ' + reportingYear, async () => {
                    await OneStop.setSelectFieldValueByCSS('#reportingPeriod', reportingYear);
                });

                it('set reporting facility > click search button', async () => {
                    //click Search btn
                    await OneStop.clickElementByCSS('#addReportingFacility');
                    await OneStop.waitForPageLoad();
                });

                OneStop.confirmModalHeader('Reporting Facility Search');    //or Authorization Search (for benzene-emissions-manual)

                it('set reporting facility > modal - type the facility id: ' + reportingFacility, async () => {
                    await OneStop.setTextFieldValueByCSS('input[name="facilityId"]', reportingFacility);
                });

                it('set reporting facility > modal - click search button', async () => {
                    await OneStop.clickElementByCSS('.btn-search');
                    await OneStop.waitForPageLoad();
                });

                if (reportingFacility !== '1') {
                    it('set reporting facility > modal - the record ' + reportingFacility + ' was found', async () => {
                            const element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td.facilityId'));
                            const elementText = await element.getText();
                            expect(elementText).to.equal(reportingFacility);
                        });
                }

                it('set reporting facility > modal - select first returned record', async () => {
                    const element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td>input'));
                    element.click();
                });

                it('store the attributes of selected record for later usage', async () => {
                    //1st clear the array in case it contains older values:
                    if (facilityInformationValues.length > 0) {
                        for (let i = facilityInformationValues.length; i === 0; i--) {
                            facilityInformationValues.pop();
                            // temp ---
                            console.log('array is clean: ' + facilityInformationValues);
                            console.log('array length: ' + facilityInformationValues.length);
                            // temp ---
                        }
                    }

                    //get the authorizationId, facilityId, facilityName, facilityType and facilitySubType
	                //retrieve the value of authorizationId:
	                let element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(3)'));
	                let elementText = await element.getText();
	                facilityInformationValues.push(elementText);
                    
                    //retrieve the value of facilityId:
                    element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(5)'));
                    elementText = await element.getText();
                    facilityInformationValues.push(elementText);

                    //retrieve the value of facilityName:
                    element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(6)'));
                    elementText = await element.getText();
                    facilityInformationValues.push(elementText);
	
	                //retrieve the value of facilityType:
	                element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(7)'));
	                elementText = await element.getText();
	                facilityInformationValues.push(elementText);
                    
                    //retrieve the value of facilitySubType:
                    element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(8)'));
                    elementText = await element.getText();
                    facilityInformationValues.push(elementText);
                });

                it('set reporting facility > modal - click select reporting facility button', async () => {
                    await OneStop.clickElementByCSS('.btn-select-reporting-facility');
                    await OneStop.waitForPageLoad();
                });
	
	            describe('save and validate that no errors are displayed', () => {
		            OneStop.clickSave();
	            });
            } else if (emissionValues.reportingFormat === 'CSV Upload') {

                //add the code for CSV Uploads - probably a call to a separate function
	
	            describe('save and validate that no errors are displayed', () => {
		            OneStop.clickSave();
	            });
            } else {
                throw 'chosen ' + emissionValues.reportingFormat +
                ' reporting format is wrong, only "Manual Entry" either "CSV Upload" options are available';
            }
        });
    };

    OneStop.pageManualEntryFacilityInformation = () => {
        describe('manual entry > facility information', () => {
            //click Next button after Save and Validate is done
            it('new submission - click next button', async () => {
                await OneStop.clickElementByCSS('.btn-next');
                await OneStop.waitForPageLoad();
            });

            //--- this will replace the leftTab clicking functionality above when it is fixed (Manual Entry is hidden now)
            //navigate to left side Manual Entry - Facility Information tab
            //OneStop.clickLeftSideMenuItems('manualEntryTab:facilityInfo', '#facilityInfoPanelHeading');

            it('the facility id is the correct one', async () => {
                const element = await driver.findElement(By.css('input[name="reportingFacility"]'));
                const elementValue = await element.getAttribute('value');
                expect(elementValue).to.equal(facilityInformationValues[0]);
            });

            it('the reporting facility name is the correct one', async () => {
                const element = await driver.findElement(By.css('input[name="reportingFacilityName"]'));
                const elementValue = await element.getAttribute('value');
                expect(elementValue).to.equal(facilityInformationValues[1]);
            });

            it('the reporting facility sub-type is the correct one', async () => {
                const element = await driver.findElement(By.css('input[name="reportingFacilitySubType"]'));
                const elementValue = await element.getAttribute('value');
                expect(elementValue).to.equal(facilityInformationValues[2]);
            });
	
	        describe('save and validate that no errors are displayed', () => {
		        OneStop.clickSave();
	        });
        });
    };

    OneStop.pageManualEntryTanks = (openApplication, tankValues) => {
        describe('manual entry > tanks', () => {
            OneStop.clickLeftSideMenuItems('manualEntryTab:tanks', '#tanksPanelHeading');

            it('> type the mass methane-emissions-manual (tonnes) value: ' + tankValues.massMethane, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="tankMass"]', tankValues.massMethane);
            });

            it('> type the total volume (e3m3) value: ' + tankValues.totalVolume, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="tankVolume"]', tankValues.totalVolume);
            });
	
	        describe('save and validate that no errors are displayed', () => {
		        OneStop.clickSave();
	        });
        });
    };

    OneStop.pageManualEntryRoutineVenting = (openApplication, routineVentingValues) => {
        describe('manual entry > routine venting', () => {

            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            OneStop.clickLeftSideMenuItems('manualEntryTab:routineVenting', '#routineVentingPanelHeading');

            it('> cumulative mass and volume section - type the mass methane-emissions-manual (tonnes) value: ' +
                routineVentingValues.massMethane, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="routineVentMass"]',
                    routineVentingValues.massMethane);
            });

            it('> cumulative mass and volume section - type the total volume (e3m3) value: ' +
                routineVentingValues.totalVolume, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="routineVentVolume"]',
                    routineVentingValues.totalVolume);
            });

            it('> pneumatic detail section - type the high bleed count value: ' +
                routineVentingValues.highBleedCount, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="pneumatichigh"]',
                    routineVentingValues.highBleedCount);
            });

            it('> pneumatic detail section - type the low bleed count value: ' +
                routineVentingValues.lowBleedCount, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="pneamaticlow"]',
                    routineVentingValues.lowBleedCount);
            });

            it('> pneumatic detail section - type the pump count value: ' +
                routineVentingValues.pumpCount, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="pneamaticpump"]',
                    routineVentingValues.pumpCount);
            });
	
	        describe('save and validate that no errors are displayed', () => {
		        OneStop.clickSave();
	        });
        });
    };

    OneStop.pageManualEntryCompressors = (openApplication, compressorValues) => {
        describe('manual entry > compressor', () => {

            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            OneStop.clickLeftSideMenuItems('manualEntryTab:compressors', '#compressorsPanelHeading');

            it('> type the mass methane-emissions-manual (tonnes) value: ' + compressorValues.massMethane, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="compressorMass"]', compressorValues.massMethane);
            });

            it('> type the total volume (e3m3) value: ' + compressorValues.totalVolume, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="compressorVolume"]', compressorValues.totalVolume);
            });

            //add row.. etc.. - to be continued
            /**************************************/
            if (compressorValues.addCompressorValues) {
                it('> click add row button', async () => {
                    await OneStop.clickElementByCSS('.btn-add-row');
                    await OneStop.waitForPageLoad();
                });

                OneStop.confirmModalHeader('Add Compressor');

                //Installation Year / Pressurized Time / Serial Number --- are required
                if (compressorValues.addCompressorValues.LLDLocation) {
                    it('> type the lld location values: ' + compressorValues.addCompressorValues.LLDLocation,
                        async () => {
                            await OneStop.setTextFieldValueByCSS('input[name="legalLandDescription[quarter]"]',
                                compressorValues.addCompressorValues.LLDLocation);
                        });
                }

                let installationYear;
                //installationYear = compressorValues.addCompressorValues.installationYear;
                // if(compressorValues.addCompressorValues.installationYear) {
                // 	installationYear = compressorValues.addCompressorValues.installationYear;
                // } else {
                // 	installationYear = new Date();
                // 	installationYear = installationYear.getFullYear();
                // }
                installationYear = new Date();
                installationYear = installationYear.getFullYear();
                installationYear = compressorValues.addCompressorValues.installationYear ?
                    compressorValues.addCompressorValues.installationYear : installationYear;
                //console.log('installationYear is: ' + installationYear);

                it('> type the installation year value: ' + installationYear, async () => {
                    await OneStop.setTextFieldValueByCSS('input[name="installationDate"]', installationYear);
                });

                if (compressorValues.addCompressorValues.compressorType) {
                    it('> select the compressor type value: ' + compressorValues.addCompressorValues.compressorType,
                        async () => {
                            await OneStop.setSelectFieldValueByCSS('#compressorType',
                                compressorValues.addCompressorValues.compressorType);
                        });
                }

                if (compressorValues.addCompressorValues.compressorType &&
                    compressorValues.addCompressorValues.compressorType === 'Reciprocating' &&
                    compressorValues.addCompressorValues.throwCount) {
                    it('> type the throw count value: ' + compressorValues.addCompressorValues.throwCount, async () => {
                        await OneStop.setTextFieldValueByCSS('#throwCount',
                            compressorValues.addCompressorValues.throwCount);
                    });
                } else if (compressorValues.addCompressorValues.compressorType &&
                    compressorValues.addCompressorValues.compressorType === 'Centrifugal' &&
                    compressorValues.addCompressorValues.sealType) {
                    it('> select the seal type value: ' + compressorValues.addCompressorValues.sealType, async () => {
                        await OneStop.setSelectFieldValueByCSS('#compressorSealType',
                            compressorValues.addCompressorValues.sealType);
                    });
                }

                if (compressorValues.addCompressorValues.sealVentControl) {
                    it('> select the seal vent control value: ' + compressorValues.addCompressorValues.sealVentControl,
                        async () => {
                            await OneStop.setSelectFieldValueByCSS('select[name="controlledSealVentInd"]',
                                compressorValues.addCompressorValues.sealVentControl);
                        });
                }

                if (compressorValues.addCompressorValues.ratedPower) {
                    it('> set the rated power (kW) value: ' + compressorValues.addCompressorValues.ratedPower,
                        async () => {
                            await OneStop.setTextFieldValueByCSS('input[name="powerRate"]',
                                compressorValues.addCompressorValues.ratedPower);
                        });
                }

                if (compressorValues.addCompressorValues.annualVentVolume) {
                    it('> set the annual vent volume (e3m3) value: ' +
                        compressorValues.addCompressorValues.annualVentVolume, async () => {
                        await OneStop.setTextFieldValueByCSS('input[name="annualVentVolume"]',
                            compressorValues.addCompressorValues.annualVentVolume);
                    });
                }

                if (compressorValues.addCompressorValues.massMethaneTonnes) {
                    it('> set the mass methane-emissions-manual (tonnes) value: ' +
                        compressorValues.addCompressorValues.massMethaneTonnes, async () => {
                        await OneStop.setTextFieldValueByCSS('input[name="methaneMass"]',
                            compressorValues.addCompressorValues.massMethaneTonnes);
                    });
                }

                it('> set the pressurized time (hours) value: ' +
                    compressorValues.addCompressorValues.pressurizedTimeHours, async () => {
                    await OneStop.setTextFieldValueByCSS('input[name="annualPressurizedTime"]',
                        compressorValues.addCompressorValues.pressurizedTimeHours);
                });

                it('> set the serial number value: ' +
                    compressorValues.addCompressorValues.serialNumber, async () => {
                    await OneStop.setTextFieldValueByCSS('input[name="compressorFrameSerial"]',
                        compressorValues.addCompressorValues.serialNumber + ' ' +
                        Math.floor((Math.random() * 100) + 1));
                });

                it('> click save compressor button', async () => {
                    await OneStop.clickElementByCSS('.btn-save-compressor');
                });

                // it('> validate there are no errors', function (done) {
                // 	driver.findElements(By.css('.has-error'))
                // 		.then(function(elements) {
                // 			if (elements.length > 0) {
                // 				OneStop.findElementsByCSS('.has-error')
                // 					.then(function (elements) {
                // 						for (var i = 0; i < elements.length; i++) {
                // 							logValidationMessages(elements[i]);
                // 						}
                //
                // 						if (elements.length > 0) { // <-- force a failed message if validation errors exist
                // 							driver.sleep(1000)
                // 								.then(function () {
                // 									expect(elements.length).to.equal(0);
                // 									done();
                // 								});
                // 						} else {
                // 							done();
                // 						}
                // 					});
                // 			} else {
                // 				done();
                // 			}
                // 		});
                // });

                /*
                OneStop.checkErrorsExist(false);    //this needs to be updated
                */
            }
	
	        describe('save and validate that no errors are displayed', () => {
		        OneStop.clickSave();
	        });
        });
    };

    // to update the locators on this one - not fully done
    OneStop.pageManualEntryFugitives = (openApplication, compressorValues) => {
        describe('manual entry > fugitives', () => {

            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            OneStop.clickLeftSideMenuItems('manualEntryTab:compressors', '#compressorsPanelHeading');

            it('> tanks grid - type the mass methane-emissions-manual (tonnes) value: ' + compressorValues.massMethane, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="compressorMass"]', compressorValues.massMethane);
            });

            it('> tanks grid - type the total volume (e3m3) value: ' + compressorValues.totalVolume, async () => {
                await OneStop.setTextFieldValueByCSS('input[name="compressorVolume"]', compressorValues.totalVolume);
            });

            //add row.. etc.. - to be continued
            /**************************************/
	
	        describe('save and validate that no errors are displayed', () => {
		        OneStop.clickSave();
	        });
        });
    };

    OneStop.pageFleetCalculations = (openApplication) => {
        describe('fleet calculations > calculations', () => {
            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            //navigate to Fleet Calculations - Site Details tab
            OneStop.clickLeftSideMenuItems('fleetCalculationsTab', '#calculationsPanelHeading');

            it('temp wait', async () => {
                await driver.sleep(100);
            });

            /// TO BE CONTINUED

        });
    };

    OneStop.pageBulkLoadCompressor = (openApplication) => {
        describe('bulk upload > compressors', () => {
            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            //click Next button after Save and Validate is done
            it('> click next button', async () => {
                await OneStop.clickElementByCSS('.btn-next');
                await OneStop.waitForPageLoad();
            });

            //--- this will replace the leftTab clicking functionality above when it is fixed (Bulk Upload is hidden now)
            //navigate to Bulk Upload - Compressor tab
            //OneStop.clickLeftSideMenuItems('bulkUploadTab:compressorsBulk', '#bulkUploadPanelHeading');

            /// TO BE CONTINUED

        });
    };
//<<<<<< METHANE EMISSIONS <<<<<<---------------------------------------------------------------------------------------


//>>>>>> BENZENE EMISSIONS >>>>>>---------------------------------------------------------------------------------------
	OneStop.pageEmissionReportingBenzeneEmissionsManual = (emissionValues) => {
		describe('emissions reporting > methane emissions', () => {
			it('select reporting format - ' + emissionValues.reportingFormat, async () => {
				await OneStop.setSelectFieldValueByCSS('#reportingFormat', emissionValues.reportingFormat);
			});
			
			if (emissionValues.reportingFormat === 'Manual Entry') {
				let reportingYear = emissionValues.manualEntries.reportingYear;
				let reportingFacility = emissionValues.manualEntries.reportingFacilityId;
				reportingFacility = reportingFacility ? reportingFacility : '1';
				//console.log(reportingFacility);
				
				it('select reporting year > ' + reportingYear, async () => {
					await OneStop.setSelectFieldValueByCSS('#reportingPeriod', reportingYear);
				});
				
				it('set authorization > click search button', async () => {
					//click Search btn
					await OneStop.clickElementByCSS('#addAuthorization');
					await OneStop.waitForPageLoad();
				});
				
				OneStop.confirmModalHeader('Authorization Search');    //or Authorization Search (for benzene)
				
				it('set reporting facility > modal - type the facility id: ' + reportingFacility, async () => {
					await OneStop.setTextFieldValueByCSS('input[name="facilityId"]', reportingFacility);
				});
				
				it('set reporting facility > modal - click search button', async () => {
					await OneStop.clickElementByCSS('.btn-search');
					await OneStop.waitForPageLoad();
				});
				
				if (reportingFacility !== '1') {
					it('set reporting facility > modal - the record ' + reportingFacility + ' was found', async () => {
						const element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td.facilityId'));
						const elementText = await element.getText();
						expect(elementText).to.equal(reportingFacility);
					});
				}
				
				it('set reporting facility > modal - select first returned record', async () => {
					const element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td>input'));
					element.click();
				});
				
				it('store the attributes of selected record for later usage', async () => {
					//1st clear the array in case it contains older values:
					if (facilityInformationValues.length > 0) {
						for (let i = facilityInformationValues.length; i === 0; i--) {
							facilityInformationValues.pop();
							// temp ---
							console.log('array items: ' + facilityInformationValues);
							console.log('array length: ' + facilityInformationValues.length);
							// temp ---
						}
						// temp ---
						console.log('array is clean: ' + facilityInformationValues);
						console.log('wait');
						// temp ---
					}
					
					//get the authorizationId, facilityId, facilityName, facilityType and facilitySubType
					//retrieve the value of authorizationId:
					let element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(3)'));
					let elementText = await element.getText();
					facilityInformationValues.push(elementText);    //facilityInformationValues[0]
					
					//retrieve the value of facilityId:
					element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(5)'));
					elementText = await element.getText();
					facilityInformationValues.push(elementText);    //facilityInformationValues[1]
					
					//retrieve the value of facilityName:
					element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(6)'));
					elementText = await element.getText();
					facilityInformationValues.push(elementText);    //facilityInformationValues[2]
					
					//retrieve the value of facilityType:
					element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(7)'));
					elementText = await element.getText();
					facilityInformationValues.push(elementText);    //facilityInformationValues[3]
					
					//retrieve the value of facilitySubType:
					element = await driver.findElement(By.css('.backgrid tr:nth-child(1)>td:nth-child(8)'));
					elementText = await element.getText();
					facilityInformationValues.push(elementText);    //facilityInformationValues[4]
				});
				
				it('set reporting facility > modal - click select reporting facility button', async () => {
					await OneStop.clickElementByCSS('.btn-select-reporting-facility');
					await OneStop.waitForPageLoad();
				});
				
				it('validate the correct authorization id is displayed within the authorization field: ' + facilityInformationValues[0], async () => {
					const element = await driver.findElement(By.css('#authorizationAliasId'));
					const elementValue = await element.getAttribute('value');
					expect(elementValue).to.equal(facilityInformationValues[0]);
				});
				
				describe('save and validate that no errors are displayed', () => {
					OneStop.clickSave();
				});
			} else if (emissionValues.reportingFormat === 'CSV Upload') {
				
				//add the code for CSV Uploads - probably a call to a separate function
				
				describe('save and validate that no errors are displayed', () => {
					OneStop.clickSave();
				});
			} else {
				throw 'chosen ' + emissionValues.reportingFormat +
				' reporting format is wrong, only "Manual Entry" either "CSV Upload" options are available';
			}
		});
	};
	
	OneStop.pageValidationRulesSubmitAndValidateBenzeneEmissions = (emissionValues) => {
		describe('navigate to overview > validations/rules', () => {
			//navigate to leftside Overview - Validations/Rules tab
			OneStop.clickLeftSideMenuItems('overviewTab:validationsRules', '.active-step-row a[data-id="overviewTab:validationsRules"]');
			
			it('check there are no failed validations', async () => {
				await OneStop.validateDisplayedText('.validationFailed-grid .empty>td>span', 'No Validations Failed');
			});
			
			let createdSubmissionRowNr;
			it('check that the created submission record is displayed within the submissions grid', async () => {
				//facilityInformationValues[0]      -   .submissions-grid tbody>tr:nth-child(1)>td.authorizationId
				for (let i = 0; i < 5; i++) {
					const element = await driver.findElement(By.css('.submissions-grid tbody>tr:nth-child(' + (i + 1) +
						')>td.authorizationId'));
					const elementText = await element.getText();
					
					if (elementText === facilityInformationValues[0]) {
						expect(elementText).to.equal(facilityInformationValues[0]);
						createdSubmissionRowNr = i + 1;
						//break the loop
						i = 5;
						break;
					} else if (i === 5 && elementText !== facilityInformationValues[0]) {
						throw "created benzene submission not found \n authorizationId: " + facilityInformationValues[0] +
						"\n facilityId: " + facilityInformationValues[1];
					}
				}
			});
			
			//select the checkbox of that record
			it('select the checkbox for the created submission', async () => {
				await OneStop.setButtonCheckboxByCSS('.submissions-grid tbody>tr:nth-child(' + createdSubmissionRowNr +
					')>td.select-row-cell');
			});
			
			it('validate that submit button is visible & enabled', async () => {
				await OneStop.waitForObjectLoad('.submit-facility', waitLong, 500, true);
			});
			
			if (emissionValues.emissionsSubmissionValues.submitEmissions === true) {
				describe('fill in contact information, declaration and disclaimer', () => {
					fillSubmissionForm(emissionValues.emissionsSubmissionValues);
				});
			}
		});
	};
	
	OneStop.pageSubmissionEmissionsValidateBenzeneSubmission = (submissionStatus, filterType) => {
		describe('submissions > emissions page - validate the record was submitted', () => {
			describe('navigate to submissions > emissions', () => {
				OneStop.clickTopMenuItems('Operate', 'Emissions Reporting', '#peaceRiverType');
				
				OneStop.clickLeftSideMenuItems('emissionsReportingTab:benzeneEmissions',
					'#step-row-benzeneEmissions.active-step-row');
			});
			
			describe('find the recently created submissions record and validate its status is ' + submissionStatus, () => {
				if (filterType && filterType === 'submitted') {
					it('click draft filter link in the recent submissions grid', async () => {
						await OneStop.clickElementByCSS('#RecentSubmissionsPanelHeading .dropdown.pull-right>button');
					});
					
					it('select submitted option', async () => {
						await OneStop.clickElementByCSS('#RecentSubmissionsPanelHeading .dropdown-menu a[value="Submitted"]');
						await OneStop.waitForPageLoad();
					});
				}
				
				it('find the recent reference id and check its status', async () => {
					let referenceStatus = '';
					const elements = await driver.findElements(By.css('.recent-submissions-grid tr td.submissionNumber'));
					let rowsCounterRecentSubmissions = elements.length;
					for (let i = 0; i < 10; i++) {
						if (i < rowsCounterRecentSubmissions) {
							//.recent-submissions-grid tr:nth-child(1) td.industryStatus
							//.recent-submissions-grid tr:nth-child(1) td:nth-child(10)
							referenceStatus = await findItemWithinRecentSubmissionsGridByColumnClass(i,
								'industryStatus', submissionStatus);    //'under review'
							if (referenceStatus && referenceStatus.toLowerCase() === submissionStatus) {    //'under review'
								break;
							}
						} else {
							break;
						}
					}
				});
			});
		});
	};
//<<<<<< BENZENE EMISSIONS <<<<<<---------------------------------------------------------------------------------------


//>>>>>> EMISSIONS REPORTING - PEACE RIVER EMISSIONS REPORTING & PERFORMANCE >>>>>>-------------------------------------
    OneStop.pageEmissionsReportingPeaceRiver = (openApplication, peaceRiverValues) => {
        describe('emissions reporting > add new peace river emissions reporting', () => {
            /*var amendmentType = appType.split('-')[1];
            amendmentType = amendmentType.replace(/\w\S*!/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });*/

            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            describe('navigate to submissions > emissions', () => {
                //OneStop.clickTopMenuItems('Operate', 'Peace River Emissions',
                // '.panel:nth-child(1)>#emissionsReportingPanelHeading');
                OneStop.clickTopMenuItems('Operate', 'Emissions Reporting', '#peaceRiverType');
            });

            describe('submissions > emissions > set reporting type', () => {
                it('select peace river reporting type as ' + peaceRiverValues[0].reportingType, async () => {
                    await OneStop.setSelectDropDownValueByCSS('#peaceRiverType',
                        peaceRiverValues[0].reportingType);//'Peace River Reporting');    //Peace River Performance Reporting
                });

                it('click search/create new submission button and validate the correct page is loaded', async () => {
                    await OneStop.clickElementByCSS('#createSubmission');
                    await OneStop.waitForPageLoad();
                    if (peaceRiverValues[0].reportingType === 'Peace River Reporting') {
                        await OneStop.waitForObjectLoad('a[data-id="peaceRiverReportingTab:peaceRiverEmissions"]',
                            waitLong * 2, 500, true);
                    } else if (peaceRiverValues[0].reportingType === 'Peace River Performance Reporting') {
                        await OneStop.waitForObjectLoad(
                            'a[data-id="peaceRiverPerformanceReportingTab:performanceReport"]',
                            waitLong * 2, 500, true);
                    }
                });
            });
	
	        //describe 1.2
	        describe('emissions reporting > ' + peaceRiverValues[0].reportingType + ' page', () => {
		        describe('check the peace river emissions note and choose the reporting format as ' +
			        peaceRiverValues[0].reportingFormat, () => {
			        if (peaceRiverValues[0].reportingType === 'Peace River Reporting') {
				        //validate the Note text is there and contains the expected value
				        OneStop.validateDisplayedText('.loading-data-notice',
					        'Note: Loading time may be upwards of 15 seconds for Manual Entry ' +
					        'depending on number of Facility/Well Licences.');
			        }
			
			        //select the Reporting Format
			        if (peaceRiverValues[0].reportingType === 'Peace River Performance Reporting' &&
				        peaceRiverValues[0].reportingFormat === 'CSV Upload') {
				        throw 'The reporting type "Peace River Performance Reporting" can only be of "Manual Entry" format';
			        } else {
				        it('select the reporting format - ' + peaceRiverValues[0].reportingFormat, async () => {
					        await OneStop.setSelectDropDownValueByCSS('#reportingFormat',
						        peaceRiverValues[0].reportingFormat);
				        });
			        }
		        });
		
		        //Reporting Format = Manual Entry
		        //if Reporting Format === Manual Entry then select/fill in the other
		        // fields (frequency, reporting period, etc..)
		        // NOTE: there is no CSV Upload for the Performance Reporting
		        let amendmentValue = '';
		        if (peaceRiverValues[0].reportingFormat === 'Manual Entry') {
			        describe('set peace river emissions/performance reporting values', () => {
				        //select the Reporting Frequency (whichever it is) Monthly or Annual
				        //NOTE: Performance Report has only Annual set as default - no drop down
				        if (peaceRiverValues[0].reportingType === 'Peace River Reporting') {
					        if (peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingFrequency === 'Monthly' ||
						        peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingFrequency === 'Annual') {
						        it('select the reporting frequency > ' +
							        peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingFrequency, async () => {
							        await OneStop.setSelectDropDownValueByCSS('#reportingFrequency',
								        peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingFrequency);
						        });
					        } else {
						        throw 'Only "Monthly" or "Annual" options are available in the Reporting Period dropdown, ' +
						        peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingPeriod + ' is wrong';
					        }
				        }
				
				        //select the Reporting Period - if the value is declared in the array then use it
				        if (peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingPeriod) {
					        //select Reporting Period
					        it('select the reporting period > ' +
						        peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingPeriod, async () => {
						        await OneStop.setSelectDropDownValueByCSS('#reportingPeriod',
							        peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingPeriod);
						        await OneStop.waitForPageLoad();
					        });
					        //select the Reporting Period - if the value was not declared in the array then build
					        // the actual Month or Year and select it
					        // the piece below might not work well because of: https://jira.aer.ca/browse/MERP-1985
				        } else {
					        //if Monthly
					        if (peaceRiverValues[0].reportingType === 'Peace River Reporting' &&
						        peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingFrequency === 'Monthly') {
						        it('select the reporting period > monthly - current month', async () => {
							        const reportingPeriodCurrentMonth = harnessObj.Moment().startOf('month').format('LL') +
								        ' - ' + harnessObj.Moment().endOf('month').format('LL');
							        await OneStop.setSelectDropDownValueByCSS('#reportingPeriod',
								        reportingPeriodCurrentMonth);
							        await OneStop.waitForPageLoad();
						        });
						        //if Annual
					        } else if (peaceRiverValues[0].reportingType === 'Peace River Performance Reporting' ||
						        peaceRiverValues[0].manualEntries.peaceRiverEmissions.reportingFrequency === 'Annual') {
						        it('select the reporting frequency > annual - current year', async () => {
							        const reportingPeriodCurrentYear = harnessObj.Moment().startOf('year').format('LL') +
								        ' - ' + harnessObj.Moment().endOf('year').format('LL');
							        await OneStop.setSelectDropDownValueByCSS('#reportingPeriod', reportingPeriodCurrentYear);
							        await OneStop.waitForPageLoad();
						        });
					        }
				        }
				
				        it('if reporting period has already been submitted click the view amendment draft button',
					        async () => {
						        const elements = await OneStop.findElementsByCSS('.modal-dialog');
						        if (elements.length > 0) {
							        //console.log('this is an amendment to the previously created record');
							        //click View Amendment / View Amendment Draft --- whichever is displayed
							        //OneStop.clickElementByCSS('.btn-amend'); OR
							        // OneStop.clickElementByCSS('.btn-view-amend-draft');
							        //new one - this works perfectly:
							        //.btn-toolbar>button[style="display: inline-block;"] OR
							        // button[class*=amend]:not([style*="none"])
							        await OneStop.clickElementByCSS('button[class*=amend]:not([style*="none"])');
							        amendmentValue = ' amendment';
							        await OneStop.waitForPageLoad();
						        }
					        });
			        });
			
			        //if licenseeInformation exists in the json file & reporting type not = performance
			        if (peaceRiverValues[0].licenseeInformation && peaceRiverValues[0].reportingType !==
                        'Peace River Performance Reporting') {
				        describe('set licensee information values', () => {
					        if (peaceRiverValues[0].manualEntries.licenseeInformation) {
						        if (peaceRiverValues[0].manualEntries.licenseeInformation.managerResponsible) {
							        it('type the manager responsible value > ' +
								        peaceRiverValues[0].manualEntries.licenseeInformation.managerResponsible,
								        async () => {
									        await OneStop.setTextFieldValueByCSS('#managerResponsible',
										        peaceRiverValues[0].manualEntries.licenseeInformation.managerResponsible +
										        amendmentValue);
								        });
						        }
						
						        if (peaceRiverValues[0].manualEntries.licenseeInformation.licenseeRepresentative) {
							        it('type the licensee representative value > ' +
								        peaceRiverValues[0].manualEntries.licenseeInformation.licenseeRepresentative,
								        async () => {
									        await OneStop.setTextFieldValueByCSS('#licenseeRepresentative',
										        peaceRiverValues[0].manualEntries.licenseeInformation.licenseeRepresentative +
										        amendmentValue);
								        });
						        }
						
						        if (peaceRiverValues[0].manualEntries.licenseeInformation.licenseePhoneNumber) {
							        it('type the licensee phone number value > ' +
								        peaceRiverValues[0].manualEntries.licenseeInformation.licenseePhoneNumber,
								        async () => {
									        await OneStop.setTextFieldValueByCSS('#licenseePhoneNumber',
										        peaceRiverValues[0].manualEntries.licenseeInformation.licenseePhoneNumber);
								        });
						        }
					        }
				        });
			        }
		        } else if (peaceRiverValues[0].reportingFormat !== 'Manual Entry' &&
			        peaceRiverValues[0].reportingFormat !== 'CSV Upload') {
			        throw 'peace river emissions - chosen ' + peaceRiverValues[0].reportingFormat +
			        ' reporting format is wrong, only "Manual Entry" either "CSV Upload" options are available';
		        }
	        });
	        
	        describe('save and validate that no errors are displayed', () => {
		        OneStop.clickSave();
	        });
        });
    };

    //this tab is available only for Peace River Performance
    OneStop.pageManualEntryAnnualPerformance = (openApplication, annualPerformanceValues) => {
        describe('manual entry > annual performance page', () => {
            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            describe('navigate to manual entry > details tab', () => {
                //navigate to leftside Manual Entry - Annual Performance tab
                OneStop.clickLeftSideMenuItems('manualEntryTab:calculations', '#facilityInfoPanelHeading');
            });

            let gasProducedAnnually, gasNonroutineFlared, gasConserved, gasRoutineFlared;

            if (annualPerformanceValues) {
                gasProducedAnnually = annualPerformanceValues.gasProducedAnnually;
                gasNonroutineFlared = annualPerformanceValues.gasNonroutineFlared;
                gasConserved = annualPerformanceValues.gasConserved;
                gasRoutineFlared = annualPerformanceValues.gasRoutineFlared;
            } else {
                gasProducedAnnually = Math.floor(Math.random() * 1000);
                gasNonroutineFlared = Math.floor(gasProducedAnnually / (Math.random() * 9 + 1));
                gasConserved = Math.floor(Math.random() * gasProducedAnnually);
                gasRoutineFlared = Math.floor(Math.random() * gasProducedAnnually);
            }

            let nonRoutineFlaringPercent = (gasNonroutineFlared / gasProducedAnnually) * 100;
            let conservationRate = (gasProducedAnnually - gasRoutineFlared) / gasProducedAnnually * 100;

            describe('fill in the annual performance', () => {
                it('set the total gas produced annually ' + gasProducedAnnually, async () => {
                    await OneStop.setTextFieldValueByCSS('#annualGasProduced', gasProducedAnnually);
                    await driver.sleep(100);
                });

                it('set the total amount of gas nonroutine flared ' + gasNonroutineFlared, async () => {
                    await OneStop.setTextFieldValueByCSS('#annualGasProducedNonRoutineFlare', gasNonroutineFlared);
                    await driver.sleep(100);
                });

                it('set the total gas conserved ' + gasConserved, async () => {
                    await OneStop.setTextFieldValueByCSS('#annualGasConserved', gasConserved);
                    await driver.sleep(100);
                });

                it('set the total amount of gas routine flared ' + gasRoutineFlared, async () => {
                    await OneStop.setTextFieldValueByCSS('#annualGasConservedRoutineFlare', gasRoutineFlared);
                    //click on field's label so the value inserted takes place (math is applied)
                    await OneStop.clickElementByCSS('#tanksPanelBody div.form-group:nth-child(4)>label');
                    await driver.sleep(100);
                });

                it('retrieve the nonroutine flaring % and validate it matches the expected value', async () => {
                    const element = await driver.findElement(By.css('#calculatedNonRoutineFlarePercent'));
                    const elementAttValue = await element.getAttribute('value');
                    expect(elementAttValue).to.equal(
                        ((Math.round(nonRoutineFlaringPercent * 100) / 100).toFixed(2)).toString()
                    );
                });

                it('retrieve the conversion rate % and validate it matches the expected value', async () => {
                    const element = await driver.findElement(By.css('#calculatedConservationRate'));
                    const elementAttValue = await element.getAttribute('value');
                    expect(elementAttValue).to.equal(
                        ((Math.round(conservationRate * 100) / 100).toFixed(2)).toString()
                    );
                });
            });
        });
    };

    //this tab is available only for Peace River Performance
    OneStop.pageManualEntryRequirements = (openApplication, requirementsValues) => {
        describe('manual entry > requirements page', () => {
            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            describe('navigate to manual entry > requirements', () => {
                //navigate to leftside Manual Entry - Annual Performance tab
                OneStop.clickLeftSideMenuItems('manualEntryTab:requirements', '#wellsPanelHeading');
            });
            
            describe('edit requirements of the first record in the well grid', () => {
                it('click first requirements link from the wells grid', async () => {
                    await OneStop.clickElementByCSS('tr:nth-child(1) button[data-event="open-requirements"]');
                });
                
                //1. D084 Section 2 Met:
	            describe('set the D084 Section 2 Met values', () => {
		            it('wait', async () => {
			            console.log('temp - the steps below need to be filled in with functions/actions');
		            });
		            
		            //Requirement 2: Routine Venting
	                it('', async () => {
			
		            });
		
		            //Control Type
		            it('', async () => {
			
		            });
		
		            if ('controlType' === 'Other') {
			            //Other Control Type Description
			            it('', async () => {
				
			            });
		            }
		
		            //Conservation Method
		            it('', async () => {
			
		            });
		
		            if ('conservationMethod' === 'Other') {
			            //Other Conservation Method Description
			            it('', async () => {
				
			            });
		            }
              
		            //when Routine Venting = No
		            if('routineVenting' === 'No') {
		                //Why Requirement Not Met
			            it('', async () => {
				
			            });
			
			            //Comments
			            it('', async () => {
				
			            });
                    }
	            });
	
	            //2. D084 Section 3 Met:
	            describe('set the D084 Section 3 Met values', () => {
		            //Requirement 3: Nonroutine Venting
		            it('', async () => {
			
		            });
		
		            //Control Type
		            it('', async () => {
			
		            });
		
		            if ('controlType' === 'Other') {
			            //Other Control Type Description
			            it('', async () => {
				
			            });
		            }
		
		            //Maintenance
		            it('', async () => {
			
		            });
		
		            if ('maintenance' === 'Other') {
			            //Other Maintenance Description
			            it('', async () => {
				
			            });
		            }
		
		            //when Nonroutine Venting = No
		            if('routineVenting' === 'No') {
			            //Why Requirement Not Met
			            it('', async () => {
				
			            });
			
			            //Comments
			            it('', async () => {
				
			            });
		            }
	            });
	
	            //3. D084 Section 4 Met:
	            describe('set the D084 Section 4 Met values', () => {
		            //Requirement 4: Nonroutine Flaring
		            it('', async () => {
			
		            });
		
		            //Amount of Gas Non-Routine Flaring
		            it('', async () => {
			
		            });
		
		            //Comments
		            it('', async () => {
			
		            });
		
		            //when Nonroutine Flaring = No
		            if('routineVenting' === 'No') {
			            //Why Requirement Not Met
			            it('', async () => {
				
			            });
			
			            //Comments
			            it('', async () => {
				
			            });
		            }
	            });
	
	            //4. D084 Section 5 Met:
	            describe('set the D084 Section 5 Met values', () => {
		            //Requirement 5: Gas Conservation
		            it('', async () => {
			
		            });
		
		            //Amount of Gas Conserved
		            it('', async () => {
			
		            });
		
		            //Comments
		            it('', async () => {
			
		            });
		
		            //when Gas Conservation = No
		            if('routineVenting' === 'No') {
			            //Why Requirement Not Met
			            it('', async () => {
				
			            });
			
			            //Comments
			            it('', async () => {
				
			            });
		            }
	            });
	
	            //5. D084 Section 6 Met:
	            describe('set the D084 Section 6 Met values', () => {
		            //Requirement 6: Fugitive Emissions
		            it('', async () => {
			
		            });
		
		            //Annual Survey Submitted
		            it('', async () => {
			
		            });
		
		            if('annualSurveySubmitted' === 'Yes') {
			            //Date of Submission
			            it('', async () => {
				
			            });
			
			            //Third Party Contractor
			            it('', async () => {
				
			            });
			
			            //Leak Detection Equipment
			            it('', async () => {
				
			            });
			            
			            if('leakDetectionEquipment' === 'Other') {
				            //Other Leak Detection Equipment
				            it('', async () => {
                
				            });
                        }
                    } else if('annualSurveySubmitted' === 'No') {
			            //Why No Submission
			            it('', async () => {
				
			            });
			
			            //Comments
			            it('', async () => {
				
			            });
		            }
		
		            //when Fugitive Emissions = No
		            if('routineVenting' === 'No') {
			            //Why Requirement Not Met
			            it('', async () => {
				
			            });
			
			            //Comments
			            it('', async () => {
				
			            });
		            }
	            });
	
	            //6. D084 Section 7 Met:
	            describe('set the D084 Section 7 Met values', () => {
		            //Requirement 7: Trucking Loading and Unloading
		            it('', async () => {
			
		            });
		
		            //Control Type
		            it('', async () => {
			
		            });
		            
		            if ('controlType' === 'Other') {
			            //Other Control Type Description
			            it('', async () => {
				
			            });
                    }
		
		            //Maintenance
		            it('', async () => {
			
		            });
		
		            if ('maintenance' === 'Other') {
			            //Other Maintenance Description
			            it('', async () => {
				
			            });
		            }
		
		            //when Trucking Loading and Unloading = No
		            if('routineVenting' === 'No') {
			            //Why Requirement Not Met
			            it('', async () => {
				
			            });
			
			            //Comments
			            it('', async () => {
				
			            });
		            }
		
		            //Identify changes to emission controls program from last year
		            it('', async () => {
			
		            });
	            });
            });

            describe('wait', () => {
                it('wait', async () => {
                    await driver.sleep(100);
                });
            });

        });
    };

    //this tab is available only for Peace River Emissions
	let ruleResults;
    OneStop.pageManualEntryDetails = (openApplication, manualEntryValues) => {
        describe('manual entry > details page', () => {
            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            describe('navigate to manual entry > details', () => {
                //navigate to leftside Manual Entry - Details tab
                OneStop.clickLeftSideMenuItems('manualEntryTab:details', '#wellsPanelHeading');
            });

            if (manualEntryValues[0].wellsGridValues.addWellsRow === true) {
                // NOTE: this code below is not yet fully tested / fixed because of:
                // https://jira.aer.ca/browse/MERP-1984
                describe('wells grid > add a new row', () => {
                    //0. click Add Row grid's button
                    it('click add row grid\'s button', async () => {
                        await OneStop.clickElementByCSS('#wellsPanelBody .btn-add-well');
                        await driver.sleep(100);
                    });

                    //1. Facility License Number
                    describe('add the facility license number', () => {
                        // NOTE:   Needs to be a valid, existing Authorization in IDB associated with the logged
                        // in user's BA ID.
                        // Entering a random a sequence of numbers as a test will fail. There's no maxlength
                        // applied on the input.
                        it('click facility license number cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#wellGrid tbody tr:nth-child(1) td.facilityAuthorizationId');
                            await OneStop.waitForObjectLoad('.modal-content', waitLong, 500, true);
                        });

                        //validate modal's title is Facility License Number
                        OneStop.confirmModalHeader('Facility License Number');

                        //validate the Note text is there and contains the expected value
                        OneStop.validateDisplayedText('.modal-content .license-number-notice',
                            'Note: This Licence number will not be editable once entered.');

                        it('facility license number modal - type the ' +
                            manualEntryValues[0].wellsGridValues.facilityLicenseNumber +
                            ' license number and click the enter button', async () => {
                            await OneStop.setTextFieldValueByCSS('.modal-content #licenseNumber',
                                manualEntryValues[0].wellsGridValues.facilityLicenseNumber);
                            await OneStop.clickElementByCSS('.modal-content .btn-submit');
                            await OneStop.waitForPageLoad();
                        });
                    });

                    //2. Reporting Facility ID
                    let reportingFacilityId = '';   //this is updated within the steps below - created for later usage
                    describe('add the reporting facility id', () => {
                        it('click reporting facility id cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#wellGrid tbody tr:nth-child(1) td.reportingFacility');
                            await OneStop.waitForObjectLoad('.modal-content', waitLong, 500, true);
                        });

                        //validate modal's title is Reporting Facility ID
                        OneStop.confirmModalHeader('Reporting Facility ID');

                        //select first record form the list
                        it('report facility id modal - select first record from the reporting facility id dropdown ' +
                            'and click the enter button', async () => {
                            const dropDownElement = await driver.wait(until.elementLocated(
                                By.css('#reportingFacilitySelect>option:nth-child(2)')), waitLong);
                            reportingFacilityId = await dropDownElement.getText();
                            await OneStop.setSelectDropDownValueByCSS('#reportingFacilitySelect', reportingFacilityId);
                            await OneStop.clickElementByCSS('.modal-content .btn-submit');
                            await OneStop.waitForPageLoad();
                        });
                    });

                    //3. Facility License Status
                    //Facility License Status: Uneditable by the user - populates as a string.

                    //4. Well License Number
                    if (manualEntryValues[0].wellsGridValues.wellLicenseNumber) {
                        describe('add the well license number', () => {
                            // NOTE: Needs to be a valid, existing Authorization in IDB associated with the logged
                            // in user's BA ID.
                            // Entering a random a sequence of numbers as a test will fail. There's no maxlength
                            // applied on the input.
                            it('click well license number cell in the grid', async () => {
                                await OneStop.clickElementByCSS('#wellGrid tbody tr:nth-child(1) td.wellAuthorizationId');
                                await OneStop.waitForObjectLoad('.modal-content', waitLong, 500, true);
                            });

                            //validate modal's title is Well License Number
                            OneStop.confirmModalHeader('Well License Number');

                            //validate the Note text is there and contains the expected value
                            OneStop.validateDisplayedText('.modal-content .license-number-notice',
                                'Note: This Licence number will not be editable once entered.');

                            it('well license number modal - type the ' +
                                manualEntryValues[0].wellsGridValues.wellLicenseNumber +
                                ' well license number and click the enter button', async () => {
                                await OneStop.setTextFieldValueByCSS('.modal-content #licenseNumber',
                                    manualEntryValues[0].wellsGridValues.wellLicenseNumber);
                                await OneStop.clickElementByCSS('.modal-content .btn-submit');
                                await OneStop.waitForPageLoad();
                            });
                        });

                    //5. Well License Status
                        //Well License Status: Uneditable by the user - populated as a string.
                    }

                    //6. Surface Location
                    describe('add the surface location', function () {
                        it('click surface location cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#wellGrid tbody tr:nth-child(1) td.lld');
                            await OneStop.waitForObjectLoad('.modal-content', waitLong, 500, true);
                        });

                        //validate modal's title is Legal Land Description
                        OneStop.confirmModalHeader('Legal Land Description');

                        it('legal land description modal - type the ' +
                            manualEntryValues[0].wellsGridValues.surfaceLocation +
                            ' surface location values and click the enter button', async () => {
                            //set the Surface Location values
                            let surfaceLocationValues = (manualEntryValues[0].wellsGridValues.surfaceLocation).split('~');
                            // console.log(surfaceLocationValues);

                            //LSD
                            await OneStop.setTextFieldValueByCSS('input[name="subdivision"]#LSD',
                                surfaceLocationValues[0]);
                            //SEC
                            await OneStop.setTextFieldValueByCSS('input[name="section"]#section',
                                surfaceLocationValues[1]);
                            //TWP
                            await OneStop.setTextFieldValueByCSS('input[name="township"]#township',
                                surfaceLocationValues[2]);
                            //RGE
                            await OneStop.setTextFieldValueByCSS('input[name="range"]#range',
                                surfaceLocationValues[3]);
                            //M
                            await OneStop.setTextFieldValueByCSS('input[name="meridian"]#meridian',
                                surfaceLocationValues[4]);

                            await OneStop.clickElementByCSS('.modal-content .btn-enter-lld');
                            await OneStop.waitForPageLoad();
                        });
                    });

                    //7. Heavy Oil or Bitumen
                    describe('select heavy oil or bitumen', () => {
                        it('click heavy oil or bitumen cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#wellGrid tbody tr:nth-child(1) td:nth-child(13).select-cell');
                        });

                        it('select the ' + manualEntryValues[0].wellsGridValues.heavyOilOrBitumen +
                            ' heavy oil or bitumen value', async () => {
                            await OneStop.setSelectDropDownValueByCSS(
                                '#wellGrid tbody tr:nth-child(1) td:nth-child(13).select-cell select',
                                manualEntryValues[0].wellsGridValues.heavyOilOrBitumen);
                        });
                    });
                    
	                //8. Site Inspected
                    if (manualEntryValues[0].wellsGridValues.heavyOilOrBitumen === 'Yes') {
                        describe('select site inspected', () => {
                            it('click site inspected cell in the grid', async () => {
                                await OneStop.clickElementByCSS(
                                    '#wellGrid tbody tr:nth-child(1) td:nth-child(14).select-cell');
                            });

                            it('select the ' + manualEntryValues[0].wellsGridValues.siteInspected +
                                ' site inspection value', async () => {
                                await OneStop.setSelectDropDownValueByCSS(
                                    '#wellGrid tbody tr:nth-child(1) td:nth-child(14).select-cell select',
                                    manualEntryValues[0].wellsGridValues.siteInspected);
                                /*
                                <td class="select-cell editable sortable renderable editor">
                                    <select>
                                        <option value="Y" selected="selected">Yes</option>
                                        <option value="N">No</option>
                                    </select>
                                </td>
                                 */
                            });
                        });
	
                    //9. Reason Why Site Was Not inspected
                        if (manualEntryValues[0].wellsGridValues.siteInspected === 'No') {
                            describe('select the reason why site was not inspected', () => {
                                it('click site inspected cell in the grid', async () => {
                                    await OneStop.clickElementByCSS(
                                        '#wellGrid tbody tr:nth-child(1) td:nth-child(15).select-cell');
                                });

                                it('select the ' + manualEntryValues[0].wellsGridValues.siteInspected +
                                    ' site inspection value', async () => {
                                    await OneStop.setSelectDropDownValueByCSS(
                                        '#wellGrid tbody tr:nth-child(1) td:nth-child(15).select-cell select',
                                        manualEntryValues[0].wellsGridValues.reasonWhySiteWasNotInspected);
                                    //clicking this just because we want to apply the selection above (close the dropdown)
                                    await OneStop.clickElementByCSS('#wellsPanelBody');
                                });
                            });
                        }
                    }
                });
            }
            
            //fill in the values in the Components For License # grid (2nd grid)
            if (manualEntryValues[0].componentsForLicenseGridValues.addComponent === true) {
                describe('components for license grid > add a new row', () => {
                    //0.1. click 'Components...' button for a row in the Wells grid
                    it('wells grid > click components... link on the row ' +
                        manualEntryValues[0].componentsForLicenseGridValues.componentLinkNr, async () => {
                        await OneStop.clickElementByCSS('#wellGrid tbody tr:nth-child(' +
                            manualEntryValues[0].componentsForLicenseGridValues.componentLinkNr + ') td button');
                        await driver.sleep(500);
                        //clicking this twice as it was not opening the bottom components section on first click
                        await OneStop.clickElementByCSS('#wellGrid tbody tr:nth-child(' +
                            manualEntryValues[0].componentsForLicenseGridValues.componentLinkNr + ') td button');
                        await driver.sleep(1000);
                        //OneStop.waitForPageLoad(done);    //not sure if this is needed - to test
                        await OneStop.waitForObjectLoad(
                            '#componentGridGroup[style="display: block;"] #componentPanelBodyHeader[aria-expanded="true"]',
                            waitLong, 500, true);
                    });

                    //0.2. click Add Row grid's button
                    it('components for license grid > click add row grid\'s button', async () => {
                        await OneStop.clickElementByCSS('#componentPanelBody .btn-add-component');
                        await driver.sleep(1000);
                    });
                    
	                //1. Component
                    describe('add the component', () => {
                        it('click component cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#componentGrid tbody tr:nth-child(1) td:nth-child(3)');
                            await driver.sleep(500);
                        });

                        it('select the component > ' +
                            manualEntryValues[0].componentsForLicenseGridValues.componentValue, async () => {
                            await OneStop.setSelectDropDownValueByCSS(
                                '#componentGrid tbody tr:nth-child(1) td:nth-child(3).select-cell select',
                                manualEntryValues[0].componentsForLicenseGridValues.componentValue);
                            await driver.sleep(300);
                        });
                    });

                    //2. Targeted Component
                    describe('add the targeted component', () => {
                        it('click targeted component cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#componentGrid tbody tr:nth-child(1) td:nth-child(4)');
                            await driver.sleep(500);
                        });

                        it('set the targeted component > ' +
                            manualEntryValues[0].componentsForLicenseGridValues.targetedComponent, async () => {
                            await OneStop.setSelectDropDownValueByCSS(
                                '#componentGrid tbody tr:nth-child(1) td:nth-child(4).select-cell select',
                                manualEntryValues[0].componentsForLicenseGridValues.targetedComponent);
                            await driver.sleep(300);
                        });
                    });

                    //3. Date Leak Addressed
                    describe('add the date leak addressed', () => {
                        it('click date leak addressed cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#componentGrid tbody tr:nth-child(1) td:nth-child(5)');
                            await driver.sleep(500);
                        });

                        //if declared in the array then use that value
                        if (manualEntryValues[0].componentsForLicenseGridValues.dateLeakAddressed &&
                            manualEntryValues[0].componentsForLicenseGridValues.dateLeakAddressed.length > 0) {
                            it('set the date leak addressed > ' +
                                manualEntryValues[0].componentsForLicenseGridValues.dateLeakAddressed, async () => {
                                await OneStop.setTextFieldValueByCSS(
                                    '#componentGrid tbody tr:nth-child(1) td:nth-child(5)>input',
                                    manualEntryValues[0].componentsForLicenseGridValues.dateLeakAddressed);
                                await driver.sleep(300);
                            });
                            //if not declared within the array then generate todays date and use it (format = MM/DD/YYYY)
                        } else {
                            const todaysDate = harnessObj.Moment().format('M/DD/YYYY');
                            it('set the date leak addressed > ' + todaysDate, async () => {
                                await OneStop.setTextFieldValueByCSS(
                                    '#componentGrid tbody tr:nth-child(1) td:nth-child(5)>input', todaysDate);
                                await driver.sleep(300);
                            });
                        }
                    });

                    //4. Leak Addressed Within Required Timeframe
                    describe('add the leak addressed within required timeframe', () => {
                        it('click leak addressed within required timeframe cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#componentGrid tbody tr:nth-child(1) td:nth-child(6)');
                            await driver.sleep(500);
                        });

                        it('select the leak addressed within required timeframe > ' +
                            manualEntryValues[0].componentsForLicenseGridValues.leakAddressedWithinRequiredTimeframe,
                            async () => {
	
	                            //set the ruleResults value for later usage (this is based on the leak addressed
	                            // value - if No then => Additional Review
	                            if (manualEntryValues[0].componentsForLicenseGridValues.leakAddressedWithinRequiredTimeframe === 'No') {
		                            ruleResults = 'Additional Review';
	                            }
	                            /// temp
	                            await console.log('ruleResults: ' + ruleResults);
	                            /// temp
                            
                                await OneStop.setSelectDropDownValueByCSS(
                                    '#componentGrid tbody tr:nth-child(1) td:nth-child(6).select-cell select',
                                    manualEntryValues[0].componentsForLicenseGridValues.leakAddressedWithinRequiredTimeframe);
                                await driver.sleep(300);
                            });
                    });

                    //5. Reason Leaks Not Addressed
                    if (manualEntryValues[0].componentsForLicenseGridValues.leakAddressedWithinRequiredTimeframe === 'No') {
                        describe('add the reason leaks not addressed', () => {
                            it('click reason leaks not addressed cell in the grid', async () => {
                                await OneStop.clickElementByCSS('#componentGrid tbody tr:nth-child(1) td:nth-child(7)');
                                await driver.sleep(500);
                            });

                            it('select the reason leaks not addressed > ' +
                                manualEntryValues[0].componentsForLicenseGridValues.reasonLeaksNotAddressed,
                                async () => {
                                    await OneStop.setSelectDropDownValueByCSS(
                                        '#componentGrid tbody tr:nth-child(1) td:nth-child(7).select-cell select',
                                        manualEntryValues[0].componentsForLicenseGridValues.reasonLeaksNotAddressed);
                                    await driver.sleep(300);
                                });
                        });
                    }

                    //6. Comments
                    describe('add the comments', () => {
                        it('click comment cell in the grid', async () => {
                            await OneStop.clickElementByCSS('#componentGrid tbody tr:nth-child(1) td:nth-child(8)');
                            await driver.sleep(300);
                        });

                        const commentsValue = Math.floor((Math.random() * 1000) + 1);
                        //if value exists in the array then use it
                        if (manualEntryValues[0].componentsForLicenseGridValues.commentsValue ||
                            manualEntryValues[0].componentsForLicenseGridValues.commentsValue.length > 0) {
                            it('set the comments > ' +
                                manualEntryValues[0].componentsForLicenseGridValues.commentsValue + ' ' + commentsValue,
                                async () => {
                                    await OneStop.setTextFieldValueByCSS(
                                        '#componentGrid tbody tr:nth-child(1) td:nth-child(8)>input',
                                        manualEntryValues[0].componentsForLicenseGridValues.commentsValue + ' ' +
                                        commentsValue);
                                    await driver.sleep(300);
                                });
                            //if the value does not exist in the array then generate one and use it
                        } else {
                            it('set the comments > ' + commentsValue, async () => {
                                await OneStop.setTextFieldValueByCSS(
                                    '#componentGrid tbody tr:nth-child(1) td:nth-child(8)>input', commentsValue);
                                await driver.sleep(300);
                            });
                        }
                    });
                });
            }

            describe('save and validate that no errors are displayed', () => {
                OneStop.clickSave();
            });
        });
    };

    OneStop.pageBulkUploadCsvFile = (openApplication, bulkUploadValues, attachmentFolderPath) => {
        describe('bulk upload (CSV) > peace river page', () => {
            if (openApplication) {
                OneStop.openApplicationByLink();
            }

            describe('navigate to bulk upload > peace river', () => {
                //navigate to leftside Bulk Upload - Peace River tab
                OneStop.clickLeftSideMenuItems('bulkUploadTab:peaceRiverBulk', '#uploadCSVPanelHeading');
            });

            describe('upload the csv file', () => {
                it('select the upload type as ' + bulkUploadValues[0].csvUploadSettings.uploadType, async () => {
                    await OneStop.setSelectDropDownValueByCSS('#uploadType',
                        bulkUploadValues[0].csvUploadSettings.uploadType);
                    await driver.sleep(100);
                });

                it('attach ' + bulkUploadValues[0].csvUploadSettings.fileName + ' file', async () => {
                    await OneStop.setFileUploadByCSS('#bulkUpload input[type="file"]',
                        attachmentFolderPath + bulkUploadValues[0].csvUploadSettings.fileName);
                    await OneStop.waitForPageLoad();
                });

                //validate the file-view section is displayed with the name of the file
                OneStop.validateDisplayedText('.file-view .file-view-col:nth-child(2)',
                    bulkUploadValues[0].csvUploadSettings.fileName);    //.file-view p.file-name (this is display: none)

                //validate the uploaded files grid has a record with the file name of the uploaded file
                OneStop.validateDisplayedText('#bulkUploadGrid td:nth-child(1) #enabledLinkSpan',
                    bulkUploadValues[0].csvUploadSettings.fileName);
	
	            //validate the uploaded files grid has the file template as summary/detail for the current file
	            OneStop.validateDisplayedText('#bulkUploadGrid tbody>tr:nth-child(1) .fileTemplate',
		            bulkUploadValues[0].csvUploadSettings.uploadType);
             
	            //validate the uploaded files grid has the status as IN_PROGRESS for the current file
	            OneStop.validateDisplayedText('#bulkUploadGrid tbody>tr:nth-child(1) .status', 'IN_PROGRESS');
	
	            it('wait while the status is in progress and check it to change to completed', async () => {
		            let element = await driver.findElement(By.css('#bulkUploadGrid tbody>tr:nth-child(1) .status'));
		            let elementText = await element.getText();
		            
		            if (elementText === 'IN_PROGRESS') {
		                let loopCounter = 0;
		                while (elementText === 'IN_PROGRESS' && loopCounter < 20) {
		                    //wait shortly
		                    await driver.sleep(waitShort * 2);
                            //console.log(loopCounter + '. elementText: ' + elementText);
		                    
		                    //click the refresh button
                            await OneStop.clickElementByCSS('#refreshUploadedFilesButton');
			                await OneStop.waitForPageLoad();
			                
                            //check the status again
			                element = await driver.findElement(By.css('#bulkUploadGrid tbody>tr:nth-child(1) .status'));
			                elementText = await element.getText();
                   
			                //exit the loop when COMPLETED
			                if (elementText === 'COMPLETED') {
				                loopCounter = 20;
				                //console.log(loopCounter + '. elementText: ' + elementText);
			                } else if (elementText === 'ERRORED') {
				                loopCounter = 20;
				                throw 'uploaded file ' + bulkUploadValues[0].csvUploadSettings.fileName +
				                ' not completed but ' + elementText;
			                } else if (elementText === 'IN_PROGRESS') {
				                loopCounter++;
			                }
                        }
			
			            if (elementText === 'IN_PROGRESS') {
				            throw 'more time was needed for the file upload, file name: ' + bulkUploadValues[0].csvUploadSettings.fileName +
				            ', status (after waitShort * 2 * 20): ' + elementText;
			            }
                    }
	            });
            });

            describe('save and validate that no errors are displayed', () => {
                OneStop.clickSave();
            });
        });
    };

    //this tab is available only for?!
    let submissionReferenceId, amendmentNumber;
    OneStop.pageOverviewValidationsRules = (validationRules) => {
        describe('overview > validations/rules page', () => {
            
            //var rowsCounterRecentSubmissions = 0;
            const businessRulesValidation = (ruleDescription, ruleResults, ruleIndex) => {
                //rule description #:
                OneStop.validateDisplayedText(
                    '.business-rules-grid tr:nth-child(' + (ruleIndex + 1) + ') td.ruleDescription', ruleDescription);
                //rule results #:
                OneStop.validateDisplayedText(
                    '.business-rules-grid tr:nth-child(' + (ruleIndex + 1) + ') td.result', ruleResults);
            };

            describe('navigate to overview > validations/rules', () => {
                //navigate to leftside Overview - Validations/Rules tab
                OneStop.clickLeftSideMenuItems('overviewTab:validationsRules', '#ValidationsPanelHeading');

                //1. retrieve the submissionReferenceId for later usage
                it('retrieve the submission reference id', async () => {
                    //check that we're on the Overview > Validations/Rules page - here we'll get the reference id from
                    const elementPage = await driver.findElement(
                        By.css('div#nav-item-header-overviewTab.active-nav-item-header'));
                    if (elementPage) {
                        const element = await driver.findElement(By.css('#submissionInformation>li:nth-child(1)'));
                        const elementText = await element.getText();
                        submissionReferenceId = elementText.replace('Submission: ', '');
                    }
                });

                //2. retrieve the amendment# for later usage
                it('retrieve the amendment number', async () => {
                    //check that we're on the Overview > Validations/Rules page - here we'll get the amendment nr from
                    const elementPage = await driver.findElement(
                        By.css('div#nav-item-header-overviewTab.active-nav-item-header'));
                    if (elementPage) {
                        const element = await driver.findElement(By.css('#submissionInformation>li:nth-child(2)'));
                        const elementTextAmendmentNr = await element.getText();
                        amendmentNumber = elementTextAmendmentNr.replace('Amendment Number: ', '');
                    }
                });
            });
	
            if (validationRules[0].applicationValidation === true) {
                describe('business rules validation', () => {
	                for (let i = 0; i < validationRules[0].businessRules.length; i++) {
	                    ///NOTE: the rule results do not always match
		                //validationRules[0].businessRules[i].ruleResults --> this holds the values (but they change)
		                // //here it does not know the ruleResults (they change based on some not fully known rules - updating them)
		                // it('update the rule results value', async () => {
		                //    // if (i !== 0) {
		                //    //    ruleResults = validationRules[0].businessRules[i].ruleResults;
		                //    //    //console.log('ruleResults: ' + ruleResults);
		                //    //    await driver.sleep(100);
		                //    // }
		                //
		                //    console.log('ruleResults before: ' + ruleResults);
		                //    ruleResults = (i !== 0) ? validationRules[0].businessRules[i].ruleResults : ruleResults;
		                //    console.log('ruleResults after: ' + ruleResults);
		                // });
		                // describe('overview > validations/rules page', (ruleResults) => {
		                businessRulesValidation(validationRules[0].businessRules[i].ruleDescription, validationRules[0].businessRules[i].ruleResults, i);
		                // });
	                }
                });
                //  the shitty piece (extra validation - on the emissions page after the record )
                // describe('navigate to submissions > emissions', function () {
                // 	OneStop.clickTopMenuItems('Operate', 'Emissions Reporting', '#peaceRiverType');
                // });
                //
                // describe('find the recently created submissions record', function () {
                // 	it('find the recent reference id and click on its view rules button', function (done) {
                // 		driver.findElements(By.css('.recent-submissions-grid tr td.referenceId'))
                // 			.then(function (elements) {
                // 				rowsCounterRecentSubmissions = elements.length;
                // 				for (var i = 0; i < 10; i++) {
                // 					if(i < rowsCounterRecentSubmissions) {
                // 						// console.log(findRecentSubmissionsAndClickViewRules(i));
                // 						findRecentSubmissionsAndClickViewRules(i);
                // 						done();
                // 					} else {
                // 						break;
                // 					}
                // 				}
                // 			});
                // 	});
                //
                // 	//validate modal's title is Business Rules
                // 	OneStop.confirmModalHeader('Business Rules');
                // });
                //
                // describe('business rules validation', function () {
                // 	for (var i = 0; i < validationRules[0].businessRules.length; i++) {
                // 		if (i !== 0) {
                // 			ruleResults  = validationRules[0].businessRules[i].ruleResults;
                // 		}
                // 		businessRulesValidation(validationRules[0].businessRules[i].ruleDescription, ruleResults, i);
                // 	}
                //
                // 	it('close the business rules modal dialog', function (done) {
                // 		OneStop.clickElementByCSS('.modal-dialog button.cancel');
                // 		driver.sleep(300);
                // 		done();
                // 	});
                // });
            }
            return submissionReferenceId;
        });
    };

    //counter               --->    .recent-submissions-grid tr td.referenceId
    //reference id cell     --->    .recent-submissions-grid tr:nth-child(i) td.referenceId
    //view rules button     --->    .recent-submissions-grid tr:nth-child(i) button[data-event="show:rules"]
    const findRecentSubmissionsAndClickViewRules = async (rowIndex) => {
        //                         .recent-submissions-grid tr:nth-child(1) button[data-event="show:rules"]
        const element = await driver.findElement(
            By.css('.recent-submissions-grid tr:nth-child(' + (rowIndex + 1) + ') td.referenceId'));
        const referenceId = await element.getText();
        console.log('rowIndex: ' + rowIndex + '\nreferenceId: ' + referenceId);
        if (referenceId === submissionReferenceId) {
            await driver.sleep(100);
            //console.log('elementText found: ' + elementText);
            await OneStop.clickElementByCSS('.recent-submissions-grid tr:nth-child(' + (rowIndex + 1) + ') button[data-event="show:rules"]');
            await OneStop.waitForPageLoad();
            return referenceId;
        } else {
            await driver.sleep(100);
            return "";
        }
    };

    const findRecentSubmissionsAndClickValidate = async (rowIndex) => {
        const element = await driver.findElement(
            By.css('.recent-submissions-grid tr:nth-child(' + (rowIndex + 1) + ') td.referenceId'));
        console.log('console: ' + element.getText());
        const elementText = await element.getText();
        if (elementText === submissionReferenceId) {
            await driver.sleep(300);
            await OneStop.clickElementByCSS('.recent-submissions-grid tr:nth-child(' + (rowIndex + 1) +
                ') button[data-event="validate:submission"]');
            //return elementText;
        }
    };

    const findRecentSubmissionsAndClickViewEdit = async (rowIndex) => {
        //find the matching reference id
        const element = await driver.findElement(By.css('.recent-submissions-grid tr:nth-child(' + (rowIndex + 1) +
            ') td.referenceId'));
        const elementText = await element.getText();
        // console.log('elementText: ' + elementText);  //this is the reference id

        if (elementText === submissionReferenceId) {
            //click View btn
            await OneStop.clickElementByCSS('.recent-submissions-grid tr:nth-child(' + (rowIndex + 1) + ') button[data-event="show:details"]');
            await OneStop.waitForPageLoad();
            await OneStop.waitForObjectLoad('#wellsPanelHeading', waitLong * 5, 500, true);
            return true;
        }
    };

    const findItemWithinRecentSubmissionsGridByColumnClass = async (rowIndex, tdClass, expectedValue) => {
        let element = await driver.findElement(By.css('.recent-submissions-grid tr:nth-child(' +
            (rowIndex + 1) + ') td.referenceId'));
        let elementText = await element.getText();
        //if referenceID is the one we're looking for then use same index and get the value of other column you need (tdClass)
        if (elementText === submissionReferenceId) {
            await driver.sleep(300);
            //.recent-submissions-grid tr:nth-child(1) td.industryStatus    -- Status column does not have the .industryStatus class when status = received
            //.recent-submissions-grid tbody>tr:nth-child(1) td:nth-child(10)
            //.recent-submissions-grid tr:nth-child(1) td:nth-child(10)
            if (tdClass && tdClass === 'industryStatus') {
                element = await driver.findElement(By.css('.recent-submissions-grid tr:nth-child(' +
                    (rowIndex + 1) + ') td:nth-child(10)'));
                elementText = await element.getText();
                expect(elementText.toLowerCase()).to.equal(expectedValue);
                return elementText;
            } else if (tdClass) {
                element = await driver.findElement(By.css('.recent-submissions-grid tr:nth-child(' +
                    (rowIndex + 1) + ') td.' + tdClass));
                elementText = await element.getText();
                expect(elementText.toLowerCase()).to.equal(expectedValue);
                return elementText;
            } else {
                throw 'wrong class element ' + tdClass + ', such class does not exist';
            }
        }
    };
	
    const fillSubmissionForm = async (submissionValues) => {
	    it('click the submit button', async () => {
	    	const elementSubmitBtn1 = await driver.findElements(By.css('#submitButton'));
		    const elementSubmitBtn2 = await driver.findElements(By.css('.submit-facility'));
	    	if (elementSubmitBtn1.length > 0) {
			    await OneStop.clickElementByCSS('#submitButton');
			    await OneStop.waitForPageLoad();
		    } else if (elementSubmitBtn2.length > 0) {
			    await OneStop.clickElementByCSS('.submit-facility');
			    await OneStop.waitForPageLoad();
		    }
	    });
	
	    //validate modal's title is Contact Information, Declaration and Disclaimer
	    OneStop.confirmModalHeader('Contact Information, Declaration and Disclaimer');
	    
	    describe('fill in the primary contact info', () => {
		    it('set the contact name > ' + submissionValues.primaryContactInfo.contactName, async () => {
				    await OneStop.setTextFieldValueByCSS('input[name="primaryContactName"]',
					    submissionValues.primaryContactInfo.contactName);
				    await driver.sleep(300);
			    });
		
		    it('set the title > ' + submissionValues.primaryContactInfo.title, async () => {
			    await OneStop.setTextFieldValueByCSS('input[name="primaryContactTitle"]',
				    submissionValues.primaryContactInfo.title);
			    await driver.sleep(300);
		    });
		
		    it('set the email > ' + submissionValues.primaryContactInfo.email, async () => {
			    await OneStop.setTextFieldValueByCSS('input[name="primaryContactEmail"]',
				    submissionValues.primaryContactInfo.email);
			    await driver.sleep(300);
		    });
		
		    it('set the primary phone > ' + submissionValues.primaryContactInfo.primaryPhone, async () => {
				    await OneStop.setTextFieldValueByCSS('input[name="primaryContactPhone"]',
					    submissionValues.primaryContactInfo.primaryPhone);
				    await driver.sleep(300);
			    });
		
		    it('set the cell phone > ' + submissionValues.primaryContactInfo.cellPhone, async () => {
			    await OneStop.setTextFieldValueByCSS('input[name="primaryContactCell"]',
				    submissionValues.primaryContactInfo.cellPhone);
			    await driver.sleep(300);
		    });
		
		    it('check the declaration and disclaimer exists and is correct', async () => {
			    await OneStop.validateDisplayedText('.disclaimer-paragraph',  submissionValues.declarationAndDisclaimerValue);
		    });
	    });
	
	    if (submissionValues.secondaryContactInfo) {
		    describe('fill in the secondary contact info', () => {
			    it('set the contact name > ' + submissionValues.secondaryContactInfo.contactName, async () => {
					    await OneStop.setTextFieldValueByCSS('input[name="secondaryContactName"]',
						    submissionValues.secondaryContactInfo.contactName);
					    await driver.sleep(300);
				    });
			
			    it('set the title > ' + submissionValues.secondaryContactInfo.title, async () => {
				    await OneStop.setTextFieldValueByCSS('input[name="secondaryContactTitle"]',
					    submissionValues.secondaryContactInfo.title);
				    await driver.sleep(300);
			    });
			
			    it('set the email > ' + submissionValues.secondaryContactInfo.email, async () => {
				    await OneStop.setTextFieldValueByCSS('input[name="secondaryContactEmail"]',
					    submissionValues.secondaryContactInfo.email);
				    await driver.sleep(300);
			    });
			
			    it('set the primary phone > ' + submissionValues.secondaryContactInfo.primaryPhone, async () => {
					    await OneStop.setTextFieldValueByCSS('input[name="secondaryContactPhone"]',
						    submissionValues.secondaryContactInfo.primaryPhone);
					    await driver.sleep(300);
				    });
			
			    it('set the cell phone > ' + submissionValues.secondaryContactInfo.cellPhone, async () => {
					    await OneStop.setTextFieldValueByCSS('input[name="secondaryContactCell"]',
						    submissionValues.secondaryContactInfo.cellPhone);
					    await driver.sleep(300);
				    });
			
			    if (submissionValues.secondaryContactInfo.includeSecondaryContactOnAllCorrespondence) {
				    it('set the include secondary contact on all correspondence as ' +
					    submissionValues.secondaryContactInfo.includeSecondaryContactOnAllCorrespondence, async () => {
						    await OneStop.setButtonCheckboxByCSS('input[name="secondaryContactCorrespondenceInd"]');
					    });
			    }
		    });
	    }
	
	    describe('agree and confirm submission', () => {
		    it('click agree button', async () => {
			    await OneStop.clickElementByCSS('.agree');
			    await driver.sleep(300);
		    });
		
		    OneStop.confirmSubmission('Confirm Submissions', 'success');
	    });
	};
    
    OneStop.pageSubmitPeaceRiverEmissions = (emissionsSubmissionValues) => {
        describe('submissions > emissions page - submit the emission', () => {
            // describe('navigate to submissions > emissions', function () {
            // 	OneStop.clickTopMenuItems('Operate', 'Emissions Reporting', '#peaceRiverType');
            // });
            //
            // describe('find the recently created submissions record', function () {
            // 	it('find the recent reference id and click on its view/edit button', function (done) {
            // 		driver.findElements(By.css('.recent-submissions-grid tr td.referenceId'))
            // 			.then(function (elements) {
            // 				var rowsCounterRecentSubmissions = elements.length;
            // 				for (var i = 0; i < 10; i++) {
            // 					if (i < rowsCounterRecentSubmissions) {
            // 						console.log('submissionReferenceId: ' + submissionReferenceId);
            // 						// console.log(findRecentSubmissionsRecordAndClickViewRules(i));
            // 						findRecentSubmissionsAndClickViewEdit(i);
            // 						done();
            // 					} else {
            // 						break;
            // 					}
            // 				}
            // 			});
            // 	});

            describe('navigate to overview > validations/rules and click submit button', () => {
                //navigate to leftside Overview - Validations/Rules tab
                OneStop.clickLeftSideMenuItems('overviewTab:validationsRules', '#ValidationsPanelHeading');

                it('check the submission number is correct', async () => {
                    await OneStop.validateDisplayedText('#ValidationsPanelHeading a', submissionReferenceId);
                });
	
	            it('check the validation message is correct - all validation passing', async () => {
		            await OneStop.validateDisplayedText('#validationText', 'All validations passing for '
                        + submissionReferenceId);
	            });
	
	            it('validate that submit button is visible & enabled', async () => {
		            await OneStop.waitForObjectLoad('#submitButton', waitLong, 500, true);
	            });
	            
            });
	
	        if (emissionsSubmissionValues.submitEmissions === true) {
		        describe('fill in contact information, declaration and disclaimer', () => {
			        fillSubmissionForm(emissionsSubmissionValues);
		        });
	        }
            //emissionsSubmissionValues[0]
            
        });
    };

    OneStop.pageSubmissionEmissionsValidatePeaceRiverSubmission = (submissionStatus, filterType) => {
        describe('submissions > emissions page - validate the record was submitted', () => {
            describe('navigate to submissions > emissions', () => {
                OneStop.clickTopMenuItems('Operate', 'Emissions Reporting', '#peaceRiverType');
            });
            
            describe('find the recently created submissions record and validate its status is ' + submissionStatus, () => {
                if (filterType && filterType === 'submitted') {
	                it('click draft filter link in the recent submissions grid', async () => {
		                await OneStop.clickElementByCSS('#RecentSubmissionsPanelHeading .dropdown.pull-right>button');
	                });
	
	                it('select submitted option', async () => {
		                await OneStop.clickElementByCSS('#RecentSubmissionsPanelHeading .dropdown-menu a[value="Submitted"]');
		                await OneStop.waitForPageLoad();
	                });
                }

                it('find the recent reference id and check its status', async () => {
                    let referenceStatus = '';
                    const elements = await driver.findElements(By.css('.recent-submissions-grid tr td.referenceId'));
                    let rowsCounterRecentSubmissions = elements.length;
                    for (let i = 0; i < 10; i++) {
                        if (i < rowsCounterRecentSubmissions) {
                            //.recent-submissions-grid tr:nth-child(1) td.industryStatus
                            //.recent-submissions-grid tr:nth-child(1) td:nth-child(10)
                            referenceStatus = await findItemWithinRecentSubmissionsGridByColumnClass(i,
                                'industryStatus', submissionStatus);    //'under review'
                            if (referenceStatus && referenceStatus.toLowerCase() === submissionStatus) {    //'under review'
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                });
            });
        });
    };
	
	OneStop.pageSubmissionEmissionsPeaceRiverValidateCsvValuesAreCorrect = (peaceRiverEmissionsPreconditionValues, peaceRiverCSVLicenseeInfo) => {
		describe('submissions > emissions page - validate the record contains the csv values', () => {
			describe('navigate to submissions > emissions', () => {
				OneStop.clickTopMenuItems('Operate', 'Emissions Reporting', '#peaceRiverType');
			});
			
			describe('find the recently created submissions record and click on the view button ', () => {
				it('find the recent reference id and click the view button', async () => {
					const elements = await driver.findElements(By.css('.recent-submissions-grid tr td.referenceId'));
					let rowsCounterRecentSubmissions = elements.length;
					for (let i = 0; i < 10; i++) {
						if (i < rowsCounterRecentSubmissions) {
							//.recent-submissions-grid tr:nth-child(1) td.industryStatus
							//.recent-submissions-grid tr:nth-child(1) td:nth-child(10)
							let elementFound = await findRecentSubmissionsAndClickViewEdit(i);
							if (elementFound === true) {
							    break;
                            }
						} else {
							break;
						}
					}
				});
				
				//navigate to leftside Emissions Reporting - Peace River Emissions tab
				OneStop.clickLeftSideMenuItems('peaceRiverReportingTab:peaceRiverEmissions', 'a[data-id="peaceRiverReportingTab:peaceRiverEmissions"]');
				
				//retrieve the Peace River Emissions section's values and compare with the CSV ones
				it('retrieve the reporting format and validate it is ' + peaceRiverEmissionsPreconditionValues.reportingFormat, async () => {
                    const elementDropDown = await driver.findElement(By.css('#reportingFormat'));
                    const elementSelectedValue = await elementDropDown.getAttribute('value'); //me
                    const elementSelectedOption = await driver.findElement(By.css('#reportingFormat option[value="' + elementSelectedValue + '"]'));
                    const elementValue = await elementSelectedOption.getText(); //Manual Entry
					expect(elementValue.toLowerCase()).to.equal(peaceRiverEmissionsPreconditionValues.reportingFormat.toLowerCase());
				});
				
				it('retrieve the reporting frequency and validate it is ' + peaceRiverEmissionsPreconditionValues.manualEntries.peaceRiverEmissions.reportingFrequency, async () => {
					const element = await driver.findElement(By.css('#reportingFrequency'));
					const elementValue = await element.getAttribute('value');
					expect(elementValue.toLowerCase()).to.equal((peaceRiverEmissionsPreconditionValues.manualEntries.peaceRiverEmissions.reportingFrequency).toLowerCase());
				});
				
				it('retrieve the reporting period and validate it is ' +
                    peaceRiverEmissionsPreconditionValues.manualEntries.peaceRiverEmissions.reportingPeriod, async () => {
					const elementDropDown = await driver.findElement(By.css('#reportingPeriod'));
					const elementSelectedValue = await elementDropDown.getAttribute('value'); //17
					const elementSelectedOption = await driver.findElement(By.css('#reportingPeriod option[value="' + elementSelectedValue + '"]'));
					const elementValue = await elementSelectedOption.getText(); //December 1,2017- December31,2017
					expect(elementValue.toLowerCase()).to.equal((peaceRiverEmissionsPreconditionValues.manualEntries.peaceRiverEmissions.reportingPeriod).toLowerCase());
				});
				
				//Licensee Information section
				it('retrieve the manager responsible and validate it is ' + peaceRiverCSVLicenseeInfo.managerResponsible, async () => {
					const element = await driver.findElement(By.css('#managerResponsible'));
					const elementValue = await element.getAttribute('value');
					expect(elementValue.toLowerCase()).to.equal((peaceRiverCSVLicenseeInfo.managerResponsible).toLowerCase());
				});
				
				it('retrieve the licensee representative and validate it is ' + peaceRiverCSVLicenseeInfo.licenseeRepresentative, async () => {
					const element = await driver.findElement(By.css('#licenseeRepresentative'));
					const elementValue = await element.getAttribute('value');
					expect(elementValue.toLowerCase()).to.equal((peaceRiverCSVLicenseeInfo.licenseeRepresentative).toLowerCase());
				});
				
				it('retrieve the licensee phone number and validate it is ' + peaceRiverCSVLicenseeInfo.licenseePhoneNumber, async () => {
					const element = await driver.findElement(By.css('#licenseePhoneNumber'));
					const elementValue = await element.getAttribute('value');
					expect(elementValue.toLowerCase()).to.equal((peaceRiverCSVLicenseeInfo.licenseePhoneNumber).toLowerCase());
				});
			});
		});
	};
//<<<<<< EMISSIONS REPORTING - PEACE RIVER EMISSIONS <<<<<<-------------------------------------------------------------

    return OneStop;
})();

module.exports = OneStop;
