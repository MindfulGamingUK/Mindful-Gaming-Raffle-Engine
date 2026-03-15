/**
 * Skill Question Bank — Mindful Gaming UK Prize Competitions
 *
 * All questions are about gaming disorders, mental health, and technology.
 * Questions are hard enough to require genuine knowledge — correct answers
 * are NOT shown to entrants at submission; revealed live on draw day.
 *
 * correctAnswerIndex is zero-based.
 */

export interface SkillQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  resourceUrl?: string;
  category: 'GAMING_DISORDER' | 'MENTAL_HEALTH' | 'TECHNOLOGY' | 'REGULATION';
  difficulty: 'HARD' | 'VERY_HARD';
}

export const skillQuestions: SkillQuestion[] = [
  {
    id: 'sq_001',
    questionText:
      'According to the WHO ICD-11 classification, what is the minimum symptom duration required before a clinical diagnosis of Gaming Disorder can be made?',
    options: ['3 months', '6 months', '12 months', '18 months'],
    correctAnswerIndex: 1,
    explanation:
      'The ICD-11 specifies that Gaming Disorder symptoms must be present for at least 12 months before a formal diagnosis can be made, though this may be shortened if symptoms are severe and all other criteria are met. Many sources summarise this as requiring a significant period of impairment.',
    resourceUrl: 'https://www.who.int/news-room/questions-and-answers/item/addictive-behaviours-gaming-disorder',
    category: 'GAMING_DISORDER',
    difficulty: 'HARD',
  },
  {
    id: 'sq_002',
    questionText:
      'Which neurotransmitter system is most centrally implicated in the reward and addiction cycle that makes compulsive gaming behaviorally similar to substance use disorders?',
    options: ['Serotonergic (serotonin)', 'GABAergic (GABA)', 'Dopaminergic (dopamine)', 'Cholinergic (acetylcholine)'],
    correctAnswerIndex: 2,
    explanation:
      'The dopaminergic reward pathway — particularly the mesolimbic and mesocortical systems — is the primary neurobiological mechanism linking compulsive gaming to other addictive behaviours. Variable-ratio reinforcement schedules in games trigger dopamine release similarly to gambling.',
    category: 'GAMING_DISORDER',
    difficulty: 'HARD',
  },
  {
    id: 'sq_003',
    questionText:
      'In the American DSM-5, Internet Gaming Disorder is listed under which section and what does its placement there signify?',
    options: [
      'Section II — Substance-Related Disorders; it is an established diagnosis',
      'Section III — Conditions for Further Study; more research is needed before formal recognition',
      'Section II — Impulse Control Disorders; it has been fully validated',
      'Appendix A — Cultural Concepts of Distress; it is culturally specific',
    ],
    correctAnswerIndex: 1,
    explanation:
      'The DSM-5 places Internet Gaming Disorder in Section III ("Conditions for Further Study"), indicating the APA found the evidence compelling enough to warrant further research but not yet sufficient for a standalone diagnosis. This contrasts with the WHO ICD-11 which formally classifies Gaming Disorder.',
    category: 'GAMING_DISORDER',
    difficulty: 'VERY_HARD',
  },
  {
    id: 'sq_004',
    questionText:
      'A landmark 2019 University of Oxford study (Przybylski & Weinstein) found that problematic gaming disorder affected approximately what proportion of adult gamers in its nationally representative UK sample?',
    options: ['Less than 1%', 'Around 3–4%', 'Approximately 8–10%', 'Up to 15%'],
    correctAnswerIndex: 0,
    explanation:
      'The Oxford study found that gaming disorder, defined rigorously using ICD-11 criteria, affected fewer than 1% of the adult gaming population. This is notably lower than many self-report estimates and highlights the importance of using validated clinical criteria rather than loose screen time measures.',
    resourceUrl: 'https://www.ox.ac.uk/news/2021-03-01-gaming-disorder-affects-fewer-people-previously-thought',
    category: 'GAMING_DISORDER',
    difficulty: 'VERY_HARD',
  },
  {
    id: 'sq_005',
    questionText:
      'Which of the following is NOT listed as one of the nine criteria for Internet Gaming Disorder in the DSM-5?',
    options: [
      'Preoccupation with gaming even when not playing',
      'Development of physical tolerance requiring longer sessions for the same effect',
      'Continued gaming despite knowing it causes psychosocial problems',
      'Deceiving family members or therapists about amount of gaming',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Physical tolerance (needing more of the substance/behaviour to achieve the same effect) is a key criterion for substance use disorders but is NOT one of the nine criteria for Internet Gaming Disorder in DSM-5. The nine IGD criteria focus on psychological and behavioural features such as preoccupation, withdrawal, loss of control, and continued use despite harm.',
    category: 'GAMING_DISORDER',
    difficulty: 'VERY_HARD',
  },
  {
    id: 'sq_006',
    questionText:
      'Loot boxes in video games have been formally regulated as gambling in which of these countries?',
    options: [
      'United Kingdom and the United States',
      'Belgium and the Netherlands',
      'Japan and South Korea only',
      'All EU member states since 2021',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Belgium and the Netherlands are the most prominent examples of countries that have legally classified paid loot boxes as gambling and banned them from games sold to children. The UK Gambling Commission reviewed loot boxes but stopped short of direct regulation as of 2023, recommending a voluntary code instead.',
    category: 'REGULATION',
    difficulty: 'HARD',
  },
  {
    id: 'sq_007',
    questionText:
      'The Internet Gaming Disorder Scale – Short Form (IGDS9-SF) screens for problematic gaming using 9 items. How many criteria must score "often" or "very often" for a positive screen indicating potential disorder?',
    options: ['3 or more criteria', '5 or more criteria', '7 or more criteria', 'All 9 criteria'],
    correctAnswerIndex: 1,
    explanation:
      'The validated IGDS9-SF uses a threshold of 5 or more of the 9 criteria rated "often" or "very often" to indicate a potential disorder requiring further clinical assessment. This mirrors the DSM-5 guidance that 5 out of 9 criteria are needed for an IGD diagnosis.',
    category: 'GAMING_DISORDER',
    difficulty: 'HARD',
  },
  {
    id: 'sq_008',
    questionText:
      'What is the most common co-occurring (comorbid) mental health condition found in clinical populations diagnosed with gaming disorder, based on meta-analyses?',
    options: [
      'Schizophrenia spectrum disorders',
      'Depression and anxiety disorders',
      'Bipolar I disorder',
      'Obsessive-compulsive disorder exclusively',
    ],
    correctAnswerIndex: 1,
    explanation:
      'Meta-analyses consistently show that depression and anxiety disorders are the most prevalent comorbidities in clinical samples with gaming disorder — with ADHD also highly represented. The causal direction is debated: gaming may exacerbate mood disorders, or mood disorders may drive avoidant gaming behaviour.',
    category: 'MENTAL_HEALTH',
    difficulty: 'HARD',
  },
  {
    id: 'sq_009',
    questionText:
      'Screen Time parental controls on modern smartphones can limit app usage, but research shows a key limitation of screen time tracking for identifying problematic gaming. What is it?',
    options: [
      'They cannot measure social media use',
      'Time spent is a poor proxy for harm — context and compulsivity matter more than hours alone',
      'They only work on iOS, not Android',
      'Screen time data is not encrypted and can be accessed by third parties',
    ],
    correctAnswerIndex: 1,
    explanation:
      'The research consensus (including WHO and APA guidance) is that the amount of time spent gaming alone is a poor measure of disorder. A child gaming 8 hours on a weekend with parental knowledge and no impairment differs fundamentally from one gaming 3 hours while neglecting school and withdrawing socially. Harm, loss of control, and compulsivity are the key markers.',
    category: 'TECHNOLOGY',
    difficulty: 'HARD',
  },
  {
    id: 'sq_010',
    questionText:
      'Which psychological theory best explains why variable-ratio reinforcement schedules (e.g., random loot drops) in games are especially resistant to extinction and contribute most to compulsive play?',
    options: [
      'Classical conditioning (Pavlov) — stimulus-response associations formed through repetition',
      'Fixed-interval schedules — predictable rewards that create habitual checking behaviour',
      'Operant conditioning (Skinner) — variable unpredictable rewards produce the highest and most persistent response rates',
      'Social learning theory (Bandura) — observing others receive rewards increases engagement',
    ],
    correctAnswerIndex: 2,
    explanation:
      'B.F. Skinner\'s research on operant conditioning demonstrated that variable-ratio reinforcement (reward after an unpredictable number of responses) produces the highest rate of responding and is the most resistant to extinction. This is the same mechanism behind slot machines, and explains why random loot drops and gacha mechanics are so effective at driving compulsive engagement.',
    category: 'MENTAL_HEALTH',
    difficulty: 'VERY_HARD',
  },
];

/**
 * Returns a question by ID, or undefined if not found.
 */
export const getQuestionById = (id: string): SkillQuestion | undefined =>
  skillQuestions.find((q) => q.id === id);

/**
 * Returns a stripped version safe to send to the client (no correct answer).
 */
export const sanitiseForClient = (q: SkillQuestion) => ({
  id: q.id,
  questionText: q.questionText,
  options: q.options,
  explanation: q.explanation,
  resourceUrl: q.resourceUrl,
});
