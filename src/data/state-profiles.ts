export interface SourceReference {
  sourceName: string;
  sourceUrl: string;
  lastChecked: string;
  publishedAt?: string;
}

export interface PublicOfficeHolder {
  position: "Chief Minister" | "Governor" | "Lieutenant Governor" | "Administrator";
  name: string | null;
  officialUrl?: string;
  unavailableReason?: string;
  source: SourceReference;
}

export interface StateEconomySnapshot {
  perCapitaNsdpInr: number | null;
  reportingPeriod: string | null;
  allIndiaPerCapitaNniInr: number | null;
  unavailableReason?: string;
  source: SourceReference;
}

export interface StateProfile {
  regionId: string;
  capital: string;
  governmentCode: string;
  lgdCode: number;
  officialPortalUrl: string;
  chiefMinister: PublicOfficeHolder;
  constitutionalHead: PublicOfficeHolder;
  economy: StateEconomySnapshot;
  profileSource: SourceReference;
}

const checkedOn = "2026-06-24";

const stateDirectorySource: SourceReference = {
  sourceName: "National Portal of India state and UT directory",
  sourceUrl: "https://www.india.gov.in/explore-india/facts-of-india/states-ut-districts",
  lastChecked: checkedOn
};

const chiefMinisterSource: SourceReference = {
  sourceName: "National Portal of India Who's Who - Chief Ministers",
  sourceUrl: "https://www.india.gov.in/directory/whos-who/chief-ministers-of-states-and-union-territories",
  lastChecked: checkedOn
};

const governorSource: SourceReference = {
  sourceName: "National Portal of India Who's Who - Governors",
  sourceUrl: "https://www.india.gov.in/directory/whos-who/governors-of-states-and-union-territories",
  lastChecked: checkedOn
};

const unionTerritoryHeadSource: SourceReference = {
  sourceName: "National Portal of India Who's Who - Lieutenant Governors and Administrators",
  sourceUrl: "https://www.india.gov.in/directory/whos-who/lt-governors-and-administrators-of-union-territories",
  lastChecked: checkedOn
};

const rbiEconomySource: SourceReference = {
  sourceName: "Reserve Bank of India, Table 9 - Per Capita Net State Domestic Product",
  sourceUrl: "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23183",
  publishedAt: "2025-08-29",
  lastChecked: checkedOn
};

interface JurisdictionBasics {
  capital: string;
  governmentCode: string;
  lgdCode: number;
  officialPortalUrl: string;
}

