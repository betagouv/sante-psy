import { expect } from 'chai';
import sinon from 'sinon';
import { DossierState } from '../../types/DemarcheSimplifiee';
import { addFrenchLanguageIfMissing, editablePsyFields, nonEditablePsyFields } from '../../services/updatePsyFields';

describe('Update psy fields', () => {
  describe('addFrenchLanguageIfMissing', () => {
    it('should return Français if input is undefined', async () => {
      const result = addFrenchLanguageIfMissing(undefined);
      expect(result).to.eql('Français');
    });

    it('should return Français if input is null', async () => {
      const result = addFrenchLanguageIfMissing(null);
      expect(result).to.eql('Français');
    });

    it('should return Français if input is empty', async () => {
      const result = addFrenchLanguageIfMissing('');
      expect(result).to.eql('Français');
    });

    it('should return Français if input contains only spaces', async () => {
      const result = addFrenchLanguageIfMissing('  ');
      expect(result).to.eql('Français');
    });

    it('should add Français if input does not contains it', async () => {
      const result = addFrenchLanguageIfMissing('Anglais');
      expect(result).to.eql('Français, Anglais');
    });

    it('should not add Français if input contains it', async () => {
      const result = addFrenchLanguageIfMissing('Français, Anglais');
      expect(result).to.eql('Français, Anglais');
    });

    it('should not add Français if input contains it (lower case)', async () => {
      const result = addFrenchLanguageIfMissing('français, anglais');
      expect(result).to.eql('français, anglais');
    });

    it('should not add Français if input contains it (no special char)', async () => {
      const result = addFrenchLanguageIfMissing('francais, anglais');
      expect(result).to.eql('francais, anglais');
    });

    it('should not add Français if input contains it (no specific order)', async () => {
      const result = addFrenchLanguageIfMissing('Espagnol Francais Anglais');
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
      const psy = {
        languages: 'random stuff',
      };

      editablePsyFields(psy[0]);
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
        inactiveUntil: 'inactiveUntil',
        updatedAt: null,
        createdAt: creationDate,
      };

      const editablePsy = editablePsyFields(psy);
      const nonEditablePsy = nonEditablePsyFields(psy);

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
