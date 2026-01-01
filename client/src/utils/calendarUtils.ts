/**
 * Formats a Date object to an ICS compatible string (YYYYMMDDTHHmmssZ)
 * @param date - The date to format
 * @returns The formatted date string
 */
const formatICSDate = (date: Date): string => {
          return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1) + 'Z';
};

interface IcsEventDetails {
          title: string;
          description: string;
          location: string;
          startDate: Date;
          durationMinutes?: number;
          organizer?: { name: string; email: string };
          attendees?: Array<{ name: string; email: string }>;
}

/**
 * Generates an ICS file content for an event
 * @param details - The event details
 * @returns The ICS file content as a string
 */
export const generateICS = ({
          title,
          description,
          location,
          startDate,
          durationMinutes = 60,
          organizer,
          attendees = []
}: IcsEventDetails): string => {
          const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
          const now = new Date();
          const uid = `${now.getTime()}@nexusmed.com`;

          const lines = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//NexusMed//Appointment Booking//EN',
                    'CALSCALE:GREGORIAN',
                    'METHOD:REQUEST',
                    'BEGIN:VEVENT',
                    `UID:${uid}`,
                    `DTSTAMP:${formatICSDate(now)}`,
                    `DTSTART:${formatICSDate(startDate)}`,
                    `DTEND:${formatICSDate(endDate)}`,
                    `SUMMARY:${title}`,
                    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
                    `LOCATION:${location}`,
                    `STATUS:CONFIRMED`,
                    `SEQUENCE:0`,
          ];

          if (organizer) {
                    lines.push(`ORGANIZER;CN=${organizer.name}:mailto:${organizer.email}`);
          }

          attendees.forEach(attendee => {
                    lines.push(`ATTENDEE;ROLE=REQ-PARTICIPANT;CN=${attendee.name}:mailto:${attendee.email}`);
          });

          lines.push('END:VEVENT');
          lines.push('END:VCALENDAR');

          return lines.join('\r\n');
};

/**
 * Triggers a download of the generated ICS file
 * @param content - The ICS content
 * @param filename - The name of the file to download
 */
export const downloadICS = (content: string, filename: string = 'appointment.ics') => {
          const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
};