const jurisdictionBasics: Record<string, JurisdictionBasics> = {
  "andhra-pradesh": { capital: "Amaravati", governmentCode: "AP", lgdCode: 28, officialPortalUrl: "https://www.ap.gov.in/" },
  "arunachal-pradesh": { capital: "Itanagar", governmentCode: "AR", lgdCode: 12, officialPortalUrl: "https://arunachalpradesh.gov.in/" },
  assam: { capital: "Dispur", governmentCode: "AS", lgdCode: 18, officialPortalUrl: "https://assam.gov.in/" },
  bihar: { capital: "Patna", governmentCode: "BR", lgdCode: 10, officialPortalUrl: "https://state.bihar.gov.in/main/CitizenHome.html" },
  chhattisgarh: { capital: "Raipur", governmentCode: "CG", lgdCode: 22, officialPortalUrl: "https://cgstate.gov.in/" },
  goa: { capital: "Panaji", governmentCode: "GA", lgdCode: 30, officialPortalUrl: "https://www.goa.gov.in/" },
  gujarat: { capital: "Gandhinagar", governmentCode: "GJ", lgdCode: 24, officialPortalUrl: "https://gujaratindia.gov.in/" },
  haryana: { capital: "Chandigarh", governmentCode: "HR", lgdCode: 6, officialPortalUrl: "https://haryana.gov.in/" },
  "himachal-pradesh": { capital: "Shimla", governmentCode: "HP", lgdCode: 2, officialPortalUrl: "https://himachal.gov.in/en-IN/" },
  jharkhand: { capital: "Ranchi", governmentCode: "JH", lgdCode: 20, officialPortalUrl: "https://www.jharkhand.gov.in/" },
  karnataka: { capital: "Bengaluru", governmentCode: "KA", lgdCode: 29, officialPortalUrl: "https://www.karnataka.gov.in/english" },
  kerala: { capital: "Thiruvananthapuram", governmentCode: "KL", lgdCode: 32, officialPortalUrl: "https://kerala.gov.in/" },
  "madhya-pradesh": { capital: "Bhopal", governmentCode: "MP", lgdCode: 23, officialPortalUrl: "https://mp.gov.in/" },
  maharashtra: { capital: "Mumbai", governmentCode: "MH", lgdCode: 27, officialPortalUrl: "https://www.maharashtra.gov.in/" },
  manipur: { capital: "Imphal", governmentCode: "MN", lgdCode: 14, officialPortalUrl: "https://manipur.gov.in/" },
  meghalaya: { capital: "Shillong", governmentCode: "ML", lgdCode: 17, officialPortalUrl: "https://meghalaya.gov.in/" },
  mizoram: { capital: "Aizawl", governmentCode: "MZ", lgdCode: 15, officialPortalUrl: "https://mizoram.gov.in/" },
  nagaland: { capital: "Kohima", governmentCode: "NL", lgdCode: 13, officialPortalUrl: "https://www.nagaland.gov.in/" },
  odisha: { capital: "Bhubaneswar", governmentCode: "OD", lgdCode: 21, officialPortalUrl: "https://odisha.gov.in/" },
  punjab: { capital: "Chandigarh", governmentCode: "PB", lgdCode: 3, officialPortalUrl: "https://punjab.gov.in/" },
  rajasthan: { capital: "Jaipur", governmentCode: "RJ", lgdCode: 8, officialPortalUrl: "https://rajasthan.gov.in/" },
  sikkim: { capital: "Gangtok", governmentCode: "SK", lgdCode: 11, officialPortalUrl: "https://sikkim.gov.in/" },
  "tamil-nadu": { capital: "Chennai", governmentCode: "TN", lgdCode: 33, officialPortalUrl: "https://www.tn.gov.in/" },
  telangana: { capital: "Hyderabad", governmentCode: "TS", lgdCode: 36, officialPortalUrl: "https://www.telangana.gov.in/" },
  tripura: { capital: "Agartala", governmentCode: "TR", lgdCode: 16, officialPortalUrl: "https://tripura.gov.in/" },
  "uttar-pradesh": { capital: "Lucknow", governmentCode: "UP", lgdCode: 9, officialPortalUrl: "https://up.gov.in/en" },
  uttarakhand: { capital: "Dehradun", governmentCode: "UK", lgdCode: 5, officialPortalUrl: "https://uk.gov.in/" },
  "west-bengal": { capital: "Kolkata", governmentCode: "WB", lgdCode: 19, officialPortalUrl: "https://wb.gov.in/" },
  "andaman-and-nicobar-islands": { capital: "Sri Vijaya Puram", governmentCode: "AN", lgdCode: 35, officialPortalUrl: "https://andamannicobar.gov.in/" },
  chandigarh: { capital: "Chandigarh", governmentCode: "CH", lgdCode: 4, officialPortalUrl: "https://chandigarh.gov.in/" },
  "dadra-and-nagar-haveli-and-daman-and-diu": { capital: "Daman", governmentCode: "ND", lgdCode: 38, officialPortalUrl: "https://ddd.gov.in/" },
  delhi: { capital: "Delhi", governmentCode: "DL", lgdCode: 7, officialPortalUrl: "https://delhi.gov.in/" },
  "jammu-and-kashmir": { capital: "Srinagar (summer), Jammu (winter)", governmentCode: "JK", lgdCode: 1, officialPortalUrl: "https://jk.gov.in/jammukashmir/" },
  ladakh: { capital: "Leh", governmentCode: "LA", lgdCode: 37, officialPortalUrl: "https://ladakh.gov.in/" },
  lakshadweep: { capital: "Kavaratti", governmentCode: "LD", lgdCode: 31, officialPortalUrl: "https://lakshadweep.gov.in/" },
  puducherry: { capital: "Puducherry", governmentCode: "PY", lgdCode: 34, officialPortalUrl: "https://py.gov.in/" }
};

