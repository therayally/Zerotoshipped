// Terms of Service and Privacy Policy, shown at /terms and /privacy. Plain English on purpose.
// Bump LEGAL_UPDATED (and TERMS_VERSION in Gates.jsx for material changes) whenever these change.

export const LEGAL_UPDATED = 'October 26, 2026';

export const terms = {
  title: 'Terms of Service',
  intro: 'These terms are an agreement between you and TheRayAlly ("we", "us"), which runs TinyAppCode at tinyappcode.com (the "Service"). By creating an account or using the Service, you agree to them. If you do not agree, please do not use the Service.',
  sections: [
    ['Who can use TinyAppCode', [
      'You must be at least 18 years old, or the age of majority where you live, to create an account.',
      'You must give a real name and an email address you control, keep your password private, and tell us if you think someone else has accessed your account. An account is for one person; please do not share it.',
    ]],
    ['Education and entertainment only', [
      'TinyAppCode teaches general skills for building software with AI tools. It is provided for educational and entertainment purposes only.',
      'Nothing in the Service is professional, legal, financial, tax, security, compliance or medical advice. Security and compliance lessons (including OWASP and SOC 2 material) are for awareness only; completing them does not make any product secure or compliant, and only a licensed CPA firm can issue a SOC 2 report.',
    ]],
    ['You are responsible for what you build', [
      'You alone are responsible for the apps you build, deploy, run, publish or charge for, for reviewing any AI-generated code before you use it, and for your use of third-party services (including their prices, terms and any charges they bill you).',
      'Prices, features and steps for third-party services change often. Always check the provider\'s current terms and pricing.',
    ]],
    ['Acceptable use', [
      'Do not use the Service to break the law, harm others, attack or probe our systems or anyone else\'s without permission, send spam, scrape the Service at scale, or try to get around sign-in, rate limits or other protections.',
      'Lessons about reverse engineering cover studying openly published, licensed source code only. They never permit accessing systems or code you are not authorized to use.',
      'We may suspend or close accounts that break these rules.',
    ]],
    ['Donations', [
      'The course is free. Donations ("Buy me a drink") are voluntary gifts to support it. You receive no goods, services, extra access or other benefit in return.',
      'Donations are processed by Square, PayPal or the crypto network you choose, under their own terms. We never see or store your full card number.',
      'Donations are non-refundable, except where we made a clear error (for example, a duplicate charge) or where the law requires a refund. Contact us within 30 days about any problem.',
      'TheRayAlly is not a charity. Donations are not tax-deductible.',
    ]],
    ['Partner links', [
      'Some lessons include partner links (for example, to an Authorized Square Reseller). We may earn a commission if you sign up through them, at no extra cost to you. Each partner link is labeled. Using them is always optional.',
    ]],
    ['Content and ownership', [
      'The course content, design, logo and mascot are owned by TheRayAlly and protected by copyright and trademark law. You may use the lessons and prompts to learn and to build your own projects, but you may not copy, resell or republish the course itself.',
      'You own the apps and code you build. Third-party names and logos shown in lessons belong to their owners and are used only to identify their products.',
    ]],
    ['No warranty', [
      'The Service is provided "as is" and "as available", without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, accuracy and non-infringement. Content may be incomplete, out of date or wrong, and the Service may be unavailable at times.',
    ]],
    ['Limitation of liability', [
      'To the fullest extent allowed by law, TheRayAlly and anyone involved in making TinyAppCode will not be liable for any indirect, incidental, special, consequential or punitive damages, or for lost profits, revenue, data or business, arising from your use of the Service or anything you build with it.',
      'Our total liability for any claim relating to the Service is limited to the greater of the amount you donated in the 12 months before the claim, or US$50.',
    ]],
    ['Indemnity', [
      'You agree to defend and hold harmless TheRayAlly from claims, losses and costs (including reasonable legal fees) arising from your use of the Service, your apps, or your breach of these terms.',
    ]],
    ['Ending your account', [
      'You can stop using the Service at any time and ask us to delete your account. We may suspend or end access if you break these terms or if we stop offering the Service.',
    ]],
    ['Changes', [
      'We may update these terms. If a change is significant, we will ask you to accept the new terms the next time you sign in. The date at the top shows the latest version.',
    ]],
    ['Governing law', [
      'These terms are governed by the laws of the State of Maryland, USA, without regard to its conflict-of-law rules. Disputes will be handled in the state or federal courts located in Maryland, unless the law where you live requires otherwise.',
    ]],
  ],
};

export const privacy = {
  title: 'Privacy Policy',
  intro: 'This policy explains what TinyAppCode collects, why, who helps us run it, and the choices you have. We keep it short because we collect very little. We never sell your data.',
  sections: [
    ['What we collect', [
      '**Account details:** your name, email address, and your password stored only as a one-way scrambled hash (we cannot read it).',
      '**Sign-in records:** active sessions and remembered devices (a device name such as "Mac" and a random ID), used for two-step sign-in. One-time email codes are stored hashed and expire after 10 minutes.',
      '**Donation records:** that you donated, the amount, the payment provider\'s payment ID, and its status (for example, refunded). Card details are handled entirely by Square or PayPal; we never receive them.',
      '**Security log:** a short record of important account events (such as account created, password reset, new-device sign-in) to protect your account.',
      '**Lesson progress:** stored only in your own browser, not on our servers.',
    ]],
    ['How we use it', [
      'To create and secure your account, send sign-in and password-reset codes, recognize your donations (so the donation window stops showing), prevent abuse, and fix problems. We do not send marketing email.',
    ]],
    ['Who helps us run TinyAppCode', [
      '**Vercel** hosts the website and server. **Neon** stores the database. **Resend** sends sign-in and reset emails. **Square** and **PayPal** process donations. **Cloudflare** provides our domain\'s DNS. Each processes data only to provide its service to us, under its own security and privacy commitments.',
      'We may disclose information if the law requires it or to protect the Service and its users from fraud or abuse.',
    ]],
    ['Cookies and browser storage', [
      'We do not use advertising or tracking cookies. The site stores your sign-in token, theme choice and lesson progress in your browser\'s local storage so it works. The admin panel uses one secure, HTTP-only cookie for administrators only.',
    ]],
    ['How long we keep it', [
      'Account data is kept while your account exists. Expired codes and old sessions are removed over time. Donation records are kept as long as needed for accounting and to handle refunds or disputes.',
    ]],
    ['Your choices and rights', [
      'You can ask us to see, correct or delete your data, or to delete your account, at any time. Depending on where you live (for example, California or the EU/UK), you may have additional rights, and we will honor valid requests.',
    ]],
    ['Security', [
      'We use encrypted connections (HTTPS) everywhere, hashed passwords, two-step sign-in for new devices, account lockout after repeated wrong passwords, rate limits, encrypted storage for secret settings, and signed payment notifications. No system is perfectly secure, so please use a unique password.',
    ]],
    ['Children', [
      'TinyAppCode is for people 18 and older. We do not knowingly collect data from children under 13; if you believe a child has created an account, contact us and we will delete it.',
    ]],
    ['Changes', [
      'We will update the date at the top when this policy changes, and tell you in the app about significant changes.',
    ]],
  ],
};
