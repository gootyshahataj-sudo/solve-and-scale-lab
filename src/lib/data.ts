export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Status = "Unsolved" | "Partially solved" | "Actively worked on";
export type Difficulty = "Low" | "Medium" | "High";

export const CATEGORIES = [
  "Agriculture",
  "Education",
  "Healthcare",
  "Environment",
  "Transportation",
  "Technology",
  "Finance",
  "Government",
  "Daily Life",
  "Employment",
  "Waste Management",
  "Rural Development",
] as const;

export const INDUSTRIES = [
  "AgriTech",
  "EdTech",
  "HealthTech",
  "ClimateTech",
  "Mobility",
  "FinTech",
  "GovTech",
  "Consumer",
  "Circular Economy",
];

export const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];
export const STATUSES: Status[] = ["Unsolved", "Partially solved", "Actively worked on"];

export interface ExistingSolution {
  id: string;
  name: string;
  description: string;
  howItWorks: string;
  features: string[];
  advantages: string[];
  limitations: string[];
  source: string;
  cost: string;
  offline: "Yes" | "No" | "Partial";
  reach: string;
  languages: string;
}

export interface CommunityIdea {
  id: string;
  author: string;
  role: string;
  title: string;
  body: string;
  upvotes: number;
  createdAt: string;
  comments: { id: string; author: string; body: string; createdAt: string }[];
}

export interface StartupOpportunity {
  targetUsers: string;
  competitors: string;
  marketGap: string;
  proposedSolution: string;
  uniqueValue: string;
  businessModel: string;
  technology: string[];
  difficulty: Difficulty;
  impact: string;
  stage: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  overview: string;
  category: (typeof CATEGORIES)[number];
  industry: string;
  location: string;
  severity: Severity;
  status: Status;
  trending: boolean;
  peopleAffected: number;
  whoFaces: string;
  whereOccurs: string;
  frequency: string;
  sources: { label: string; url: string }[];
  upvotes: number;
  createdAt: string;
  existingSolutions: ExistingSolution[];
  alternatives: { name: string; detail: string }[];
  limitations: string[];
  improvements: { title: string; detail: string }[];
  ideas: CommunityIdea[];
  startup: StartupOpportunity;
}