const chiefMinisters: Record<string, { name: string; officialUrl: string }> = {
  "andhra-pradesh": { name: "Shri N. Chandrababu Naidu", officialUrl: "https://www.ap.gov.in/" },
  "arunachal-pradesh": { name: "Shri Pema Khandu", officialUrl: "https://arunachalpradesh.gov.in/cm.html" },
  assam: { name: "Shri Himanta Biswa Sarma", officialUrl: "https://assam.gov.in/" },
  bihar: { name: "Shri Samrat Choudhary", officialUrl: "https://state.bihar.gov.in/main/CitizenHome.html" },
  chhattisgarh: { name: "Shri Vishnu Deo Sai", officialUrl: "https://cgstate.gov.in/" },
  goa: { name: "Shri Pramod Sawant", officialUrl: "https://www.goavidhansabha.gov.in/member_detail.php?dflag=CM" },
  gujarat: { name: "Shri Bhupendra Patel", officialUrl: "https://cmogujarat.gov.in/en/" },
  haryana: { name: "Shri Nayab Singh Saini", officialUrl: "https://haryana.gov.in/" },
  "himachal-pradesh": { name: "Shri Sukhvinder Singh Sukhu", officialUrl: "https://himachal.nic.in/en-IN/chief-minister.html" },
  jharkhand: { name: "Shri Hemant Soren", officialUrl: "https://cm.jharkhand.gov.in/cmprofile" },
  karnataka: { name: "Shri D. K. Shivakumar", officialUrl: "https://karnataka.gov.in/english" },
  kerala: { name: "Shri V. D. Satheesan", officialUrl: "https://keralacm.gov.in/" },
  "madhya-pradesh": { name: "Shri Mohan Yadav", officialUrl: "https://mp.gov.in/" },
  maharashtra: { name: "Shri Devendra Fadnavis", officialUrl: "https://maharashtra.gov.in/" },
  manipur: { name: "Shri Yumnam Khemchand Singh", officialUrl: "https://manipur.gov.in/" },
  meghalaya: { name: "Shri Conrad Kongkal Sangma", officialUrl: "https://meghalaya.gov.in/meghalaya/2" },
  mizoram: { name: "Shri PU Lalduhoma", officialUrl: "https://mizoram.nic.in/gov/cm.htm" },
  nagaland: { name: "Shri Neiphiu Rio", officialUrl: "https://www.nagaland.gov.in/chief-ministers" },
  odisha: { name: "Shri Mohan Charan Majhi", officialUrl: "https://cm.odisha.gov.in/" },
  punjab: { name: "Shri Bhagwant Singh Mann", officialUrl: "https://punjab.gov.in/government/whos-who/chief-minister/" },
  rajasthan: { name: "Shri Bhajan Lal Sharma", officialUrl: "https://cmoffice.rajasthan.gov.in/" },
  sikkim: { name: "Shri PS Golay", officialUrl: "https://sikkim.gov.in/mygovernment/whos-who/hcm-profile" },
  "tamil-nadu": { name: "Shri C. Joseph Vijay", officialUrl: "https://www.tn.gov.in/" },
  telangana: { name: "Shri A Revanth Reddy", officialUrl: "https://telangana.gov.in/" },
  tripura: { name: "Dr. Manik Saha", officialUrl: "https://tripura.gov.in/" },
  "uttar-pradesh": { name: "Shri Yogi Aditya Nath", officialUrl: "https://uplegisassembly.gov.in/" },
  uttarakhand: { name: "Shri Pushkar Singh Dhami", officialUrl: "https://cm.uk.gov.in/" },
  "west-bengal": { name: "Shri Suvendu Adhikari", officialUrl: "https://wb.gov.in/" },
  delhi: { name: "Smt. Rekha Gupta", officialUrl: "https://delhi.gov.in/" },
  "jammu-and-kashmir": { name: "Shri Omar Abdullah", officialUrl: "https://jkgad.nic.in/En/minCouncil.aspx" },
  puducherry: { name: "Shri N. Rangaswamy", officialUrl: "https://dpar.py.gov.in/" }
};

