import { apiURL } from '../../utils';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function analyzeSymptoms(payload: { symptoms: string[], severity?: number, duration?: string }) {
  const res = await fetch(`${apiURL}/api/chat/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function getDoctors(specialization?: string) {
  const query = specialization ? `?specialization=${encodeURIComponent(specialization)}` : '';
  const res = await fetch(`${apiURL}/api/chat/doctors${query}`);
  return res.json();
}

export async function bookAppointment(payload: any) {
  const res = await fetch(`${apiURL}/api/chat/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function getChatHistory() {
  try {
    const res = await fetch(`${apiURL}/api/chat/history`, { headers: { ...authHeaders() } });
    // If unauthorized or error, return null instead of throwing
    if (!res.ok) {
      console.log('Chat history not available (user may not be logged in)');
      return null;
    }
    return res.json();
  } catch (error) {
    console.log('Failed to fetch chat history:', error);
    return null;
  }
}
