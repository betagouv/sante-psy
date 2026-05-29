import { validationResult } from 'express-validator';
import { checkIne } from '../../controllers/validators/common';
import { expect } from 'chai';

const runValidator = async (value: unknown) => {
  const req = { body: { ine: value } };
  await checkIne.run(req);
  return validationResult(req);
};

const ineTestCases: {
  input: unknown;
  isValid: boolean;
  description: string;
}[] = [
  // ─── Vide / absent ────────────────────────────────────────────────────────
  { input: '', isValid: false, description: 'chaîne vide' },
  {
    input: '   ',
    isValid: false,
    description: 'espaces uniquement',
  },
  { input: null, isValid: false, description: 'null' },
  { input: undefined, isValid: false, description: 'undefined' },

  // ─── Format complètement invalide ────────────────────────────────────────
  { input: 'INVALID', isValid: false, description: 'texte trop court' },
  {
    input: 'INVALID123',
    isValid: false,
    description: 'texte aléatoire sans pattern',
  },
  { input: '12345', isValid: false, description: 'trop court (5 chars)' },
  {
    input: '123456789ABCD',
    isValid: false,
    description: 'trop long (13 chars)',
  },
  { input: '123456789@#', isValid: false, description: 'caractères spéciaux' },
  { input: '12345 6789AB', isValid: false, description: 'espace au milieu' },
  {
    input: '  123456789AB',
    isValid: true,
    description: 'espaces en début (trim → valide si pattern ok)',
  },

  // ─── Injection / sécurité ─────────────────────────────────────────────────
  {
    input: '<script>alert(1)</script>',
    isValid: false,
    description: 'tentative XSS',
  },
  { input: "' OR '1'='1", isValid: false, description: 'injection SQL' },

  // ─── INE-RNIE : /^[0-9]{9}[A-HJK]{2}$/ ──────────────────────────────────
  // 9 chiffres + 2 lettres parmi A-H, J, K (sans I)
  {
    input: '123456789AB',
    isValid: true,
    description: '[RNIE] valide — 9 chiffres + AB',
  },
  {
    input: '000000000AH',
    isValid: true,
    description: '[RNIE] valide — lettres limites A et H',
  },
  {
    input: '123456789JK',
    isValid: true,
    description: '[RNIE] valide — lettres J et K',
  },
  {
    input: '123456789KA',
    isValid: true,
    description: '[RNIE] valide — K puis A',
  },
  {
    input: '123456789II',
    isValid: false,
    description: '[RNIE] invalide — I est exclu',
  },
  {
    input: '123456789AL',
    isValid: false,
    description: '[RNIE] invalide — L hors plage',
  },
  {
    input: '123456789ab',
    isValid: false,
    description: '[RNIE] invalide — minuscules',
  },
  {
    input: '12345678AB',
    isValid: false,
    description: '[RNIE] invalide — 8 chiffres seulement',
  },
  {
    input: '1234567890AB',
    isValid: false,
    description: '[RNIE] invalide — 10 chiffres (trop long)',
  },

  // ─── INE-BEA : /^\d{10}[A-HJ-NPR-Z]$/ ───────────────────────────────────
  // 10 chiffres + 1 lettre (sans I, O)
  {
    input: '1234567890A',
    isValid: true,
    description: '[BEA] valide — 10 chiffres + A',
  },
  {
    input: '1234567890Z',
    isValid: true,
    description: '[BEA] valide — lettre limite Z',
  },
  {
    input: '1234567890N',
    isValid: true,
    description: '[BEA] valide — N inclus',
  },
  {
    input: '1234567890R',
    isValid: true,
    description: '[BEA] valide — R inclus',
  },
  {
    input: '1234567890I',
    isValid: false,
    description: '[BEA] invalide — I exclu',
  },
  {
    input: '1234567890O',
    isValid: false,
    description: '[BEA] invalide — O exclu',
  },
  {
    input: '123456789A',
    isValid: false,
    description: '[BEA] invalide — 9 chiffres seulement',
  },

  // ─── INE-Base36 : /^[0-9A-Z]{10}\d$/ ────────────────────────────────────
  // 10 chars alphanumériques majuscules + 1 chiffre final
  {
    input: '12345678901',
    isValid: true,
    description: '[Base36] valide — 11 chiffres',
  },
  {
    input: 'A2B4C6D8E05',
    isValid: true,
    description: '[Base36] valide — mix lettres/chiffres + chiffre final',
  },
  {
    input: 'AAAAAAAAAA5',
    isValid: true,
    description: '[Base36] valide — 10 lettres + chiffre',
  },
  {
    input: 'a2b4c6d8e05',
    isValid: false,
    description: '[Base36] invalide — minuscules',
  },
  {
    input: 'A2B4C6D8E0A',
    isValid: false,
    description:
      '[Base36] invalide — lettre en position finale (doit être chiffre)',
  },

  // ─── INE-SIFA : /^\d{4}[A]\d{5}[A-HJ-NPR-Z]$/ ───────────────────────────
  // 4 chiffres + A + 5 chiffres + 1 lettre (sans I, O)
  {
    input: '1234A56789B',
    isValid: true,
    description: '[SIFA] valide — format standard',
  },
  {
    input: '0000A00000Z',
    isValid: true,
    description: '[SIFA] valide — lettres limites',
  },
  {
    input: '1234A56789N',
    isValid: true,
    description: '[SIFA] valide — N en finale',
  },
  {
    input: '1234B56789C',
    isValid: false,
    description: '[SIFA] invalide — B au lieu de A en position 5',
  },
  {
    input: '1234A56789I',
    isValid: false,
    description: '[SIFA] invalide — I exclu en finale',
  },
  {
    input: '1234A56789O',
    isValid: false,
    description: '[SIFA] invalide — O exclu en finale',
  },
  {
    input: '123A456789B',
    isValid: false,
    description: '[SIFA] invalide — A en position 4 au lieu de 5',
  },

  // ─── INE provisoire : /^\d{4}[D]\d{5}[A-HJ-NPR-Z]$/i ────────────────────
  // Même structure que SIFA mais avec D (insensible à la casse)
  {
    input: '1234D56789B',
    isValid: true,
    description: '[Provisoire] valide — D majuscule',
  },
  {
    input: '1234d56789B',
    isValid: true,
    description: '[Provisoire] valide — d minuscule (flag i)',
  },
  {
    input: '0000D00000A',
    isValid: true,
    description: '[Provisoire] valide — format minimal',
  },
  {
    input: '1234D56789I',
    isValid: false,
    description: '[Provisoire] invalide — I exclu en finale',
  },
  {
    input: '1234E56789B',
    isValid: false,
    description: '[Provisoire] invalide — E au lieu de D',
  },
  {
    input: '1234D5678B',
    isValid: false,
    description: '[Provisoire] invalide — 4 chiffres au lieu de 5 après D',
  },
];

describe('validateINE', () => {
  ineTestCases.forEach(({ input, isValid, description }) => {
    it(description, async () => {
      const result = await runValidator(input);
      expect(result.isEmpty()).to.equal(isValid);
    });
  });
});
