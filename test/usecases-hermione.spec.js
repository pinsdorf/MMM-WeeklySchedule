const expect = require('chai').expect;
const assert = require('chai').assert;
const moment = require('moment');

const weekschedule = require('../weekschedule.js');

describe('Hermiones classes from README.md', () => {

  var hermionesClasses = {  
    A: {
      timeslots: ['8:00', '10:00', '12:00', '14:00', '16:00'],
      lessons: {
        mon: ['Potions', 'Defense against the Dark Arts', 'Lunch Break', 'Transfiguration'],  
        tue: ['', 'Astronomy', 'Lunch Break', 'Charms', 'History of Magic'],
        wed: ['Arithmancy', 'Divination', 'Lunch Break', 'Muggle Studies', 'Herbology'],
        thu: ['Care of Magical Creatures', 'Care of Magical Creatures', 'Lunch Break', 'Transfiguration', 'Charms'],
        fri: ['Potions', 'Herbology', 'Lunch Break', 'Charms', 'Defense against the Dark Arts'],
        // no entries for saturday
        sun: ['', 'Quidditch Match', 'Sunday Lunch'] // short day on sundays
      }
    },
    B: {
      timeslots: ['8:00', '10:00', '12:00', '14:00', '16:00'],
      lessons: {
        // no entries for monday  
        tue: ['', 'Astronomy', 'Lunch Break', 'Charms', 'History of Magic'],
        wed: ['Care of Magical Creatures', 'Care of Magical Creatures', 'Lunch Break', 'Transfiguration', 'Charms'],
        thu: ['Arithmancy', 'Divination', 'Lunch Break', 'Muggle Studies', 'Herbology'],
        fri: ['Potions', 'Herbology', 'Lunch Break', 'Charms', 'Defense against the Dark Arts'],
        sat: ['Potions', 'Defense against the Dark Arts', 'Lunch Break', 'Transfiguration'],
        sun: ['', '', 'Sunday Lunch'] // Quidditch match only every second week 
      }
    }
  };
  var weekpattern = 'AB'; // weeks applied like ABABABABA...

  it('No lessons on Mondays in B week', () => {
    var sut = new weekschedule.MultiWeekSchedule();

    sut.schedule = hermionesClasses;
    sut.pattern = weekpattern;
    sut.startdate = moment('2021-03-01').locale('en-GB'); // Monday
        
    let bWeekMonday = moment('2021-03-08');
    let actual = sut.getTodaysLessons(bWeekMonday);

    expect(actual).is.undefined;

    bWeekMonday = bWeekMonday.add(7, 'days');
    actual = sut.getTodaysLessons(bWeekMonday);
    expect(actual).is.not.undefined;

    bWeekMonday = bWeekMonday.add(7, 'days');
    actual = sut.getTodaysLessons(bWeekMonday);
    expect(actual).is.undefined;
  });

  it('No lessons before start of school term', () => {
    var sut = new weekschedule.MultiWeekSchedule();

    sut.schedule = hermionesClasses;
    sut.pattern = weekpattern;
    sut.startdate = moment('2021-03-01').locale('en-GB'); // Monday
        
    let tooEarly = moment('2021-02-28');
    let actual = sut.getTodaysLessons(tooEarly);

    expect(actual).is.undefined;
  });
  
  it('First lesson every tuesday is free (empty string)', () => {
    var sut = new weekschedule.MultiWeekSchedule();

    sut.schedule = hermionesClasses;
    sut.pattern = weekpattern;
    sut.startdate = moment('2021-03-01'); 

    let tuesday = moment('2021-03-02');

    for (let week = 0; week < 52; week++) {
      let actual = sut.getTodaysLessons(tuesday);

      expect(actual[0]).is.not.undefined;
      expect(actual[0]).equals('');

      tuesday = tuesday.add(1, 'week');
    }
  });

  it('Second lesson on Wednesday\'s alternates between \'Divination\' and \'Care of Magical Creatures\'', () => {
    var sut = new weekschedule.MultiWeekSchedule();

    sut.schedule = hermionesClasses;
    sut.pattern = weekpattern;
    sut.startdate = moment('2021-03-01').locale('en-GB'); 

    let wednesday = moment('2021-03-03');

    for (let week = 0; week < 52; week++) {
      let actual = sut.getTodaysLessons(wednesday);

      if (week % 2 === 0) {expect(actual[1]).to.equal('Divination');} else {expect(actual[1]).to.equal('Care of Magical Creatures');}

      wednesday = wednesday.add(1, 'week');
    }
  });

  it('Correct lessons at first day of school term (locale with Monday start of week)', () => {
    var sut = new weekschedule.MultiWeekSchedule();

    sut.schedule = hermionesClasses;
    sut.pattern = weekpattern;
    sut.startdate = moment('2021-03-01').locale('en-GB'); // Monday
        
    let tooEarly = moment('2021-03-01');
    let actual = sut.getTodaysLessons(tooEarly);
    
    expect(actual).is.equal(hermionesClasses.A.lessons.mon);
  });

  it('Correct lessons at first day of school term (locale with Sunday start of week)', () => {
    var sut = new weekschedule.MultiWeekSchedule();

    sut.schedule = hermionesClasses;
    sut.pattern = weekpattern;
    sut.startdate = moment('2021-03-01').locale('en-US'); // Monday
        
    let tooEarly = moment('2021-03-01');
    let actual = sut.getTodaysLessons(tooEarly);
    
    expect(actual).is.equal(hermionesClasses.A.lessons.mon);
  });

  it('Sunday Lunch in many locales', () => {
    var sut = new weekschedule.MultiWeekSchedule();

    sut.schedule = hermionesClasses;
    sut.pattern = weekpattern;
    sut.startdate = moment('2021-03-01').locale('en-US'); // Monday
        
    let locales = ['da', 'de', 'en', 'en-GB', 'en-US', 'fr', 'he', 'nb', 'nn', 'pl', 'sv', 'zh-cn'];

    locales.forEach(locale => {
      let sunday = moment('2021-03-07').locale(locale);
      let actual = sut.getTodaysLessons(sunday);

      expect(actual[2]).is.equal('Sunday Lunch');
    });
  });

});