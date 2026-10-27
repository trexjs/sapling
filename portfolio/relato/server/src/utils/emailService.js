import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email configuration (should be in environment variables in production)
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password"
  }
};

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Email templates directory
const TEMPLATES_DIR = path.join(__dirname, "../templates");

// Load email template
const loadTemplate = (templateName, data) => {
  try {
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with data
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(placeholder, data[key] || '');
    });
    
    return template;
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    return null;
  }
};

// Send email function
export const sendEmail = async ({ to, subject, template, data = {}, html = null, text = null }) => {
  try {
    let emailContent = {};
    
    if (html) {
      emailContent.html = html;
    } else if (text) {
      emailContent.text = text;
    } else if (template) {
      const templateContent = loadTemplate(template, data);
      if (templateContent) {
        emailContent.html = templateContent;
      } else {
        // Fallback to simple text email
        emailContent.text = `Subject: ${subject}\n\n${JSON.stringify(data, null, 2)}`;
      }
    } else {
      throw new Error("Either template, html, or text must be provided");
    }

    const mailOptions = {
      from: `"School Platform" <${EMAIL_CONFIG.auth.user}>`,
      to: to,
      subject: subject,
      ...emailContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
