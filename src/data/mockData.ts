import { ExamInfo, DigitalBook, ShortNote, MockTest, Achievement, PYQQuestion } from '../types';

export const EXAMS_LIST: ExamInfo[] = [
  {
    id: 'gate',
    name: 'GATE CS',
    category: 'Engineering & Postgrad',
    fullName: 'Graduate Aptitude Test in Engineering (CS & IT)',
    badge: 'GATE 2025/2026',
    accentColor: '#1D8676',
    description: 'Premier national exam for M.Tech admissions at IITs/IISc and PSU recruitment.',
    totalMarks: 100,
    durationMinutes: 180,
    negativeMarking: '1/3rd for 1-mark & 2/3rd for 2-mark MCQs. No negative for NAT & MSQ.',
    subjects: [
      {
        id: 'gate-dsa',
        name: 'Data Structures & Algorithms',
        icon: 'Code2',
        color: '#1D8676',
        totalChapters: 8,
        chapters: [
          { id: 'gate-dsa-trees', name: 'Binary Trees & BSTs', subjectId: 'gate-dsa', pyqCount: 42, weightagePercent: 12 },
          { id: 'gate-dsa-graphs', name: 'Graph Algorithms (BFS/DFS/Dijkstra)', subjectId: 'gate-dsa', pyqCount: 38, weightagePercent: 10 },
          { id: 'gate-dsa-dp', name: 'Dynamic Programming & Recurrences', subjectId: 'gate-dsa', pyqCount: 35, weightagePercent: 11 },
          { id: 'gate-dsa-arrays', name: 'Arrays, Heaps & Hashing', subjectId: 'gate-dsa', pyqCount: 29, weightagePercent: 8 },
        ]
      },
      {
        id: 'gate-os',
        name: 'Operating Systems',
        icon: 'Cpu',
        color: '#0ea5e9',
        totalChapters: 6,
        chapters: [
          { id: 'gate-os-sync', name: 'Process Synchronization & Semaphores', subjectId: 'gate-os', pyqCount: 45, weightagePercent: 14 },
          { id: 'gate-os-vm', name: 'Virtual Memory & Paging', subjectId: 'gate-os', pyqCount: 40, weightagePercent: 12 },
          { id: 'gate-os-cpu', name: 'CPU Scheduling Algorithms', subjectId: 'gate-os', pyqCount: 28, weightagePercent: 8 },
          { id: 'gate-os-deadlock', name: 'Deadlock Handling & Banker\'s Algo', subjectId: 'gate-os', pyqCount: 22, weightagePercent: 6 }
        ]
      },
      {
        id: 'gate-dbms',
        name: 'Database Management Systems',
        icon: 'Database',
        color: '#8b5cf6',
        totalChapters: 5,
        chapters: [
          { id: 'gate-dbms-sql', name: 'Relational Algebra & SQL', subjectId: 'gate-dbms', pyqCount: 36, weightagePercent: 10 },
          { id: 'gate-dbms-tx', name: 'Transactions & Concurrency Control', subjectId: 'gate-dbms', pyqCount: 34, weightagePercent: 11 },
          { id: 'gate-dbms-norm', name: 'Normalization & Functional Dependencies', subjectId: 'gate-dbms', pyqCount: 30, weightagePercent: 9 }
        ]
      },
      {
        id: 'gate-cn',
        name: 'Computer Networks',
        icon: 'Globe',
        color: '#ec4899',
        totalChapters: 6,
        chapters: [
          { id: 'gate-cn-tcp', name: 'TCP/IP, Sliding Window & Flow Control', subjectId: 'gate-cn', pyqCount: 39, weightagePercent: 12 },
          { id: 'gate-cn-ip', name: 'IP Addressing & Subnetting', subjectId: 'gate-cn', pyqCount: 33, weightagePercent: 9 },
          { id: 'gate-cn-routing', name: 'Routing Protocols (Distance Vector, OSPF)', subjectId: 'gate-cn', pyqCount: 25, weightagePercent: 7 }
        ]
      },
      {
        id: 'gate-toc',
        name: 'Theory of Computation',
        icon: 'Binary',
        color: '#f59e0b',
        totalChapters: 5,
        chapters: [
          { id: 'gate-toc-reg', name: 'Regular Languages & Finite Automata', subjectId: 'gate-toc', pyqCount: 48, weightagePercent: 13 },
          { id: 'gate-toc-cfl', name: 'Context Free Grammars & Pushdown Automata', subjectId: 'gate-toc', pyqCount: 32, weightagePercent: 9 },
          { id: 'gate-toc-dec', name: 'Turing Machines & Decidability', subjectId: 'gate-toc', pyqCount: 27, weightagePercent: 8 }
        ]
      }
    ]
  },
  {
    id: 'jee',
    name: 'IIT-JEE',
    category: 'Engineering Undergraduate',
    fullName: 'Joint Entrance Examination (Main & Advanced)',
    badge: 'JEE 2025/2026',
    accentColor: '#1D8676',
    description: 'Premier national entrance exam for admission to IITs, NITs, and IIITs.',
    totalMarks: 300,
    durationMinutes: 180,
    negativeMarking: '+4 for correct, -1 for incorrect in MCQs and numerical questions.',
    subjects: [
      {
        id: 'jee-maths',
        name: 'Mathematics',
        icon: 'Calculator',
        color: '#1D8676',
        totalChapters: 12,
        chapters: [
          { id: 'jee-maths-calc', name: 'Definite Integration & Differential Equations', subjectId: 'jee-maths', pyqCount: 65, weightagePercent: 14 },
          { id: 'jee-maths-coord', name: 'Coordinate Geometry (Conics & Circles)', subjectId: 'jee-maths', pyqCount: 58, weightagePercent: 12 },
          { id: 'jee-maths-vectors', name: 'Vectors & 3D Geometry', subjectId: 'jee-maths', pyqCount: 45, weightagePercent: 10 },
          { id: 'jee-maths-prob', name: 'Probability & Permutation-Combination', subjectId: 'jee-maths', pyqCount: 38, weightagePercent: 8 }
        ]
      },
      {
        id: 'jee-phys',
        name: 'Physics',
        icon: 'Zap',
        color: '#3b82f6',
        totalChapters: 14,
        chapters: [
          { id: 'jee-phys-mech', name: 'Rotational Motion & Mechanics', subjectId: 'jee-phys', pyqCount: 72, weightagePercent: 15 },
          { id: 'jee-phys-elec', name: 'Electrostatics & Current Electricity', subjectId: 'jee-phys', pyqCount: 68, weightagePercent: 14 },
          { id: 'jee-phys-optics', name: 'Wave & Ray Optics', subjectId: 'jee-phys', pyqCount: 44, weightagePercent: 9 },
          { id: 'jee-phys-modern', name: 'Modern Physics & Nuclear Physics', subjectId: 'jee-phys', pyqCount: 52, weightagePercent: 11 }
        ]
      },
      {
        id: 'jee-chem',
        name: 'Chemistry',
        icon: 'FlaskConical',
        color: '#10b981',
        totalChapters: 14,
        chapters: [
          { id: 'jee-chem-org', name: 'Reaction Mechanisms & GOC', subjectId: 'jee-chem', pyqCount: 70, weightagePercent: 15 },
          { id: 'jee-chem-coord', name: 'Coordination Compounds & Chemical Bonding', subjectId: 'jee-chem', pyqCount: 56, weightagePercent: 12 },
          { id: 'jee-chem-thermo', name: 'Thermodynamics & Chemical Equilibrium', subjectId: 'jee-chem', pyqCount: 49, weightagePercent: 10 }
        ]
      }
    ]
  },
  {
    id: 'neet',
    name: 'NEET UG',
    category: 'Medical Undergraduate',
    fullName: 'National Eligibility cum Entrance Test',
    badge: 'NEET 2025/2026',
    accentColor: '#1D8676',
    description: 'National single medical entrance test for MBBS, BDS, and AYUSH admissions.',
    totalMarks: 720,
    durationMinutes: 200,
    negativeMarking: '+4 for correct, -1 for incorrect. 0 for unattempted.',
    subjects: [
      {
        id: 'neet-bio',
        name: 'Biology (Botany & Zoology)',
        icon: 'Dna',
        color: '#1D8676',
        totalChapters: 18,
        chapters: [
          { id: 'neet-bio-genetics', name: 'Principles of Inheritance & Molecular Basis', subjectId: 'neet-bio', pyqCount: 95, weightagePercent: 20 },
          { id: 'neet-bio-human-physio', name: 'Human Physiology (Neural, Chemical, Circulatory)', subjectId: 'neet-bio', pyqCount: 88, weightagePercent: 18 },
          { id: 'neet-bio-reprod', name: 'Reproduction in Organisms & Humans', subjectId: 'neet-bio', pyqCount: 62, weightagePercent: 12 },
          { id: 'neet-bio-cell', name: 'Cell Cycle, Division & Biomolecules', subjectId: 'neet-bio', pyqCount: 54, weightagePercent: 10 }
        ]
      },
      {
        id: 'neet-phys',
        name: 'Physics',
        icon: 'Zap',
        color: '#0284c7',
        totalChapters: 12,
        chapters: [
          { id: 'neet-phys-current', name: 'Current Electricity & Magnetism', subjectId: 'neet-phys', pyqCount: 54, weightagePercent: 12 },
          { id: 'neet-phys-semicon', name: 'Semiconductor Electronics & Modern Physics', subjectId: 'neet-phys', pyqCount: 48, weightagePercent: 11 },
          { id: 'neet-phys-mechanics', name: 'Laws of Motion & Work Energy Power', subjectId: 'neet-phys', pyqCount: 50, weightagePercent: 11 }
        ]
      },
      {
        id: 'neet-chem',
        name: 'Chemistry',
        icon: 'FlaskConical',
        color: '#059669',
        totalChapters: 14,
        chapters: [
          { id: 'neet-chem-organic', name: 'Hydrocarbons, Aldehydes, Ketones & Amines', subjectId: 'neet-chem', pyqCount: 66, weightagePercent: 14 },
          { id: 'neet-chem-inorganic', name: 'p-Block & d/f-Block Elements', subjectId: 'neet-chem', pyqCount: 58, weightagePercent: 13 },
          { id: 'neet-chem-physical', name: 'Chemical Kinetics & Solutions', subjectId: 'neet-chem', pyqCount: 46, weightagePercent: 10 }
        ]
      }
    ]
  }
];