const constitutionalHeads: Record<string, Omit<PublicOfficeHolder, "source">> = {
  "andhra-pradesh": { position: "Governor", name: "Shri Justice (Retd.) S. Abdul Nazeer", officialUrl: "https://www.ap.gov.in/" },
  "arunachal-pradesh": { position: "Governor", name: "Lt. General Kaiwalya Trivikram Parnaik", officialUrl: "https://arunachalgovernor.gov.in/html/profile.htm" },
  assam: { position: "Governor", name: "Shri Lakshman Prasad Acharya", officialUrl: "https://assam.gov.in/honble-dignitaries/216" },
  bihar: { position: "Governor", name: "Lt. General (Retired) Syed Ata Hasnain", officialUrl: "https://governor.bih.nic.in/" },
  chhattisgarh: { position: "Governor", name: "Shri Ramen Deka", officialUrl: "https://rajbhavancg.gov.in/" },
  goa: { position: "Governor", name: "Shri Pusapati Ashok Gajapathi Raju", officialUrl: "https://www.rajbhavan.goa.gov.in/" },
  gujarat: { position: "Governor", name: "Shri Acharya Dev Vrat", officialUrl: "https://rajbhavan.gujarat.gov.in/" },
  haryana: { position: "Governor", name: "Prof. Ashim Kumar Ghosh" },
  "himachal-pradesh": { position: "Governor", name: "Shri Kavinder Gupta", officialUrl: "https://himachalrajbhavan.nic.in/" },
  jharkhand: { position: "Governor", name: "Shri Santosh Kumar Gangwar", officialUrl: "https://rajbhavanjharkhand.nic.in/" },
  karnataka: { position: "Governor", name: "Shri Thaawarchand Gehlot", officialUrl: "https://www.karnataka.gov.in/english" },
  kerala: { position: "Governor", name: "Shri Rajendra Vishwanath Arlekar", officialUrl: "https://www.rajbhavan.kerala.gov.in/" },
  "madhya-pradesh": { position: "Governor", name: "Shri Mangubhai Chhaganbhai Patel", officialUrl: "https://governor.mp.gov.in/" },
  maharashtra: { position: "Governor", name: "Shri Jishnu Dev Varma", officialUrl: "https://rajbhavan-maharashtra.gov.in/" },
  manipur: { position: "Governor", name: "Shri Ajay Kumar Bhalla", officialUrl: "https://rajbhavanmanipur.nic.in/" },
  meghalaya: { position: "Governor", name: "Shri C H Vijayashankar", officialUrl: "https://meggovernor.gov.in/" },
  mizoram: { position: "Governor", name: "General (Dr.) Vijay Kumar Singh", officialUrl: "https://rajbhavan.mizoram.gov.in/" },
  nagaland: { position: "Governor", name: "Shri Nand Kishore Yadav", officialUrl: "https://nagaland.gov.in/governors" },
  odisha: { position: "Governor", name: "Dr Hari Babu Kambhampati", officialUrl: "https://www.rajbhavanodisha.gov.in/" },
  punjab: { position: "Governor", name: "Shri Gulab Chand Kataria", officialUrl: "https://punjabrajbhavan.gov.in/" },
  rajasthan: { position: "Governor", name: "Shri Haribhau Kisanrao Bagde", officialUrl: "https://rajbhawan.rajasthan.gov.in/" },
  sikkim: { position: "Governor", name: "Shri Om Prakash Mathur", officialUrl: "https://rajbhavansikkim.gov.in/" },
  "tamil-nadu": { position: "Governor", name: "Shri Rajendra Vishwanath Arlekar", officialUrl: "https://tnrajbhavan.gov.in/" },
  telangana: { position: "Governor", name: "Shri Shiv Pratap Shukla", officialUrl: "https://governor.telangana.gov.in/" },
  tripura: { position: "Governor", name: "Shri Indra Sena Reddy Nallu", officialUrl: "https://rajbhavan.tripura.gov.in/" },
  "uttar-pradesh": { position: "Governor", name: "Smt. Anandiben Patel", officialUrl: "https://uplegisassembly.gov.in/" },
  uttarakhand: { position: "Governor", name: "Lt. Gen. Gurmit Singh", officialUrl: "https://governoruk.gov.in/" },
  "west-bengal": { position: "Governor", name: "Shri R. N. Ravi", officialUrl: "https://rajbhavankolkata.gov.in/" },
  "andaman-and-nicobar-islands": { position: "Lieutenant Governor", name: "Admiral D K Joshi", officialUrl: "https://andamannicobar.gov.in/" },
  chandigarh: { position: "Administrator", name: "Shri Gulab Chand Kataria", officialUrl: "https://chandigarh.gov.in/" },
  "dadra-and-nagar-haveli-and-daman-and-diu": { position: "Administrator", name: "Shri Praful Patel", officialUrl: "https://ddd.gov.in/" },
  delhi: { position: "Lieutenant Governor", name: "Shri Taranjit Singh Sandhu", officialUrl: "https://lg.delhi.gov.in/" },
  "jammu-and-kashmir": { position: "Lieutenant Governor", name: "Shri Manoj Sinha", officialUrl: "https://jkrajbhawan.nic.in/" },
  ladakh: { position: "Lieutenant Governor", name: "Shri Vinai Kumar Saxena", officialUrl: "https://ladakh.gov.in/directory/hlg-ladakh/" },
  lakshadweep: { position: "Administrator", name: "Shri Praful Patel", officialUrl: "https://lakshadweep.gov.in/about-lakshadweep/profile-administrator/" },
  puducherry: { position: "Lieutenant Governor", name: "Shri K. Kailashnathan", officialUrl: "https://www.py.gov.in/lt-governor" }
};

