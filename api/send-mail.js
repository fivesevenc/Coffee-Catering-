const MAIL_TO = process.env.MAIL_TO || "info@cafechocolate.de";
const MAIL_FROM = process.env.RESEND_FROM_EMAIL || "Coffee Catering <noreply@cafechocolate-catering.de>";

function clean(value = "") {
  return String(value).trim();
}

function escapeHtml(value = "") {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "RESEND_API_KEY ist in Vercel nicht gesetzt."
    });
  }

  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return res.status(400).json({
      success: false,
      message: "Ungültige Formulardaten."
    });
  }

  if (clean(data._honey)) {
    return res.status(200).json({ success: true });
  }

  const name = clean(data.name);
  const email = clean(data.email);
  const date = clean(data.date);
  const privacyConsent = clean(data.privacy_consent);

  if (!name || !email || !date || !privacyConsent) {
    return res.status(422).json({
      success: false,
      message: "Bitte alle Pflichtfelder ausfüllen."
    });
  }

  if (!isValidEmail(email)) {
    return res.status(422).json({
      success: false,
      message: "Bitte eine gültige E-Mail-Adresse eingeben."
    });
  }

  const fields = [
    ["Name", name],
    ["Unternehmen", clean(data.company)],
    ["E-Mail", email],
    ["Telefonnummer", clean(data.phone)],
    ["Eventdatum", date],
    ["Gästeanzahl", clean(data.guests)],
    ["Eventart", clean(data.event_type)],
    ["Location vorhanden", clean(data.location_known)],
    ["Ort des Events", clean(data.event_location)],
    ["Bevorzugte Kontaktart", clean(data.contact_preference)],
    ["Nachricht", clean(data.message)],
    ["Datenschutz-Einwilligung", privacyConsent ? "Ja" : "Nein"]
  ];

  const rows = fields
    .filter(([, value]) => value)
    .map(([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border:1px solid #ddd;font-weight:700;">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border:1px solid #ddd;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
      </tr>
    `)
    .join("");

  const subject = `Neue Coffee Catering Anfrage${date ? ` - ${date}` : ""}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
      <h1 style="margin:0 0 18px;font-size:24px;">Neue Anfrage über cafechocolate-catering.de</h1>
      <table style="border-collapse:collapse;width:100%;max-width:760px;">${rows}</table>
      <p style="margin-top:18px;color:#555;">Diese Anfrage wurde über das Formular der Coffee Catering Landingpage gesendet.</p>
    </div>
  `;

  const text = fields
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [MAIL_TO],
      reply_to: email,
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    let details = await response.text();
    try {
      const parsed = JSON.parse(details);
      details = parsed.message || parsed.error || details;
    } catch {}

    return res.status(502).json({
      success: false,
      message: "Resend konnte die E-Mail nicht versenden.",
      details
    });
  }

  return res.status(200).json({ success: true });
};
