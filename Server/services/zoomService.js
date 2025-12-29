async function getAccessToken() {
  const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
  const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
  const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
    throw new Error('Zoom OAuth credentials not configured in .env');
  }

  const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom OAuth error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function createZoomMeeting({ topic, startTime, durationMinutes = 30, password }) {
  const token = await getAccessToken();
  const userId = process.env.ZOOM_USER_ID || 'me';
  const url = `https://api.zoom.us/v2/users/${userId}/meetings`;
  const body = {
    topic: topic || 'Telemedicine Consultation',
    type: 2, // scheduled
    start_time: new Date(startTime).toISOString(),
    duration: durationMinutes,
    timezone: 'UTC',
    settings: {
      join_before_host: false,
      host_video: true,
      participant_video: true,
      mute_upon_entry: true,
      enforce_login: false,
      approval_type: 2 // no registration
    }
  };
  if (password) body.password = password;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data;
}

export async function getZoomMeeting(meetingId) {
  const token = await getAccessToken();
  const url = `https://api.zoom.us/v2/meetings/${meetingId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoom API error: ${res.status} ${text}`);
  }
  return await res.json();
}