export const PROBLEMS: Problem[] = [
  {
    id: "agri-expert-access",
    title: "Farmers in rural villages can't reach crop experts before harvest windows close",
    description:
      "Seasonal, language-heavy and offline — most tele-agriculture platforms assume connectivity that does not exist in the last mile.",
    overview:
      "A smallholder who spots leaf curl on a tomato crop has roughly 72 hours to act. The nearest extension officer serves 14 villages, advisory helplines run only in two languages, and the apps that could help need a data connection the field does not have. The result is avoidable yield loss on plots that already run on thin margins.",
    category: "Agriculture",
    industry: "AgriTech",
    location: "India, Kenya, Indonesia",
    severity: "High",
    status: "Partially solved",
    trending: true,
    peopleAffected: 1200000,
    whoFaces: "Smallholder farmers with under 2 hectares, mostly without smartphones",
    whereOccurs: "Rural districts with patchy 2G coverage and one extension officer per 14 villages",
    frequency: "Every growing season, 2-3 crisis windows per year",
    sources: [
      { label: "FAO Smallholder Advisory Access Survey (2024)", url: "https://www.fao.org" },
      { label: "National Agriculture Extension Review", url: "https://www.fao.org" },
    ],
    upvotes: 342,
    createdAt: "2026-06-14",
    existingSolutions: [
      {
        id: "agriconnect",
        name: "AgriConnect Voice",
        description: "Voice-first advisory line that routes farmer calls to agronomists.",
        howItWorks:
          "A farmer dials a toll-free number, describes the symptom in their language, and the call is routed to an agronomist on rota. Advice is logged and a follow-up SMS is sent.",
        features: ["Toll-free voice line", "5 regional languages", "SMS follow-up", "Call transcripts"],
        advantages: ["Works on feature phones", "No literacy requirement", "Human judgement in the loop"],
        limitations: ["Peak-season wait times over 40 minutes", "No visual diagnosis", "Costly to scale agronomist rota"],
        source: "agriconnect.example.org",
        cost: "Free to farmer, donor funded",
        offline: "Yes",
        reach: "4 states",
        languages: "5",
      },
      {
        id: "cropadvisor",
        name: "CropAdvisor App",
        description: "Smartphone app with photo-based disease detection and a paid expert chat.",
        howItWorks:
          "The user photographs an affected leaf. An on-device model returns the three most likely diseases with confidence, then offers a paid chat with a certified agronomist.",
        features: ["Photo diagnosis", "Treatment library", "Paid expert chat", "Weather alerts"],
        advantages: ["Instant first answer", "Large disease library", "Works offline for detection"],
        limitations: ["Requires a smartphone", "Subscription cost", "English and Hindi only", "Chat needs data"],
        source: "cropadvisor.example.com",
        cost: "Subscription, mid",
        offline: "Partial",
        reach: "National",
        languages: "2",
      },
      {
        id: "kisan-kendra",
        name: "Government Extension Centres",
        description: "Physical district centres staffed by public agriculture officers.",
        howItWorks:
          "Farmers travel to the block centre during working hours, bring a sample, and receive a written recommendation with subsidised input vouchers.",
        features: ["In-person diagnosis", "Subsidised inputs", "Soil testing", "Training days"],
        advantages: ["Trusted and free", "Access to subsidies", "Physical sample inspection"],
        limitations: ["Travel of 20-40km", "Weekday hours only", "One officer per 14 villages", "Long queues in peak season"],
        source: "district agriculture department",
        cost: "Free, travel cost to farmer",
        offline: "Yes",
        reach: "District",
        languages: "Local",
      },
    ],
    alternatives: [
      { name: "WhatsApp village groups", detail: "Farmers photograph crops and ask neighbours; advice quality varies wildly and misinformation spreads fast." },
      { name: "Input dealer advice", detail: "The shop that sells pesticide also diagnoses the problem, which biases towards over-prescription." },
      { name: "Community radio slots", detail: "Weekly broadcast advisory — broad and timely, but never specific to one field." },
    ],
    limitations: [
      "Expensive for a farmer earning seasonal income",
      "Requires a smartphone and a data connection",
      "Poor accessibility in low-signal rural belts",
      "Limited to two or three languages",
      "Advice arrives after the 72-hour action window",
      "No record that follows the farmer between seasons",
    ],
    improvements: [
      { title: "Missed-call callback queue", detail: "Let farmers place a missed call and receive a scheduled callback, removing airtime cost and queue waiting." },
      { title: "Offline-first image triage on cheap Android", detail: "Ship a 6MB quantised model that runs on sub-$60 handsets and syncs when signal returns." },
      { title: "Village-level agent model", detail: "Train one literate youth per village as a paid intermediary who operates the tool on behalf of others." },
    ],
    ideas: [
      {
        id: "idea-agri-1",
        author: "Meera Raghavan",
        role: "Student, Agri Engineering",
        title: "Voice bot with local dialect packs, trained on extension call recordings",
        body: "Ten years of recorded helpline calls already exist. Fine-tune a small speech model per dialect so the first triage is automated and agronomists only handle escalations.",
        upvotes: 96,
        createdAt: "2026-07-02",
        comments: [
          { id: "c1", author: "Daniel Otieno", body: "Consent and recording rights on those call archives will be the hard part, not the model.", createdAt: "2026-07-03" },
        ],
      },
      {
        id: "idea-agri-2",
        author: "Sunil Kharde",
        role: "Developer",
        title: "Printed QR crop cards that work without any app",
        body: "Each card covers one crop and one symptom family. Scanning at a village kiosk prints the treatment sheet locally, so no farmer device is needed at all.",
        upvotes: 54,
        createdAt: "2026-07-11",
        comments: [],
      },
    ],
    startup: {
      targetUsers: "Smallholder farmers and the village-level agents who serve them",
      competitors: "AgriConnect Voice, CropAdvisor App, public extension centres",
      marketGap: "No offline-capable, dialect-aware diagnosis that reaches a farmer within the 72-hour action window at near-zero cost",
      proposedSolution: "A missed-call plus offline-model hybrid, operated by paid village agents with a shared low-cost handset",
      uniqueValue: "Answer within two hours, in the farmer's dialect, with no device or data plan required from the farmer",
      businessModel: "Per-diagnosis micro-fee bundled into input purchases, plus insurer and cooperative data subscriptions",
      technology: ["On-device vision model", "IVR / telephony", "Speech recognition", "Offline sync"],
      difficulty: "Medium",
      impact: "Yield loss reduced by an estimated 18-25% on enrolled plots",
      stage: "Prototype",
    },
  },
  {
    id: "clinic-offline-records",
    title: "Small clinics lose patient records when power or internet drops",
    description:
      "Cloud-first record systems disappear offline. Clinics revert to paper and follow-up continuity breaks across the region.",
    overview:
      "A rural clinic seeing 90 patients a day runs on a cloud record system designed for city hospitals. When the line drops, staff switch to paper slips that are rarely reconciled later. Chronic patients then arrive at their next visit with no history, and clinicians restart treatment decisions from scratch.",
    category: "Healthcare",
    industry: "HealthTech",
    location: "Sub-Saharan Africa, South Asia",
    severity: "Critical",
    status: "Partially solved",
    trending: true,
    peopleAffected: 800000,
    whoFaces: "Clinic staff and chronic-care patients in facilities with unstable power",
    whereOccurs: "Primary health centres outside grid-stable districts",
    frequency: "Several outages per week",
    sources: [{ label: "Primary Care Digital Readiness Report", url: "https://www.who.int" }],
    upvotes: 287,
    createdAt: "2026-05-30",
    existingSolutions: [
      {
        id: "cloudemr",
        name: "CloudEMR Lite",
        description: "Browser-based electronic medical record for small facilities.",
        howItWorks: "Staff enter visits into a web app; everything is stored server-side and synced live to a district dashboard.",
        features: ["Visit notes", "District reporting", "Prescription printing", "Role permissions"],
        advantages: ["No local server", "Automatic district reporting", "Cheap per seat"],
        limitations: ["Unusable offline", "Slow on 2G", "No local backup"],
        source: "cloudemr.example.org",
        cost: "Low subscription",
        offline: "No",
        reach: "Multi-country",
        languages: "3",
      },
      {
        id: "openrecords",
        name: "OpenRecords Local Server",
        description: "Self-hosted record system running on a clinic mini-PC.",
        howItWorks: "A small server in the clinic holds the database; tablets connect over local Wi-Fi and the server pushes to district storage nightly.",
        features: ["Local-first storage", "Nightly sync", "Offline lab module", "Open source"],
        advantages: ["Fully works offline", "Data stays in the clinic", "No per-seat cost"],
        limitations: ["Needs on-site technical maintenance", "Hardware failure loses data", "Upgrade path is manual"],
        source: "openrecords.example.org",
        cost: "Hardware upfront",
        offline: "Yes",
        reach: "Clinic",
        languages: "Configurable",
      },
      {
        id: "paperplus",
        name: "Structured Paper Registers",
        description: "Carbon-copy registers with a monthly data-entry clerk.",
        howItWorks: "Clinicians write into a structured register; a clerk digitises the pages monthly into a district spreadsheet.",
        features: ["Standard forms", "Carbon copies", "Monthly digitisation"],
        advantages: ["Never fails", "Zero training", "Cheapest option"],
        limitations: ["No search", "Month-old data", "Illegible entries", "Physical loss and damage"],
        source: "ministry of health registers",
        cost: "Very low",
        offline: "Yes",
        reach: "Clinic",
        languages: "Local",
      },
    ],
    alternatives: [
      { name: "Personal patient-held cards", detail: "The patient carries their own history card; effective until the card is lost or soaked." },
      { name: "Clinician WhatsApp notes", detail: "Staff message case summaries to themselves as an informal backup, with obvious privacy problems." },
    ],
    limitations: [
      "Cloud tools stop entirely without connectivity",
      "Local servers need maintenance skills the clinic does not have",
      "No reconciliation path from paper back into the digital record",
      "Chronic-care history is lost between visits",
      "District reporting delays of up to a month",
    ],
    improvements: [
      { title: "Offline-first sync with conflict resolution", detail: "Make the tablet the source of truth and treat the server as an eventual mirror." },
      { title: "Paper-to-digital OCR reconciliation", detail: "Photograph the outage-day register and auto-match entries to existing patient IDs." },
      { title: "Solar-buffered mini server", detail: "A $90 board with a battery hat that survives eight-hour outages." },
    ],
    ideas: [
      {
        id: "idea-clinic-1",
        author: "Dr. Amara Nwosu",
        role: "Clinician",
        title: "QR patient card that carries a signed offline summary",
        body: "Print a QR on the patient card holding an encrypted last-visit summary. Any clinic can read it without a network, and the record travels with the person.",
        upvotes: 128,
        createdAt: "2026-06-21",
        comments: [
          { id: "c2", author: "Priya Sethi", body: "Cap it to the last three visits or the QR gets unreadable at print size.", createdAt: "2026-06-22" },
        ],
      },
    ],
    startup: {
      targetUsers: "Primary health centres in low-connectivity districts and their district health offices",
      competitors: "CloudEMR Lite, OpenRecords, ministry paper registers",
      marketGap: "Nothing bridges outage-day paper back into the digital record automatically",
      proposedSolution: "Offline-first tablet record with signed QR patient cards and OCR reconciliation of paper days",
      uniqueValue: "Zero data loss during outages without asking the clinic to run a server",
      businessModel: "Per-facility annual licence funded by district health budgets and donor programmes",
      technology: ["CRDT sync", "On-device OCR", "Signed QR payloads", "Low-power hardware"],
      difficulty: "High",
      impact: "Continuity of care restored for roughly 300k chronic patients",
      stage: "Concept",
    },
  },
  {
    id: "recycling-traceability",
    title: "Households can't verify whether recyclables actually get recycled",
    description:
      "No traceability between doorstep pickup and processing — trust is low and contamination rates stay high.",
    overview:
      "Residents sort waste carefully and then watch the collection truck tip every stream into one hopper. Without proof of what happens downstream, sorting discipline collapses, contamination rises, and the material recovery facility receives loads it cannot process economically.",
    category: "Waste Management",
    industry: "Circular Economy",
    location: "Urban wards, Brazil, India, Poland",
    severity: "Medium",
    status: "Unsolved",
    trending: true,
    peopleAffected: 2600000,
    whoFaces: "Urban households, municipal collectors and material recovery facility operators",
    whereOccurs: "Mid-sized cities with mixed formal and informal collection",
    frequency: "Every collection cycle",
    sources: [{ label: "Municipal Waste Stream Audit 2025", url: "https://www.unep.org" }],
    upvotes: 198,
    createdAt: "2026-07-01",
    existingSolutions: [
      {
        id: "binscan",
        name: "BinScan Rewards",
        description: "Points app where residents scan a bin QR at pickup.",
        howItWorks: "The collector scans the household bin tag; weight is logged and residents earn points redeemable with local partners.",
        features: ["Bin QR tags", "Weight logging", "Reward partners", "Ward leaderboard"],
        advantages: ["Motivates sorting", "Cheap to deploy", "Gives ward-level data"],
        limitations: ["Stops at the truck", "No proof of downstream fate", "Rewards fatigue after 3 months"],
        source: "binscan.example.com",
        cost: "Municipal contract",
        offline: "Partial",
        reach: "City",
        languages: "2",
      },
      {
        id: "mrfdash",
        name: "MRF Operations Dashboard",
        description: "Facility software tracking inbound loads and bale output.",
        howItWorks: "Weighbridge data and bale tags are entered at the facility, producing monthly recovery-rate reports for the municipality.",
        features: ["Weighbridge integration", "Bale tracking", "Contamination logging", "Monthly reports"],
        advantages: ["Accurate facility view", "Regulator-ready reporting"],
        limitations: ["Invisible to residents", "Load-level only, not household", "Monthly cadence"],
        source: "mrfdash.example.com",
        cost: "Enterprise",
        offline: "No",
        reach: "Facility",
        languages: "1",
      },
    ],
    alternatives: [
      { name: "Ward WhatsApp photo proof", detail: "Collectors post photos of segregated loads; easy to stage and impossible to audit." },
      { name: "Informal recycler receipts", detail: "Households sell high-value material directly for cash, which works but strips the formal stream." },
    ],
    limitations: [
      "Chain of custody breaks at the truck",
      "Residents get no evidence, so trust decays",
      "Household-level contamination is never attributed",
      "Reporting arrives monthly, far too late to correct behaviour",
    ],
    improvements: [
      { title: "Load-linked household receipts", detail: "Tie each bin scan to a truck load and a bale batch so a resident can follow their own material." },
      { title: "Contamination photo feedback in 24h", detail: "One photo of the offending item back to the household beats a leaderboard." },
      { title: "Open ward-level recovery API", detail: "Publish recovery rates per ward so residents can compare and local media can report." },
    ],
    ideas: [
      {
        id: "idea-waste-1",
        author: "Luca Marchetti",
        role: "Entrepreneur",
        title: "Batch passport: one scannable ID from bin to bale",
        body: "Give every truck load a batch ID that inherits household scans and is stamped again at the facility. Residents see a simple 'your plastic became these bales' page.",
        upvotes: 71,
        createdAt: "2026-07-18",
        comments: [],
      },
    ],
    startup: {
      targetUsers: "Municipalities, ward associations and material recovery facility operators",
      competitors: "BinScan Rewards, MRF Operations Dashboard",
      marketGap: "No end-to-end custody record connecting a household bin to a finished bale",
      proposedSolution: "Batch passport tracking with 24-hour contamination feedback to households",
      uniqueValue: "Proof, not points — residents see the actual downstream fate of their material",
      businessModel: "Per-household municipal SaaS fee plus verified-recovery certificates sold to brands",
      technology: ["QR batch tracking", "Weighbridge integration", "Mobile capture", "Public data API"],
      difficulty: "Medium",
      impact: "Contamination cut by an estimated 30%, recovery value up materially",
      stage: "Prototype",
    },
  },
  {
    id: "student-skill-employability",
    title: "Graduates finish degrees without evidence of the skills employers screen for",
    description:
      "Transcripts describe courses, not capability, so first-generation graduates are filtered out before any interview.",
    overview:
      "Hiring screens now run on demonstrable project work and verified skills. A student from a tier-three college finishes with a strong transcript, no portfolio, and no network, so their application never reaches a human. Colleges track marks; employers want evidence.",
    category: "Employment",
    industry: "EdTech",
    location: "India, Nigeria, Philippines",
    severity: "High",
    status: "Partially solved",
    trending: true,
    peopleAffected: 4300000,
    whoFaces: "First-generation graduates from non-elite institutions",
    whereOccurs: "Tier-two and tier-three colleges with weak placement cells",
    frequency: "Every graduating cohort",
    sources: [{ label: "Graduate Employability Tracker 2025", url: "https://www.ilo.org" }],
    upvotes: 264,
    createdAt: "2026-04-19",
    existingSolutions: [
      {
        id: "moocs",
        name: "Certificate MOOCs",
        description: "Online course platforms issuing completion certificates.",
        howItWorks: "Students take video courses and quizzes, then receive a shareable certificate for their profile.",
        features: ["Video lessons", "Quizzes", "Shareable certificates", "Career tracks"],
        advantages: ["Cheap and flexible", "Recognised brands", "Broad subject range"],
        limitations: ["Completion is not competence", "Employers discount certificates", "No project evidence"],
        source: "mooc platforms",
        cost: "Low to mid",
        offline: "No",
        reach: "Global",
        languages: "Many",
      },
      {
        id: "placementcell",
        name: "College Placement Cells",
        description: "Institution-run recruitment drives.",
        howItWorks: "The cell invites companies for campus drives, shortlists by marks, and runs aptitude rounds on site.",
        features: ["Campus drives", "Aptitude prep", "Employer relationships"],
        advantages: ["Direct employer access", "Free to students"],
        limitations: ["Only serves top-quartile students", "Few employer relationships outside metros", "Marks-based filtering"],
        source: "institutional placement office",
        cost: "Free",
        offline: "Yes",
        reach: "Campus",
        languages: "Local",
      },
    ],
    alternatives: [
      { name: "Freelance marketplaces", detail: "Students build a rating by underbidding; it proves delivery but pays poorly and rarely maps to a career." },
      { name: "Open-source contribution", detail: "Excellent evidence, but the onboarding gap is brutal without a mentor." },
    ],
    limitations: [
      "Certificates prove attendance, not skill",
      "No standard way to verify a student's project work",
      "Placement support is concentrated on the top decile",
      "English-only screening tools filter capable candidates",
    ],
    improvements: [
      { title: "Employer-scored project briefs", detail: "Real briefs written by hiring teams, scored against their own rubric, and attached to the profile." },
      { title: "Verified peer review circles", detail: "Cohort-based code and design review that produces an auditable trail of feedback." },
      { title: "Regional-language screening", detail: "Assess reasoning in the candidate's strongest language, then teach the workplace language separately." },
    ],
    ideas: [
      {
        id: "idea-emp-1",
        author: "Fatima Bello",
        role: "Researcher",
        title: "Skill passport signed by the reviewing employer",
        body: "Each completed brief is signed by the company that reviewed it. Employers trust their own peers' signatures far more than a platform badge.",
        upvotes: 88,
        createdAt: "2026-05-08",
        comments: [
          { id: "c3", author: "Rahul Menon", body: "The signing employer needs a reason to participate — early access to the candidate pool, probably.", createdAt: "2026-05-09" },
        ],
      },
    ],
    startup: {
      targetUsers: "Tier-two and tier-three graduates plus mid-market employers hiring at volume",
      competitors: "Certificate MOOCs, campus placement cells, freelance marketplaces",
      marketGap: "No portable, employer-signed evidence layer between a transcript and a job application",
      proposedSolution: "Employer-authored project briefs with signed, portable skill records",
      uniqueValue: "The evidence is written and signed by the same companies that do the hiring",
      businessModel: "Employer subscription for verified candidate pipelines; free for students",
      technology: ["Verifiable credentials", "Rubric scoring", "Portfolio hosting", "Matching engine"],
      difficulty: "Medium",
      impact: "Interview conversion up 3x for non-elite candidates in pilots",
      stage: "Early traction",
    },
  },
  {
    id: "last-mile-transit-gap",
    title: "Commuters abandon public transport because the last two kilometres are unusable",
    description:
      "Trunk routes run well; the walk or connection at the end is unlit, unpriced and unmapped, so people drive instead.",
    overview:
      "City transit authorities optimise trunk corridors and report ridership stagnation. The real breakage is at the ends of the trip: no safe footpath, informal autos with no fixed fare, and a connection that is missing from every journey planner. People with a car simply stop using the network.",
    category: "Transportation",
    industry: "Mobility",
    location: "Mid-sized cities worldwide",
    severity: "Medium",
    status: "Unsolved",
    trending: false,
    peopleAffected: 5100000,
    whoFaces: "Daily commuters, especially women travelling after dark",
    whereOccurs: "Peripheral wards between the last stop and residential clusters",
    frequency: "Twice daily",
    sources: [{ label: "Urban Mobility Ridership Study", url: "https://www.itdp.org" }],
    upvotes: 143,
    createdAt: "2026-03-27",
    existingSolutions: [
      {
        id: "journeyplanner",
        name: "City Journey Planner",
        description: "Official multi-modal trip planning app.",
        howItWorks: "Static timetable data plus live vehicle positions produce a route suggestion between two points.",
        features: ["Live positions", "Fare estimate", "Multi-modal routing"],
        advantages: ["Authoritative timetable", "Free", "Live arrivals"],
        limitations: ["Informal modes absent", "No safety information", "Assumes a walkable footpath exists"],
        source: "city transit authority",
        cost: "Free",
        offline: "Partial",
        reach: "City",
        languages: "2",
      },
      {
        id: "ridehail",
        name: "Ride-hailing Short Trips",
        description: "App-based cars and bikes for the final leg.",
        howItWorks: "The commuter books a short trip from the transit stop; pricing is dynamic and driver acceptance varies.",
        features: ["On-demand", "Cashless", "Driver tracking"],
        advantages: ["Reliable when accepted", "Door-to-door", "Trackable"],
        limitations: ["Surge pricing at peak", "Drivers reject short fares", "Cost exceeds the transit fare itself"],
        source: "commercial ride-hail apps",
        cost: "High per trip",
        offline: "No",
        reach: "City",
        languages: "Many",
      },
    ],
    alternatives: [
      { name: "Shared autos on fixed informal routes", detail: "Cheap and frequent, but routes and fares live only in local knowledge." },
      { name: "Personal two-wheeler parked at the station", detail: "Works for one person, needs secure parking that mostly does not exist." },
    ],
    limitations: [
      "Informal transport is invisible to official planners",
      "No lighting or footpath data in any routing product",
      "Short trips are economically unattractive to ride-hail drivers",
      "Fares for the last leg often exceed the entire trunk journey",
    ],
    improvements: [
      { title: "Crowd-mapped informal routes", detail: "Let regular riders trace shared-auto routes and fares, then publish them into the journey planner." },
      { title: "Safety-weighted walking routes", detail: "Route people along lit, populated paths rather than the shortest line." },
      { title: "Bundled last-leg fare", detail: "Sell the trunk ticket and the final leg together so drivers get guaranteed volume." },
    ],
    ideas: [
      {
        id: "idea-transit-1",
        author: "Yasmin Farouk",
        role: "Urban planner",
        title: "Station-level last-leg concessions",
        body: "Auction a guaranteed last-leg contract per station to shared-auto collectives with a fixed published fare. Predictability beats dynamic pricing here.",
        upvotes: 47,
        createdAt: "2026-04-04",
        comments: [],
      },
    ],
    startup: {
      targetUsers: "Transit authorities, shared-auto collectives and daily commuters",
      competitors: "Official journey planners, ride-hailing apps",
      marketGap: "Informal last-leg supply is unmapped, unpriced and absent from every planning tool",
      proposedSolution: "Crowd-mapped informal route layer with bundled, fixed-price last-leg tickets",
      uniqueValue: "Turns the invisible informal network into bookable, predictable capacity",
      businessModel: "Revenue share on bundled tickets plus data licensing to transit authorities",
      technology: ["Crowd mapping", "GTFS extensions", "Ticketing integration", "Routing"],
      difficulty: "High",
      impact: "Ridership recovery of 8-12% on peripheral corridors",
      stage: "Concept",
    },
  },
  {
    id: "smallholder-credit-invisibility",
    title: "Micro-entrepreneurs are invisible to lenders because their cash trade leaves no record",
    description:
      "Thriving cash businesses fail credit checks that only read formal statements, so growth capital never arrives.",
    overview:
      "A vegetable seller turning steady daily volume has no bank statement, no GST trail and no credit score. Lenders price that absence as risk and decline, while informal lenders charge rates that consume the margin. The business stays exactly the same size for a decade.",
    category: "Finance",
    industry: "FinTech",
    location: "South and Southeast Asia, West Africa",
    severity: "High",
    status: "Partially solved",
    trending: false,
    peopleAffected: 9400000,
    whoFaces: "Cash-trading micro-entrepreneurs, mostly women-led businesses",
    whereOccurs: "Street markets and neighbourhood shops",
    frequency: "Continuous",
    sources: [{ label: "Financial Inclusion Gap Report", url: "https://www.worldbank.org" }],
    upvotes: 176,
    createdAt: "2026-02-12",
    existingSolutions: [
      {
        id: "mfi",
        name: "Microfinance Group Lending",
        description: "Joint-liability group loans issued by field officers.",
        howItWorks: "Five borrowers guarantee each other; weekly repayment is collected in person by a field officer.",
        features: ["Group guarantee", "Weekly collection", "No collateral"],
        advantages: ["Reaches unbanked borrowers", "High repayment rates", "Established at scale"],
        limitations: ["Small ticket ceiling", "Weekly meetings cost trading hours", "Group pressure can be coercive"],
        source: "microfinance institutions",
        cost: "18-26% APR",
        offline: "Yes",
        reach: "Regional",
        languages: "Local",
      },
      {
        id: "upiscore",
        name: "Digital Payment Credit Scoring",
        description: "Lenders scoring merchants on digital transaction history.",
        howItWorks: "A merchant links their payment account; twelve months of inflow data produces an instant limit offer.",
        features: ["Instant decision", "No paperwork", "Automatic repayment"],
        advantages: ["Fast", "Cheap to underwrite", "Grows with volume"],
        limitations: ["Useless for cash-only trade", "Needs 12 months of history", "Excludes seasonal businesses"],
        source: "payment platform lending arms",
        cost: "14-22% APR",
        offline: "No",
        reach: "National",
        languages: "3",
      },
    ],
    alternatives: [
      { name: "Rotating savings circles", detail: "Reliable and social, but the payout order rarely matches when capital is actually needed." },
      { name: "Supplier credit", detail: "The wholesaler extends stock on trust, which caps growth at the supplier's own appetite." },
    ],
    limitations: [
      "Cash trade produces no scoreable trail",
      "Twelve months of digital history excludes new and seasonal traders",
      "Weekly in-person collection costs the borrower trading hours",
      "Ticket sizes cap out well below equipment purchases",
    ],
    improvements: [
      { title: "Supplier-ledger underwriting", detail: "Use the wholesaler's own purchase ledger as the primary repayment signal." },
      { title: "Cash-flow attestation by market association", detail: "Let the market committee attest daily turnover bands for its members." },
      { title: "Seasonal repayment schedules", detail: "Match instalments to trade seasonality rather than a flat weekly demand." },
    ],
    ideas: [
      {
        id: "idea-fin-1",
        author: "Grace Mensah",
        role: "Investor",
        title: "Underwrite the supply chain, not the individual",
        body: "The wholesaler already knows who pays. Lend against that ledger and share the default risk with the supplier who holds the relationship.",
        upvotes: 63,
        createdAt: "2026-03-02",
        comments: [],
      },
    ],
    startup: {
      targetUsers: "Cash-trading micro-merchants and the wholesalers who supply them",
      competitors: "Microfinance institutions, payment-platform lending arms",
      marketGap: "No underwriting path for merchants whose entire trade is cash and whose history is relational",
      proposedSolution: "Supplier-ledger underwriting with market-association attestation and seasonal repayment",
      uniqueValue: "Credit built on the record that already exists rather than one the merchant must create",
      businessModel: "Origination fee shared with suppliers plus a spread on lender capital",
      technology: ["Ledger ingestion", "Alternative credit scoring", "Mobile collections", "Risk sharing contracts"],
      difficulty: "High",
      impact: "Access to growth capital for millions of currently unscoreable businesses",
      stage: "Early traction",
    },
  },
  {
    id: "rural-water-quality-blindspot",
    title: "Villages have no way to know their water is unsafe until people are already sick",
    description:
      "Testing is centralised, slow and quarterly, so contamination is discovered weeks after exposure begins.",
    overview:
      "A hand-pump supplying 400 households is tested once a quarter by a district lab. Samples travel for a day, results return in three weeks, and nobody is notified unless the reading is catastrophic. Contamination events that last two weeks are effectively invisible.",
    category: "Rural Development",
    industry: "ClimateTech",
    location: "Rural districts, South Asia and East Africa",
    severity: "Critical",
    status: "Unsolved",
    trending: false,
    peopleAffected: 3100000,
    whoFaces: "Households dependent on shared hand pumps and open wells",
    whereOccurs: "Villages outside piped-supply networks",
    frequency: "Seasonal peaks after monsoon",
    sources: [{ label: "Rural Drinking Water Quality Monitoring Review", url: "https://www.unicef.org" }],
    upvotes: 211,
    createdAt: "2026-06-02",
    existingSolutions: [
      {
        id: "districtlab",
        name: "District Laboratory Testing",
        description: "Quarterly sampling by public health technicians.",
        howItWorks: "A technician collects samples on a route, transports them to the district lab, and results are filed into a state dashboard.",
        features: ["Full chemical panel", "Accredited results", "State reporting"],
        advantages: ["Highly accurate", "Legally recognised", "Free to the village"],
        limitations: ["Three-week turnaround", "Quarterly only", "Results rarely reach the village"],
        source: "public health engineering department",
        cost: "State funded",
        offline: "Yes",
        reach: "District",
        languages: "Local",
      },
      {
        id: "fieldkit",
        name: "Field Test Strip Kits",
        description: "Colour-comparison strips for basic contaminant screening.",
        howItWorks: "A trained volunteer dips a strip, compares the colour to a chart, and records the reading in a register.",
        features: ["Immediate reading", "No equipment", "Cheap per test"],
        advantages: ["Same-day result", "Usable by volunteers", "Very low cost"],
        limitations: ["Narrow contaminant range", "Subjective colour reading", "No bacterial detection", "Results not aggregated"],
        source: "NGO water programmes",
        cost: "Very low",
        offline: "Yes",
        reach: "Village",
        languages: "Local",
      },
    ],
    alternatives: [
      { name: "Boiling and household filters", detail: "Effective mitigation, but fuel cost and filter replacement make it inconsistent." },
      { name: "Tanker deliveries after an outbreak", detail: "Reactive by definition and expensive per litre." },
    ],
    limitations: [
      "Three-week result turnaround makes data historical",
      "No bacterial detection in field kits",
      "Results never reach the households that drink the water",
      "No continuous monitoring between quarterly visits",
    ],
    improvements: [
      { title: "Weekly volunteer testing with SMS aggregation", detail: "Push strip readings into a shared map the same day via a simple SMS code." },
      { title: "Low-cost bacterial incubation pouch", detail: "A 12-hour ambient incubation pouch gives a village a same-day presence/absence answer." },
      { title: "Public pump scorecards", detail: "Paint a QR on each pump linking to its live testing history." },
    ],
    ideas: [
      {
        id: "idea-water-1",
        author: "Ravi Deshmukh",
        role: "Developer",
        title: "SMS shortcode for strip readings, map for the district",
        body: "Volunteers text three digits per pump. The district gets a live contamination map for the price of an SMS, no app or smartphone anywhere in the loop.",
        upvotes: 102,
        createdAt: "2026-06-19",
        comments: [
          { id: "c4", author: "Meera Raghavan", body: "Add a weekly reminder text or reporting drops off after month two.", createdAt: "2026-06-20" },
        ],
      },
    ],
    startup: {
      targetUsers: "Village water committees, district health offices and rural NGOs",
      competitors: "District laboratories, NGO strip-kit programmes",
      marketGap: "No same-day, village-level, bacterial-capable monitoring with a public feedback loop",
      proposedSolution: "Volunteer weekly testing with SMS aggregation, pump scorecards and low-cost bacterial pouches",
      uniqueValue: "Contamination surfaced in hours instead of weeks, visible to the people drinking the water",
      businessModel: "Consumables sale plus district monitoring subscription",
      technology: ["SMS aggregation", "Low-cost assays", "Geospatial dashboards"],
      difficulty: "Medium",
      impact: "Waterborne illness reduced by an estimated 20% in monitored villages",
      stage: "Prototype",
    },
  },
  {
    id: "civic-grievance-blackhole",
    title: "Civic complaints disappear after submission with no accountable owner",
    description:
      "Residents report a broken streetlight or overflowing drain and never learn whether anyone was assigned to it.",
    overview:
      "Municipal grievance portals accept complaints, generate a ticket number, and then reveal nothing. Residents cannot see the assigned department, the deadline, or whether the ticket was closed without any work being done. Repeat complaints flood the system and staff lose the ability to prioritise.",
    category: "Government",
    industry: "GovTech",
    location: "Municipal wards, global",
    severity: "Medium",
    status: "Partially solved",
    trending: false,
    peopleAffected: 7800000,
    whoFaces: "Urban residents and the municipal staff drowning in duplicate tickets",
    whereOccurs: "City and ward administration",
    frequency: "Daily",
    sources: [{ label: "Municipal Service Delivery Audit", url: "https://www.oecd.org" }],
    upvotes: 129,
    createdAt: "2026-01-22",
    existingSolutions: [
      {
        id: "grievanceportal",
        name: "Municipal Grievance Portal",
        description: "Official web form and ticket tracker.",
        howItWorks: "A resident submits a categorised complaint and receives a ticket number; internal routing happens invisibly.",
        features: ["Category routing", "Ticket numbers", "Photo upload"],
        advantages: ["Official record", "Free", "Photo evidence"],
        limitations: ["No visible owner", "Tickets closed without proof", "No duplicate merging", "Desktop-oriented"],
        source: "municipal corporation",
        cost: "Free",
        offline: "No",
        reach: "City",
        languages: "2",
      },
      {
        id: "socialmedia",
        name: "Public Social Media Escalation",
        description: "Tagging officials publicly to force a response.",
        howItWorks: "A resident posts a photo tagging the city account; visibility pressure drives an ad-hoc fix.",
        features: ["Public visibility", "Fast escalation", "Community amplification"],
        advantages: ["Genuinely effective for loud cases", "No system needed"],
        limitations: ["Favours users with reach", "No record or SLA", "Ignores quiet neighbourhoods"],
        source: "public platforms",
        cost: "Free",
        offline: "No",
        reach: "Variable",
        languages: "Many",
      },
    ],
    alternatives: [
      { name: "Ward councillor WhatsApp", detail: "Direct and personal, entirely dependent on one individual's diligence." },
      { name: "Resident association escalation letters", detail: "Formal and slow, works only for organised neighbourhoods." },
    ],
    limitations: [
      "No named owner attached to a ticket",
      "Closure requires no proof of work",
      "Duplicate complaints are never merged",
      "Quiet neighbourhoods get systematically less attention",
    ],
    improvements: [
      { title: "Named owner and public SLA clock", detail: "Show the assigned officer and a countdown from the moment of assignment." },
      { title: "Photo-verified closure", detail: "Require an after photo geotagged to the complaint before a ticket can close." },
      { title: "Automatic duplicate clustering", detail: "Merge complaints within 50 metres and the same category into one weighted case." },
    ],
    ideas: [
      {
        id: "idea-gov-1",
        author: "Daniel Otieno",
        role: "Developer",
        title: "Ward accountability scoreboard",
        body: "Publish per-ward median resolution time monthly. Departments respond to comparison far more reliably than to individual complaints.",
        upvotes: 58,
        createdAt: "2026-02-09",
        comments: [],
      },
    ],
    startup: {
      targetUsers: "Municipal corporations, ward officers and resident associations",
      competitors: "In-house grievance portals, social media escalation",
      marketGap: "No accountability layer with named owners, proof-of-closure and duplicate clustering",
      proposedSolution: "An accountability layer over existing portals with public SLA clocks and photo-verified closure",
      uniqueValue: "Turns an opaque ticket number into a named, timed, provable commitment",
      businessModel: "Per-ward municipal licence with an optional public transparency dashboard",
      technology: ["Geospatial clustering", "Workflow engine", "Image verification", "Public dashboards"],
      difficulty: "Medium",
      impact: "Median resolution time down 40% in comparable deployments",
      stage: "Concept",
    },
  },
];

