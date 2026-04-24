export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  position: string;
  department: string;
  hireDate: string;
  payrollId: string;
  lastVisit: string;
  status: 'Active' | 'Archived';
  avatar: string;
  vaccines: number;
  consultations: number;
}

export interface Consultation {
  id: string;
  employeeId: string;
  employeeName: string;
  doctor: string;
  date: string;
  time: string;
  type: 'Embauche' | 'Périodique' | 'Reprise' | 'Soin' | 'Spontanée';
  conclusion: 'Apte' | 'Apte avec restrictions' | 'Inapte temporaire' | 'À revoir';
  weight?: number;
  bp?: string;
}

export interface Drug {
  set_id: string;
  drug_name: string;
  generic_name: string;
  dosage: string;
  indications: string;
  sicknesses: string[];
  image_lookup_url: string;
  category: 'Antibiotic' | 'Analgesic' | 'Respiratory' | 'Cardiovascular' | 'Gastric' | 'Vitamin';
}

export interface AuditEvent {
  id: string;
  actor: string;
  actorRole: 'admin' | 'coordinatrice' | 'doctor' | 'system';
  action: string;
  target: string;
  ip: string;
  time: string;
  level: 'ok' | 'warn' | 'danger';
}

export const EMPLOYEES: Employee[] = [
  { id: 'EMP-1042', firstName: 'Pierre', lastName: 'Mercier', birthDate: '1984-06-12', position: 'Chef d\'équipe', department: 'Operations', hireDate: '2019-03-04', payrollId: 'PAY-7821', lastVisit: '2025-04-02', status: 'Active', vaccines: 4, consultations: 6,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-0871', firstName: 'Naima', lastName: 'Khelifa', birthDate: '1990-11-23', position: 'Ingénieure QA', department: 'R&D', hireDate: '2021-09-15', payrollId: 'PAY-6612', lastVisit: '2025-09-10', status: 'Active', vaccines: 5, consultations: 3,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-0322', firstName: 'Tomas', lastName: 'Reyes', birthDate: '1978-02-01', position: 'Cariste', department: 'Logistics', hireDate: '2014-06-20', payrollId: 'PAY-3201', lastVisit: '2024-11-18', status: 'Active', vaccines: 6, consultations: 12,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-0450', firstName: 'Sofia', lastName: 'Andersen', birthDate: '1992-07-30', position: 'Comptable', department: 'Finance', hireDate: '2020-01-10', payrollId: 'PAY-4502', lastVisit: '2025-02-22', status: 'Active', vaccines: 4, consultations: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-0612', firstName: 'Yara', lastName: 'Haddad', birthDate: '1986-03-19', position: 'Technicienne', department: 'Operations', hireDate: '2017-08-01', payrollId: 'PAY-6120', lastVisit: '2025-08-05', status: 'Active', vaccines: 5, consultations: 7,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-1188', firstName: 'Marc', lastName: 'Lefèvre', birthDate: '1975-12-04', position: 'Responsable site', department: 'Operations', hireDate: '2010-05-12', payrollId: 'PAY-1188', lastVisit: '2025-01-15', status: 'Active', vaccines: 6, consultations: 14,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-0907', firstName: 'Camille', lastName: 'Beaulieu', birthDate: '1995-08-16', position: 'Designer UX', department: 'R&D', hireDate: '2022-11-02', payrollId: 'PAY-9077', lastVisit: '2024-09-30', status: 'Active', vaccines: 3, consultations: 2,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-0654', firstName: 'Hugo', lastName: 'Martin', birthDate: '1988-04-09', position: 'Magasinier', department: 'Logistics', hireDate: '2016-02-14', payrollId: 'PAY-6543', lastVisit: '2025-07-12', status: 'Active', vaccines: 4, consultations: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-0233', firstName: 'Elena',  lastName: 'Rossi', birthDate: '1991-10-25', position: 'Acheteuse', department: 'Finance', hireDate: '2018-09-01', payrollId: 'PAY-2330', lastVisit: '2025-03-19', status: 'Active', vaccines: 5, consultations: 4,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80' },
  { id: 'EMP-0099', firstName: 'Liam',   lastName: 'O\'Connor', birthDate: '1982-01-08', position: 'Soudeur', department: 'Operations', hireDate: '2012-06-06', payrollId: 'PAY-0099', lastVisit: '2023-11-04', status: 'Archived', vaccines: 4, consultations: 9,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80' },
];

export const CONSULTATIONS: Consultation[] = [
  { id: 'C-2401', employeeId: 'EMP-1042', employeeName: 'Pierre Mercier',  doctor: 'Dr. Dubois',  date: '2026-04-23', time: '09:00', type: 'Embauche',  conclusion: 'Apte',  weight: 82, bp: '125/80' },
  { id: 'C-2402', employeeId: 'EMP-0871', employeeName: 'Naima Khelifa',   doctor: 'Dr. Okafor',  date: '2026-04-23', time: '09:45', type: 'Périodique', conclusion: 'Apte',  weight: 64, bp: '118/76' },
  { id: 'C-2403', employeeId: 'EMP-0322', employeeName: 'Tomas Reyes',     doctor: 'Dr. Dubois',  date: '2026-04-23', time: '10:30', type: 'Soin',      conclusion: 'À revoir', weight: 91, bp: '142/88' },
  { id: 'C-2404', employeeId: 'EMP-0450', employeeName: 'Sofia Andersen',  doctor: 'Dr. Okafor',  date: '2026-04-23', time: '11:15', type: 'Reprise',    conclusion: 'Apte avec restrictions', weight: 58, bp: '110/72' },
  { id: 'C-2405', employeeId: 'EMP-0612', employeeName: 'Yara Haddad',     doctor: 'Dr. Okafor',  date: '2026-04-23', time: '14:15', type: 'Périodique', conclusion: 'Apte',  weight: 67, bp: '120/78' },
  { id: 'C-2398', employeeId: 'EMP-1188', employeeName: 'Marc Lefèvre',    doctor: 'Dr. Dubois',  date: '2026-04-21', time: '15:00', type: 'Périodique', conclusion: 'Apte avec restrictions', weight: 88, bp: '138/86' },
  { id: 'C-2395', employeeId: 'EMP-0907', employeeName: 'Camille Beaulieu',doctor: 'Dr. Dubois',  date: '2026-04-19', time: '11:30', type: 'Spontanée',  conclusion: 'Apte',  weight: 60, bp: '115/74' },
  { id: 'C-2392', employeeId: 'EMP-0233', employeeName: 'Elena Rossi',     doctor: 'Dr. Okafor',  date: '2026-04-17', time: '09:30', type: 'Périodique', conclusion: 'Apte',  weight: 62, bp: '116/75' },
];

export const DRUGS: Drug[] = [
  { set_id: 'DRG-001', drug_name: 'Carbocistéine 5%', generic_name: 'Carbocistéine', dosage: '5% sirop, 200ml', indications: 'Troubles de l\'expectoration des affections bronchiques aiguës.', sicknesses: ['toux grasse','bronchite','expectoration'], category: 'Respiratory',
    image_lookup_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-002', drug_name: 'Acétylcystéine', generic_name: 'Acétylcystéine', dosage: '200 mg sachet', indications: 'Fluidifiant bronchique, mucolytique.', sicknesses: ['toux grasse','bronchite','BPCO'], category: 'Respiratory',
    image_lookup_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-003', drug_name: 'Doliprane', generic_name: 'Paracétamol', dosage: '500 mg / 1000 mg cp', indications: 'Douleurs légères à modérées, fièvre.', sicknesses: ['fièvre','douleur','céphalée','grippe'], category: 'Analgesic',
    image_lookup_url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-004', drug_name: 'Ibuprofène', generic_name: 'Ibuprofène', dosage: '400 mg cp', indications: 'Anti-inflammatoire non stéroïdien — douleurs et inflammation.', sicknesses: ['douleur','inflammation','arthrose'], category: 'Analgesic',
    image_lookup_url: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-005', drug_name: 'Amoxicilline', generic_name: 'Amoxicilline', dosage: '500 mg gél / 1g cp', indications: 'Antibiotique β-lactamine, infections ORL et respiratoires.', sicknesses: ['angine','sinusite','otite'], category: 'Antibiotic',
    image_lookup_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-006', drug_name: 'Amoxicilline + Acide clavulanique', generic_name: 'Amoxicilline/Clav.', dosage: '875mg/125mg cp', indications: 'Antibiotique large spectre.', sicknesses: ['infection respiratoire','sinusite'], category: 'Antibiotic',
    image_lookup_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-007', drug_name: 'Inexium', generic_name: 'Esoméprazole', dosage: '20 mg / 40 mg cp', indications: 'IPP — reflux gastro-œsophagien, ulcères.', sicknesses: ['RGO','gastrite','ulcère'], category: 'Gastric',
    image_lookup_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-008', drug_name: 'Loxen LP', generic_name: 'Nicardipine', dosage: '50 mg LP', indications: 'Inhibiteur calcique — hypertension artérielle.', sicknesses: ['hypertension','HTA'], category: 'Cardiovascular',
    image_lookup_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-009', drug_name: 'Ramipril', generic_name: 'Ramipril', dosage: '5 mg / 10 mg cp', indications: 'IEC — hypertension, insuffisance cardiaque.', sicknesses: ['hypertension','insuffisance cardiaque'], category: 'Cardiovascular',
    image_lookup_url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-010', drug_name: 'Vitamine D3', generic_name: 'Cholécalciférol', dosage: '100 000 UI ampoule', indications: 'Carence en vitamine D.', sicknesses: ['carence vitaminique','ostéoporose'], category: 'Vitamin',
    image_lookup_url: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-011', drug_name: 'Tramadol', generic_name: 'Tramadol', dosage: '50 mg gél', indications: 'Antalgique de palier 2.', sicknesses: ['douleur intense'], category: 'Analgesic',
    image_lookup_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80' },
  { set_id: 'DRG-012', drug_name: 'Ventoline', generic_name: 'Salbutamol', dosage: '100 µg/dose aérosol', indications: 'Bronchodilatateur — crise d\'asthme.', sicknesses: ['asthme','BPCO'], category: 'Respiratory',
    image_lookup_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=200&q=80' },
];

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'A-9001', actor: 'Camille Dubois', actorRole: 'doctor',        action: 'Consultation dossier', target: 'EMP-1042 Pierre Mercier',  ip: '10.4.12.88',  time: '23/04 09:02', level: 'ok' },
  { id: 'A-9002', actor: 'Léa Bernard',    actorRole: 'coordinatrice', action: 'Modification dossier', target: 'EMP-0871 Naima Khelifa',   ip: '10.4.12.41',  time: '23/04 09:14', level: 'ok' },
  { id: 'A-9003', actor: 'system',         actorRole: 'system',        action: 'Permission refusée — export', target: 'EMP-0322 Tomas Reyes', ip: '10.4.12.41', time: '23/04 09:55', level: 'warn' },
  { id: 'A-9004', actor: 'Idris Okafor',   actorRole: 'doctor',        action: 'Création vaccination',  target: 'EMP-0322 Tomas Reyes',   ip: '10.4.12.92', time: '23/04 10:33', level: 'ok' },
  { id: 'A-9005', actor: 'Margaux Laurent',actorRole: 'admin',         action: 'Invitation utilisateur', target: 'aria.nakamura@medzoon.health', ip: '10.4.12.4', time: '23/04 11:02', level: 'ok' },
  { id: 'A-9006', actor: 'Léa Bernard',    actorRole: 'coordinatrice', action: 'Création dossier',     target: 'EMP-1190 Sami Aït',      ip: '10.4.12.41',  time: '23/04 11:25', level: 'ok' },
  { id: 'A-9007', actor: 'system',         actorRole: 'system',        action: 'Échec connexion (3x)', target: 'unknown@medzoon.health', ip: '94.21.66.18', time: '23/04 12:01', level: 'danger' },
  { id: 'A-9008', actor: 'Camille Dubois', actorRole: 'doctor',        action: 'Export PDF rapport',   target: 'EMP-0871 Naima Khelifa', ip: '10.4.12.88', time: '23/04 13:14', level: 'ok' },
  { id: 'A-9009', actor: 'Margaux Laurent',actorRole: 'admin',         action: 'Sauvegarde lancée',    target: 'Snapshot quotidien',     ip: '10.4.12.4',   time: '23/04 13:30', level: 'ok' },
  { id: 'A-9010', actor: 'Léa Bernard',    actorRole: 'coordinatrice', action: 'Rappel manuel envoyé', target: '12 employés (Tdap)',     ip: '10.4.12.41',  time: '23/04 14:05', level: 'ok' },
];

export const SCHEDULE_WEEK = [
  { day: 'Lun 21', date: '2026-04-21', visits: [
    { time: '09:00', name: 'Marc Lefèvre',   type: 'Périodique', doctor: 'Dr. Dubois', status: 'Done' },
    { time: '10:00', name: 'Hugo Martin',    type: 'Embauche',   doctor: 'Dr. Okafor', status: 'Done' },
  ]},
  { day: 'Mar 22', date: '2026-04-22', visits: [
    { time: '08:30', name: 'Elena Rossi',    type: 'Périodique', doctor: 'Dr. Dubois', status: 'Done' },
    { time: '11:00', name: 'Pierre Mercier', type: 'Reprise',    doctor: 'Dr. Okafor', status: 'Done' },
    { time: '14:00', name: 'Sami Aït',       type: 'Embauche',   doctor: 'Dr. Dubois', status: 'Done' },
  ]},
  { day: 'Mer 23', date: '2026-04-23', visits: [
    { time: '09:00', name: 'Pierre Mercier', type: 'Embauche',   doctor: 'Dr. Dubois', status: 'Done' },
    { time: '09:45', name: 'Naima Khelifa',  type: 'Périodique', doctor: 'Dr. Okafor', status: 'Done' },
    { time: '10:30', name: 'Tomas Reyes',    type: 'Soin',       doctor: 'Dr. Dubois', status: 'Now' },
    { time: '11:15', name: 'Sofia Andersen', type: 'Reprise',    doctor: 'Dr. Okafor', status: 'Upcoming' },
    { time: '14:15', name: 'Yara Haddad',    type: 'Périodique', doctor: 'Dr. Okafor', status: 'Upcoming' },
  ]},
  { day: 'Jeu 24', date: '2026-04-24', visits: [
    { time: '09:30', name: 'Camille Beaulieu',type: 'Spontanée', doctor: 'Dr. Dubois', status: 'Upcoming' },
    { time: '11:00', name: 'Liam O\'Connor', type: 'Reprise',    doctor: 'Dr. Okafor', status: 'Upcoming' },
  ]},
  { day: 'Ven 25', date: '2026-04-25', visits: [
    { time: '08:30', name: 'Marc Lefèvre',   type: 'Soin',       doctor: 'Dr. Dubois', status: 'Upcoming' },
  ]},
];
