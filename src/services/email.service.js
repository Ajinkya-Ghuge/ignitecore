import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "waghajay304@gmail.com",
    pass: "fehs fzhi qxub jldc"
  }
});

export const sendTicketEmail = async ({
  email,
  name,
  event,
  ticketUrl,
  entryNumber
}) => {

  try {

    console.log("🟡 [EMAIL] Preparing ticket email...");
    console.log("📧 Recipient:", email);

    const mailOptions = {
      from: `"Ignite Student Association" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎟 Your Ticket for ${event.title}`,

      html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>

      <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:30px 10px;">
      <tr>
      <td align="center">

      <table width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;" cellpadding="0" cellspacing="0">

      <tr>
      <td style="background:#0f172a;color:white;text-align:center;padding:25px;">
      <h2 style="margin:0;">Ignite Student Association</h2>
      <p style="margin:5px 0 0 0;font-size:14px;">Event Registration Confirmation</p>
      </td>
      </tr>

      <tr>
      <td style="padding:30px;color:#333333;font-size:15px;line-height:1.6;">

      <p>Hello <strong>${name}</strong>,</p>

      <p>
      Your registration for the event <strong>${event.title}</strong> has been successfully confirmed.
      </p>

      <table width="100%" style="background:#f1f5f9;border-radius:8px;padding:15px;margin:20px 0;">
      <tr>
      <td>
      <p style="margin:5px 0;"><strong>Entry Number:</strong> ${entryNumber}</p>
      <p style="margin:5px 0;"><strong>Event Date:</strong> ${event.eventdate}</p>
      <p style="margin:5px 0;"><strong>Venue:</strong> ${event.eventvenue}</p>
      </td>
      </tr>
      </table>

      <p style="text-align:center;margin:25px 0 10px 0;font-weight:bold;">
      Your Event Ticket
      </p>

      <p style="text-align:center;">
      <img src="${ticketUrl}" width="220" style="max-width:220px;border-radius:6px;" />
      </p>

      <p style="text-align:center;">
      Please present this QR ticket at the event entry gate.
      </p>

      ${
      event.whatsapp_group_url
      ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:25px;">
      <tr>
      <td align="center">

      <a href="${event.whatsapp_group_url}"
      style="
      background:#25D366;
      color:#ffffff;
      padding:14px 24px;
      font-size:15px;
      text-decoration:none;
      border-radius:6px;
      display:inline-block;
      font-weight:bold;
      ">
      Join WhatsApp Event Group
      </a>

      </td>
      </tr>
      </table>
      `
      : ""
      }

      <p style="margin-top:30px;">
      If you have any questions, feel free to contact the event organizers.
      </p>

      <p>
      Regards,<br>
      <strong>Ignite Student Association</strong>
      </p>

      </td>
      </tr>

      <tr>
      <td style="background:#f1f5f9;text-align:center;padding:15px;font-size:12px;color:#666;">
      © ${new Date().getFullYear()} Ignite Student Association
      </td>
      </tr>

      </table>

      </td>
      </tr>
      </table>

      </body>
      </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("🟢 [EMAIL SUCCESS] Ticket email sent");
    console.log("📨 Message ID:", info.messageId);

  } catch (error) {

    console.log("🔴 [EMAIL ERROR] Failed to send email");
    console.log(error);

    throw error;
  }
};