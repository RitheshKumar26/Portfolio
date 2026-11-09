export interface Certificate {
  id: string;
  name: string;
  code: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  verificationUrl: string;
  sha256: string;
  skills: string[];
}

export const certificates: Certificate[] = [
  {
    id: 'sec-plus',
    name: 'CompTIA Security+',
    code: 'SY0-701',
    issuer: 'CompTIA',
    issueDate: '2024',
    expiryDate: '2027',
    credentialId: 'COMP001021948',
    verificationUrl: 'https://www.credly.com/',
    sha256: '9a3f7b2c0184e921d782bc4e5f019a28c34512e088ba7610',
    skills: ['Network Security', 'Threat Hunting', 'Vulnerability Mgmt', 'Cryptography']
  },
  {
    id: 'ejpt',
    name: 'eJPTv2 - Junior Penetration Tester',
    code: 'eJPTv2',
    issuer: 'INE Security',
    issueDate: '2024',
    expiryDate: 'Non-Expiring',
    credentialId: 'INE-EJPT-849201',
    verificationUrl: 'https://www.ine.com/',
    sha256: '8b12f734a991c0e8234db0299f1283e7456bc91001dfa234',
    skills: ['Network Reconnaissance', 'Host Auditing', 'Exploitation', 'Web App Pentesting']
  },
  {
    id: 'ceh',
    name: 'Certified Ethical Hacker (CEH)',
    code: 'v12',
    issuer: 'EC-Council',
    issueDate: '2024',
    expiryDate: '2027',
    credentialId: 'ECC-91823746',
    verificationUrl: 'https://aspen.eccouncil.org/Verify',
    sha256: 'c4981d0092fa8b12e45609312bc88190de4568912301fa77',
    skills: ['Attack Surface Analysis', 'Malware Analysis', 'Sniffing & Evasion', 'System Hacking']
  },
  {
    id: 'google-sec',
    name: 'Google Cybersecurity Professional',
    code: 'GCP-SEC',
    issuer: 'Google',
    issueDate: '2023',
    expiryDate: 'Non-Expiring',
    credentialId: 'GCP-SEC-582910',
    verificationUrl: 'https://www.coursera.org/verify/',
    sha256: '14f09238bc8901de78234bc5678912ef0129384756abcdef',
    skills: ['SIEM & Packet Analysis', 'Python & Bash', 'Linux Security', 'Incident Response']
  }
];
