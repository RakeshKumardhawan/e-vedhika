export interface GPDPActivityItem {
  id: string;
  masterCode: string;
  themeNumber: number;
  themeName: string;
  activityName: string;
  focusArea: string;
  type: "Tied" | "Untied";
}

export const GPDP_THEMES = [
  { id: 1, code: "T1", name: "Theme 1 - Poverty Free and Enhanced Livelihoods Village", pilotOnly: false },
  { id: 2, code: "T2", name: "Theme 2 - Healthy Village", pilotOnly: false },
  { id: 3, code: "T3", name: "Theme 3 - Child Friendly Village", pilotOnly: false },
  { id: 4, code: "T4", name: "Theme 4 - Water Sufficient Village", pilotOnly: false },
  { id: 5, code: "T5", name: "Theme 5 - Clean and Green Village", pilotOnly: false },
  { id: 6, code: "T6", name: "Theme 6 - Self-sufficient Infrastructure in Village", pilotOnly: false },
  { id: 7, code: "T7", name: "Theme 7 - Socially Just and Socially Secured Village", pilotOnly: false },
  { id: 8, code: "T8", name: "Theme 8 - Village with Good Governance", pilotOnly: false },
  { id: 9, code: "T9", name: "Theme 9 - Women Friendly Village", pilotOnly: false },
  { id: 10, code: "T10", name: "Theme 10 - Forest Rights Act", pilotOnly: true },
  { id: 11, code: "T11", name: "Theme 11 - PESA Theme", pilotOnly: true }
];