export const SAMPLE_PYQS: PYQQuestion[] = [
  // GATE Questions
  {
    id: 'gate-2024-q1',
    examId: 'gate',
    subjectId: 'gate-dsa',
    chapterId: 'gate-dsa-trees',
    year: 2024,
    examShift: 'Set 1',
    questionText: 'Consider a binary tree T with 100 leaf nodes. How many nodes of degree 2 does T have?',
    type: 'mcq',
    options: [
      { id: 'A', text: '99' },
      { id: 'B', text: '100' },
      { id: 'C', text: '50' },
      { id: 'D', text: 'Cannot be determined without knowing total nodes' }
    ],
    correctAnswer: 'A',
    explanation: 'By standard tree theorem: For any strictly binary or general binary tree, the number of internal nodes with two children (degree 2) is always equal to (Number of leaf nodes - 1). Therefore, n2 = n0 - 1 = 100 - 1 = 99.',
    keyFormula: 'n2 = n0 - 1 (where n0 = leaf nodes, n2 = degree 2 nodes)',
    difficulty: 'Easy',
    marks: 1,
    negativeMarks: 0.33
  },
  {
    id: 'gate-2024-q2',
    examId: 'gate',
    subjectId: 'gate-os',
    chapterId: 'gate-os-sync',
    year: 2024,
    examShift: 'Set 2',
    questionText: 'A counting semaphore S is initialized to 12. Then 8 P (wait) operations and 5 V (signal) operations are executed on S in some order. What is the final value of S?',
    type: 'nat',
    correctAnswer: '9',
    numericalTolerance: 0,
    explanation: 'Initial semaphore value = 12. Each P(S) operation decrements the semaphore by 1: 12 - 8 = 4. Each V(S) operation increments the semaphore by 1: 4 + 5 = 9. Final value = 9.',
    keyFormula: 'S_final = S_init - count(P) + count(V)',
    difficulty: 'Easy',
    marks: 1,
    negativeMarks: 0
  },
  {
    id: 'gate-2023-q1',
    examId: 'gate',
    subjectId: 'gate-dbms',
    chapterId: 'gate-dbms-tx',
    year: 2023,
    examShift: 'Set 1',
    questionText: 'Which of the following schedules is conflict serializable? Let r_i(X) and w_i(X) denote read and write operations by transaction T_i on item X.',
    type: 'mcq',
    options: [
      { id: 'A', text: 'S1: r1(X); w1(X); r2(X); w2(X); r1(Y); w2(Y);' },
      { id: 'B', text: 'S2: r1(X); w2(X); r2(X); w1(X);' },
      { id: 'C', text: 'S3: r1(X); r2(X); w1(X); w2(X); r1(Y); w1(Y);' },
      { id: 'D', text: 'S4: r2(X); w1(X); r1(X); w2(X);' }
    ],
    correctAnswer: 'A',
    explanation: 'Construct the precedence graph. S1 has edges only from T1 -> T2 for both X and Y. Because the graph has no cycles, S1 is conflict serializable with serial order T1 -> T2. In the other schedules, conflicting operations create cyclic dependencies (T1 -> T2 and T2 -> T1).',
    keyFormula: 'Conflict serializable iff Precedence Graph has no directed cycles.',
    difficulty: 'Medium',
    marks: 2,
    negativeMarks: 0.66
  },
  {
    id: 'gate-2023-q2',
    examId: 'gate',
    subjectId: 'gate-cn',
    chapterId: 'gate-cn-ip',
    year: 2023,
    examShift: 'Set 2',
    questionText: 'An organization is granted the block 130.56.0.0/16. The administrator wants to create 128 subnets. What is the subnet mask and the maximum number of usable host addresses in each subnet?',
    type: 'mcq',
    options: [
      { id: 'A', text: '255.255.254.0 and 510 hosts' },
      { id: 'B', text: '255.255.255.0 and 254 hosts' },
      { id: 'C', text: '255.255.254.0 and 512 hosts' },
      { id: 'D', text: '255.255.255.128 and 126 hosts' }
    ],
    correctAnswer: 'A',
    explanation: 'To create 128 subnets: 2^7 = 128, so we borrow 7 bits from the host portion. New prefix length = 16 + 7 = 23 bits (/23). Subnet mask: 255.255.254.0. Remaining host bits = 32 - 23 = 9 bits. Usable hosts per subnet = 2^9 - 2 = 512 - 2 = 510 hosts.',
    keyFormula: 'Usable hosts = 2^(host_bits) - 2 (subtract network and broadcast address)',
    difficulty: 'Medium',
    marks: 2,
    negativeMarks: 0.66
  },
  {
    id: 'gate-2022-q1',
    examId: 'gate',
    subjectId: 'gate-toc',
    chapterId: 'gate-toc-reg',
    year: 2022,
    questionText: 'Which of the following languages over alphabet {0, 1} is regular?',
    type: 'mcq',
    options: [
      { id: 'A', text: 'L = { 0^n 1^m | n, m >= 0 and n = m }' },
      { id: 'B', text: 'L = { w in {0,1}* | number of 0s in w is divisible by 3 }' },
      { id: 'C', text: 'L = { 0^p | p is a prime number }' },
      { id: 'D', text: 'L = { w w^R | w in {0,1}* }' }
    ],
    correctAnswer: 'B',
    explanation: 'Option B requires keeping track of modulo 3 of the count of zeros, which can be accomplished with a finite state machine having only 3 states (state 0, state 1, state 2). All other options require infinite memory (stack or tape) and are context-free or non-context-free.',
    keyFormula: 'Finite memory required implies Regular language recognizable by DFA.',
    difficulty: 'Easy',
    marks: 1,
    negativeMarks: 0.33
  },

  // JEE Questions
  {
    id: 'jee-2024-q1',
    examId: 'jee',
    subjectId: 'jee-maths',
    chapterId: 'jee-maths-calc',
    year: 2024,
    examShift: '27 Jan Shift 1',
    questionText: 'Evaluate the definite integral: I = integral from 0 to pi of (x * sin(x)) / (1 + cos^2(x)) dx.',
    type: 'mcq',
    options: [
      { id: 'A', text: 'pi^2 / 4' },
      { id: 'B', text: 'pi^2 / 2' },
      { id: 'C', text: 'pi / 4' },
      { id: 'D', text: 'pi^2 / 8' }
    ],
    correctAnswer: 'A',
    explanation: 'Using King\'s property: integral from 0 to a f(x) dx = integral from 0 to a f(a - x) dx. 2I = pi * integral from 0 to pi sin(x)/(1+cos^2(x)) dx. Substituting t = cos(x), dt = -sin(x) dx gives 2I = pi * [arctan(t)] from 1 to -1 = pi * (pi/2) = pi^2 / 2 => I = pi^2 / 4.',
    keyFormula: 'King\'s Property: integral_0^a f(x) dx = integral_0^a f(a - x) dx',
    difficulty: 'Medium',
    marks: 4,
    negativeMarks: 1
  },
  {
    id: 'jee-2024-q2',
    examId: 'jee',
    subjectId: 'jee-phys',
    chapterId: 'jee-phys-elec',
    year: 2024,
    examShift: '29 Jan Shift 2',
    questionText: 'A parallel plate capacitor with air between the plates has a capacitance of 9 pF. The separation between its plates is d. The space between the plates is now filled with two dielectrics of dielectric constants k1 = 3 and k2 = 6, each of thickness d/2. What is the new capacitance?',
    type: 'nat',
    correctAnswer: '36',
    numericalTolerance: 0.5,
    explanation: 'The two slabs act as two capacitors in series, each of thickness d/2. C1 = (k1 * eps0 * A) / (d/2) = 2 * 3 * C0 = 6 * 9 = 54 pF. C2 = (k2 * eps0 * A) / (d/2) = 2 * 6 * C0 = 12 * 9 = 108 pF. C_eq = (C1 * C2) / (C1 + C2) = (54 * 108) / (162) = 36 pF.',
    keyFormula: 'Series Capacitors: 1/C_eq = 1/C1 + 1/C2',
    difficulty: 'Medium',
    marks: 4,
    negativeMarks: 1
  },

  // NEET Questions
  {
    id: 'neet-2024-q1',
    examId: 'neet',
    subjectId: 'neet-bio',
    chapterId: 'neet-bio-genetics',
    year: 2024,
    questionText: 'In a dihybrid cross involving two genes that assort independently, what is the phenotypic ratio obtained in the F2 generation?',
    type: 'mcq',
    options: [
      { id: 'A', text: '9 : 3 : 3 : 1' },
      { id: 'B', text: '9 : 7' },
      { id: 'C', text: '1 : 2 : 1' },
      { id: 'D', text: '15 : 1' }
    ],
    correctAnswer: 'A',
    explanation: 'Mendel\'s Law of Independent Assortment states that when two pairs of traits are combined in a hybrid, segregation of one pair of characters is independent of the other pair. The resulting F2 phenotypic ratio is 9 (Round Yellow) : 3 (Round Green) : 3 (Wrinkled Yellow) : 1 (Wrinkled Green).',
    keyFormula: 'Dihybrid ratio: (3:1)^2 = 9:3:3:1',
    difficulty: 'Easy',
    marks: 4,
    negativeMarks: 1
  },
  {
    id: 'neet-2023-q1',
    examId: 'neet',
    subjectId: 'neet-phys',
    chapterId: 'neet-phys-current',
    year: 2023,
    questionText: 'The resistance of a platinum wire is 2.00 ohms at 0 degree C and 2.50 ohms at 100 degree C. What is the temperature coefficient of resistance of platinum?',
    type: 'mcq',
    options: [
      { id: 'A', text: '0.0025 / °C' },
      { id: 'B', text: '0.0050 / °C' },
      { id: 'C', text: '0.00125 / °C' },
      { id: 'D', text: '0.0035 / °C' }
    ],
    correctAnswer: 'A',
    explanation: 'Using formula R_t = R_0 * (1 + alpha * delta_T). 2.50 = 2.00 * (1 + alpha * 100). 1 + 100*alpha = 1.25 => 100*alpha = 0.25 => alpha = 0.0025 / °C.',
    keyFormula: 'alpha = (R_t - R_0) / (R_0 * Delta T)',
    difficulty: 'Medium',
    marks: 4,
    negativeMarks: 1
  }
];

