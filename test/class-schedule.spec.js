const expect = require('chai').expect;
const assert = require('chai').assert;
const moment = require('moment');

const weekschedule = require('../weekschedule.js');

describe('Class Schedule', () => {

  var sampleSchedule = { timeslots: 'ttt', lessons: 'lll' };

  describe('Constructor', () => {

    it('instantiate', () => {
      var sut = new weekschedule.Schedule(sampleSchedule); 

      expect(sut).to.not.be.undefined;
    });

    it('sets schedule', () => {
      var sut = new weekschedule.Schedule(sampleSchedule); 

      expect(sut.schedule).to.equal(sampleSchedule);
    });

    it('works without parameter', () => {
      sut = new weekschedule.Schedule();
      expect(sut.timeslots).to.be.undefined;
      expect(sut.lessons).to.be.undefined;
    });
  });

  describe('Properties', () => {
    var sut = new weekschedule.Schedule(); 

    it('should have property schedule', () => {
      expect(sut).to.have.property('schedule');
    });

    it('default value of schedule should be undefined', () => {
      expect(sut).to.have.property('schedule').which.is.undefined;
    });

    it('get/set schedule', () => {
      sut = new weekschedule.Schedule();
      sut.timeslots = sampleSchedule;
      assert.equal(sut.timeslots, sampleSchedule);
    });
  });  

  describe('Methods', () => {
    
    it('checkParametersMsg()', () => {

      // schedule defined
      sut = new weekschedule.Schedule(sampleSchedule);
      assert.equal(sut.checkParametersMsg(), undefined);

      // schedule missing
      sut = new weekschedule.Schedule();
      assert.equal(sut.checkParametersMsg(), 'no schedule defined');
    });

    it('getTodaysLessons()', () => {
      var testSchedule = {
        timeslots: ['10:00', '11:00', '12:00'],
        lessons: {
          mon: ['M', 'O', 'N'], 
          tue: ['T', 'U', 'E'],
          wed: ['W', 'E', 'D'],
          thu: ['T', 'H', 'U'],
          fri: ['F', 'R', 'I'],
          sat: ['S', 'A', 'T'],
          sun: ['S', 'U', 'N'] }
      };

      sut = new weekschedule.Schedule(testSchedule);
      date = moment('2021-03-23');

      // check seven days from date ...
      for (let i = 0; i < 8; i++) {
        let checkdate = date.add(i, 'days');
        let result = sut.getTodaysLessons(checkdate);

        // ... three lessons per day
        for (let n = 0; n < 3; n++) {
          let dow = checkdate.locale('en').format('ddd').toUpperCase();

          assert.equal(result[n], dow[n]);
        }        
      }
    });

    it('getTodaysTimeslots()', () => {
      var testSchedule = {
        timeslots: ['10:00', '11:00', '12:00'],
        lessons: { }
      };

      sut = new weekschedule.Schedule(testSchedule);
      date = moment('2021-03-23');

      let result = sut.getTodaysTimeslots(date);

      expect(result).to.not.be.undefined;
      expect(result).to.have.length(3);
      expect(result).to.equal(testSchedule.timeslots);
    });    
  });
});
