// === StartupOps Equity Calculator - Updated with Accurate Logic ===

// ====== CONSTANTS FROM REFERENCE CALCULATOR ======
const SERVICES = {
    STUDENT: {
        "branding": 30000,        // Branding & Strategy
        "pitchdeck": 20000,       // Pitch Deck Design  
        "website": 30000,         // Website Development
        "uiux": 25000,            // UI/UX Design
        "mvp": 90000,             // MVP Development
        "mobileapp": 150000,      // Mobile App Development
        "marketing": 20000,       // Marketing Setup
        "legal": 10000,           // Legal Documentation
        "fundraising": 35000,     // Fundraising Support
        "fullpackage": 199000     // Full Startup Package
    },
    PRO: {
        "branding": 50000,
        "pitchdeck": 30000,
        "website": 60000,
        "uiux": 45000,
        "mvp": 150000,
        "mobileapp": 250000,
        "marketing": 40000,
        "legal": 20000,
        "fundraising": 60000,
        "fullpackage": 325000
    }
};

const STAGE_MULTIPLIER = {
    IDEA: 1.0,
    MVP_BUILDING: 1.2,
    MVP_LIVE: 1.4,
    REVENUE: 1.6
};

const FOUNDER_SCORE = {
    LOW: 0.9,
    MEDIUM: 1.0,
    HIGH: 1.1
};

const VALUATION = {
    STUDENT: {
        IDEA: 1500000,        // ₹15L
        MVP_BUILDING: 2500000, // ₹25L
        MVP_LIVE: 4000000,     // ₹40L
        REVENUE: 6000000       // ₹60L
    },
    PRO: {
        IDEA: 3000000,         // ₹30L
        MVP_BUILDING: 4000000, // ₹40L
        MVP_LIVE: 6000000,     // ₹60L
        REVENUE: 10000000      // ₹1Cr
    }
};

// Legacy service prices mapping for backward compatibility
const servicePrices = SERVICES.STUDENT;

// ====== MAIN CALCULATION FUNCTION ======
function calculateAccurateEquity(selectedServices, cashPercent, stage, founderCommitment, mode = 'STUDENT') {
    console.log('calculateAccurateEquity called with:', { selectedServices, cashPercent, stage, founderCommitment, mode });
    
    // Calculate total service price
    let totalServicePrice = 0;
    selectedServices.forEach(service => {
        if (SERVICES[mode][service]) {
            totalServicePrice += SERVICES[mode][service];
        }
    });
    
    if (totalServicePrice === 0) {
        console.error('No valid services selected or service prices not found');
        return cashOnlyResult(0);
    }
    
    // Map stage to uppercase format
    const stageMap = {
        'idea': 'IDEA',
        'mvp_building': 'MVP_BUILDING',
        'mvp_live': 'MVP_LIVE', 
        'revenue': 'REVENUE'
    };
    const mappedStage = stageMap[stage] || 'IDEA';
    
    // Calculate Adjusted Service Value (ASV)
    const ASV = totalServicePrice * STAGE_MULTIPLIER[mappedStage] * FOUNDER_SCORE[founderCommitment];
    
    // Calculate cash based on user's slider input
    let cash = (cashPercent / 100) * ASV;
    
    // Apply minimum cash rules based on mode
    let minCashPercent = mode === 'STUDENT' ? 0.15 : 0.3; // 15% for students, 30% for pro
    let minCash = ASV * minCashPercent;
    
    // Ensure minimum cash requirements
    cash = Math.max(cash, minCash);
    
    // Apply student-specific cash cap
    if (mode === 'STUDENT') {
        cash = Math.min(cash, 50000); // Max ₹50K cash for students
    }
    
    // Ensure minimum cash of ₹5K
    cash = Math.max(cash, 5000);
    
    // Calculate equity value
    const equityValue = ASV - cash;
    
    // Calculate equity percentage
    let equityPercent = (equityValue / VALUATION[mode][mappedStage]) * 100;
    
    // Apply equity caps (0% to 8%)
    equityPercent = Math.min(Math.max(equityPercent, 0), 8);
    
    console.log('Calculation details:', { 
        totalServicePrice, 
        ASV, 
        cashPercent,
        userCashAmount: (cashPercent / 100) * ASV,
        minCashPercent, 
        minCash,
        finalCash: cash, 
        equityValue, 
        valuation: VALUATION[mode][mappedStage], 
        equityPercent 
    });
    
    // Determine deal type
    let dealType;
    if (equityPercent === 0) dealType = "Cash-Only Model";
    else if (equityPercent < 2) dealType = "Cash-Heavy Model";
    else if (equityPercent < 5) dealType = "Hybrid Model";
    else dealType = "Equity-Heavy Model";
    
    return {
        servicePrice: Math.round(totalServicePrice),
        adjustedValue: Math.round(ASV),
        cashPayable: Math.round(cash),
        equityPercent: Number(equityPercent.toFixed(1)),
        equityType: equityPercent > 0 ? "Advisory Equity" : "Not Applicable",
        vesting: equityPercent > 0 ? "24 months" : "Not Applicable",
        dealStatus: equityPercent > 0 ? "Hybrid Approved" : "Cash Only",
        dealType: dealType,
        selectedServicesCount: selectedServices.length,
        stage: mappedStage,
        founderCommitment: founderCommitment,
        mode: mode,
        cashPercent: cashPercent
    };
}

// ====== WRAPPER FOR EXISTING INTERFACE ======
function calculateEquityNew(selectedServices, cashPercent, stage, founderCommitment) {
    // Use STUDENT mode by default for existing interface
    return calculateAccurateEquity(selectedServices, cashPercent, stage, founderCommitment, 'STUDENT');
}

// ====== CASH ONLY RESULT ======
function cashOnlyResult(price) {
    return {
        servicePrice: Math.round(price),
        adjustedValue: Math.round(price),
        cashPayable: Math.round(price),
        equityPercent: 0,
        equityType: "Not Applicable",
        vesting: "Not Applicable",
        dealStatus: "Cash Only",
        dealType: "Cash-Only Model",
        selectedServicesCount: 1,
        stage: "N/A",
        founderCommitment: "N/A"
    };
}

// Legacy functions for backward compatibility
function calculateHybridDeal(params) {
    return calculateAccurateEquity([params.serviceType], 50, params.startupStage.toLowerCase(), params.founderCommitment, 'STUDENT');
}

function cashOnly(price) {
    return cashOnlyResult(price);
}

function cashOnlyDeal(selectedServices) {
    let totalPrice = 0;
    selectedServices.forEach(service => {
        if (SERVICES.STUDENT[service]) totalPrice += SERVICES.STUDENT[service];
    });
    return cashOnlyResult(totalPrice);
}

// Helper function to calculate founder commitment score
function calculateFounderCommitment() {
    const fullTime = document.getElementById('fullTimeFounder')?.checked || false;
    const ownMoney = document.getElementById('ownMoneyInvested')?.checked || false;
    const roadmap = document.getElementById('clearRoadmap')?.checked || false;
    
    const yesCount = [fullTime, ownMoney, roadmap].filter(Boolean).length;
    
    if (yesCount <= 1) return 'LOW';
    if (yesCount === 2) return 'MEDIUM';
    return 'HIGH';
}

// Export functions for use
window.EquityCalculatorNew = {
    calculateEquityNew,
    calculateAccurateEquity,
    calculateHybridDeal,
    cashOnly,
    cashOnlyDeal,
    calculateFounderCommitment,
    servicePrices,
    SERVICES,
    VALUATION,
    STAGE_MULTIPLIER,
    FOUNDER_SCORE
};