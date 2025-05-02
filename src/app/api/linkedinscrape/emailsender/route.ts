// import sgMail from '@sendgrid/mail';

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// export async function sendEmailsToRecipients(posts: Record<string, { email: string; draft: string }[]>) {
//   const emails = [];
//   let draft = '';

//   // Extract email and draft from posts
//   for (const postKey in posts) {
//     posts[postKey].forEach((entry) => {
//       emails.push(entry.email); // Collect all email addresses
//       draft = entry.draft; // Example: Use the first draft
//     });
//   }

//   // Send emails via the Next.js API
//   const response = await fetch('/api/email_sender/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       emails, // Array of email addresses
//       draft,  // Email draft content
//     }),
//   });

//   const data = await response.json();
//   if (data.success) {
//     console.log('Emails sent successfully');
//   } else {
//     console.error('Failed to send emails:', data.error);
//   }
// }
