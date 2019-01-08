/**
 * Created by cb5rp on 5/26/2017.
 */

const waitShort = 2000;
const waitLong = 10000;
const harness = require('../../../../lib/harness');
const OneStop = require('../../../../lib/OneStopApp-reccert');

describe(harness.getCommandLineArgs().appType + ':' + harness.getCommandLineArgs().appSubType +
    ' - (' + harness.getCommandLineArgs().username + ' - ' + harness.getCommandLineArgs().env + ')', function () {
    let harnessObj = null;

    before(async () => {
        harnessObj = await harness.init();
        await OneStop.init(harnessObj, waitShort, waitLong);
        await OneStop.login();
    });

    after(async () => {
        await harnessObj.quit();
    });

    afterEach(async () => {
        await OneStop.afterEachTest(this.ctx.currentTest);
    });

    OneStop.pageGeneralContactInformation('automated tester', 'automated.tester@aer.ca');
    OneStop.pageGeneralApplicationInformation(false, 'N', harness.getCommandLineArgs().appType + ':' +
        harness.getCommandLineArgs().appSubType + ' - ' + harness.Moment().format(), null);

    OneStop.pageAssetInformationAssets(false,
        [
            {
                qtr: "",
                lsd: "10",
                sec: "28",
                twp: "71",
                rge: "13",
                mer: "6",
                constructionPractice: "Full disturbance",
                primaryAsset: "Yes"
            }
        ],
        [
            {
                type: "Access Road",
                other: "Other Type",
                llds: [
                    {
                        qtr: "",
                        lsd: "10",
                        sec: "28",
                        twp: "71",
                        rge: "13",
                        mer: "6"
                    }
                ],
                constructionPractice: "Minimum Disturbance"
            }
        ]
    );

    // OneStop.pageAssetInformationRelatedSubmissions(false,
    //     [
    //         {
    //             operator: "Repsol"
    //         }
    //     ]
    // );

    OneStop.pageSiteInformationSiteIdentification(false,
        'Y',
        '12345678',
        true,
        true,
        true,
        true,
        "ROE - Right of Entry Order",
        "Acme",
        "1",
        "2",
        "3",
        require('path').join(__dirname, '/attachments/SurveyPlan.pdf')
    );

    OneStop.pageSiteInformationAdditionalCertificatesAttached(false,
        [
            {
                number: "1",
                type: "Reclaimation Certificate",
                comments: "cert comment"
            },
            {
                number: "2",
                type: "Remediation Certificate",
                comments: "cert comment2"
            }
        ]
    );

    OneStop.pageSiteInformationPreviousRefusedCancelled(false,
        "Y",
        "ADMIN",
        "Y",
        "ADMIN",
        "OTHER",
        "howAddressedOther"
    );

    OneStop.pageSiteInformationPartialOverlapping(false,
        "Y",
        require('path').join(__dirname, '/attachments/OverlappingExemption.pdf'),
        "Y",
        require('path').join(__dirname, '/attachments/PartialReclaimation.pdf'),
        "Y"
    );

    OneStop.pageEnvironmentalSiteAssessmentPhase1Summary(false);

    OneStop.pageEnvironmentalSiteAssessmentPhase23Summary(false);

    OneStop.pageStakeholderInformationOperator(false,
        {
            contactName: "Automated Tester",
            email: "test@aer.com"
        }
    );

    OneStop.pageStakeholderInformationLandOwnerOccupants(false,
        [
            {
                type: "Landowner",
                companyName: "Company Name",
                contactName: "Automated Tester",
                phone: "123-456-7890",
                address: "123 Anywhere Street",
                city: "Calgary",
                province: "AB",
                postalZipCode: "T2T2T2",
                country: "Canada",
                email: "me@test.com",
                communicationPreference: "Email"
            },
            {
                type: "Occupant",
                companyName: "Company Name2",
                contactName: "Automated Tester2",
                phone: "123-456-7890",
                address: "1234 Anywhere Street",
                city: "Calgary",
                province: "AB",
                postalZipCode: "T2T2T2",
                country: "Canada",
                email: "me2@test.com",
                communicationPreference: "Mail"
            }
        ],
        [
            {
                type: "Landowner",
                interviewee: "Joe Landowner",
                date: new harness.Moment().format('MM/DD/YYYY'),
                interviewer: "Automated Tester",
                comments: "No concerns/Work completed acceptable.",
                intervieweeCommentOther: "other landowner comments"
            },
            {
                type: "Occupant",
                interviewee: "Joe Occupant",
                date: new harness.Moment().format('MM/DD/YYYY'),
                interviewer: "Automated Tester",
                comments: "Did not contact",
                intervieweeCommentOther: "other occupant comments"
            }
        ],
        [
            {
                path: require('path').join(__dirname, '/attachments/InterviewForm.pdf'),
                type: "Interview Form",
                comments: "some interview form comments"
            },
            {
                path: require('path').join(__dirname, '/attachments/LandTitle.pdf'),
                type: "Land Title",
                comments: "some land title comments"
            },
            {
                path: require('path').join(__dirname, '/attachments/SpecialAreasBoardSearch.pdf'),
                type: "Special Areas Board Search",
                comments: "some special area board search comments"
            }
        ]
    );

    OneStop.pageReclamationInformationDates(false,
        harness.Moment().format('MM/DD/YYYY'),
        harness.Moment().format('MM/DD/YYYY'),
        harness.Moment().format('MM/DD/YYYY'),
        harness.Moment().format('MM/DD/YYYY'),
        harness.Moment().format('MM/DD/YYYY'),
        harness.Moment().format('MM/DD/YYYY')
    );

    OneStop.pageReclamationInformationCriteriaCategoryUsed(false,
        [
            {
                name: "cultivatedConstruction",
                criteria: "Before Jan 1st, 1983"
            },
            {
                name: "peatlandsConstruction",
                criteria: "Undisturbed"
            },
            {
                name: "nativeGrasslandsJan1992",
                criteria: "Before Jan 1st, 1993"
            },
            {
                name: "nativeGrasslandsJan1993Apr1994",
                criteria: "Jan 1st, 1993 - Dec 31st, 2009"
            },
            {
                name: "nativeGrasslandsAfterApril1994",
                criteria: "April 30th, 1994 - Dec 31st, 2009"
            },
            {
                name: "forestedLandsBeforeApril1994",
                criteria: "Before June 1st, 2007"
            },
            {
                name: "forestedLandsApril1994June2007",
                criteria: "Before June 1st, 2007"
            },
            {
                name: "forestedLandsJune2007",
                criteria: "On or After June 1st, 2007"
            },
            {
                name: "forestedWhiteZoneBefore1994",
                criteria: "Before Jun. 1st, 2007"
            },
            {
                name: "forestedWhiteZoneAfter1994",
                criteria: "Before Jun. 1st, 2007"
            }
        ],
        'Y',
        'Cultivated',
        require('path').join(__dirname, '/attachments/Consent.pdf')
    );

    // OneStop.pageConfirmationValidationsRules(false);
    // OneStop.pageConfirmationOverview(false, 'Application');
});