export const GPDP_MASTER_ACTIVITIES: GPDPActivityItem[] = [
  {
    "id": "act-1-94-1",
    "masterCode": "94",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Establishment of Agricultural produce procurement unit at local level",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-1-96-2",
    "masterCode": "96",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate access/issuance of soild health card for farmers",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-1-101-3",
    "masterCode": "101",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate enrolment under crop insurance schemes",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-1-104-4",
    "masterCode": "104",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate linkage of eligible beneficiaries with appropriate schemes for agricultural produce storage structures for groups",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-1-106-5",
    "masterCode": "106",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate linkage of eligible benficaries with appropriate schemes for agricultural bunding works",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-1-109-6",
    "masterCode": "109",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Incentivizing farmers through fair value of their produce",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-1-120-7",
    "masterCode": "120",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Support in Production of bio fertiliser/ organic manure/ Vermi compost etc.",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-1-121-8",
    "masterCode": "121",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Support livelihood activities such as mushroom cultivation etc/pisciculture",
    "focusArea": "Agriculture,Fisheries",
    "type": "Untied"
  },
  {
    "id": "act-1-90-9",
    "masterCode": "90",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Create awareness on FPOs and support formation/ strngthening of FPOs through farmer mobilisation",
    "focusArea": "Agriculture,Poverty allevation programme",
    "type": "Untied"
  },
  {
    "id": "act-1-92-10",
    "masterCode": "92",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Cultivation of organic products and provide marketing support such as labeling of products, promotion in different forums etc",
    "focusArea": "Agriculture,Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-1-111-11",
    "masterCode": "111",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Management of Animal feed unit",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-1-112-12",
    "masterCode": "112",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Management of Cattle & Buffalo",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-1-113-13",
    "masterCode": "113",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Management of Duckery unit",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-1-114-14",
    "masterCode": "114",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Management of Piggery unit",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-1-118-15",
    "masterCode": "118",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Setting up of Poultry/piggery/ duckery/animal feed unit",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-1-91-16",
    "masterCode": "91",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Create awareness on volunteering and community support initiatices, including animal welfare activities",
    "focusArea": "Animal husbandry,Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-1-107-17",
    "masterCode": "107",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate provision of Ujjwala LPG gas connections for eligible households",
    "focusArea": "Fuel and fodder",
    "type": "Untied"
  },
  {
    "id": "act-1-115-18",
    "masterCode": "115",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Management of Poultry Unit",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-1-99-19",
    "masterCode": "99",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate asset construction demand",
    "focusArea": "Poverty allevation programme",
    "type": "Untied"
  },
  {
    "id": "act-1-100-20",
    "masterCode": "100",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate demand based employment",
    "focusArea": "Poverty allevation programme",
    "type": "Untied"
  },
  {
    "id": "act-1-117-21",
    "masterCode": "117",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Promote rural tourism based livelihood and income generation activities such as homestay etc",
    "focusArea": "Poverty allevation programme,Cultural activities",
    "type": "Untied"
  },
  {
    "id": "act-1-116-22",
    "masterCode": "116",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Organise career counselling camps to promote self-employment opportunities at the GP level",
    "focusArea": "Poverty allevation programme,Technical training and vocational education",
    "type": "Untied"
  },
  {
    "id": "act-1-103-23",
    "masterCode": "103",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate formation oh SHGs and provide support for strengthening SHGs in Gram Panchayats",
    "focusArea": "Poverty allevation programme,Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-1-102-24",
    "masterCode": "102",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate formation of bank sakhi",
    "focusArea": "Poverty allevation programme,Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-1-97-25",
    "masterCode": "97",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate access to housing related beenfits for eligible households",
    "focusArea": "Rural housing",
    "type": "Untied"
  },
  {
    "id": "act-1-110-26",
    "masterCode": "110",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Manage and operate Primary/Food Processing units/project",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-1-122-27",
    "masterCode": "122",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Support to block/district level federation-to provide marketing support, providing space in complex prepared by BP/DP, packaging and branding etc",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-1-95-28",
    "masterCode": "95",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Establish Primary/Food Processing units/project",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-1-105-29",
    "masterCode": "105",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate linkage of eligible beneficiaries with appropriate schemes for farm forstry and tree plantation activities based on demand",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-1-89-30",
    "masterCode": "89",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Conduct IEC/ awareness and inclusion camps for social protection and beneficiary-oriented schemes",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-1-93-31",
    "masterCode": "93",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Distribution of any beneficiary oriented items/services as per local needs",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-1-98-32",
    "masterCode": "98",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitate access to NSAP widow pension benefits for eligible beneficiaries",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-1-108-33",
    "masterCode": "108",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Facilitation/provision of skill development training",
    "focusArea": "Technical training and vocational education",
    "type": "Untied"
  },
  {
    "id": "act-1-119-34",
    "masterCode": "119",
    "themeNumber": 1,
    "themeName": "Theme 1 - Poverty Free and Enhanced Livelihoods Village",
    "activityName": "Skilling centres at Block and District level",
    "focusArea": "Technical training and vocational education",
    "type": "Untied"
  },
  {
    "id": "act-2-125-35",
    "masterCode": "125",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Distribution of sapling to the Mothers to promote healthy diet & significance of basic food groups in diet",
    "focusArea": "Agriculture,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-143-36",
    "masterCode": "143",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing plantation/ promote Nutri Garden in AWC /Households/ School",
    "focusArea": "Agriculture,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-134-37",
    "masterCode": "134",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing Awareness Campaign/ Program including Nukkad Natak/Street Play on Maternal and Child health",
    "focusArea": "Cultural activities,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-126-38",
    "masterCode": "126",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Identification and monitoring of pregnant and lactating mothers through awareness camp",
    "focusArea": "Family welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-129-39",
    "masterCode": "129",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Oraginizing awareness camp/ program on significance of health & nutrition",
    "focusArea": "Family welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-131-40",
    "masterCode": "131",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Oranizing Training of Mid Wives on safe & institutional delivery",
    "focusArea": "Family welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-135-41",
    "masterCode": "135",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing awareness camp on institutional delivery and early registration to the hospitals for ante-natal chaeck up & post natal check up of pregnanat mothers",
    "focusArea": "Family welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-136-42",
    "masterCode": "136",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing awareness camp on rountine immunization of children",
    "focusArea": "Family welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-138-43",
    "masterCode": "138",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing Awareness & IEC campaign on Health Schemes/ Program",
    "focusArea": "Family welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-148-44",
    "masterCode": "148",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Providing Supplementary food to the Pregnant Women in AWC/ Health Sub-Centers",
    "focusArea": "Family welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-123-45",
    "masterCode": "123",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Distribution of Deworming Tablet to the children in School /AWC/Health Centers",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-124-46",
    "masterCode": "124",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Distribution of Mosquito nets",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-127-47",
    "masterCode": "127",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Maintenance and upgradation of Health Sub- Centres/ Public Health Center/ Aryogaya Health center/ Health Dispenciary",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-128-48",
    "masterCode": "128",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Oraganizing Blood Donation Camp",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-130-49",
    "masterCode": "130",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Oranizing awareness program to celebrate Village Health and Nutrition Days",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-132-50",
    "masterCode": "132",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organize Mental Health Awareness Camps & Development of IEC materials on Mental Health",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-133-51",
    "masterCode": "133",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing awareness camp about child heath through campaign",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-139-52",
    "masterCode": "139",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing awareness Progarm & IEC campaign on symptoms of anaemia; vicious cycle of anaemia",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-140-53",
    "masterCode": "140",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing awareness Progarm & IEC campaign on symptoms of Vector Borne Diseases (VBD)",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-142-54",
    "masterCode": "142",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing health camp for screening Non- Communicable Diseases",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-145-55",
    "masterCode": "145",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Procurement of Equipment for Ambulance",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-146-56",
    "masterCode": "146",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Procurement of Equipment for Rural Hospital/ Health Sub Centres/ Public Health Center/ Health Dispenciary/ Arogya Health Center",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-147-57",
    "masterCode": "147",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Procurement of Weighing machine & other growth monitoing machine; medical equipment in AWC",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-149-58",
    "masterCode": "149",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Providing Supplementary Nutricious food for TB Patients",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-150-59",
    "masterCode": "150",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Provision of Tele Medicine at GP Office/ Health Sub-Center",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-2-137-60",
    "masterCode": "137",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing awareness generation program/camp to include millets in diets through Anganwadi, Mid-Day meal and PD scheme",
    "focusArea": "Public distribution system,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-141-61",
    "masterCode": "141",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing Camp for inclusion of name in the list of health card/ health insurance at GP Level",
    "focusArea": "Social welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-2-144-62",
    "masterCode": "144",
    "themeNumber": 2,
    "themeName": "Theme 2 - Healthy Village",
    "activityName": "Organizing Special screening camp to identify & track SAM & MAM Children",
    "focusArea": "Women and child development,Health",
    "type": "Untied"
  },
  {
    "id": "act-3-154-63",
    "masterCode": "154",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Awareness Program/Campaign - Health, Nutrion & Hygiene practices",
    "focusArea": "Education",
    "type": "Untied"
  },
  {
    "id": "act-3-158-64",
    "masterCode": "158",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Child Participation, Leadership Strengthening & Facilitation",
    "focusArea": "Education",
    "type": "Untied"
  },
  {
    "id": "act-3-164-65",
    "masterCode": "164",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Enrolment drive in School/ Technical Educational Institute; Tracking of the drop out children",
    "focusArea": "Education",
    "type": "Untied"
  },
  {
    "id": "act-3-155-66",
    "masterCode": "155",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Awareness Program/ Rallies/ Campaign on importance of education/ vocational / technical education",
    "focusArea": "Education,Technical training and vocational education",
    "type": "Untied"
  },
  {
    "id": "act-3-157-67",
    "masterCode": "157",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Capacity Building & Training of Children",
    "focusArea": "Education,Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-175-68",
    "masterCode": "175",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Providing Educational Materials /Special Coaching Support to the student",
    "focusArea": "Education,Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-163-69",
    "masterCode": "163",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Demonstration & Distribution of Supplementary Nutritious food",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-3-171-70",
    "masterCode": "171",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Mid day meal provisions",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-3-172-71",
    "masterCode": "172",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Plantation of Nutri Garden in AWC /Households/ School",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-3-177-72",
    "masterCode": "177",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Setting up of digital library smart classes/Language Lab in school",
    "focusArea": "Libraries",
    "type": "Untied"
  },
  {
    "id": "act-3-167-73",
    "masterCode": "167",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Installation of RO unit for drinking water in AWC/ Schools",
    "focusArea": "Maintenance of community system",
    "type": "Tied"
  },
  {
    "id": "act-3-170-74",
    "masterCode": "170",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Maintenance of Classroom & AWC- Flooring/Doors/Ramps Windows/Gates/Lights/Fixtures etc",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-3-162-75",
    "masterCode": "162",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Construction of toilets/handwash unit in AWC/School",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-3-173-76",
    "masterCode": "173",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Procurement & Distribution of various aids / assistive devices to the special need children",
    "focusArea": "Welfare of the weaker sections",
    "type": "Untied"
  },
  {
    "id": "act-3-151-77",
    "masterCode": "151",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Awareness Campaign on services of ICDS: Child rights & protection",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-152-78",
    "masterCode": "152",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Awareness camp on different schemes related to special children",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-153-79",
    "masterCode": "153",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Awareness on gender discrimination and gender equality",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-159-80",
    "masterCode": "159",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Construction and Maintenance of Children Park",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-160-81",
    "masterCode": "160",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Construction of Child Friendly Corner in AWC/ School/ GP/ Public Building",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-161-82",
    "masterCode": "161",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Construction of Classroom & AWC (Flooring/Doors/Ramps Windows/Gates/Lights/Fixtures etc)",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-165-83",
    "masterCode": "165",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Identification/ distribution of Supplements to the malnourished children",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-166-84",
    "masterCode": "166",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Immediate Support & Rehabilitation for Vulnerable Children",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-168-85",
    "masterCode": "168",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Installation of Sanitary vending machine in Upper Primary / Secondary schools",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-169-86",
    "masterCode": "169",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Institutional Strengthening & Convergence on child related issues",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-174-87",
    "masterCode": "174",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Procurement of Sports Items",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-176-88",
    "masterCode": "176",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Provision of Creche support",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-178-89",
    "masterCode": "178",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Weighing machine distribution in AWC",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-3-156-90",
    "masterCode": "156",
    "themeNumber": 3,
    "themeName": "Theme 3 - Child Friendly Village",
    "activityName": "Awareness Program/ Rallies / Street Play on child marriage, child labour, child marriage, trafficking",
    "focusArea": "Women and child development, Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-4-185-91",
    "masterCode": "185",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Construction of Drip irrigation system/ Sprinkler/UG Pipe",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-4-201-92",
    "masterCode": "201",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Operation & Maintenance of Drip irrigation system/Sprinkler/UG Pipe",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-4-186-93",
    "masterCode": "186",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Construction of Pond/Farm Pond",
    "focusArea": "Agriculture,Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-210-94",
    "masterCode": "210",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Soil and Minor irrigation, water manangement and watershed development works like construction of gully plugs, check dams, stop dams etc",
    "focusArea": "Agriculture,Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-189-95",
    "masterCode": "189",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Creation of cattle troughs",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-4-179-96",
    "masterCode": "179",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Administrative expenses towards water supply system data entry cost, account and audit, plan preparetion, cost of preparetion of GPDP",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-180-97",
    "masterCode": "180",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Arrangement for water availability if current source become defunct/ insufficient",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-181-98",
    "masterCode": "181",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Bulk water charges",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-182-99",
    "masterCode": "182",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Cleaning / Repair of over-head tank",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-194-100",
    "masterCode": "194",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Honorarium/professional fees/ service charges to operator/ Nal Jal Mitra managing PWS system, water testing women, lab charges, contractual staff engaged in O&M of PWS, SHG for maintaining accounts and user charges collection",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-195-101",
    "masterCode": "195",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Installation of Cholorine doser through (Ventury System etc)",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-196-102",
    "masterCode": "196",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Install Solar panels for drinking water supply system to minimize electricity charges",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-199-103",
    "masterCode": "199",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Minor repair of pumps, motors, valves, control panels and extension of existing pipeline.",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-200-104",
    "masterCode": "200",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Operation and Maintenance of Water treatment plant",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-202-105",
    "masterCode": "202",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Orientation for water user and community groups (Water Budgeting/ Jal Chaupal, presentation of jal seva ankalan report every year), Awareness generation for use of water- efficient fixtures for taps, and showerheads, judicious use of drinking water & Celibration of Jal Arpan Diwas/ IEC activities",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-203-106",
    "masterCode": "203",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Payment of re-occurring electricity charges of intra-village water supply systems",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-204-107",
    "masterCode": "204",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Protection of drinking water source",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-205-108",
    "masterCode": "205",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Providing taps for drinking, handwashing and use in toilets in public institutions like schools, anganwadi centres, ashramshalas (tribal residential schools), health centres, GP buildings, public places like weekly haat/ bazar, mela ground, bus stand, playground/ sports complex, etc.",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-206-109",
    "masterCode": "206",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Purchase of consumable such as disinfectant (Bleaching powder, sodium hypochlorite, ClO2 gas)",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-207-110",
    "masterCode": "207",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Purchase of water testing kit/ reagents (specially for residual cholorine)",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-211-111",
    "masterCode": "211",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Taking up emergency breakdown and up- gradation post disasters/exigencies of rural piped water supply infrastructure",
    "focusArea": "Drinking water",
    "type": "Tied"
  },
  {
    "id": "act-4-183-112",
    "masterCode": "183",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Construction/maintenance of Platform at Community Drinking Water Point",
    "focusArea": "Maintenance of community system",
    "type": "Tied"
  },
  {
    "id": "act-4-184-113",
    "masterCode": "184",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Construction of community washing & bathing complex",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-4-187-114",
    "masterCode": "187",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Construction works relating to revival of traditional Ponds / Tanks/ Tanka/ Diggi/ Gokatte/ Water Tank/ well",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-188-115",
    "masterCode": "188",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Creation/Construction of Recharge Pits/ Rainwater Harvesting",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-190-116",
    "masterCode": "190",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Creation of other water recharging structure/ Recharge pit,shaft/ Anicut/ Check,Earthen, Percolation Dams/ Continous Contour Trenches, Bunds/ Drainage Pit",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-191-117",
    "masterCode": "191",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Development of Water bodies or, Converting abandoned borewells into water recharging structure /Borewell Recharge Pit/ Dug Well Recharge/ Injection wells/ Recharge wells",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-192-118",
    "masterCode": "192",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Fencing of Ponds",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-193-119",
    "masterCode": "193",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Hand Pump Rebore",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-197-120",
    "masterCode": "197",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Maintenance of traditional Ponds / Tanks/ Tanka/ Diggi/ Gokatte/ Water Tank",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-198-121",
    "masterCode": "198",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Maintenance/Repair of Hand Pump",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-208-122",
    "masterCode": "208",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Rejuvenation, maintenance and desilting of tank/ water body/pond",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-4-209-123",
    "masterCode": "209",
    "themeNumber": 4,
    "themeName": "Theme 4 - Water Sufficient Village",
    "activityName": "Sand Filter Construction for wells recharge",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-5-245-124",
    "masterCode": "245",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Hiring of support agencies",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-5-264-125",
    "masterCode": "264",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Preparation of accounts, auditing expenses, etc.",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-5-280-126",
    "masterCode": "280",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Technical & administrative expenses (sanitation)",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-5-214-127",
    "masterCode": "214",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness creation on behavioural issues under LIFE Mission",
    "focusArea": "Adult and non-formal education",
    "type": "Untied"
  },
  {
    "id": "act-5-224-128",
    "masterCode": "224",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation to avoid purchasing products/ souvenirs made from skin, tuskers and fur of wild",
    "focusArea": "Adult and non-formal education",
    "type": "Untied"
  },
  {
    "id": "act-5-213-129",
    "masterCode": "213",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Agroforestry/Crop Diversification/ Mulching/ Direct Seeded Rice (DSR)/Poly House/ Net House/ Shednet/ Happy Seeder/ Hydrogel/ Land Leveling",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-5-215-130",
    "masterCode": "215",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation about effects of stubble burning on pollution",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-5-222-131",
    "masterCode": "222",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation on use of agriculture residue, animal waste for composting, manuring and mulching",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-5-228-132",
    "masterCode": "228",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Bio-Fertilizer Purchase/Distribution",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-5-251-133",
    "masterCode": "251",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "New Orchard Development",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-5-284-134",
    "masterCode": "284",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Vermi-compost Construction",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-5-225-135",
    "masterCode": "225",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation to feed unused and uncooked vegetables leftovers to cattle",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-5-246-136",
    "masterCode": "246",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Initiate and/or join green clubs in your residential area/ school/ office",
    "focusArea": "Education",
    "type": "Untied"
  },
  {
    "id": "act-5-250-137",
    "masterCode": "250",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Land Development",
    "focusArea": "Land improvement",
    "type": "Untied"
  },
  {
    "id": "act-5-218-138",
    "masterCode": "218",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation for use of natural products in daily life",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-226-139",
    "masterCode": "226",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awarness generation for use of smart switches for appliances which are used frequently",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-229-140",
    "masterCode": "229",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Bio-gas/piped gas supply unit/plant",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-230-141",
    "masterCode": "230",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Construction of Bio-Gas and Compost Unit for indvidual households",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-247-142",
    "masterCode": "247",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Initiatives related to carbon neutral Panchayats",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-248-143",
    "masterCode": "248",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Insatallation of solar water heaters and solar cooker on rooftop",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-249-144",
    "masterCode": "249",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Installation of Solar Lights in Gram Panchayat",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-276-145",
    "masterCode": "276",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Solar power/renewable energy system to provide electricity in SWM units and FSM units/treatment plants to make them self- sufficient",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-277-146",
    "masterCode": "277",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Solar Pumpset Installation",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-278-147",
    "masterCode": "278",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Solar Roof Top Plant",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-5-283-148",
    "masterCode": "283",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Use of LED bulbs/LED tubelights for street lights",
    "focusArea": "Rural electrification",
    "type": "Untied"
  },
  {
    "id": "act-5-212-149",
    "masterCode": "212",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Admin expenses towards sanitation and SLWM, data entry cost, accounting, preparation of project reports/technical plans for community sanitation and SLWM projects, GPDP preparation cost.",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-217-150",
    "masterCode": "217",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation for segregation of waste at source and Household level composting and feeding organic waste to cattle",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-219-151",
    "masterCode": "219",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation on 3Rs (Reduce,Reuse,Recycle) for GWM",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-220-152",
    "masterCode": "220",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation on 4Rs (Refuse,Reduce,Reuse,Recycle) of Plastic Waste Management",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-223-153",
    "masterCode": "223",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation regarding social security schemes for sanitation workers",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-231-154",
    "masterCode": "231",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Construction of community level large Grey Water Management systems like DEWATS, Phytorids etc.",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-232-155",
    "masterCode": "232",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Construction of community soak pits for Grey Water Management",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-233-156",
    "masterCode": "233",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Construction of compost pits at community level",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-234-157",
    "masterCode": "234",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Construction of Gobardhan units at community/ cluster levels",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-235-158",
    "masterCode": "235",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Construction of Individual Hosehold Latrines (IHHL) for eligible Households",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-236-159",
    "masterCode": "236",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Construction of segregation shed at community level",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-237-160",
    "masterCode": "237",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Construction of toilets in public institutions",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-238-161",
    "masterCode": "238",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Creation of compost pits for individual households",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-239-162",
    "masterCode": "239",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Creation of Silt, Oil & Grease chamber for pre- treatment of grey water",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-240-163",
    "masterCode": "240",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Creation of soak pits/ kitchen gardens for individual households for Grey Water Management",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-241-164",
    "masterCode": "241",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Creation, repair and maintenance of Drainage line for grey water",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-244-165",
    "masterCode": "244",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Emergency minor repairs of CSCs and community level Solid & Liquid Waste Management(SLWM) assets (like PWMU, community segregation sheds, community soak pits, DEWATS, Planted drying beds etc.) for damage caused due to natural calamities, to ensure safe sanitation and sustained service delivery",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-252-166",
    "masterCode": "252",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "O&M of community compost pits including payments for consumables and excluding major repairs and renovations",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-253-167",
    "masterCode": "253",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "O&M of community Grey Water Management systems/ community soak pits including consumables and excluding major repairs and renovations",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-254-168",
    "masterCode": "254",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "O&M of Feacal Sludge Management plant excluding major repairs and renovations",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-255-169",
    "masterCode": "255",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "O&M of Gobardhan units at community/cluster level including establishment of forward linkages",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-256-170",
    "masterCode": "256",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "O&M of PWMUs excluding major repairs and renovations",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-257-171",
    "masterCode": "257",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "O&M of segregation shed at community level excluding major repairs and renovations",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-258-172",
    "masterCode": "258",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Operation and Maintenance (O&M) of CSCs including payment for consumables like soap, disinfectant etc, excluding major renovations and repairs",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-259-173",
    "masterCode": "259",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Panchayat Temporaray public toilets at relief camps in times of natural calamities (Max2/camp)",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-260-174",
    "masterCode": "260",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Payment of honorarium/ remuneration to outsourced/contractual persons engaged by the GP for sanitation service delivery for solid & liquid waste management (including feacal sludge management)",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-261-175",
    "masterCode": "261",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Payment of honorarium to swachhagrahis",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-265-176",
    "masterCode": "265",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Procurement of machinery for solid waste management at community level for seggregation sheds",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-266-177",
    "masterCode": "266",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Purchase and repair of Tricycles/other battery operated vehicles for door to door waste collection including waste collection for Gobardhan units",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-267-178",
    "masterCode": "267",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Purchase of equipment including safety equipments like gloves, masks, PPE kits etc. for waste management",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-268-179",
    "masterCode": "268",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Purchase of sanitary pad incinerator",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-269-180",
    "masterCode": "269",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Purchase of segregation bins for community level",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-270-181",
    "masterCode": "270",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Purchase of segregation bins for Household level",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-271-182",
    "masterCode": "271",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Retrofitting of septic tank toilets with soak pits",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-272-183",
    "masterCode": "272",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Retrofitting of single pit toilets to twin pit toilets",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-274-184",
    "masterCode": "274",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Sanitation service delivery for collection and transportation of waste from household to treatment site",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-275-185",
    "masterCode": "275",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Sanitation service delivery for mechanical cleaning/ desludging/ collection of Faecal Sludge",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-279-186",
    "masterCode": "279",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Support for rural cleanliness drives and special campaigns on sanitation",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-281-187",
    "masterCode": "281",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Training of PRI members/VWSCs/Swacchagrahis on SBM(G) including sanitation service delivery",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-282-188",
    "masterCode": "282",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Upgradation of CSC for ensuring divyangjan friendly access",
    "focusArea": "Sanitation",
    "type": "Tied"
  },
  {
    "id": "act-5-216-189",
    "masterCode": "216",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation for development of Nature-Positive Self-Reliant Villages",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-5-221-190",
    "masterCode": "221",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Awareness generation on deforestation, human wildlife conflict",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-5-227-191",
    "masterCode": "227",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Biodiversity conservation at community level",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-5-243-192",
    "masterCode": "243",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Ek Ped Maa ke Naam",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-5-262-193",
    "masterCode": "262",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Plantation of medicinal and fruit bearing trees",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-5-263-194",
    "masterCode": "263",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Plant trees to reduce the impact of pollution",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-5-273-195",
    "masterCode": "273",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Roads, culverts, bridges, ferries, waterways, and other means of communicationide Plantation/ Social forestry/ Social forestry in grazing land",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-5-242-196",
    "masterCode": "242",
    "themeNumber": 5,
    "themeName": "Theme 5 - Clean and Green Village",
    "activityName": "Development of Kitchen Garden",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-358-197",
    "masterCode": "358",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement of Diesel and Petrol for Tractor, Generator, Office vehicles etc.",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-6-366-198",
    "masterCode": "366",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Training/ Awarness creation/ IEC/ Poster banner Wall writing, Wall painting, etc.",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-6-288-199",
    "masterCode": "288",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction/maintenance of Grain drying platform",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-6-334-200",
    "masterCode": "334",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Grain drying platform",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-6-352-201",
    "masterCode": "352",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Preparation of Kitchen Garden/ Nutrition Garden",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-6-297-202",
    "masterCode": "297",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Grain storage building/ facilities / Warehouse/cold storages under VB-G RAM G",
    "focusArea": "Agriculture,Markets and fairs",
    "type": "Untied"
  },
  {
    "id": "act-6-335-203",
    "masterCode": "335",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Grain storage building./ facilities / Warehouse/cold storages under VB-G RAM G",
    "focusArea": "Agriculture,Markets and fairs",
    "type": "Untied"
  },
  {
    "id": "act-6-333-204",
    "masterCode": "333",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Feed Mill and related works",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-6-360-205",
    "masterCode": "360",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement of Feed Mill",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-6-298-206",
    "masterCode": "298",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Gym, Youth Club, culture centres/Public Park, Playground",
    "focusArea": "Cultural activities, Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-347-207",
    "masterCode": "347",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Sports Equipments in public park/gym",
    "focusArea": "Cultural activities, Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-351-208",
    "masterCode": "351",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/upgradation/Repair of Gym, Youth Club, culture centres/Public Park, Playground",
    "focusArea": "Cultural activities, Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-325-209",
    "masterCode": "325",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation furniture for school - (Desk, bench , black boards)",
    "focusArea": "Education",
    "type": "Untied"
  },
  {
    "id": "act-6-353-210",
    "masterCode": "353",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement/Installationof furniture for school - (Desk, bench , black boards)",
    "focusArea": "Education",
    "type": "Untied"
  },
  {
    "id": "act-6-345-211",
    "masterCode": "345",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of School buildings",
    "focusArea": "Education, Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-359-212",
    "masterCode": "359",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement of equiptments for Health: ambulance, refrigerator, other medical equipments",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-6-363-213",
    "masterCode": "363",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement of Medicines",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-6-367-214",
    "masterCode": "367",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Upgradation of Public Health Centers at GP",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-6-286-215",
    "masterCode": "286",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction/ Establishment of Library (Books, Journals and Periodicals)/ Installation Audio Visual aid)",
    "focusArea": "Libraries",
    "type": "Untied"
  },
  {
    "id": "act-6-322-216",
    "masterCode": "322",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgaradation of Library (Books, Journals and Periodicals)/ Installation Audio Visual aid)",
    "focusArea": "Libraries",
    "type": "Untied"
  },
  {
    "id": "act-6-285-217",
    "masterCode": "285",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Co-Locating CSCs in Panchayat Bhawan for Easy Access to Government Services.",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-287-218",
    "masterCode": "287",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction/Establishment of Retaining Walls/ Fences",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-291-219",
    "masterCode": "291",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Bharat Nirman Sewa Kendra Building (VB-G RAM G)",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-292-220",
    "masterCode": "292",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of building/Facilitation / common centres for CBOs",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-293-221",
    "masterCode": "293",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Bus Stand Shed, Ghats Graveyard/ Cemetery/crematorium",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-295-222",
    "masterCode": "295",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Cyclone Shelter (VB-G RAM G)",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-296-223",
    "masterCode": "296",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of GP Building, Public Building/ community kitchen, Hall, Community Centre, Boundary wall, Flooring, doors, window, fixtures etc of Community Assets/public buildings/offices.",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-299-224",
    "masterCode": "299",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Kitchen Shed Building",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-305-225",
    "masterCode": "305",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Store Room in GP Bhawan",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-306-226",
    "masterCode": "306",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Waiting shed under VB-G RAM G",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-307-227",
    "masterCode": "307",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Establishment of Kitchen facilities and Sheds",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-311-228",
    "masterCode": "311",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Gram Panchayat Operational Expenses - Electricity, Internet, BharatNet Wifi/Telephone, Water Charges, Postal, Printing charges & other Office Expenses",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-315-229",
    "masterCode": "315",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Installation of Biometric/IRIS/webcams in Public Offices",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-317-230",
    "masterCode": "317",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Installation of Information Board",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-319-231",
    "masterCode": "319",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance of Store Room in GP Bhawan",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-320-232",
    "masterCode": "320",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgaradation of Bus Stand Shed, Ghats Graveyard/ Cemetery/Crematorium",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-321-233",
    "masterCode": "321",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgaradation of GP Building, Punlic Building, Hall, Community Centre, Boundary wall, Flooring, doors, window, fixtures etc of Community Assets/ public buildings/ offices.",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-323-234",
    "masterCode": "323",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgaradation of Retaining Walls/ Fences",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-328-235",
    "masterCode": "328",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/ Repair/ Upgradation of Bharat Nirman Sewa Kendra Building (VB-G RAM G)",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-329-236",
    "masterCode": "329",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/ Repair/ Upgradation of Biometric /IRIS/ webcams in Public Offices",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-330-237",
    "masterCode": "330",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of CCTVs in Public Offices and Public Spaces.",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-336-238",
    "masterCode": "336",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Kitchen facilities and Sheds",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-337-239",
    "masterCode": "337",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Kitchen Shed Building",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-348-240",
    "masterCode": "348",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Tubewell",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-349-241",
    "masterCode": "349",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Waiting shed under VB-G RAM G",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-356-242",
    "masterCode": "356",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement/Installation of Tubewell",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-357-243",
    "masterCode": "357",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement of Computer, Printer, UPS, etc.",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-361-244",
    "masterCode": "361",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement of Firefighting equipments",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-362-245",
    "masterCode": "362",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement of Furniture",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-364-246",
    "masterCode": "364",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement of Tarpaulin, Utensils, etc. for Community Hall",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-6-300-247",
    "masterCode": "300",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Market/ haat bazaar",
    "focusArea": "Markets and fairs",
    "type": "Untied"
  },
  {
    "id": "act-6-339-248",
    "masterCode": "339",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Market/ haat bazaar",
    "focusArea": "Markets and fairs",
    "type": "Untied"
  },
  {
    "id": "act-6-346-249",
    "masterCode": "346",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of solar power systems in public buildings/office.",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-6-355-250",
    "masterCode": "355",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement/Installation of solar power systems in public buildings/office.",
    "focusArea": "Non-conventional energy sources",
    "type": "Untied"
  },
  {
    "id": "act-6-310-251",
    "masterCode": "310",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Fair Price Shops (PDS Shop) in villages",
    "focusArea": "Public distribution system",
    "type": "Untied"
  },
  {
    "id": "act-6-294-252",
    "masterCode": "294",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Culvert (VB-G RAM G)",
    "focusArea": "Roads",
    "type": "Untied"
  },
  {
    "id": "act-6-302-253",
    "masterCode": "302",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Paver Blocks for Better Roads, culverts, bridges, ferries, waterways, and other means of communication and Public Spaces.",
    "focusArea": "Roads",
    "type": "Untied"
  },
  {
    "id": "act-6-304-254",
    "masterCode": "304",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Roads, culverts, bridges, ferries, waterways, and other means of communication",
    "focusArea": "Roads",
    "type": "Untied"
  },
  {
    "id": "act-6-324-255",
    "masterCode": "324",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgaradation of Roads, culverts, bridges, ferries, waterways, and other means of communication",
    "focusArea": "Roads",
    "type": "Untied"
  },
  {
    "id": "act-6-331-256",
    "masterCode": "331",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Culvert (VB-G RAM G)",
    "focusArea": "Roads",
    "type": "Untied"
  },
  {
    "id": "act-6-341-257",
    "masterCode": "341",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Paver Blocks for Better Roads, culverts, bridges, ferries, waterways, and other means of communication and Public Spaces.",
    "focusArea": "Roads",
    "type": "Untied"
  },
  {
    "id": "act-6-314-258",
    "masterCode": "314",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Identify and facilitate housholds, public offices, CBOs for electric connection",
    "focusArea": "Rural electrification",
    "type": "Untied"
  },
  {
    "id": "act-6-318-259",
    "masterCode": "318",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Installation of lights/streetlights",
    "focusArea": "Rural electrification",
    "type": "Untied"
  },
  {
    "id": "act-6-338-260",
    "masterCode": "338",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of lights/streetlights",
    "focusArea": "Rural electrification",
    "type": "Untied"
  },
  {
    "id": "act-6-308-261",
    "masterCode": "308",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Establishment of Primary Processing Facility",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-6-309-262",
    "masterCode": "309",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Establishment of Weaving centre for SHGs and other entrepreneurs",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-6-342-263",
    "masterCode": "342",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Primary Processing Facility",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-6-350-264",
    "masterCode": "350",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradationt of Weaving centre for SHGs and other entrepreneurs",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-6-365-265",
    "masterCode": "365",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Support to Handloom small scale units",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-6-312-266",
    "masterCode": "312",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Green Fencing and Plantation",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-6-313-267",
    "masterCode": "313",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Identification and establishment of pipeline connection for water supply to public offices/buildings/CBOs",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-6-332-268",
    "masterCode": "332",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Cyclone Shelter (VB-G RAM G)",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-6-303-269",
    "masterCode": "303",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of ramps with handrails in public buildings",
    "focusArea": "Welfare of the weaker sections",
    "type": "Untied"
  },
  {
    "id": "act-6-343-270",
    "masterCode": "343",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of ramps with handrails in public buildings",
    "focusArea": "Welfare of the weaker sections",
    "type": "Untied"
  },
  {
    "id": "act-6-289-271",
    "masterCode": "289",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Anganwadi Centres in convergence with VB-G RAM G",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-290-272",
    "masterCode": "290",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Baby feeding rooms in public spaces",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-301-273",
    "masterCode": "301",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Construction of Multi unit seperate toilets for boys & girls in Anganwadi in convergence with VB-G RAM G",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-316-274",
    "masterCode": "316",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Installation of CCTVs in Public Offices and Public Spaces.",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-326-275",
    "masterCode": "326",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Anganwadi Centres in convergence with VB-G RAM G",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-327-276",
    "masterCode": "327",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Baby feeding rooms in public spaces",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-340-277",
    "masterCode": "340",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of Multi unit separate toilets for boys & girls in Anganwadi in convergence with VB-G RAM G",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-344-278",
    "masterCode": "344",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Maintenance/Repair/Upgradation of sanitary pad vending machines and incinerators in in public buildings (schools, health centres, GP building etc).",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-6-354-279",
    "masterCode": "354",
    "themeNumber": 6,
    "themeName": "Theme 6 - Self-sufficient Infrastructure in Village",
    "activityName": "Procurement/installation of sanitary pad vending machines and incinerators in public buildings (schools, health centres, GP building etc).",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-7-383-280",
    "masterCode": "383",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Demands for farmer welfare under State specific scheme",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-7-379-281",
    "masterCode": "379",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Lack of access to education for Persons with Disabilities (Inclusive Education)",
    "focusArea": "Education",
    "type": "Untied"
  },
  {
    "id": "act-7-373-282",
    "masterCode": "373",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Issues related to migrant labourers (Social exclusion)",
    "focusArea": "Poverty allevation programme",
    "type": "Untied"
  },
  {
    "id": "act-7-387-283",
    "masterCode": "387",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Preparation of Job Card of eligible households",
    "focusArea": "Poverty allevation programme",
    "type": "Untied"
  },
  {
    "id": "act-7-391-284",
    "masterCode": "391",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Tracking of the Migration Family and enrolment of beneficiaries",
    "focusArea": "Poverty allevation programme,Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-385-285",
    "masterCode": "385",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Inclusion of name in the list for State specific scheme for rural housing",
    "focusArea": "Rural housing",
    "type": "Untied"
  },
  {
    "id": "act-7-389-286",
    "masterCode": "389",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Revitalizing the Traditional Craft Cottage Industry in Tribal Areas",
    "focusArea": "Small-scale industries",
    "type": "Untied"
  },
  {
    "id": "act-7-368-287",
    "masterCode": "368",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness Campaign about UDID",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-369-288",
    "masterCode": "369",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness Campaign on different social protection scheme",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-370-289",
    "masterCode": "370",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness Campaign on Scheme related to pension",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-372-290",
    "masterCode": "372",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Discrimination against transgenders (Social exclusion)",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-374-291",
    "masterCode": "374",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Issues related to persons with disabilities (PWDs) (Social exclusion)",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-375-292",
    "masterCode": "375",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Issues related to sanitation workers (Social exclusion)",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-376-293",
    "masterCode": "376",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Issues related to sex workers (Social exclusion)",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-377-294",
    "masterCode": "377",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Issues related to single women/widows (Social exclusion)",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-378-295",
    "masterCode": "378",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Issues related to the elderly (Social exclusion)",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-380-296",
    "masterCode": "380",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Witch Hunting (Social exclusion)",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-381-297",
    "masterCode": "381",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Camp for distribution of assistive device",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-382-298",
    "masterCode": "382",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Construction/ upgradation of ramps for disabled- friendly community toilets.",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-384-299",
    "masterCode": "384",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Identification/ Enrolment of beneficiary for Social Protection Scheme",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-386-300",
    "masterCode": "386",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Night shelter/Old age home/recreation centres in cluster of village or block/district level",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-388-301",
    "masterCode": "388",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Provide Pension to the Vulnerable Person",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-7-390-302",
    "masterCode": "390",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Social Protection Facilitation centres",
    "focusArea": "Social welfare,Health",
    "type": "Untied"
  },
  {
    "id": "act-7-371-303",
    "masterCode": "371",
    "themeNumber": 7,
    "themeName": "Theme 7 - Socially Just and Socially Secured Village",
    "activityName": "Awareness on Discrimination against SC/ST/PVTG/religious minority communities (Social exclusion)",
    "focusArea": "Welfare of the weaker sections",
    "type": "Untied"
  },
  {
    "id": "act-8-392-304",
    "masterCode": "392",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Administrative cost for Activities related to Record keeping / Maintenance of data base/ digital tools / portals / Grievance / CPGRAM",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-8-393-305",
    "masterCode": "393",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Administrative cost for mediation facilities for redressal of petty disputes",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-8-395-306",
    "masterCode": "395",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Charges / Fees and other activities for ISO Certification",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-8-396-307",
    "masterCode": "396",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Charges for Electricity Connection/ Electricity bill payment / internet charges in Gram Panchayat Bhawan",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-8-398-308",
    "masterCode": "398",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Cost for Installation & maintenance of Information Board at GP",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-8-399-309",
    "masterCode": "399",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Cost for preparation of GPDP",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-8-400-310",
    "masterCode": "400",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Cost for resource material preparation for Gram Panchayat",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-8-406-311",
    "masterCode": "406",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Wage/ Honorarium/ Remuneration to Staff",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-8-397-312",
    "masterCode": "397",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Cost for Disaster Readiness, relief and mitigation activities (Training, planning, survey etc)",
    "focusArea": "Adult and non-formal education",
    "type": "Untied"
  },
  {
    "id": "act-8-403-313",
    "masterCode": "403",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "IEC & Awareness on disaster preparedness and mitigation",
    "focusArea": "Adult and non-formal education",
    "type": "Untied"
  },
  {
    "id": "act-8-402-314",
    "masterCode": "402",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "IEC & Awareness campaign on SHG-PRI Convergence /Public Services/ Service Delivery Provisions/ RTI/Grivences",
    "focusArea": "Poverty allevation programme,Adult and non- formal education",
    "type": "Untied"
  },
  {
    "id": "act-8-404-315",
    "masterCode": "404",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Operationalising community kitchen and other relief mechanism during disaster",
    "focusArea": "Public distribution system",
    "type": "Untied"
  },
  {
    "id": "act-8-394-316",
    "masterCode": "394",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Capacity Building & Training of Elected Representatives, Functionaries & other stakeholders",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-8-401-317",
    "masterCode": "401",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "IEC & Awareness Campaign for active participation in Gram Sabha, Ward Sabha, Mahila Sabha",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-8-405-318",
    "masterCode": "405",
    "themeNumber": 8,
    "themeName": "Theme 8 - Village with Good Governance",
    "activityName": "Organising of Gram Sabha/ Ward Sabha/ Mahila Sabha/ GPDP",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-9-422-319",
    "masterCode": "422",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Providing educational support for School-going Children (books, uniforms, scholarships etc)",
    "focusArea": "Education",
    "type": "Untied"
  },
  {
    "id": "act-9-408-320",
    "masterCode": "408",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Distribution of Iron Folic Acid tablets in schools / sub centres/Awcs",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-9-410-321",
    "masterCode": "410",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Oraganizing Awareness Camp/Program on Maternal Health Program",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-9-411-322",
    "masterCode": "411",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Oraginizing awareness Campaign on Reproductive Maternal, Child Health & Adolescent",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-9-413-323",
    "masterCode": "413",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Organising Blood Testing Camp for women & girl children",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-9-416-324",
    "masterCode": "416",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Organizing awareness Progarm & IEC campaign on symptoms of anaemia; vicious cycle of anaemia",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-9-417-325",
    "masterCode": "417",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Organizing awareness program / IEC Campaign on Menstrual Health and Hygiene",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-9-421-326",
    "masterCode": "421",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Procurement and Distribution of Sanitary Napkins in School; Health Sub Centers",
    "focusArea": "Health",
    "type": "Untied"
  },
  {
    "id": "act-9-415-327",
    "masterCode": "415",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Organizing Awareness Camp & IEC campaign on Human Trafficking, Violence against women and children etc",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-9-418-328",
    "masterCode": "418",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Organizing camp for enrolment of destitutes, marginalised, survivors of trafficking in shelter/remand homes",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-9-420-329",
    "masterCode": "420",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Organizing Skill Training Program for Women & Adolescent Girls",
    "focusArea": "Technical training and vocational education",
    "type": "Untied"
  },
  {
    "id": "act-9-407-330",
    "masterCode": "407",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Construction of Working women hostels/crèche",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-9-409-331",
    "masterCode": "409",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Instalation of CCTV for safety & security of women & girl children",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-9-412-332",
    "masterCode": "412",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Oranizing Awareness campaign/ Developing IEC material for conducting Mahila Sabha",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-9-414-333",
    "masterCode": "414",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Organize awareness program/ IEC Campaign on women welfare/ development schemes/program",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-9-419-334",
    "masterCode": "419",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Organizing legal aid camp/ IEC campaign on different laws for Women & Girl Children",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-9-423-335",
    "masterCode": "423",
    "themeNumber": 9,
    "themeName": "Theme 9 - Women Friendly Village",
    "activityName": "Setting up of Gender Resource cum Help Centre for providing assistance on various aspects of women",
    "focusArea": "Women and child development",
    "type": "Untied"
  },
  {
    "id": "act-10-6-336",
    "masterCode": "6",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Community Nursery Development (Local Species/ Fruit Bearing/ Medicinal)",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-10-16-337",
    "masterCode": "16",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of Vermicompost/NADEP compost pit",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-10-28-338",
    "masterCode": "28",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Maintainence of Vermicompost/NADEP compost pit",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-10-34-339",
    "masterCode": "34",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Plantation/ Wildling/Seedling/Broad casting of seeds/ Broad casting of seed by preparing ball and pallets (Local Species/Fruit Bearing/Medicinal)",
    "focusArea": "Agriculture",
    "type": "Untied"
  },
  {
    "id": "act-10-43-340",
    "masterCode": "43",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Site development for beekeeping",
    "focusArea": "Animal husbandry",
    "type": "Untied"
  },
  {
    "id": "act-10-5-341",
    "masterCode": "5",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Community Fish Seed Production Centre",
    "focusArea": "Fisheries",
    "type": "Untied"
  },
  {
    "id": "act-10-29-342",
    "masterCode": "29",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Napier/fodder grass plantation (in existing grazing land)",
    "focusArea": "Fuel and fodder",
    "type": "Untied"
  },
  {
    "id": "act-10-15-343",
    "masterCode": "15",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of Thal around the pit and weeding for moisture conservation",
    "focusArea": "Land improvement",
    "type": "Untied"
  },
  {
    "id": "act-10-26-344",
    "masterCode": "26",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Grazing land development (Grass planting, pasture area protection)(in existing grazing land)",
    "focusArea": "Land improvement",
    "type": "Untied"
  },
  {
    "id": "act-10-27-345",
    "masterCode": "27",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Gully Filling/Contour Bunding",
    "focusArea": "Land improvement",
    "type": "Untied"
  },
  {
    "id": "act-10-44-346",
    "masterCode": "44",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Site development for soil testing centre",
    "focusArea": "Land improvement",
    "type": "Untied"
  },
  {
    "id": "act-10-45-347",
    "masterCode": "45",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Soil and water conservation works (gully plugs, check dams, stop dams)",
    "focusArea": "Land improvement",
    "type": "Untied"
  },
  {
    "id": "act-10-2-348",
    "masterCode": "2",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Cleaning and repairing of stream/ natural spring/ seepage etc",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-3-349",
    "masterCode": "3",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Community Craft Training Building for Rural Women (Forest Resources Based)- Construction",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-4-350",
    "masterCode": "4",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Community Craft Training Building for Rural Women (Forest Resources Based) - Operations & Maintenance",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-7-351",
    "masterCode": "7",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction community well (Forest Land)",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-9-352",
    "masterCode": "9",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of CFRMC Office Building / Meeting Hall (Outside the forest area)",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-24-353",
    "masterCode": "24",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Fire Line Development - Construction",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-25-354",
    "masterCode": "25",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Fire Line Development - Operation and Maintenance",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-30-355",
    "masterCode": "30",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Operations and maintenance of CFRMC Office Building / Meeting Hall (Outside the forest area)",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-39-356",
    "masterCode": "39",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Removal of invasive/alien species",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-41-357",
    "masterCode": "41",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Repair community well (Forest Land)",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-10-13-358",
    "masterCode": "13",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of Minor Forest Produce- Collection, storage, processing and Marketing centre (Outside the forest area)",
    "focusArea": "Minor forest produce",
    "type": "Untied"
  },
  {
    "id": "act-10-32-359",
    "masterCode": "32",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Operations and Maintenance of Minor Forest Produce-Collection, storage, processing and Marketing centre (Outside the forest area)",
    "focusArea": "Minor forest produce",
    "type": "Untied"
  },
  {
    "id": "act-10-10-360",
    "masterCode": "10",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of CPT/live fencing and other method for plant protection",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-10-17-361",
    "masterCode": "17",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Demarcation of CFR Boundary",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-10-22-362",
    "masterCode": "22",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Drought-resistant plantation",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-10-33-363",
    "masterCode": "33",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Plantation of medicinal and aromatic plants (as shrub)",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-10-35-364",
    "masterCode": "35",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Planting fodder trees on community grazing lands (in existing grazing land)",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-10-36-365",
    "masterCode": "36",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Planting trees along rural Roads, culverts, bridges, ferries, waterways, and other means of communication",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-10-42-366",
    "masterCode": "42",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Sand Dune Stabilization",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-10-21-367",
    "masterCode": "21",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Drinking water source protection",
    "focusArea": "Water Conservation",
    "type": "Tied"
  },
  {
    "id": "act-10-1-368",
    "masterCode": "1",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Bio-fencing and plantation along the river banks",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-8-369",
    "masterCode": "8",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of Brushwood Check Dam/Earthern Dam/Check dam/Loose Bolder Check Dam/GullyPlug/Gabion Structure/Flood Diversion Channel/Community Water Harvesting Ponds",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-11-370",
    "masterCode": "11",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of embankments and farm embankments",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-12-371",
    "masterCode": "12",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of embankments for flood control",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-14-372",
    "masterCode": "14",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Construction of Staggered Contour Trench / Continuous Contour Trench /Water Absorption Trench / Earthen contour Bund/Stone contour Bund/ Semi Lunar Trench/Pebble contour Bund",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-18-373",
    "masterCode": "18",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Development of Farm Pond",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-19-374",
    "masterCode": "19",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Development of pond/waterbodies in forest",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-20-375",
    "masterCode": "20",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Drain diversion structure for irrigation of plantation",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-23-376",
    "masterCode": "23",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Excavation/Deepening of Pond",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-31-377",
    "masterCode": "31",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Operations and Maintenance of Farm Pond",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-37-378",
    "masterCode": "37",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Rain water harvesting structure",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-38-379",
    "masterCode": "38",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Rejuvenation of streams, rivulets, springs",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-40-380",
    "masterCode": "40",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Renovation of Brushwood Check Dam/Earthern Dam/Check dam/Loose Bolder Check Dam/GullyPlug/Gabion Structure/Flood Diversion Channel/Community Water Harvesting Ponds",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-10-46-381",
    "masterCode": "46",
    "themeNumber": 10,
    "themeName": "Theme 10 - Forest Rights Act",
    "activityName": "Stopdam construction",
    "focusArea": "Water Conservation",
    "type": "Untied"
  },
  {
    "id": "act-11-47-382",
    "masterCode": "47",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Administrative expenses for Gram Sabha office [under section 4(c) of PESA]",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-11-69-383",
    "masterCode": "69",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Meeting expenditure for Gram Sabha and its committees [under section 4(c) of PESA]",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-11-71-384",
    "masterCode": "71",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Monitoring and documentation of migrant workers in the Gram Sabhas area [under section 4(c) of PESA]",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-11-73-385",
    "masterCode": "73",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Monitoring mining activities and mining related agencies in the GS area [under section 4(k) and 4(l) of PESA]",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-11-74-386",
    "masterCode": "74",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Monitoring of social institutions and government functionaries [under section 4(m)(vi)]",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-11-77-387",
    "masterCode": "77",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Preparation of mining plan and expenses for sustainable exploration and extraction of minor minerals in the Gram Sabha area [under section 4(k) and 4(l) of PESA]",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-11-87-388",
    "masterCode": "87",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Survey and monitoring of collection / extraction of minor minerals [under section 4(k) and 4(l) of PESA]",
    "focusArea": "Administrative & Technical Support",
    "type": "Untied"
  },
  {
    "id": "act-11-48-389",
    "masterCode": "48",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Awareness generation and IEC activity [under section 4(c) of PESA]",
    "focusArea": "Adult and non-formal education",
    "type": "Untied"
  },
  {
    "id": "act-11-88-390",
    "masterCode": "88",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Training and capacity building programs for Gram Sabha members [under section 4(c) of PESA]",
    "focusArea": "Adult and non-formal education",
    "type": "Untied"
  },
  {
    "id": "act-11-82-391",
    "masterCode": "82",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Purchase of Minor Forest Produce by Gram Sabha or its committee [under section 4(m)(ii) of PESA]",
    "focusArea": "Cultural activities",
    "type": "Untied"
  },
  {
    "id": "act-11-75-392",
    "masterCode": "75",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Preparation and maintenance of physical/ digital village maps [under section 4(m)(iii) of PESA]",
    "focusArea": "Land improvement",
    "type": "Untied"
  },
  {
    "id": "act-11-83-393",
    "masterCode": "83",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Record keeping and monitoring of activities related to prevention of alienation of land [under section 4(m)(iii) of PESA]",
    "focusArea": "Land improvement",
    "type": "Untied"
  },
  {
    "id": "act-11-53-394",
    "masterCode": "53",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Construction of Gram Sabha Mandap (shade for Gram Sabha meeting) / Gram Sabha Office / Sachivalaya [under section 4(c) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-54-395",
    "masterCode": "54",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Construction of public toilets in market / places of cultural and traditional importance [under section 4(m)(iv) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-55-396",
    "masterCode": "55",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Construction of warehouse / storage godowns / cold storage [under section 4(m)(ii) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-64-397",
    "masterCode": "64",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Maintenance and upkeep of places of traditional / cultural significance [under section 4(d) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-65-398",
    "masterCode": "65",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Maintenance of garden / parks around minor water bodies [under section 4(j) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-66-399",
    "masterCode": "66",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Maintenance of Gram Sabha Mandap (shade for Gram Sabha meeting) / Gram Sabha Office / Sachivalaya [under section 4(c) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-67-400",
    "masterCode": "67",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Maintenance of public toilets in market / places of cultural and traditional importance [under section 4(m)(iv) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-68-401",
    "masterCode": "68",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Maintenance of warehouse / storage godowns / cold storage [under section 4(m)(ii) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-70-402",
    "masterCode": "70",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Mitigation activities for pollution caused due to extraction of minor minerals [under section 4(k) and 4(l) of PESA]",
    "focusArea": "Maintenance of community system",
    "type": "Untied"
  },
  {
    "id": "act-11-79-403",
    "masterCode": "79",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Providing drinking water facilities in village market [under section 4(m)(iv) of PESA]",
    "focusArea": "Markets and fairs",
    "type": "Tied"
  },
  {
    "id": "act-11-50-404",
    "masterCode": "50",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Cleanliness and sanitation related expenditure in village market area [under section 4(m)(iv) of PESA]",
    "focusArea": "Markets and fairs",
    "type": "Untied"
  },
  {
    "id": "act-11-61-405",
    "masterCode": "61",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Infrastructure development in the village market such as all weather Roads, culverts, bridges, ferries, waterways, and other means of communication, rain sheds, parking etc [under section 4(m)(iv) of PESA]",
    "focusArea": "Markets and fairs",
    "type": "Untied"
  },
  {
    "id": "act-11-51-406",
    "masterCode": "51",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Collection/ Processing / Transportation / Marketing of MFP [under section 4(m)(ii) of PESA]",
    "focusArea": "Minor forest produce",
    "type": "Untied"
  },
  {
    "id": "act-11-60-407",
    "masterCode": "60",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Improvement activities in degraded forest due to over exploitation of minor forest produces [under section 4(m)(ii) of PESA]",
    "focusArea": "Minor forest produce",
    "type": "Untied"
  },
  {
    "id": "act-11-80-408",
    "masterCode": "80",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Purchase of MFP related seeds / plants for plantation in forest [under section 4(m)(ii) of PESA]",
    "focusArea": "Minor forest produce",
    "type": "Untied"
  },
  {
    "id": "act-11-81-409",
    "masterCode": "81",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Purchase of Minor Forest Produce by Gram Sabha or its committee [Minor Forest Produce]",
    "focusArea": "Minor forest produce",
    "type": "Untied"
  },
  {
    "id": "act-11-86-410",
    "masterCode": "86",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Skill training / Capacity Building for Collection/ Processing / Transportation / Marketing MFP [under section 4(m)(ii) of PESA]",
    "focusArea": "Minor forest produce",
    "type": "Untied"
  },
  {
    "id": "act-11-62-411",
    "masterCode": "62",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Installation of electricity and lighting facilities in village market [under section 4(m)(iv) of PESA]",
    "focusArea": "Rural electrification,Markets and fairs",
    "type": "Untied"
  },
  {
    "id": "act-11-49-412",
    "masterCode": "49",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Awareness generation for mitigation of human- wildlife conflict [under section 4(d) of PESA]",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-11-52-413",
    "masterCode": "52",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Construction of garden / parks around minor water bodies [under section 4(j) of PESA]",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-11-56-414",
    "masterCode": "56",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Development of tourism activities like bamboo rafting, boat riding, etc around minor water bodies [under section 4(j) of PESA]",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-11-76-415",
    "masterCode": "76",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Preparation of management plan for community forest resources / natural resources [under section 4(d) of PESA]",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-11-78-416",
    "masterCode": "78",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Promoting Forest based tourism / safaris / sight seeing through Gram Sabha [under section 4(d) of PESA]",
    "focusArea": "Social forestry and farm forestry",
    "type": "Untied"
  },
  {
    "id": "act-11-57-417",
    "masterCode": "57",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Expenses for public announcement systems / notice board in public places [under section 4(c) of PESA]",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-11-59-418",
    "masterCode": "59",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Expenses to control and monitor the production, sale and consumption of intoxicants [under section 4(m)(i) of PESA]",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-11-63-419",
    "masterCode": "63",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Listing and monitoring of money lenders active in the area [under section 4(m)(v) of PESA]",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-11-72-420",
    "masterCode": "72",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Monitoring and record keeping of dispute resolution process [under section 4(d) of PESA]",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-11-84-421",
    "masterCode": "84",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Restoration of environmental / land / water damage caused due to mining [under section 4(k) and 4(l) of PESA]",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-11-85-422",
    "masterCode": "85",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Running of rehabilitation centre for those addicted to intoxicants [under section 4(m)(i) of PESA]",
    "focusArea": "Social welfare",
    "type": "Untied"
  },
  {
    "id": "act-11-58-423",
    "masterCode": "58",
    "themeNumber": 11,
    "themeName": "Theme 11 - PESA Theme",
    "activityName": "Expenses related to planning and management of minor water bodies [under section 4(j) of PESA]",
    "focusArea": "Water Conservation",
    "type": "Untied"
  }
];
