import { expect } from 'chai';
import sinon from 'sinon';
import { DossierState } from '../types/DossierState';
import * as updatePsyFields from '../services/updatePsyFields';
import clean from './helper/clean';

describe('Update psy fields', () => {
  describe('addFrenchLanguageIfMissing', () => {
    it('should return Français if input is undefined', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing(undefined);
      expect(result).to.eql('Français');
    });

    it('should return Français if input is null', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing(null);
      expect(result).to.eql('Français');
    });

    it('should return Français if input is empty', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing('');
      expect(result).to.eql('Français');
    });

    it('should return Français if input contains only spaces', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing('  ');
      expect(result).to.eql('Français');
    });

    it('should add Français if input does not contains it', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing('Anglais');
      expect(result).to.eql('Français, Anglais');
    });

    it('should not add Français if input contains it', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing('Français, Anglais');
      expect(result).to.eql('Français, Anglais');
    });

    it('should not add Français if input contains it (lower case)', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing('français, anglais');
      expect(result).to.eql('français, anglais');
    });

    it('should not add Français if input contains it (no special char)', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing('francais, anglais');
      expect(result).to.eql('francais, anglais');
    });

    it('should not add Français if input contains it (no specific order)', async () => {
      const result = updatePsyFields.addFrenchLanguageIfMissing('Espagnol Francais Anglais');
      expect(result).to.eql('Espagnol Francais Anglais');
    });
  });

  describe('fields', () => {
    let addFrenchLanguageIfMissingStub;
    beforeEach(() => {
      addFrenchLanguageIfMissingStub = sinon.stub(updatePsyFields, 'addFrenchLanguageIfMissing')
        .returnsArg(0);
    });

    afterEach(() => {
      addFrenchLanguageIfMissingStub.restore();
    });

    it('Editable psy fields should add french language', () => {
      const psy = clean.getOnePsy();
      psy.languages = 'random stuff';

      updatePsyFields.editablePsyFields(psy);
      sinon.assert.calledWith(addFrenchLanguageIfMissingStub, psy.languages);
    });

    it('Editable and non editable fields should not overlap', () => {
      const creationDate : Date = new Date('2019,01,02, 12,34,56');
      const psy = {
        email: 'email',
        address: 'adress',
        departement: 'departement',
        region: 'region',
        phone: 'phone',
        website: 'website',
        description: 'description',
        teleconsultation: true,
        languages: 'francais',
        personalEmail: 'personalEmail',
        firstNames: 'firstNames',
        lastName: 'lastName',
        archived: true,
        state: DossierState.accepte,
        training: 'training',
        adeli: 'adeli',
        diploma: 'diploma',
        dossierNumber: 'dossierNumber',
        assignedUniversityId: 'assignedUniversityId',
        isConventionSigned: true,
        selfModified: true,
        active: true,
        inactiveUntil: new Date(),
        createdAt: creationDate,
      };

      const editablePsy = updatePsyFields.editablePsyFields(psy);
      const nonEditablePsy = updatePsyFields.nonEditablePsyFields(psy);

      Object.keys(editablePsy).forEach((key) => {
        expect(editablePsy[key]).to.equal(psy[key]);
        expect(nonEditablePsy).to.not.have.own.property(key);
      });

      Object.keys(nonEditablePsy).forEach((key) => {
        expect(nonEditablePsy[key]).to.equal(psy[key]);
        expect(editablePsy).to.not.have.own.property(key);
      });

      ['dossierNumber',
        'assignedUniversityId',
        'isConventionSigned',
        'selfModified',
        'active',
        'inactiveUntil',
      ].forEach((key) => {
        expect(editablePsy).to.not.have.own.property(key);
        expect(nonEditablePsy).to.not.have.own.property(key);
      });
    });
  });
});
