import type { ForzaTune } from '../ForzaTune';

interface SendFeedbackEmailParams {
  email?: string;
  content: string;
  tune?: ReturnType<ForzaTune['toJSON']> | null;
  recipientEmail: string;
}

function generateEmailHTML(content: string, tune?: ReturnType<ForzaTune['toJSON']> | null): string {
  const tuneSection = tune ? `
    <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333;">Included Tune Data:</h3>
      <pre style="background-color: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 3px; overflow-x: auto; font-size: 12px;">${JSON.stringify(tune, null, 2)}</pre>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>ForzaTunerBox Feedback</title>
    </head>
    <body style="font-family: 'Google Sans', Roboto, Arial, sans-serif; background-color: #505050; margin: 0; padding: 20px;">
      <div style="max-width: 648px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #191919; padding: 20px; text-align: center;">
          <h1 style="color: #f0d361; margin: 0; font-size: 24px;">ForzaTunerBox Feedback</h1>
        </div>
        <div style="padding: 30px;">
          <div style="font-size: 16px; line-height: 1.6; color: #333;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          ${tuneSection}
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Sent from ForzaTunerBox - The ultimate Forza Motorsport tuning tool</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendFeedbackEmail({
  email,
  content,
  tune,
  recipientEmail
}: SendFeedbackEmailParams): Promise<void> {
  const workerUrl = import.meta.env.VITE_WORKER_URL;

  if (!workerUrl) {
    throw new Error('Worker URL not configured');
  }

  const emailHtml = generateEmailHTML(content, tune);

  const emailData = {
    to: recipientEmail,
    subject: `ForzaTunerBox Feedback${email ? ` from ${email}` : ''}`,
    html: emailHtml,
    from: 'ForzaTunerBox <feedback@forzatunerbox.com>'
  };

  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${errorText}`);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(`Email service error: ${result.error}`);
  }
}