export const COMPARISON_METRICS: { key: keyof ExistingSolution; label: string }[] = [
  { key: "cost", label: "Cost" },
  { key: "offline", label: "Works offline" },
  { key: "reach", label: "Reach" },
  { key: "languages", label: "Languages" },
];

export function getProblem(id: string) {
  return PROBLEMS.find((p) => p.id === id);
}

export function formatAffected(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

export const PLATFORM_STATS = {
  problems: 4182,
  solutions: 12904,
  ideas: 38410,
  opportunities: 640,
};

export const CURRENT_USER = {
  name: "Gooty Shahataj",
  role: "Student & Builder",
  skills: ["React", "Product research", "Field interviews", "Python"],
  interests: ["Agriculture", "Rural Development", "Healthcare"],
};

export const ADMIN_REPORTS = [
  { id: "r1", target: "Idea: 'Guaranteed 10x returns on agri-drones'", reason: "Spam / promotional", reporter: "Priya Sethi", date: "2026-08-30" },
  { id: "r2", target: "Comment on clinic records problem", reason: "Shares patient identifiers", reporter: "Dr. Amara Nwosu", date: "2026-09-01" },
];

export const ADMIN_USERS = [
  { id: "u1", name: "Meera Raghavan", role: "Student", contributions: 24, status: "Active" },
  { id: "u2", name: "Daniel Otieno", role: "Developer", contributions: 41, status: "Active" },
  { id: "u3", name: "Grace Mensah", role: "Investor", contributions: 12, status: "Active" },
  { id: "u4", name: "Luca Marchetti", role: "Entrepreneur", contributions: 19, status: "Suspended" },
];
