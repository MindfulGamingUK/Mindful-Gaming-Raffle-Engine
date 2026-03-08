import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Raffle, PaymentProvider, MindfulContent, RaffleStatus, AwarenessContent } from '../types';
import { fetchRaffleBySlug, createEntryIntent, fetchMindfulContent } from '../services/api';
import { getAsset } from '../utils/assets';
import { formatCurrency, calculateProgress, isOver18 } from '../utils/formatting';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { TransparencyPanel } from '../components/TransparencyPanel';
import { MindfulMoment } from '../components/MindfulMoment';

import { FlashcardMoment } from '../components/Flashcards';
import { fetchAwarenessFeed, fetchCompetitionQuestion } from '../services/api';
import { RaffleType, CompetitionQuestion } from '../types';
import { formatWixMediaUrl } from '../utils/wixMedia';
import { getConfig } from '../utils/config';

type Step = 'OVERVIEW' | 'PROFILE_GATE' | 'MINDFUL' | 'FLASHCARDS' | 'CART' | 'SKILL_QUESTION' | 'PAYMENT';

export const RaffleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, login, isEligible, updateUser } = useAuth();

  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [step, setStep] = useState<Step>('OVERVIEW');
  const [mindfulContent, setMindfulContent] = useState<MindfulContent | null>(null);
  const [awarenessContent, setAwarenessContent] = useState<AwarenessContent[]>([]);

  const [quantity, setQuantity] = useState(1);
  const [selectedSkillAnswer, setSelectedSkillAnswer] = useState<number | null>(null);
  const [competitionQuestion, setCompetitionQuestion] = useState<CompetitionQuestion | null>(null);
  const [skillGatePassed, setSkillGatePassed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Gating Form State
  const [dobInput, setDobInput] = useState('');
  const [residencyChecked, setResidencyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Image State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const config = getConfig();

  useEffect(() => {
    if (!slug) return;
    fetchRaffleBySlug(slug).then(setRaffle);
  }, [slug]);

  useEffect(() => {
    if (step === 'SKILL_QUESTION' && raffle && !competitionQuestion) {
      fetchCompetitionQuestion(raffle._id).then(setCompetitionQuestion);
    }
  }, [step, raffle, competitionQuestion]);

  useEffect(() => {
    // Fetch mindful content and awareness feed only once, or when slug changes
    if (!slug) return;
    Promise.all([
      fetchMindfulContent(),
      fetchAwarenessFeed(3, 0) // Get 3 flashcards
    ]).then(([m, a]) => {
      setMindfulContent(m);
      setAwarenessContent(a.items);
    });
  }, [slug]);

  useEffect(() => {
    if (user) {
      if (user.dob) setDobInput(user.dob);
      if (user.residencyConfirmed) setResidencyChecked(true);
    }
  }, [user]);

  const handleStartEntry = () => {
    if (!user) {
      login();
      return;
    }

    // UX Polish: Auto-skip gate if already eligible
    if (isEligible) {
      setStep('MINDFUL');
    } else {
      setStep('PROFILE_GATE');
    }
  };

  const handleGateSubmit = async () => {
    setErrorMsg('');
    if (!dobInput) return setErrorMsg('Date of Birth is required.');
    if (!isOver18(dobInput)) return setErrorMsg('You must be 18+ to enter.');
    if (!residencyChecked) return setErrorMsg('You must confirm GB residency.');
    if (!termsChecked) return setErrorMsg('You must accept the terms.');

    setSubmitting(true);
    try {
      await updateUser({
        dob: dobInput,
        residencyConfirmed: true,
        termsAcceptedAt: new Date().toISOString()
      });
      setSubmitting(false);

      // Route after gate
      if (raffle?.drawType === RaffleType.PRIZE_COMPETITION) {
        setStep('CART'); // Competitions skip lottery awareness content
      } else {
        setStep('MINDFUL');
      }
    } catch (e) {
      setErrorMsg('Failed to update profile. Please try again.');
      setSubmitting(false);
    }
  };

  const handlePayment = async (provider: PaymentProvider) => {
    if (!raffle || !user) return;
    setSubmitting(true);
    try {
      // Send skillAnswerIndex if passed
      const { paymentUrl } = await createEntryIntent(
        raffle._id,
        quantity,
        provider,
        skillGatePassed ? (selectedSkillAnswer ?? undefined) : undefined
      );

      if (paymentUrl.startsWith('/')) {
        navigate(paymentUrl);
      } else {
        window.location.href = paymentUrl;
      }
    } catch (e: any) {
      setPaymentError(e.message || 'Payment initiation failed. Please try again.');
      setSubmitting(false);
    }
  };

  const handleCompetitionAnswer = () => {
    if (!competitionQuestion || selectedSkillAnswer === null) return;

    const isCorrect = selectedSkillAnswer === competitionQuestion.correctAnswerIndex;
    setSkillGatePassed(isCorrect);
    setShowExplanation(true);
  };

  if (!raffle) return <div className="p-12 text-center animate-pulse">Loading Raffle...</div>;

  const isClosed = raffle.status === RaffleStatus.CLOSED || raffle.status === RaffleStatus.DRAWN || raffle.status === RaffleStatus.SOLD_OUT;
  const usesContainFit = raffle.imageFit === 'contain';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
        <button onClick={() => navigate('/draws')} className="hover:text-brand-purple">Draws</button>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{raffle.title}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">

        {/* LEFT COLUMN: Visuals & Info */}
        <div className="lg:col-span-7 space-y-8">
          <div className={`relative rounded-2xl overflow-hidden shadow-2xl group ${usesContainFit ? 'bg-gradient-to-br from-white via-brand-mist to-[#d9e8dd]' : 'bg-gray-100'}`}>
            <img
              src={formatWixMediaUrl(selectedImage || raffle.heroImageUrl || getAsset(raffle.assetKey))}
              alt={raffle.imageAlt || raffle.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/assets/prizes/placeholder.svg';
              }}
              className={`w-full h-80 lg:h-96 ${usesContainFit ? 'object-contain p-8' : 'object-cover'}`}
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${raffle.drawType === RaffleType.LOTTERY_RAFFLE ? 'bg-brand-purple text-white' : 'bg-brand-teal text-white'}`}>
                {raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'Prize Competition' : 'Lottery Raffle'}
              </span>
            </div>
          </div>

          {/* ... (Gallery code unchanged) */}
          {(raffle.galleryImageUrls && raffle.galleryImageUrls.length > 0) && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div
                onClick={() => setSelectedImage(raffle.heroImageUrl || getAsset(raffle.assetKey))}
                className={`min-w-[80px] h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${(!selectedImage || selectedImage === raffle.heroImageUrl) ? 'border-brand-purple scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img
                  src={formatWixMediaUrl(raffle.heroImageUrl || getAsset(raffle.assetKey), 200, 200)}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/assets/prizes/placeholder.svg';
                  }}
                  className={`w-full h-full ${usesContainFit ? 'object-contain bg-brand-mist p-2' : 'object-cover'}`}
                  alt="Main"
                />
              </div>
              {raffle.galleryImageUrls.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(url)}
                  className={`min-w-[80px] h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === url ? 'border-brand-purple scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img
                    src={formatWixMediaUrl(url, 200, 200)}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = '/assets/prizes/placeholder.svg';
                    }}
                    className={`w-full h-full ${usesContainFit ? 'object-contain bg-brand-mist p-2' : 'object-cover'}`}
                    alt={`Gallery ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-purple max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{raffle.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{raffle.description}</p>

            {raffle.specs && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Prize Specifications</h3>
                <dl className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div><dt className="text-gray-500">Brand</dt><dd className="font-semibold text-gray-900">{raffle.specs.brand}</dd></div>
                  <div><dt className="text-gray-500">Model</dt><dd className="font-semibold text-gray-900">{raffle.specs.model}</dd></div>
                  <div><dt className="text-gray-500">Condition</dt><dd className="font-semibold text-gray-900">{raffle.specs.condition}</dd></div>
                  <div><dt className="text-gray-500">RRP</dt><dd className="font-semibold text-gray-900">{formatCurrency(raffle.specs.retailValue)}</dd></div>
                </dl>
              </div>
            )}
          </div>

          <TransparencyPanel
            ticketPrice={raffle.ticketPrice}
            projectedDonationPercent={raffle.projectedDonation}
            drawType={raffle.drawType}
          />
        </div>

        {/* RIGHT COLUMN: The Interaction Card */}
        <div className="lg:col-span-5">
          <div className="bg-white/95 border border-brand-dark/10 shadow-[0_30px_80px_rgba(40,26,57,0.12)] rounded-[28px] p-6 lg:p-8 sticky top-24">

            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price per Entry</p>
                <p className="text-3xl font-extrabold text-brand-plum">{formatCurrency(raffle.ticketPrice)}</p>
                {raffle.drawType === RaffleType.PRIZE_COMPETITION && (
                  <p className="text-[10px] text-brand-green font-bold uppercase mt-1">Skill Question Required</p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${isClosed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {raffle.status}
                </span>
              </div>
            </div>

            {isClosed ? (
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium mb-4">This draw has ended.</p>
                <Button variant="secondary" onClick={() => navigate('/draws')}>View Active Draws</Button>
              </div>
            ) : (
              <>
                <div className="mb-6 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 p-4 text-sm text-slate-700">
                  <p className="font-bold text-brand-plum">Prefer to support directly?</p>
                  <p className="mt-2 leading-6">
                    Tickets help Mindful Gaming UK, but if someone simply wants to donate, use the live charity form instead of entering a draw.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="block">
                      <Button className="w-full bg-brand-yellow text-brand-dark hover:bg-[#efe72c] focus:ring-brand-yellow">
                        Donate Through Form
                      </Button>
                    </a>
                    <a href={config.charityLinks.donateUrl} target="_blank" rel="noreferrer" className="block">
                      <Button variant="secondary" className="w-full border-brand-plum text-brand-plum hover:bg-brand-plum hover:text-white">
                        Donation Page
                      </Button>
                    </a>
                  </div>
                </div>

                {/* 1. OVERVIEW */}
                {step === 'OVERVIEW' && (
                  <div className="animate-fadeIn space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                        <span>{raffle.soldTickets} tickets sold</span>
                        <span>{raffle.maxTickets} max</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-brand-teal h-3 rounded-full" style={{ width: `${calculateProgress(raffle.soldTickets, raffle.maxTickets)}%` }}></div>
                      </div>
                    </div>

                    <Button className="w-full py-4 text-lg shadow-lg shadow-brand-green/20" onClick={handleStartEntry}>
                      {user ? 'Enter This Draw' : 'Login to Enter'}
                    </Button>

                    <div className="bg-brand-mist text-slate-700 text-xs p-3 rounded-lg flex gap-2 items-start">
                      <span className="text-base">ℹ️</span>
                      <div>
                        <p className="font-bold">Entry Requirements</p>
                        <ul className="list-disc ml-4 space-y-1 mt-1 opacity-80">
                          <li>18+ and GB Resident</li>
                          {raffle.drawType === RaffleType.PRIZE_COMPETITION ? (
                            <li>One skill question must be answered correctly</li>
                          ) : (
                            <li>Small Society Lottery draw (no skill required)</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PROFILE GATE */}
                {step === 'PROFILE_GATE' && (
                  <div className="animate-fadeIn space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-gray-900">Eligibility Check</h3>
                      <p className="text-xs text-gray-500">Legal requirement for UK raffles.</p>
                    </div>
                    {errorMsg && <div className="text-red-600 text-xs bg-red-50 p-2 rounded border border-red-100">{errorMsg}</div>}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                        <input type="date" value={dobInput} onChange={(e) => setDobInput(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                        />
                      </div>
                      <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={residencyChecked} onChange={e => setResidencyChecked(e.target.checked)} className="mt-1 w-4 h-4 text-brand-purple rounded" />
                        <span className="text-xs text-gray-700">I confirm I am a resident of Great Britain.</span>
                      </label>
                      <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} className="mt-1 w-4 h-4 text-brand-purple rounded" />
                        <span className="text-xs text-gray-700">I accept the terms and understand ticket purchases are not donations.</span>
                      </label>
                    </div>
                    <Button className="w-full mt-4" onClick={handleGateSubmit} isLoading={submitting}>Confirm & Continue</Button>
                  </div>
                )}

                {/* 3. MINDFUL MOMENT */}
                {step === 'MINDFUL' && mindfulContent && (
                  <div className="animate-fadeIn">
                    <MindfulMoment content={mindfulContent} onComplete={() => setStep(awarenessContent.length > 0 ? 'FLASHCARDS' : 'CART')} />
                    <div className="mt-4 text-center">
                      <button onClick={() => setStep('CART')} className="text-xs text-gray-400 hover:text-gray-600 underline">Skip All</button>
                    </div>
                  </div>
                )}

                {/* 4. FLASHCARDS (Optional Awareness) */}
                {step === 'FLASHCARDS' && (
                  <div className="animate-fadeIn">
                    <FlashcardMoment
                      content={awarenessContent}
                      onFinish={() => setStep('CART')}
                      onSkip={() => setStep('CART')}
                    />
                  </div>
                )}

                {/* 5. CART */}
                {step === 'CART' && (
                  <div className="animate-fadeIn">
                    <h3 className="font-bold text-gray-900 mb-6 text-center">How many tickets?</h3>
                    <div className="flex items-center justify-center gap-6 mb-8">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-brand-plum hover:text-brand-plum font-bold text-xl transition-colors">-</button>
                      <div className="text-center w-16"><span className="text-4xl font-extrabold text-brand-plum">{quantity}</span></div>
                      <button onClick={() => setQuantity(Math.min(20, quantity + 1))} className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-brand-plum hover:text-brand-plum font-bold text-xl transition-colors">+</button>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center border border-gray-100">
                      <span className="text-gray-600 font-medium">Total to Pay</span>
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(quantity * raffle.ticketPrice)}</span>
                    </div>
                    <Button className="w-full py-3" onClick={() => setStep(raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'SKILL_QUESTION' : 'PAYMENT')}>
                      Proceed to Checkout
                    </Button>
                    <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="block">
                      <Button variant="secondary" className="mt-3 w-full border-brand-plum text-brand-plum hover:bg-brand-plum hover:text-white">
                        Donate Instead
                      </Button>
                    </a>
                    <button onClick={() => setStep('OVERVIEW')} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
                  </div>
                )}

                {/* 6. SKILL QUESTION (Competition Only) */}
                {step === 'SKILL_QUESTION' && (
                  <div className="animate-fadeIn space-y-6">
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900">Skill Question</h3>
                      <p className="text-xs text-gray-500 mt-1">Required for Prize Competitions.</p>
                    </div>

                    {!competitionQuestion ? (
                      <div className="py-8 text-center animate-pulse text-gray-400">Loading question...</div>
                    ) : !showExplanation ? (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="font-bold text-gray-800 mb-4">{competitionQuestion.questionText}</p>
                        <div className="grid gap-3">
                          {competitionQuestion.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedSkillAnswer(i)}
                              className={`w-full p-3 text-left rounded-lg border-2 transition-all ${selectedSkillAnswer === i ? 'border-brand-purple bg-brand-purple/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                            >
                              <span className="text-sm">{opt}</span>
                            </button>
                          ))}
                        </div>
                        <Button
                          className="w-full mt-6"
                          onClick={handleCompetitionAnswer}
                          disabled={selectedSkillAnswer === null}
                        >
                          Confirm Answer
                        </Button>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl border-2 animate-fade-in space-y-4 border-gray-100">
                        <div className={`text-center py-4 rounded-xl font-bold ${skillGatePassed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {skillGatePassed ? '✓ Correct Answer!' : '✗ Incorrect Answer'}
                        </div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                          <p className="font-bold text-gray-900 mb-1">Did you know?</p>
                          {competitionQuestion.explanation}
                          {competitionQuestion.resourceUrl && (
                            <a href={competitionQuestion.resourceUrl} target="_blank" className="block mt-2 text-brand-purple font-bold hover:underline">Learn more &rarr;</a>
                          )}
                        </div>
                        {skillGatePassed ? (
                          <Button className="w-full" onClick={() => setStep('PAYMENT')}>Proceed to Payment</Button>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-center text-xs text-red-600 italic">Sorry, a correct answer is required to enter this competition.</p>
                            <Button variant="secondary" className="w-full" onClick={() => { setShowExplanation(false); setSelectedSkillAnswer(null); }}>Try Again</Button>
                          </div>
                        )}
                      </div>
                    )}
                    <button onClick={() => setStep('CART')} className="w-full text-xs text-gray-400 hover:underline">Back</button>
                  </div>
                )}

                {/* 7. PAYMENT */}
                {step === 'PAYMENT' && (
                  <div className="animate-fadeIn space-y-4">
                    <h3 className="font-bold text-gray-900 mb-2">Select Payment Method</h3>
                    {paymentError && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 leading-relaxed">
                        {paymentError}
                      </div>
                    )}
                    <div className="bg-yellow-50 border border-yellow-200 p-3 text-[11px] text-yellow-800 rounded-lg flex items-start gap-2 leading-relaxed">
                      <span>⚠️</span>
                      <div>
                        <strong>Legal Notice:</strong> This purchase is an entry into a {raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'Prize Competition' : 'Small Society Lottery'}. It is not a charitable donation and is not Gift Aid eligible.
                      </div>
                    </div>
                    <button onClick={() => handlePayment(PaymentProvider.STRIPE)} disabled={submitting} className="w-full bg-[#635BFF] text-white py-3.5 rounded-lg font-bold hover:bg-[#534be0] transition flex justify-center items-center gap-2 shadow-sm">
                      <span>Credit / Debit Card</span>
                    </button>
                    <button onClick={() => handlePayment(PaymentProvider.PAYPAL)} disabled={submitting} className="w-full bg-[#FFC439] text-black py-3.5 rounded-lg font-bold hover:brightness-95 transition flex justify-center items-center gap-2 shadow-sm">
                      <span>PayPal</span>
                    </button>
                    <button onClick={() => { setStep('CART'); setPaymentError(null); }} className="w-full text-sm text-gray-500 mt-2 hover:underline">Back to Quantity</button>
                    <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="block">
                      <Button variant="secondary" className="mt-2 w-full border-brand-plum text-brand-plum hover:bg-brand-plum hover:text-white">
                        Donate Instead
                      </Button>
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
