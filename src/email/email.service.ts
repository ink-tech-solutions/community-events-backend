import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}
  emailTemplate = (
    username: string,
    linkUrl: string,
    mailPurpose: 'password-reset' | 'signup',
  ) => {
    const capitilizedName =
      username.charAt(0).toUpperCase() + username.toLowerCase().slice(1);
    return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet">
    <style>
       a {
        color: #365cce;
        text-decoration: none;
      }
        .border {
      border-style: solid;
        border-width: 1px;
        border-color: #365cce;
        border-radius: 0.25rem;
      }
      .otpbox
      {
      display: flex;
       align-items: center;
       justify-content: center;
       width: 2rem;
        height: 2rem;
         font-size: 12px;
         font-weight: bold;
          color: #365cce
      }
      .footertext
      {
      font-size : 12px;
      }
       @media (min-width: 640px) {
       .footertext
       {
        font-size :16px;
       }
      }
    </style>
  </head>
<body>
  <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; margin-top: 1.25rem; font-family: Nunito, sans-serif">
    <section style="max-width: 60rem; background-color: #fff;">
      <div style="padding: 10px; background-color: #365cce; width: 100%; color: #fff;">
      ${
        mailPurpose === 'signup'
          ? `<div style="text-align: center; margin: 20px auto; font-size: 14px; font-weight: normal;">
            THANKS FOR SIGNING UP!
          </div>`
          : ''
      }
          <div
            class=""
            style="font-size: 24px; margin: 20px auto; font-weight: bold; text-transform: capitalize; text-align  :center"
          >
          ${mailPurpose === 'password-reset' ? 'Reset your password' : 'Verify your E-mail Address'}
          </div>
      </div>
      <main style="margin-top: 2rem; padding-left: 1.25rem; padding-right: 1.25rem;">
        <h4 style="color: #374151;">Hello ${capitilizedName},</h4>
        <p style="margin-top: 1rem; line-height: 1.75; color: #4b5563;">
          Click the following link to  ${mailPurpose === 'password-reset' ? 'reset your password:' : ' verify your email:'}
        </p>
        <a href="${linkUrl}" style="padding-left: 1.25rem; padding-right: 1.25rem; padding-top: 0.5rem; padding-bottom: 0.5rem; margin-top: 1.5rem; font-size: 14px; font-weight: bold; text-transform: capitalize; background-color: #f97316; color: #fff; transition-property: background-color; transition-duration: 300ms; transform: none; border-radius: 0.375rem; border-width: 1px; border: none; outline: none; cursor: pointer;">
         ${mailPurpose === 'password-reset' ? 'Reset password' : ' Verify email'}
         
        </a>
        <p style="margin-top: 2rem; color: #4b5563; ">
          Thank you, <br />
          Community Events Team
        </p>
      </main>
      <footer style="margin-top: 2rem;">
        <div style="background-color: #365cce; padding-top :10px; padding-bottom : 10px; color: #fff; text-align: center;">
          <p class="footertext">© 2024 Community Events. All Rights Reserved.</p>
        </div>
      </footer>
    </section>
  </div>
</body>
 </html>`;
  };

  createEmail = (
    userName: string,
    linkUrl: string,
    mailPurpose: 'password-reset' | 'signup',
  ) => {
    const capitilizedName =
      userName.charAt(0).toUpperCase() + userName.toLowerCase().slice(1);
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Community Events reset your password<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:#f6f9fc;padding:10px 0">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Hi <!-- -->${capitilizedName}<!-- -->,</p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">${mailPurpose === 'password-reset' ? '  Someone recently requested a password change for your Community Events account. If this was you, you can set a new password here:' : 'Welcome to Community Events. Click the following link to verify your email address'}
                    </p><a href="${linkUrl}" style="background-color:#007ee6;border-radius:4px;color:#fff;font-family:&#x27;Open Sans&#x27;, &#x27;Helvetica Neue&#x27;, Arial;font-size:15px;text-decoration:none;text-align:center;display:inline-block;width:210px;padding:14px 7px 14px 7px;line-height:100%;max-width:100%" target="_blank"><span><!--[if mso]><i style="letter-spacing: 7px;mso-font-width:-100%;mso-text-raise:21" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:10.5px">${mailPurpose === 'password-reset' ? 'Reset password' : ' Verify email'}</span><span><!--[if mso]><i style="letter-spacing: 7px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">${mailPurpose === 'password-reset' ? 'If you don&#x27;t want to change your password or didn&#x27;t request this, just ignore and delete this message.' : 'If you didn&#x27;t request this, just ignore and delete this message.'}</p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">${mailPurpose === 'password-reset' ? 'To keep your account secure, please don&#x27;t forward this email to anyone.' : ''}</p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Happy Community Eventing!</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`;
  };
  async sendVerificationEmail(
    name: string,
    email: string,
    token: string,
  ): Promise<void> {
    // Configure nodemailer to send emails (replace with your email configuration)
    const urlLink = `${this.configService.get<string>('CLIENT_BASE_URL')}/auth/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE') || 'gmail',
      auth: {
        user:
          this.configService.get<string>('EMAIL_USER') ||
          'community.events.app@gmail.com',
        pass:
          this.configService.get<string>('EMAIL_PASSWORD') ||
          'ioxh orwv olbb lrlj',
      },
      secure: false, // Use regular connection (TLS on port 587)
      requireTLS: true, // Require TLS
      port: 587, // Port for regular connection
    });

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: this.createEmail(name, urlLink, 'signup'),
    };
    //TODO: change the client base url
    await transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(
    name: string,
    email: string,
    token: string,
  ): Promise<void> {
    // Configure nodemailer to send emails (replace with your email configuration)
    const urlLink = `${this.configService.get<string>('CLIENT_BASE_URL')}/auth/reset_password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE') || 'gmail',
      auth: {
        user:
          this.configService.get<string>('EMAIL_USER') ||
          'community.events.app@gmail.com',
        pass:
          this.configService.get<string>('EMAIL_PASSWORD') ||
          'ioxh orwv olbb lrlj',
      },
      secure: false, // Use regular connection (TLS on port 587)
      requireTLS: true, // Require TLS
      port: 587, // Port for regular connection
    });

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      html: this.createEmail(name, urlLink, 'password-reset'),
    };
    //TODO: change the client base url
    await transporter.sendMail(mailOptions);
  }
}
