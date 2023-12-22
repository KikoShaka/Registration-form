jest.mock('nodemailer');
jest.mock('mysql');

const mysql = require('mysql');
const nodemailer = require('nodemailer');
const myServer = require('./server1');

const mockConnect = jest.fn();
const mockQuery = jest.fn();

nodemailer.createTransport.mockReturnValue({
    sendMail: mockSendMail
  });

mysql.createConnection.mockReturnValue({ connect: mockConnect, query: mockQuery });


const myServer = require('./server1');

describe('sendVerificationEmail', () => {
    it('should send an email', async () => {
        const email = 'test@example.com';
        
        const mockSendMail = jest.fn().mockResolvedValue(true);
        require('nodemailer').createTransport.mockReturnValue({ sendMail: mockSendMail });

        await myServer.sendVerificationEmail(email);

        expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
            from: 'kirilpit777@gmail.com', 
            to: email,
            subject: 'Account Verification', 
        }));
    });

    it('should handle failure in sending email', async () => {
        const email = 'test@example.com';
        const mockSendMail = jest.fn().mockRejectedValue(new Error('Failed to send email'));
        require('nodemailer').createTransport.mockReturnValue({ sendMail: mockSendMail });

        await expect(myServer.sendVerificationEmail(email)).rejects.toThrow('Failed to send email');
    });

   
});
