// Simple symptom analyzer with sample disease DB and matching algorithm
import Doctor from '../models/doctors.js';

const diseases = [
  {
    id: 'common_cold',
    name: 'Common Cold',
    symptoms: ['cough', 'sore throat', 'runny nose', 'sneezing', 'congestion', 'fever'],
    prevention: ['Wash hands regularly', 'Avoid close contact', 'Cover mouth when sneezing'],
    suggestions: ['Rest', 'Stay hydrated', 'Over-the-counter cold remedies'],
    specializations: ['General Physician', 'Internal Medicine']
  },
  {
    id: 'migraine',
    name: 'Migraine',
    symptoms: ['headache', 'nausea', 'sensitivity to light', 'visual disturbances', 'throbbing pain'],
    prevention: ['Manage stress', 'Avoid triggers', 'Maintain sleep schedule'],
    suggestions: ['Pain relievers', 'Rest in dark room', 'Prescription migraine meds'],
    specializations: ['Neurologist']
  },
  {
    id: 'allergies',
    name: 'Allergies',
    symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'congestion', 'rash'],
    prevention: ['Avoid allergens', 'Keep windows closed during high pollen'],
    suggestions: ['Antihistamines', 'Nasal sprays', 'Allergy testing'],
    specializations: ['Allergist', 'Immunologist']
  },
  {
    id: 'covid19',
    name: 'COVID-19',
    symptoms: ['fever', 'cough', 'shortness of breath', 'loss of taste', 'loss of smell', 'fatigue'],
    prevention: ['Vaccination', 'Mask in crowded areas', 'Hand hygiene'],
    suggestions: ['Test for COVID-19', 'Isolate', 'Seek urgent care for breathing issues'],
    specializations: ['Infectious Disease', 'Pulmonologist']
  }
];

export async function analyzeSymptoms({ symptoms = [], severity = 1, duration = 'short' }) {
  // Normalize symptoms
  const normalized = symptoms.map(s => s.toLowerCase());

  const durationWeight = duration === 'long' ? 1.2 : duration === 'medium' ? 1.1 : 1;

  const results = diseases.map(d => {
    const matches = d.symptoms.filter(s => normalized.includes(s));
    const matchRatio = matches.length / d.symptoms.length;
    const score = matchRatio * (1 + (severity - 1) * 0.1) * durationWeight;
    return {
      diseaseId: d.id,
      name: d.name,
      matches,
      score,
      prevention: d.prevention,
      suggestions: d.suggestions,
      specializations: d.specializations
    };
  });

  // Sort by score desc
  results.sort((a, b) => b.score - a.score);

  // Attach recommended doctors for top specializations
  const top = results.slice(0, 3);

  const recommendations = [];
  for (const r of top) {
    if (r.specializations && r.specializations.length > 0) {
      // Find doctors for each specialization (limit 3)
      const doctors = await Doctor.find({ specialization: { $in: r.specializations } }).limit(3).lean();
      recommendations.push({ disease: r.name, doctors });
    }
  }

  return { results, recommendations };
}