export const DIGITAL_BOOKS: DigitalBook[] = [
  {
    id: 'book-1',
    examId: 'gate',
    title: 'Top 500 PYQs with Solutions',
    subtitle: 'Curated by AIR 1-50 Rankers with step-by-step video & text solutions',
    tag: 'GATE 2025/2026',
    badgeText: 'MUST SOLVE',
    coverGradient: 'from-[#1D8676] to-[#0f4940]',
    rating: 4.9,
    readersCount: '48.2k',
    pagesCount: 420,
    subject: 'All Subjects',
    highlights: ['100% Verified IIT Official Answer Keys', 'Shortcut Tricks for Numerical Answer Type (NAT)', 'Frequent Concept Traps & Pitfalls']
  },
  {
    id: 'book-2',
    examId: 'gate',
    title: 'Must Do 1500 Questions',
    subtitle: 'High frequency repeat patterns and conceptual boundary cases',
    tag: 'Core CS Subjects',
    badgeText: 'HIGH YIELD',
    coverGradient: 'from-[#1D8676] via-[#145a50] to-[#0c312c]',
    rating: 4.8,
    readersCount: '32.1k',
    pagesCount: 680,
    subject: 'Algorithms & OS & DBMS',
    highlights: ['Categorized by Difficulty (Easy, Med, Hard)', 'Gate Virtual Calculator Optimized', 'Full Coverage of 2010-2024 Trends']
  },
  {
    id: 'book-3',
    examId: 'gate',
    title: 'GATE CS Rank Booster Handbook',
    subtitle: 'All theorems, standard master theorem cases, and quick lookups',
    tag: 'Quick Revision',
    badgeText: 'BESTSELLER',
    coverGradient: 'from-[#176f62] to-[#0d3f37]',
    rating: 4.95,
    readersCount: '64.9k',
    pagesCount: 190,
    subject: 'Formulas & Cheat Sheets',
    highlights: ['Zero Clutter High-Yield Tables', 'Time & Space Complexity Reference', 'Memory Management & Subnetting Fast Formulas']
  },
  // JEE Books
  {
    id: 'book-4',
    examId: 'jee',
    title: 'Top 500 PYQs for JEE Main',
    subtitle: 'With step-by-step video solutions and multi-method solving',
    tag: 'JEE Main 2025',
    badgeText: 'TOP 500',
    coverGradient: 'from-[#1D8676] to-[#124b42]',
    rating: 4.9,
    readersCount: '89.4k',
    pagesCount: 390,
    subject: 'PCM Complete',
    highlights: ['Weightage-driven chapter order', 'NTA repeat questions flagged', 'Timer recommendations per question']
  },
  {
    id: 'book-5',
    examId: 'jee',
    title: '99 Percentile Question Bank',
    subtitle: 'Advanced level multi-concept problems to break the 99% barrier',
    tag: 'JEE Advanced',
    badgeText: '99% CLUB',
    coverGradient: 'from-[#1D8676] via-[#105248] to-[#0a302a]',
    rating: 4.85,
    readersCount: '41.2k',
    pagesCount: 520,
    subject: 'Mathematics & Physics',
    highlights: ['Multi-correct strategies', 'Matrix match & Paragraph questions', 'Calculus and Mechanics deep dives']
  },
  // NEET Books
  {
    id: 'book-6',
    examId: 'neet',
    title: 'NCERT Punch 360: Biology Mastery',
    subtitle: 'Line-by-line NCERT diagrammatic and assertion-reason questions',
    tag: 'NEET 2025/2026',
    badgeText: '360/360 BIO',
    coverGradient: 'from-[#1D8676] to-[#0f4940]',
    rating: 4.92,
    readersCount: '112.5k',
    pagesCount: 460,
    subject: 'Botany & Zoology',
    highlights: ['Every NCERT diagram labeled & tested', 'Previous 15 years trend analysis', 'Genetics pedigree tricks']
  }
];

