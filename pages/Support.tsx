import React from 'react';
import { getConfig } from '../utils/config';
import { Button } from '../components/Button';

export const Support: React.FC = () => {
  const config = getConfig();

  return (
    <div className="space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[36px] border border-brand-dark/10 bg-white/92 shadow-[0_30px_100px_rgba(40,26,57,0.1)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-10">
          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Support Centre</p>
            <h1 className="text-4xl font-black tracking-tight text-brand-plum sm:text-5xl">Give directly, ask questions, or find the right help path</h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              This page keeps the charity's live donation routes together with the key raffle and support answers, so supporters can choose the right path immediately.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer">
                <Button>Donate Through Live Form</Button>
              </a>
              <a href={config.charityLinks.donateGamesUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary">Donate Games or Hardware</Button>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a href={config.charityLinks.donateUrl} target="_blank" rel="noreferrer" className="rounded-[28px] border border-brand-dark/10 bg-brand-plum p-6 text-white shadow-[0_20px_60px_rgba(40,26,57,0.16)]">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-yellow">Donation page</p>
              <h2 className="mt-3 text-2xl font-black">Other ways to give</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">Connect supporters to the charity's dedicated donation page, PayPal option, and further support routes.</p>
            </a>
            <a href={config.charityLinks.easyFundraisingUrl} target="_blank" rel="noreferrer" className="rounded-[28px] border border-brand-dark/10 bg-brand-mist p-6">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-green">Easyfundraising</p>
              <h2 className="mt-3 text-2xl font-black text-brand-plum">Raise support while people shop</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Useful for people who want to help the charity without entering a draw or making an upfront donation.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-[32px] border border-brand-dark/10 bg-white/92 p-6 shadow-[0_24px_70px_rgba(40,26,57,0.08)] sm:p-8">
          <h2 className="text-2xl font-black tracking-tight text-brand-plum">Frequently asked questions</h2>

          <div className="rounded-[24px] border border-brand-dark/10 bg-brand-mist/60 p-5">
            <h3 className="text-lg font-bold text-brand-plum">Is this a real charity raffle?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Yes. Mindful Gaming UK is a registered charity (No. {config.charityNumber}) and the platform keeps the live charity and compliance links visible alongside each raffle flow.
            </p>
          </div>

          <div className="rounded-[24px] border border-brand-dark/10 bg-brand-mist/60 p-5">
            <h3 className="text-lg font-bold text-brand-plum">How are winners selected?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Lottery draws are random — a cryptographic draw selects the winning ticket number after the close date. Prize competitions require a correct answer to a skill question before payment proceeds. All results are published on the Winners page with the draw date and winning ticket reference.
            </p>
          </div>

          <div className="rounded-[24px] border border-brand-dark/10 bg-brand-mist/60 p-5">
            <h3 className="text-lg font-bold text-brand-plum">Can I claim Gift Aid on a ticket?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              No. Raffle and competition entries are gambling transactions, not donations. If someone wants to give charitably, send them to the live donation form or donation page instead.
            </p>
          </div>

          <div className="rounded-[24px] border border-brand-dark/10 bg-brand-mist/60 p-5">
            <h3 className="text-lg font-bold text-brand-plum">What if I need help for gaming or gambling concerns?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the charity's resources and support pages for gaming-disorder information, and use safer-gambling services if raffle participation is becoming uncomfortable or harmful.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-brand-dark/10 bg-white/92 p-6 shadow-[0_24px_70px_rgba(40,26,57,0.08)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Direct Support Routes</p>
            <div className="mt-5 space-y-4">
              <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="block rounded-[24px] border border-brand-dark/10 bg-brand-mist px-5 py-4 transition hover:border-brand-green">
                <p className="text-sm font-bold text-brand-plum">Open live donation form</p>
                <p className="mt-1 text-sm text-slate-600">The quickest way to make a direct financial contribution to the charity.</p>
              </a>
              <a href={config.charityLinks.donateUrl} target="_blank" rel="noreferrer" className="block rounded-[24px] border border-brand-dark/10 bg-white px-5 py-4 transition hover:border-brand-green">
                <p className="text-sm font-bold text-brand-plum">Donation page and PayPal options</p>
                <p className="mt-1 text-sm text-slate-600">Includes PayPal and other giving options for supporters who prefer different payment methods.</p>
              </a>
              <a href={config.charityLinks.volunteerUrl} target="_blank" rel="noreferrer" className="block rounded-[24px] border border-brand-dark/10 bg-white px-5 py-4 transition hover:border-brand-green">
                <p className="text-sm font-bold text-brand-plum">Volunteer with the charity</p>
                <p className="mt-1 text-sm text-slate-600">Help the charity with your time and skills — open roles in communications, admin, and awareness work.</p>
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border border-brand-dark/10 bg-brand-plum p-6 text-white shadow-[0_24px_70px_rgba(40,26,57,0.16)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-yellow">Need To Talk?</p>
            <h2 className="mt-3 text-2xl font-black">Email the charity directly</h2>
            <p className="mt-4 text-sm leading-6 text-white/75">
              For draw queries, fundraising questions, or general support, contact the charity directly at the address below.
            </p>
            <a href={config.charityLinks.contactUrl} className="mt-6 inline-flex rounded-full bg-brand-yellow px-5 py-3 text-sm font-black text-brand-dark transition hover:bg-[#efe72c]">
              info@mindfulgaminguk.org
            </a>
          </div>

          <div className="rounded-[32px] border border-brand-dark/10 bg-white/92 p-6 shadow-[0_24px_70px_rgba(40,26,57,0.08)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Safer play</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              If gambling behaviour feels difficult to control, step away from the draw flow and use dedicated support.
            </p>
            <a href="https://www.begambleaware.org" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-brand-plum underline-offset-4 hover:underline">
              Visit BeGambleAware.org
            </a>
          </div>
        </div>
      </section>

      <div className="rounded-[28px] border border-brand-dark/10 bg-brand-mist/70 px-6 py-5 text-sm leading-6 text-slate-600">
        The wellbeing copy on this site is educational and awareness-focused. It is not a substitute for medical or therapeutic advice. If someone is in immediate difficulty, direct them to appropriate professional help.
      </div>
    </div>
  );
};
