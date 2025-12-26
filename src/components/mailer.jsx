import nodemailer from 'nodemailer';


export function Mailer () {
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         type: 'OAuth2',
    //         user: "Ben",
    //         pass: 'password',
    //         clientId: 'your-client-id',
    //         clientSecret: 'your-client-secret',
    //         refreshToken: 'your-refresh-token',
    //     }
    // });
    

    // const mailOptions = {
    //     from: ' "CCTransport" <Ben>',
    //     to: email,
    //     subject: 'Payment Confirmation',
    //     html: `<h1>Payment Successful</h1>
    //            <p>Dear ${name},</p>
    //            <p>We have received your payment of $${amount} for your bus ticket.</p>
    //             <p>Your seat number is: ${seatNumber}</p>
    //             <p>Date of Travel: ${date}</p>
    //             <p>Thank you for choosing CCTransport!</p>`
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.log('Error occurred: ' + error.message);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });



  async function sendTestEmail() {
    // Generate a test account
    const testAccount = await nodemailer.createTestAccount();

    console.log("Test account created:");
    console.log("  User: %s", testAccount.user);
    console.log("  Pass: %s", testAccount.pass);

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send a test message
    const info = await transporter.sendMail({
      from: `"Test App" <${testAccount.user}>`,
      to: "recipient@example.com",
      subject: "Hello from Ethereal!",
      text: "This message was sent using Ethereal.",
      html: "<p>This message was sent using <b>Ethereal</b>.</p>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
  }

  const sendmail = sendTestEmail().catch(console.error);

  return (
    {sendmail}
  );
}
