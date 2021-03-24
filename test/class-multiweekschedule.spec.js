const expect = require('chai').expect;
const assert = require('chai').assert;
const moment = require('moment');
const weekschedule = require('../weekschedule.js');

describe('Class MultiWeekSchedule', () => {

  var sampleSchedule = { A: { timeslots: 'ttt', lessons: 'lll' }, B: { timeslots: 'ttt', lessons: 'lll' } };

  describe('Constructor', () => {

    it('instantiate', () => {
      var sut = new weekschedule.MultiWeekSchedule(sampleSchedule, 'sss', 'ppp');

      expect(sut).to.not.be.undefined;
    });

    it('sets schedule', () => {
      var sut = new weekschedule.MultiWeekSchedule(sampleSchedule);

      expect(sut.schedule).to.equal(sampleSchedule);
    });

    it('sets startdate', () => {
      var sut = new weekschedule.MultiWeekSchedule(sampleSchedule, 'sss', 'ppp');

      expect(sut.startdate).to.equal('sss');
    });

    it('sets pattern', () => {
      var sut = new weekschedule.MultiWeekSchedule(sampleSchedule, 'sss', 'ppp');

      expect(sut.pattern).to.equal('ppp');
    });

    it('works with two parameters', () => {
      sut = new weekschedule.MultiWeekSchedule(sampleSchedule, 'sss');
      expect(sut.schedule).to.equal(sampleSchedule);
      expect(sut.startdate).to.equal('sss');
      expect(sut.pattern).to.be.undefined;
    });

    it('works with one parameter', () => {
      sut = new weekschedule.MultiWeekSchedule(sampleSchedule);
      expect(sut.schedule).to.equal(sampleSchedule);
      expect(sut.startdate).to.be.undefined;
      expect(sut.pattern).to.be.undefined;
    });

    it('works without parameter', () => {
      sut = new weekschedule.MultiWeekSchedule();
      expect(sut.schedule).to.be.undefined;
      expect(sut.startdate).to.be.undefined;
      expect(sut.pattern).to.be.undefined;
    });

  });

  describe('Properties', () => {
    var sut = new weekschedule.MultiWeekSchedule();

    it('should have property schedule', () => {
      expect(sut).to.have.property('schedule');
    });

    it('should have property startdate', () => {
      expect(sut).to.have.property('startdate');
    });

    it('should have property pattern', () => {
      expect(sut).to.have.property('pattern');
    });

    it('default value of schedule should be undefined', () => {
      expect(sut).to.have.property('schedule').which.is.undefined;
    });

    it('default value of startdate should be undefined', () => {
      expect(sut).to.have.property('startdate').which.is.undefined;
    });

    it('default value of pattern should be undefined', () => {
      expect(sut).to.have.property('pattern').which.is.undefined;
    });

    it('get/set schedule', () => {
      sut = new weekschedule.MultiWeekSchedule();
      sut.schedule = sampleSchedule;
      assert.equal(sut.schedule, sampleSchedule);
    });

    it('get/set startdate', () => {
      sut = new weekschedule.MultiWeekSchedule();
      sut.startdate = 'sss';
      assert.equal(sut.startdate, 'sss');
    });

    it('get/set pattern', () => {
      sut = new weekschedule.MultiWeekSchedule();
      sut.pattern = 'ppp';
      assert.equal(sut.pattern, 'ppp');
    });
  });

  describe('Methods', () => {

    var sampleSchedule = { 
      A: {
        timeslots: ['9:00', '10:00', '11:00'],
        lessons: {
          mon: ['Am', 'Ao', 'An'],
          tue: ['At', 'Au', 'Ae'],
          wed: ['Aw', 'Ae', 'Ad'],
          thu: ['At', 'Ah', 'Au'],
          fri: ['Af', 'Ar', 'Ai'],
          sat: ['As', 'Aa', 'At'],
          sun: ['As', 'Au', 'An'] }
      },
      B: {
        timeslots: ['19:00', '20:00', '21:00'],
        lessons: {
          mon: ['Bm', 'Bo', 'Bn'],
          tue: ['Bt', 'Bu', 'Be'],
          wed: ['Bw', 'Be', 'Bd'],
          thu: ['Bt', 'Bh', 'Bu'],
          fri: ['Bf', 'Br', 'Bi'],
          sat: ['Bs', 'Ba', 'Bt'],
          sun: ['Bs', 'Bu', 'Bn'] }
      }
    };

    it('checkParametersMsg()', () => {

      // all settings defined
      sut = new weekschedule.MultiWeekSchedule(sampleSchedule, 'sss', 'ppp');
      assert.equal(sut.checkParametersMsg(), undefined);

      // one setting is missing
      sut.schedule = undefined;
      sut.startdate = 'sss';
      sut.pattern = 'ppp';
      assert.equal(sut.checkParametersMsg(), 'no schedule defined');

      sut.schedule = sampleSchedule;
      sut.startdate = undefined;
      sut.pattern = 'ppp';
      assert.equal(sut.checkParametersMsg(), 'no startdate defined');

      sut.schedule = sampleSchedule;
      sut.startdate = 'sss';
      sut.pattern = undefined;
      assert.equal(sut.checkParametersMsg(), 'no weekpattern defined');

      // all settings are missing
      sut.schedule = undefined;
      sut.startdate = undefined;
      sut.pattern = undefined;
      assert.equal(sut.checkParametersMsg(), 'no schedule defined');
    });

    it('getTodaysLessons() returns undefined before start of pattern', () => {
      var date = moment('2021-03-22');
      var sut = new weekschedule.MultiWeekSchedule();

      sut.schedule = sampleSchedule;
      sut.startdate = date;
      sut.pattern = 'AB';

      let yesterday = moment(date).add(-1, 'days');

      expect(sut.getTodaysLessons(yesterday)).to.be.undefined;
    });

    it('getTodaysLessons() returns correct values A/B weeks', () => {
      var startdate = moment('2021-03-23'); 
      var sut = new weekschedule.MultiWeekSchedule();

      sut.schedule = sampleSchedule;
      sut.startdate = startdate;
      sut.pattern = 'AB';

      // Calculation uses the week of the year. This in turn depends on the locale, see
      // https://momentjs.com/docs/#/get-set/week/ for details. Therefore we set the 
      // locale and 

      // checking different locales ...
      let locales = ['en-us', 'de', 'fr', 'zh-cn'];

      locales.forEach(locale => {
        startdate.locale(locale);

        // ... several times the week pattern 'AB'  ...
        let weeks = ['A', 'B', 'A', 'B', 'A']; 
        let checkdate = 
          moment(startdate) // start from a copy of startdate
            .add(1, 'month') // go well past the start date (avoids conflicts when switching locales)
            .startOf('week') // start at beginning of the week as defined by this locale
            .add(-1, 'days'); // -1d will be incremented again in loop

        weeks.forEach(week => {

          // ... seven days per week ...
          for (let d = 0; d < 7; d++) {     
            checkdate = checkdate.add(1, 'days');     
            let result = sut.getTodaysLessons(checkdate);

            // console.log(locale + " - " + checkdate.format("ddd, YYYY-MM-DD") + " - " + week + " - " + result);
            expect(result).to.be.not.undefined;
            expect(result).to.have.length(3);

            // ... three lessons per day.
            for (let n = 0; n < 3; n++) {
              let dow = checkdate.locale('en').format('ddd').toLowerCase();

              expect(week + dow[n]).to.equal(sampleSchedule[week].lessons[dow][n]);
            }
          }
        });
      });
    });

    it('getTodaysTimeslots()', () => {
      var startdate = moment('2021-03-22').locale('de'); // date is a Monday and start of week in DE
      
      var sut = new weekschedule.MultiWeekSchedule();

      sut.schedule = sampleSchedule;
      sut.startdate = startdate;
      sut.pattern = 'AB';

      // Check several times the week pattern 'AB' ...
      let weeks = ['A', 'B', 'A', 'B', 'A']; 
      let checkdate = moment(startdate).startOf('week').add(-1, 'days'); // -1 will be incremented in loop

      weeks.forEach(week => {
        // ... seven days per week
        for (let day = 0; day < 7; day++) {     
          checkdate = checkdate.add(1, 'days');     
          let result = sut.getTodaysTimeslots(checkdate);

          expect(result).to.be.not.undefined;
          expect(result).to.have.length(3);
          expect(result).to.equal(sampleSchedule[week].timeslots);
        }
      });
    });
  });
});