const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Check if we're using a custom SMTP service or Gmail
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      // Custom SMTP configuration (recommended for production)
      return nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false // Only for development/testing
        }
      });
    } else {
      // Fallback to Gmail (for development)
      return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || 'ketatasalem7@gmail.com',
          pass: process.env.GMAIL_APP_PASSWORD || 'ahan ygra ovgf tvtx'
        }
      });
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email, verificationCode) {
    const fromEmail = process.env.FROM_EMAIL || 'support@timedelivery.tn';
    const fromName = process.env.FROM_NAME || 'TimeDelivery Support';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Code de réinitialisation de mot de passe - TimeDelivery',
      text: `Votre code de réinitialisation de mot de passe est : ${verificationCode}. Ce code est valable pour 10 minutes.`,
      html: this.getPasswordResetEmailTemplate(verificationCode)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error(`Impossible d'envoyer l'e-mail de réinitialisation: ${error.message}`);
    }
  }

  async sendWelcomeEmail(email, firstName) {
    const fromEmail = process.env.FROM_EMAIL || 'support@timedelivery.tn';
    const fromName = process.env.FROM_NAME || 'TimeDelivery Support';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Bienvenue chez TimeDelivery!',
      html: this.getWelcomeEmailTemplate(firstName)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error(`Impossible d'envoyer l'e-mail de bienvenue: ${error.message}`);
    }
  }

  async sendOrderConfirmationEmail(email, orderDetails) {
    const fromEmail = process.env.FROM_EMAIL || 'support@timedelivery.tn';
    const fromName = process.env.FROM_NAME || 'TimeDelivery Support';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: `Confirmation de commande #${orderDetails.id} - TimeDelivery`,
      html: this.getOrderConfirmationTemplate(orderDetails)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw new Error(`Impossible d'envoyer l'e-mail de confirmation: ${error.message}`);
    }
  }

  getPasswordResetEmailTemplate(verificationCode) {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { background-color: #fff; border: 2px solid #ff6b35; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TimeDelivery</h1>
            <h2>Réinitialisation de mot de passe</h2>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Voici votre code de vérification :</p>
            <div class="code">${verificationCode}</div>
            <p><strong>Important :</strong> Ce code est valable pendant 10 minutes seulement.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
            <p>Cordialement,<br>L'équipe TimeDelivery</p>
          </div>
          <div class="footer">
            <p>© 2025 TimeDelivery. Tous droits réservés.</p>
            <p>Cet e-mail a été envoyé depuis une adresse automatisée. Merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getWelcomeEmailTemplate(firstName) {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue chez TimeDelivery</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TimeDelivery</h1>
            <h2>Bienvenue!</h2>
          </div>
          <div class="content">
            <p>Bonjour ${firstName || ''},</p>
            <p>Bienvenue chez TimeDelivery! Nous sommes ravis de vous compter parmi nos utilisateurs.</p>
            <p>Vous pouvez maintenant profiter de nos services de livraison rapide et fiable.</p>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <p>Bon appétit!<br>L'équipe TimeDelivery</p>
          </div>
          <div class="footer">
            <p>© 2025 TimeDelivery. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getOrderConfirmationTemplate(orderDetails) {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de commande</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-details { background-color: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TimeDelivery</h1>
            <h2>Confirmation de commande</h2>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Votre commande a été confirmée avec succès!</p>
            <div class="order-details">
              <h3>Détails de la commande #${orderDetails.id}</h3>
              <p><strong>Total:</strong> ${orderDetails.total} TND</p>
              <p><strong>Adresse de livraison:</strong> ${orderDetails.delivery_address}</p>
              <p><strong>Statut:</strong> ${orderDetails.status}</p>
            </div>
            <p>Nous vous tiendrons informé de l'évolution de votre commande.</p>
            <p>Merci de votre confiance!<br>L'équipe TimeDelivery</p>
          </div>
          <div class="footer">
            <p>© 2025 TimeDelivery. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();