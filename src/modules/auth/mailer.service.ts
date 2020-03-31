import sgMail from '../../core/sendgrid';
import { User } from '../user/user.model';

export class MailerService {
  async sendVerification(user: User, verificationToken: string) {
    try {
      const message = {
        to: user.email,
        from: 'Cool Company Support <support@coolcompany.com>',
        subject: 'Congrats! Your account has been created!',
        text: `Hello, ${user.firstName} ${user.lastName},
Here is your verification token:
${verificationToken}`,
      };

      return await sgMail.send(message);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
