const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ketatasalem7@gmail.com', // Replace with your actual email
        pass: 'ahan ygra ovgf tvtx'     // Replace with your actual app password
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Erreur de connexion:', error);
    } else {
        console.log('Serveur de messagerie prêt à envoyer des e-mails');
    }
});
