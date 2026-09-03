export type Language = 'en' | 'ta';

export const i18n = {
  en: {
    // Navigation
    home: 'Home',
    riskMap: 'Risk Map',
    safeRoute: 'Safe Route',
    shelters: 'Shelters',
    reportHazard: 'Report Hazard',
    alerts: 'Alerts',
    emergency: 'Emergency',

    // Titles & Header
    citizenPortalTitle: 'Citizen Safety & Neighborhood Portal',
    locationLabel: 'YOUR LOCATION',
    currentLocation: 'Velachery Lowlands, Zone 4, Chennai',
    defconStatus: 'DEFCON 2 ACTIVATION ACTIVE',
    
    // Safety Status Actions
    getToSafety: 'GET TO SAFETY NOW',
    iAmSafe: 'I Am Safe (Check-In)',
    registeredSafe: 'REGISTERED AS SAFE',
    requestAssistance: 'Request Emergency Assistance',
    assistanceSent: 'Emergency Assistance Signal Dispatched to EOC Triage Desk',

    // Risk Metrics
    riskScore: 'RISK SCORE',
    riskLevel: 'RISK LEVEL',
    aiConfidence: 'AI CONFIDENCE',
    whyRiskHigh: 'Why Risk is High',
    whatToDoNow: 'What to Do Now',
    aiDisclaimer: 'AI-assisted decision support • Non-scientific model',

    // Near Facilities & Road Alerts
    nearestShelter: 'Nearest Emergency Shelter',
    nearestHospital: 'Nearest Hospital & Medical Desk',
    roadWarnings: 'Flooded & Blocked Road Advisories',
    latestAlert: 'Latest High-Priority Advisory',

    // Hazard Report Form
    reportFormTitle: 'Submit Citizen Hazard Report',
    hazardType: 'Hazard Type',
    description: 'Hazard Description',
    waterLevelInput: 'Observed Water Depth (inches/feet)',
    uploadPhoto: 'Attach Photo Evidence',
    gpsDetected: 'GPS Coordinates Detected',
    submitReportBtn: 'Transmit Hazard Report to EOC',
    reportSubmittedTitle: 'Hazard Report Transmitted Successfully',
    confidenceScore: 'AI Credibility Score',
    verificationStatus: 'Verification Status',

    // Emergency Contacts
    emergencyHelplines: 'Emergency Hotlines',
    ambulance: '108 Ambulance Service',
    fireRescue: '101 Fire & Emergency',
    stateEmergency: '1070 State Disaster Relief',
    gccHelpline: '1913 Chennai Corp Helpline',
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    riskMap: 'ஆபத்து வரைபடம்',
    safeRoute: 'பாதுகாப்பான வழி',
    shelters: 'முகாம்கள்',
    reportHazard: 'ஆபத்தைப் புகாரளி',
    alerts: 'எச்சரிக்கைகள்',
    emergency: 'அவசரம்',

    // Titles & Header
    citizenPortalTitle: 'பொதுமக்கள் பாதுகாப்பு மையம்',
    locationLabel: 'உங்கள் இருப்பிடம்',
    currentLocation: 'வேளச்சேரி தாழ்வுப் பகுதி, மண்டலம் 4, சென்னை',
    defconStatus: 'அவசரகால நிலை 2 செயலில் உள்ளது',
    
    // Safety Status Actions
    getToSafety: 'உடனே பாதுகாப்பான இடத்திற்குச் செல்லுங்கள்',
    iAmSafe: 'நான் பாதுகாப்பாக உள்ளேன்',
    registeredSafe: 'பாதுகாப்பாகப் பதிவு செய்யப்பட்டது',
    requestAssistance: 'அவசர உதவி கோருங்கள்',
    assistanceSent: 'அவசர உதவி சமிக்ஞை EOC மையத்திற்கு அனுப்பப்பட்டது',

    // Risk Metrics
    riskScore: 'ஆபத்து மதிப்பெண்',
    riskLevel: 'ஆபத்து நிலை',
    aiConfidence: 'AI நம்பிக்கை அளவு',
    whyRiskHigh: 'ஆபத்து அதிகமாக இருப்பதற்கான காரணம்',
    whatToDoNow: 'இப்போது என்ன செய்ய வேண்டும்',
    aiDisclaimer: 'AI-உதவி தீர்மான ஆதரவு • அறிவியல் சார்ந்ததல்ல',

    // Near Facilities & Road Alerts
    nearestShelter: 'அருகிலுள்ள அவசரகால முகாம்',
    nearestHospital: 'அருகிலுள்ள மருத்துவமனை',
    roadWarnings: 'வெள்ளம் பாதிக்கப்பட்ட சாலை எச்சரிக்கைகள்',
    latestAlert: 'சமீபத்திய முக்கிய எச்சரிக்கை',

    // Hazard Report Form
    reportFormTitle: 'ஆபத்து பற்றிய தகவல் தெரிவிக்க',
    hazardType: 'ஆபத்து வகை',
    description: 'விளக்கம்',
    waterLevelInput: 'நீரின் ஆழம் (அங்குலம்/அடி)',
    uploadPhoto: 'புகைப்படம் இணைக்கவும்',
    gpsDetected: 'GPS இருப்பிடம் கண்டறியப்பட்டது',
    submitReportBtn: 'தகவலை EOC மையத்திற்கு அனுப்பு',
    reportSubmittedTitle: 'தகவல் வெற்றிகரமாக அனுப்பப்பட்டது',
    confidenceScore: 'AI நம்பகத்தன்மை மதிப்பெண்',
    verificationStatus: 'சரிபார்ப்பு நிலை',

    // Emergency Contacts
    emergencyHelplines: 'அவசர உதவி எண்கள்',
    ambulance: '108 ஆம்புலன்ஸ் சேவை',
    fireRescue: '101 தீயணைப்புத் துறை',
    stateEmergency: '1070 மாநில அவசர மையம்',
    gccHelpline: '1913 சென்னை மாநகராட்சி',
  }
};