export const SHORT_NOTES_DATA: ShortNote[] = [
  {
    id: 'note-dsa-trees',
    examId: 'gate',
    subjectId: 'gate-dsa',
    chapterId: 'gate-dsa-trees',
    chapterName: 'Binary Trees & BSTs',
    subjectName: 'Data Structures & Algorithms',
    title: 'High-Yield Tree Formulas & Traversal Properties',
    readTime: '6 min read',
    isBookmarked: true,
    sections: [
      {
        heading: 'Essential Binary Tree Properties',
        content: '1. Handshaking Lemma: Total sum of degrees = 2 * (Number of edges).\n2. For binary tree: Nodes with 2 children n2 = n0 - 1 (where n0 = leaf nodes).\n3. Maximum nodes at level i = 2^i (root at level 0).\n4. Maximum nodes in binary tree of height h = 2^(h+1) - 1.\n5. Minimum height of binary tree with n nodes = floor(log2(n)).',
        formula: 'n = n0 + n1 + n2  ==>  Edges E = n - 1  ==>  n2 = n0 - 1',
        examTip: 'In GATE, questions often hide n1 (single child nodes). Note that n2 depends solely on n0 regardless of how many n1 nodes exist!'
      },
      {
        heading: 'BST Construction & Traversal Invariants',
        content: '• Inorder traversal of ANY Binary Search Tree always yields elements in strictly sorted ascending order.\n• To reconstruct a UNIQUE binary tree, Inorder traversal is MANDATORY along with either Preorder or Postorder.\n• For a BST, only Preorder OR only Postorder is sufficient to reconstruct the tree (since Inorder is implicitly sorted).',
        keyPoints: [
          'Number of structurally unique BSTs with n distinct keys = Catalan Number C(n) = (2n)! / ((n+1)! * n!)',
          'Height of AVL tree with n nodes: h < 1.44 * log2(n + 2) - 0.328',
          'Minimum nodes in AVL tree of height h: N(h) = N(h-1) + N(h-2) + 1 (with N(0)=1, N(1)=2)'
        ]
      }
    ]
  },
  {
    id: 'note-os-sync',
    examId: 'gate',
    subjectId: 'gate-os',
    chapterId: 'gate-os-sync',
    chapterName: 'Process Synchronization',
    subjectName: 'Operating Systems',
    title: 'Critical Section Criteria & Semaphore Cheat Sheet',
    readTime: '7 min read',
    isBookmarked: false,
    sections: [
      {
        heading: 'The 3 Critical Section Criteria',
        content: 'To prevent race conditions, any valid critical section solution MUST satisfy:\n1. Mutual Exclusion (Primary): No two processes can be inside CS at the same time.\n2. Progress (Primary): Only processes interested in entering CS participate in deciding who enters, and decision cannot be postponed indefinitely.\n3. Bounded Waiting (Secondary): Limit on number of times other processes are allowed to enter after a request has been made.',
        examTip: 'GATE Questions check: Does the code violate Mutual Exclusion or cause Deadlock? To test progress, check if one process outside CS can block the other.'
      },
      {
        heading: 'Counting Semaphores vs Binary Semaphores',
        content: '• P(S) or wait(S): while(S <= 0); S--; (Blocks if resource unavailable)\n• V(S) or signal(S): S++; (Wakes up a sleeping process)',
        formula: 'Final Value = Initial Value - Successful P() + Completed V()'
      }
    ]
  },
  {
    id: 'note-jee-calc',
    examId: 'jee',
    subjectId: 'jee-maths',
    chapterId: 'jee-maths-calc',
    chapterName: 'Definite Integration',
    subjectName: 'Mathematics',
    title: 'King\'s Rule & Leibniz Integral Rule Quick Notes',
    readTime: '5 min read',
    isBookmarked: true,
    sections: [
      {
        heading: 'King\'s Property & Periodic Integrals',
        content: 'Integral from a to b of f(x) dx = Integral from a to b of f(a + b - x) dx.\nUseful for cancelling out difficult numerators like x, sin(x), or e^x in fractional integrands.',
        formula: 'I = int_a^b f(x) dx = int_a^b f(a + b - x) dx  ==>  2I = int_a^b [f(x) + f(a + b - x)] dx',
        examTip: 'Whenever you see an x in the numerator multiplied by a symmetric trigonometric expression, apply King\'s Rule immediately!'
      }
    ]
  },
  {
    id: 'note-neet-genetics',
    examId: 'neet',
    subjectId: 'neet-bio',
    chapterId: 'neet-bio-genetics',
    chapterName: 'Principles of Inheritance',
    subjectName: 'Biology',
    title: 'Mendelian Ratios & Chromosomal Aberrations',
    readTime: '8 min read',
    isBookmarked: true,
    sections: [
      {
        heading: 'Crucial Genetic Cross Ratios',
        content: '• Monohybrid F2 Phenotypic: 3:1 | Genotypic: 1:2:1\n• Incomplete Dominance (Mirabilis jalapa): Phenotypic 1:2:1 (Red : Pink : White)\n• Dihybrid F2 Phenotypic: 9:3:3:1\n• Dihybrid Test Cross Ratio: 1:1:1:1',
        examTip: 'NEET trick: Test cross always crosses the unknown genotype with homozygous recessive parent!'
      }
    ]
  }
];

