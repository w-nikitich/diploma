const { Scenes, Markup,WizardScene } = require('telegraf');
const nodemailer = require('nodemailer');
const Users = require('../models/Users');
const {sendEmail} = require('../additional/feedbackOpt');

const feedback = new Scenes.WizardScene('feedback',
        async(ctx) => {
            await ctx.reply('Напишіть свій відгук');
            ctx.wizard.next();
        },
        async (ctx) => {
            const feedbackText = ctx.message.text;
            // await sendEmail(feedbackText);
        }
);



module.exports = {feedback};