const latestPerCapitaNsdp: Record<string, { value: number; reportingPeriod: string }> = {
  "andhra-pradesh": { value: 266240, reportingPeriod: "2024-25" },
  "arunachal-pradesh": { value: 220209, reportingPeriod: "2023-24" },
  assam: { value: 154222, reportingPeriod: "2024-25" },
  bihar: { value: 60180, reportingPeriod: "2023-24" },
  chhattisgarh: { value: 162870, reportingPeriod: "2024-25" },
  goa: { value: 585953, reportingPeriod: "2023-24" },
  gujarat: { value: 297722, reportingPeriod: "2023-24" },
  haryana: { value: 353182, reportingPeriod: "2024-25" },
  "himachal-pradesh": { value: 257212, reportingPeriod: "2024-25" },
  "jammu-and-kashmir": { value: 154703, reportingPeriod: "2024-25" },
  jharkhand: { value: 105274, reportingPeriod: "2023-24" },
  karnataka: { value: 380906, reportingPeriod: "2024-25" },
  kerala: { value: 279751, reportingPeriod: "2023-24" },
  "madhya-pradesh": { value: 152615, reportingPeriod: "2024-25" },
  maharashtra: { value: 309340, reportingPeriod: "2024-25" },
  manipur: { value: 128925, reportingPeriod: "2023-24" },
  meghalaya: { value: 149891, reportingPeriod: "2024-25" },
  mizoram: { value: 235823, reportingPeriod: "2023-24" },
  nagaland: { value: 158730, reportingPeriod: "2023-24" },
  odisha: { value: 182548, reportingPeriod: "2024-25" },
  punjab: { value: 209452, reportingPeriod: "2024-25" },
  rajasthan: { value: 185053, reportingPeriod: "2024-25" },
  sikkim: { value: 587743, reportingPeriod: "2023-24" },
  "tamil-nadu": { value: 358027, reportingPeriod: "2024-25" },
  telangana: { value: 379751, reportingPeriod: "2024-25" },
  tripura: { value: 176943, reportingPeriod: "2023-24" },
  "uttar-pradesh": { value: 93422, reportingPeriod: "2023-24" },
  uttarakhand: { value: 274064, reportingPeriod: "2024-25" },
  "west-bengal": { value: 163467, reportingPeriod: "2024-25" },
  "andaman-and-nicobar-islands": { value: 275758, reportingPeriod: "2023-24" },
  chandigarh: { value: 430119, reportingPeriod: "2023-24" },
  delhi: { value: 459408, reportingPeriod: "2023-24" },
  puducherry: { value: 285072, reportingPeriod: "2024-25" }
};

const allIndiaPerCapitaNni: Record<string, number> = {
  "2023-24": 188892,
  "2024-25": 205324
};

const noChiefMinisterReason =
  "No Chief Minister is listed for this Union Territory in the National Portal's current directory.";
const unavailableEconomyReason =
  "A comparable per-capita NSDP figure is not reported for this Union Territory in RBI Table 9.";

export const stateProfiles: StateProfile[] = Object.entries(jurisdictionBasics).map(([regionId, basics]) => {
  const chiefMinister = chiefMinisters[regionId];
  const constitutionalHead = constitutionalHeads[regionId];
  const economy = latestPerCapitaNsdp[regionId];

  if (!constitutionalHead) throw new Error(`Missing constitutional head for ${regionId}`);

  return {
    regionId,
    ...basics,
    chiefMinister: chiefMinister
      ? { position: "Chief Minister", name: chiefMinister.name, officialUrl: chiefMinister.officialUrl, source: chiefMinisterSource }
      : { position: "Chief Minister", name: null, unavailableReason: noChiefMinisterReason, source: chiefMinisterSource },
    constitutionalHead: {
      ...constitutionalHead,
      source: constitutionalHead.position === "Governor" ? governorSource : unionTerritoryHeadSource
    },
    economy: economy
      ? {
          perCapitaNsdpInr: economy.value,
          reportingPeriod: economy.reportingPeriod,
          allIndiaPerCapitaNniInr: allIndiaPerCapitaNni[economy.reportingPeriod],
          source: rbiEconomySource
        }
      : {
          perCapitaNsdpInr: null,
          reportingPeriod: null,
          allIndiaPerCapitaNniInr: null,
          unavailableReason: unavailableEconomyReason,
          source: rbiEconomySource
        },
    profileSource: stateDirectorySource
  };
});

export function getStateProfile(regionId: string) {
  return stateProfiles.find((profile) => profile.regionId === regionId);
}