export const SAMPLE_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-gate-full-1',
    examId: 'gate',
    title: 'GATE CS 2025 Full Length Mock Test 01',
    type: 'Full Mock',
    durationMinutes: 180,
    totalQuestions: 5,
    totalMarks: 7,
    positiveMarks: 1,
    negativeMarks: 0.33,
    questions: SAMPLE_PYQS.filter(q => q.examId === 'gate')
  },
  {
    id: 'mock-gate-speed-dsa',
    examId: 'gate',
    title: 'DSA & Algorithms Rapid Speed Test',
    type: 'Speed Test',
    subject: 'Data Structures & Algorithms',
    durationMinutes: 30,
    totalQuestions: 4,
    totalMarks: 5,
    positiveMarks: 1,
    negativeMarks: 0.33,
    questions: SAMPLE_PYQS.filter(q => q.examId === 'gate')
  },
  {
    id: 'mock-jee-full-1',
    examId: 'jee',
    title: 'JEE Main 2025 Simulator Test Series 1',
    type: 'Full Mock',
    durationMinutes: 180,
    totalQuestions: 2,
    totalMarks: 8,
    positiveMarks: 4,
    negativeMarks: 1,
    questions: SAMPLE_PYQS.filter(q => q.examId === 'jee')
  },
  {
    id: 'mock-neet-full-1',
    examId: 'neet',
    title: 'NEET 2025 High-Yield Mock Test 1',
    type: 'Full Mock',
    durationMinutes: 200,
    totalQuestions: 2,
    totalMarks: 8,
    positiveMarks: 4,
    negativeMarks: 1,
    questions: SAMPLE_PYQS.filter(q => q.examId === 'neet')
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Day 1 Discipline',
    description: 'Start your study streak and complete your first goal.',
    icon: 'Flame',
    isUnlocked: true,
    unlockedAt: '2026-11-15',
    xpReward: 50,
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'ach-2',
    title: 'PYQ Crusher',
    description: 'Solve 10 Previous Year Questions across subjects.',
    icon: 'CheckCircle2',
    isUnlocked: false,
    xpReward: 100,
    progress: 4,
    maxProgress: 10
  },
  {
    id: 'ach-3',
    title: 'Deep Focus Master',
    description: 'Clock in 120 minutes of uninterrupted Focus Mode.',
    icon: 'Timer',
    isUnlocked: false,
    xpReward: 150,
    progress: 50,
    maxProgress: 120
  },
  {
    id: 'ach-4',
    title: 'Mock Test Warrior',
    description: 'Submit your first full-length mock test and review the scorecard.',
    icon: 'Trophy',
    isUnlocked: false,
    xpReward: 200,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'ach-5',
    title: '7-Day Unstoppable',
    description: 'Maintain a 7-day continuous study streak.',
    icon: 'Zap',
    isUnlocked: false,
    xpReward: 300,
    progress: 4,
    maxProgress: 7
  }
];
