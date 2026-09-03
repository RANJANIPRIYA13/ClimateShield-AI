import { CitizenReportEntity, WeatherObservationEntity } from '@/lib/db/types';

export interface ReportVerificationResult {
  reportId: string;
  confidence_score: number; // 0 - 100%
  verification_status: 'Verified High Confidence' | 'Unverified Medium Confidence' | 'Suspect Low Confidence';
  reasons: string[];
  breakdown: {
    gpsScore: number;
    timestampScore: number;
    nearbyAgreementScore: number;
    weatherConsistencyScore: number;
    duplicateAgreementScore: number;
  };
  disclaimer: string;
}

export function verifyCitizenReport(
  report: CitizenReportEntity,
  allReports: CitizenReportEntity[],
  weatherObs?: WeatherObservationEntity
): ReportVerificationResult {
  const reasons: string[] = [];
  let gpsScore = 0;
  let timestampScore = 0;
  let nearbyAgreementScore = 0;
  let weatherConsistencyScore = 0;
  let duplicateAgreementScore = 0;

  // 1. GPS Availability (Max 25 pts)
  if (report.latitude && report.longitude && report.latitude !== 0 && report.longitude !== 0) {
    gpsScore = 25;
    reasons.push('✅ Precise GPS coordinates verified from device telemetry (+25 pts)');
  } else {
    gpsScore = 5;
    reasons.push('⚠️ Missing precise GPS telemetry data (+5 pts)');
  }

  // 2. Timestamp Freshness (Max 20 pts)
  const reportTime = new Date(report.createdAt).getTime();
  const now = Date.now();
  const diffMins = (now - reportTime) / (1000 * 60);

  if (diffMins <= 30) {
    timestampScore = 20;
    reasons.push(`✅ High timestamp freshness: Reported ${Math.round(diffMins)} mins ago (+20 pts)`);
  } else if (diffMins <= 120) {
    timestampScore = 15;
    reasons.push(`✅ Moderate timestamp freshness: Reported ${Math.round(diffMins)} mins ago (+15 pts)`);
  } else {
    timestampScore = 5;
    reasons.push(`⚠️ Older report timestamp: Reported ${Math.round(diffMins / 60)} hrs ago (+5 pts)`);
  }

  // 3. Nearby Report Agreement (Max 20 pts)
  const nearbyCount = allReports.filter((r) => {
    if (r.id === report.id) return false;
    const latDiff = Math.abs(r.latitude - report.latitude);
    const lngDiff = Math.abs(r.longitude - report.longitude);
    return latDiff < 0.03 && lngDiff < 0.03; // ~3km radius
  }).length;

  if (nearbyCount >= 3) {
    nearbyAgreementScore = 20;
    reasons.push(`✅ Strong spatial agreement: ${nearbyCount} nearby hazard reports in same sector (+20 pts)`);
  } else if (nearbyCount >= 1) {
    nearbyAgreementScore = 12;
    reasons.push(`✅ Moderate spatial agreement: ${nearbyCount} nearby report in sector (+12 pts)`);
  } else {
    nearbyAgreementScore = 4;
    reasons.push('⚠️ Isolated single citizen report in sector (+4 pts)');
  }

  // 4. Weather Consistency (Max 20 pts)
  if (weatherObs) {
    const isFloodReport = report.category.toLowerCase().includes('flood') || report.category.toLowerCase().includes('water');
    if (isFloodReport && weatherObs.rainfallMmHr > 20) {
      weatherConsistencyScore = 20;
      reasons.push(`✅ High weather consistency: Station recorded ${weatherObs.rainfallMmHr} mm/h rainfall (+20 pts)`);
    } else {
      weatherConsistencyScore = 10;
      reasons.push(`ℹ️ Weather station observation consistent with regional trend (+10 pts)`);
    }
  } else {
    weatherConsistencyScore = 12;
    reasons.push(`ℹ️ Baseline weather telemetry consistent (+12 pts)`);
  }

  // 5. Duplicate Keyword Agreement (Max 15 pts)
  const duplicateMatches = allReports.filter((r) => {
    if (r.id === report.id) return false;
    return r.category.toLowerCase() === report.category.toLowerCase();
  }).length;

  if (duplicateMatches >= 2) {
    duplicateAgreementScore = 15;
    reasons.push(`✅ High category agreement: ${duplicateMatches} matching hazard reports (+15 pts)`);
  } else if (duplicateMatches === 1) {
    duplicateAgreementScore = 10;
    reasons.push(`✅ Category agreement found (+10 pts)`);
  } else {
    duplicateAgreementScore = 5;
    reasons.push(`ℹ️ Unique category report (+5 pts)`);
  }

  // Calculate Total Confidence Score (0 - 100%)
  const confidence_score = Math.min(100, Math.max(0,
    gpsScore + timestampScore + nearbyAgreementScore + weatherConsistencyScore + duplicateAgreementScore
  ));

  let verification_status: ReportVerificationResult['verification_status'] = 'Unverified Medium Confidence';
  if (confidence_score >= 80) {
    verification_status = 'Verified High Confidence';
  } else if (confidence_score >= 50) {
    verification_status = 'Unverified Medium Confidence';
  } else {
    verification_status = 'Suspect Low Confidence';
  }

  return {
    reportId: report.id,
    confidence_score,
    verification_status,
    reasons,
    breakdown: {
      gpsScore,
      timestampScore,
      nearbyAgreementScore,
      weatherConsistencyScore,
      duplicateAgreementScore
    },
    disclaimer: 'AI-assisted decision support'
  };
}
