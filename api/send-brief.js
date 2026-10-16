import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  try {
    const {
      name,
      email,
      phone,
      services = [],
      budget,
      timeSlot,
      brief
    } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required." });
    }

    const emailUser = process.env.EMAIL_USER || "community.divak@gmail.com";
    const emailPass = process.env.EMAIL_PASS;

    if (!emailPass) {
      console.warn("EMAIL_PASS environment variable is missing on Vercel.");
      return res.status(500).json({
        success: false,
        error: "Email service is not yet configured. Please set EMAIL_PASS in Vercel environment variables."
      });
    }

    // Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const formattedServices = Array.isArray(services) && services.length > 0
      ? services.join(", ")
      : "None specified";

    const teamMailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
        <div style="background: #1e1e1e; padding: 24px 32px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: #cc5500;">DIVAK &bull; New Project Brief</h2>
          <p style="margin: 6px 0 0; font-size: 14px; color: #a0a0a0;">Received via divak.co brief submission form</p>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
            <tr>
              <td style="padding: 10px 0; color: #666666; width: 140px; font-weight: 600;">Client Name:</td>
              <td style="padding: 10px 0; color: #111111; font-weight: 700;">${name}</td>
            </tr>
            <tr style="border-top: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #666666; font-weight: 600;">Work Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #cc5500; font-weight: 600;">${email}</a></td>
            </tr>
            <tr style="border-top: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #666666; font-weight: 600;">Phone / WhatsApp:</td>
              <td style="padding: 10px 0; color: #111111;">${phone || "Not provided"}</td>
            </tr>
            <tr style="border-top: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #666666; font-weight: 600;">Selected Services:</td>
              <td style="padding: 10px 0; color: #111111; font-weight: 600;">${formattedServices}</td>
            </tr>
            <tr style="border-top: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #666666; font-weight: 600;">Budget Range:</td>
              <td style="padding: 10px 0; color: #111111;">${budget || "Not specified"}</td>
            </tr>
            <tr style="border-top: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #666666; font-weight: 600;">Preferred Slot:</td>
              <td style="padding: 10px 0; color: #111111;">${timeSlot || "Standard business hours"}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 20px; background: #fdfaf6; border-left: 4px solid #cc5500; border-radius: 4px;">
            <div style="font-size: 13px; font-weight: 700; color: #cc5500; text-transform: uppercase; margin-bottom: 8px;">Project Scope &amp; Brief:</div>
            <p style="margin: 0; font-size: 14px; color: #222222; line-height: 1.6; white-space: pre-wrap;">${brief || "No detailed notes provided."}</p>
          </div>

          <div style="margin-top: 28px; text-align: center;">
            <a href="mailto:${email}" style="display: inline-block; background: #1e1e1e; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
              Reply Directly to ${name} &rarr;
            </a>
          </div>
        </div>
        <div style="background: #fafafa; padding: 16px 32px; border-top: 1px solid #eeeeee; font-size: 12px; color: #888888; text-align: center;">
          Divak Technical Development Studio &bull; Notification System
        </div>
      </div>
    `;

    const clientReceiptHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
        <div style="background: #1e1e1e; padding: 28px 32px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: #cc5500;">DIVAK</h2>
          <p style="margin: 6px 0 0; font-size: 15px; color: #dddddd;">We've received your project brief</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 15px; color: #222222; line-height: 1.6;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="font-size: 14px; color: #444444; line-height: 1.6;">
            Thank you for reaching out to Divak Technical Studio. A founding technical engineer has received your brief regarding:
          </p>
          <div style="background: #fdfaf6; padding: 16px; border-left: 4px solid #cc5500; border-radius: 4px; margin: 18px 0; font-size: 14px; color: #222222;">
            <strong>Services Scoped:</strong> ${formattedServices}<br/>
            <strong>Budget Allocation:</strong> ${budget || "Not specified"}<br/>
            <strong>Preferred Sync:</strong> ${timeSlot || "Flexible"}
          </div>
          <p style="font-size: 14px; color: #444444; line-height: 1.6;">
            We review every brief within <strong>1 business day</strong> with transparent technical feedback and architectural milestone pricing.
          </p>
          <p style="font-size: 14px; color: #444444; line-height: 1.6;">
            If your timeline is urgent or you would like to reserve a dedicated founder consultation slot right now, you can also pick a direct 30-minute window on our calendar:
          </p>
          <div style="margin: 24px 0;">
            <a href="https://calendly.com/goyaldivyansh2004" style="display: inline-block; background: #cc5500; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
              Pick a Slot on Calendly &rarr;
            </a>
          </div>
          <p style="font-size: 13px; color: #666666; margin-top: 32px; border-top: 1px solid #eeeeee; padding-top: 16px;">
            Best regards,<br/>
            <strong>Divak Technical Studio &bull; Founders Team</strong><br/>
            <a href="mailto:community.divak@gmail.com" style="color: #cc5500;">community.divak@gmail.com</a>
          </p>
        </div>
      </div>
    `;

    // 1. Send alert to Divak team
    await transporter.sendMail({
      from: `"Divak Brief Bot" <${emailUser}>`,
      to: emailUser,
      replyTo: email,
      subject: `[New Project Brief] ${name} (${formattedServices})`,
      html: teamMailHtml
    });

    // 2. Send receipt confirmation to the client (non-blocking if client email rejects)
    try {
      await transporter.sendMail({
        from: `"Divak Technical Studio" <${emailUser}>`,
        to: email,
        subject: `We've received your project brief | Divak Technical Studio`,
        html: clientReceiptHtml
      });
    } catch (clientMailErr) {
      console.warn("Could not send receipt confirmation to client email:", clientMailErr.message);
    }

    return res.status(200).json({ success: true, message: "Project brief successfully delivered." });
  } catch (error) {
    console.error("Nodemailer dispatch error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to dispatch email via Nodemailer."
    });
  }
}
