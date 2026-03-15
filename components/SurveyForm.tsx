import React, { useState } from 'react';
import { Button } from './Button';
import { SurveyResponse } from '../types';
import { post_surveyResponse } from '../services/api';
import { surveyCategoryOptions } from '../data/prizeVault';

export const SurveyForm: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Partial<SurveyResponse>>({
        is18Plus: false,
        takePartInterest: undefined,
        preferredFormat: 'BOTH',
        prizeCategories: [],
        otherPrizeIdeas: '',
        emailOptional: '',
        marketingConsent: false
    });

    const categoryOptions = surveyCategoryOptions;

    const toggleArray = (field: 'prizeCategories', value: string) => {
        const current = (form[field] as string[]) || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setForm({ ...form, [field]: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.is18Plus) {
            alert("You must be 18+ to complete this survey.");
            return;
        }
        setLoading(true);
        try {
            await post_surveyResponse({
                ...form,
                createdAt: new Date().toISOString(),
                anonymousSessionId: `anon_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                trustFactors: [] // Deprecated field kept for type compatibility if needed, or remove from type
            } as SurveyResponse);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('Failed to submit survey. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-green-50 rounded-2xl p-8 text-center animate-fade-in border border-green-200 shadow-sm">
                <span className="text-4xl mb-4 block">🎉</span>
                <h3 className="text-xl font-bold text-green-900 mb-2">Thanks for shaping the queue.</h3>
                <p className="text-green-700 mb-6">We have recorded which prizes matter most and what should move into the next wave of live draws.</p>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>Submit Another</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-8 relative overflow-hidden">
            {/* Visual Header Decoration */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-brand-plum via-brand-orange to-brand-green"></div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Q1: Age Confirmation */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">1. Age Confirmation <span className="text-red-500">*</span></label>
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.is18Plus ? 'border-brand-purple bg-brand-purple/5' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input
                            type="checkbox"
                            checked={form.is18Plus}
                            onChange={(e) => setForm({ ...form, is18Plus: e.target.checked })}
                            className="w-6 h-6 text-brand-purple rounded focus:ring-brand-purple"
                        />
                        <span className="font-medium text-gray-700">I confirm I am 18 years or older</span>
                    </label>
                </div>

                {/* Q2: Interest Level */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">2. Would you take part? <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['YES', 'MAYBE', 'NO'] as const).map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => setForm({ ...form, takePartInterest: opt })}
                                className={`py-3 rounded-lg font-bold text-sm border-2 transition-all ${form.takePartInterest === opt
                                    ? 'border-brand-green bg-brand-green text-white shadow-md'
                                    : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Q3: Format Preference */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">3. Preferred Format</label>
                    <select
                        value={form.preferredFormat}
                        onChange={(e) => setForm({ ...form, preferredFormat: e.target.value as any })}
                        className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none bg-gray-50 font-medium"
                    >
                        <option value="LOTTERY">Lottery Draw (Pure Chance)</option>
                        <option value="COMPETITION">Prize Competition (Skill Question)</option>
                        <option value="BOTH">I like both types</option>
                        <option value="UNSURE">Not sure yet</option>
                    </select>
                </div>
            </div>

            {/* Q4: Prize Interests */}
            <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">4. What should go live next? (Select all)</label>
                <div className="flex flex-wrap gap-2">
                    {categoryOptions.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => toggleArray('prizeCategories', cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${form.prizeCategories?.includes(cat)
                                ? 'border-brand-plum bg-brand-plum text-white shadow-md transform scale-105'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-brand-green/50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Other ideas? (e.g. sim rigs, gift cards, collector bundles...)"
                    value={form.otherPrizeIdeas}
                    onChange={(e) => setForm({ ...form, otherPrizeIdeas: e.target.value })}
                    className="mt-2 w-full border-b-2 border-gray-100 bg-transparent p-3 text-sm outline-none transition-colors focus:border-brand-plum"
                />
            </div>

            {/* Q5: Optional Email */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-grow w-full">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email for Updates (Optional)</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={form.emailOptional}
                            onChange={(e) => setForm({ ...form, emailOptional: e.target.value })}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-brand-purple outline-none"
                        />
                    </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={form.marketingConsent}
                        onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                    />
                    <span className="text-xs text-gray-500 group-hover:text-gray-900 leading-snug">
                        I agree to receive occasional updates about new draws and charity news.
                        We never sell your data. Unsubscribe anytime.
                    </span>
                </label>
            </div>

            <Button
                type="submit"
                className="w-full py-4 text-lg font-black tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                isLoading={loading}
                disabled={!form.is18Plus || !form.takePartInterest}
            >
                Start Supporting 🚀
            </Button>

            {!form.is18Plus && (
                <p className="text-center text-xs text-red-400 font-medium animate-pulse">
                    * Please confirm you are 18+ to submit
                </p>
            )}
        </form>
    );
};
