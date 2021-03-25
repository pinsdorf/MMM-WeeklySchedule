MMM-WeeklySchedule
==================

This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror). It displays today's timetable from a weekly recurring schedule. It is intended for regular weekly schedules, which have a low update frequency and thus can be maintained manually. Examples are:
* kid’s school classes
* student lectures
* teacher’s teaching schedule
* gym training classes
* household chores
* opening hours of bakery, post office, supermarket 

This module supports multi-week schedules, i.e. "A weeks" and "B weeks". See section *Multi-week schedules* below.

# Preview

![](images/screenshot.png)

# Installation
1. Navigate into your MagicMirror's `modules` folder. 
2. Execute `git clone https://github.com/pinsdorf/MMM-WeeklySchedule.git`. A new folder will appear. 
3. Navigate into folder `MMM-WeeklySchedule`.
4. Execute `npm install` to install the node dependencies.

# Config
The entry in `config.js` can include the following options. You have to distinguish if you want to use this module for weekly recurring schedules (**Single**) or if you have alternating week patterns (**Multi**). The table below marks which module config options are being used for which use case.

|Option|Single|Multi|Description|
|---|---|---|---|
|`schedule`|X| |Defines the data the module shows. It consists of a definition for `timeslots` and `lessons`, see below. Using `schedule` overrides settings for `multischedule`.|
|`multischedule`| |X|Defines the data the module shows for multiple alternating weeks. This settings is overridden by `schedule`. See section *Multi-week schdules* for details.|
|`weekpattern`| |X|Defines the rotation pattern of weeks, only used by `multischedule`. See section *Multi-week schedules* for details.|
|`startdate`| |X|Defines the start date for the weekly patterns, only used by `multischedule`. See section *Multi-week schedules* for details.|
|`updateInterval`|X|X|How often the content is updated.<br>**Default value:** `1 • 60 • 60 • 1000` // every 1 hour |
|`showWeekdayinHeader`|X|X|Appends the module `header`text with weekday name, e.g., *on Monday*<br>**Default value:** `true`|
|`showNextDayAfter`|X|X|From this time of the day on the module shows the schedule of the *next* day. This is helpful when, e.g., a school day is over and you want to show what is up tomorrow. If you don't like this set the value to `23:59` or `undefined`. <br>**Default value:** `16:00`|
|`allowHTML`|X|X|Whether timeslot and lesson texts can contain HTML. Can for example be used to color certain lessons.<br>**Default value:** `false`|

Below is an example of an configuration entry in `config.js`. Make sure that the days of week (mon, tue, wed, ...) are all lower case. The `timeslots` arrays shall have at least the same length as the longest array in `lessons.*`. In other words, make sure each `lesson` entry has a `timeslot` value.

If you want to show no entry at a particular time simply put an empty string as in the example below (cf. first entry for `tue` and `sun`). You can omit one or many weekdays (cf. entry for `sat`). On days without lessons the module shows the text *no lessons*.

``` js
{
    module: "MMM-WeeklySchedule",
    position: "top_left",
    header: "Hermione's classes",
    config: {
        schedule: {
            timeslots: [ "8:00", "10:00", "12:00", "14:00", "16:00" ],
            lessons: {
                mon: [ "Potions", "Defense against the Dark Arts", "Lunch Break", "Transfiguration" ],  
                tue: [ "", "Astronomy", "Lunch Break", "Charms", "History of Magic" ],
                wed: [ "Arithmancy", "Divination", "Lunch Break", "Muggle Studies", "Herbology" ],
                thu: [ "Care of Magical Creatures", "Care of Magical Creatures", "Lunch Break", "Transfiguration", "Charms" ],
                fri: [ "Potions", "Herbology", "Lunch Break", "Charms", "Defense against the Dark Arts" ],
                // no entries for saturday
                sun: [ "", "Quidditch Match", "Sunday Lunch" ]   // short day on sundays
            }
        },
        updateInterval: 1 * 60 * 60 * 1000, // every hour
        showNextDayAfter: "16:00"
    }
},
```

The values in the `timeslots` array don't need to be a time. It is merely an arbitrary string. This allows to use the module also to announce shared workload like household chores. The screenshot below shows an example. 

![](images/screenshot2.png?raw=true)

And here is the configuaration for this example. 

``` js
{
    module: "MMM-WeeklySchedule",
    position: "top_left",
    header: "Household chores",
    config: {
		schedule: {
			timeslots: [ "Feed the fish", "Set the table", "Take out the trash", "Hoover living room" ],
			lessons: {
				mon: [ "Bart",  "Marge", "Homer", "Lisa"  ],
				tue: [ "Lisa",  "Bart",  "Marge", "Homer" ],
				wed: [ "Homer", "Lisa",  "Bart",  "Marge" ],
				thu: [ "Marge", "Homer", "Lisa",  "Bart"  ],
				fri: [ "Bart",  "Marge", "Homer", "Lisa" ]
			}
		},
        updateInterval: 1 * 60 * 60 * 1000, // every hour
        showNextDayAfter: undefined
    }
},
```
# Multi-week schedules (bi-weekly, three-weekly, arbitrary)

The most frequent user request is support for multi-week schedules. That is that two or more schedules alternate, e.g. A, B, A, B, etc. 
But there are more complicated schedule patterns being used like three-weekly A, B, C, A, B, C, etc. This module supports arbitrary patterns like A, A, B, C, C, A, A, B, C, C, etc. There is no limit in length of the pattern.

In order to enable schedule patterns you have to configure two things. Your config must contain
1. `multischedule` section defines several weekly patterns. This is similar to the normal weekly schedule, but for multiple weeks. For details see below.
2.  `weekpattern` defines how schedules are arranged, like so: `weekpattern: 'ABC'`. The each letter stands for one week and refers to an entry in the `multischedule` section. In this example the first week uses schedule `A`, the second week schedule `B`, the third week schedule `C`. Then it will start over with `A` and so on. It will repeat forever.
3. `startdate` of the pattern, stated in format `YYYY-MM-DD`. This date identifies the day when the pattern has started. It should be today or earlier; if the `startdate` is in future the module will show *no lessons* for today. 

Here is a working example for multi-week schedules:

``` js
{
    module: "MMM-WeeklySchedule",
    position: "top_left",
    header: "Hermione's classes",
    config: {
		multischedule: [
			A: {
            	timeslots: [ "8:00", "10:00", "12:00", "14:00", "16:00" ],
				lessons: {
					mon: [ "Potions", "Defense against the Dark Arts", "Lunch Break", "Transfiguration" ],  
					tue: [ "", "Astronomy", "Lunch Break", "Charms", "History of Magic" ],
					wed: [ "Arithmancy", "Divination", "Lunch Break", "Muggle Studies", "Herbology" ],
					thu: [ "Care of Magical Creatures", "Care of Magical Creatures", "Lunch Break", "Transfiguration", "Charms" ],
					fri: [ "Potions", "Herbology", "Lunch Break", "Charms", "Defense against the Dark Arts" ],
					// no entries for saturday
					sun: [ "", "Quidditch Match", "Sunday Lunch" ]   // short day on sundays
				}
            },
			B: {
            	timeslots: [ "8:00", "10:00", "12:00", "14:00", "16:00" ],
				lessons: {
					// no entries for monday  
					tue: [ "", "Astronomy", "Lunch Break", "Charms", "History of Magic" ],
					wed: [ "Care of Magical Creatures", "Care of Magical Creatures", "Lunch Break", "Transfiguration", "Charms" ],
					thu: [ "Arithmancy", "Divination", "Lunch Break", "Muggle Studies", "Herbology" ],
					fri: [ "Potions", "Herbology", "Lunch Break", "Charms", "Defense against the Dark Arts" ],
					sat: [ "Potions", "Defense against the Dark Arts", "Lunch Break", "Transfiguration" ],
					sun: [ "", "", "Sunday Lunch" ]   // Quidditch match only every second week 
			}
		],
		weekpattern: 'AB', // weeks applied like ABABABABA...
		startdate: '2021-03-01', 
		updateInterval: 1 * 60 * 60 * 1000, // every hour
		showNextDayAfter: undefined
    }
},
```

The nameing of the weeks (`A`, `B`, ...) is arbitrary, but it has to be a single letter. Each letter in your `weekpattern` has to have a matching entry in `multischedule` list. Watch out for upper case and lower case letters. NB: If your schedule requires more than 2 x 26 different schedules then you should really check your assignments. :-)   

In case you want to define a monthly alternating pattern you can define the week pattern like `AAAABBBB`. Then you get four weeks in a row with schedule `A` and the next four weeks with schedule `B`. After that the module will start with the first `A` again.

There may be times when your pattern goes out of sync, e.g. due to holiday weeks. In this case simply update the start date to get back into the rythmn. Another option is to define a really long pattern entry that covers each week of, say, a semester. You could even define schedule for your holiday weeks without lessons. For instance, a 14-week pattern could look like this: `ABABABCCBABABA`. Please note the two weeks break in the middle (`CC`) and that the pattern continues irregularly with `B` afterwards and not with `A`.

Please note that each schedule has its own entry for `timeslots`. This allows to have weeks even with different timeslots.

If you have defined both `schedule` and `multischedule` then the normal `schedule` wins.  

# Use HTML markup in schedules 

Setting `allowHTML` to true gives you the possibility to color texts, add images or include any HTML. This works in both types of schedule. Here's an example to add red text for reminders:

![](images/screenshot3.png?raw=true)

Configuration for the above example:

``` js
{
	module: "MMM-WeeklySchedule",
	position: "top_left",
	header: "Activity",
	config: {
		schedule: {
			timeslots: [ "Activity", "Remember" ],
			lessons: {
				mon: [ "Running", "<span style='color: #ff5000'>Charge GPS watch!</span>" ],
				tue: [ "Swimming", "" ],
				thu: [ "Cycling", "" ],
				sat: [ "Bowling", "<span style='color: #ff5000'>Bring bowling ball!</span>" ],
			}
		},
		updateInterval: 1 * 60 * 60 * 1000, // every hour
		showNextDayAfter: "21:00",
		allowHTML: true
	}
},
```

And another example using images:

![](images/screenshot4.png?raw=true)

Configuration for the above example:

``` js
{
	module: "MMM-WeeklySchedule",
	position: "top_left",
	header: "",
	config: {
		schedule: {
			timeslots: [ "Fruit of the day" ],
			lessons: {
				mon: [ "<img src='https://img.icons8.com/metro/35/ffffff/pear.png' />" ],
				tue: [ "<img src='https://img.icons8.com/metro/35/ffffff/citrus.png' />" ],
				wed: [ "<img src='https://img.icons8.com/metro/35/ffffff/kiwi.png' />" ],
				thu: [ "<img src='https://img.icons8.com/metro/35/ffffff/strawberry.png' />" ],
				fri: [ "<img src='https://img.icons8.com/metro/35/ffffff/apple.png' />" ],
				sat: [ "<img src='https://img.icons8.com/metro/35/ffffff/grapes.png' />" ],
				sun: [ "<img src='https://img.icons8.com/metro/35/ffffff/watermelon.png' />" ],
			}
		},
		updateInterval: 1 * 60 * 60 * 1000, // every hour
		showNextDayAfter: undefined,
		allowHTML: true
	}
},
```

# Localization
Thanks to many contributions by the community this module has been localized for a number of languages already. More input is very welcome. There is no setting for the language in this module's config section, but the language is taken from [Magic Mirror's global locale setting](https://docs.magicmirror.builders/getting-started/configuration.html#general).

|Locale|Language            |
|------|--------------------|
|da    | Danish             |
|de    | German             |
|en    | English            |
|he    | Hebrew             |
|hu    | Hungarian          |
|nb    | Norwegian Bokmål   |
|nn    | Norwegian Nynorsk  |
|pl    | Polish             |
|sv    | Swedish            |
|zh-cn | Simplified Chinese |

# Dependencies
- [moment](https://www.npmjs.com/package/moment) (installed via `npm install`)

# Notes
- This is my first project using Node, so feel free to submit pull requests or post on the issues and I will do my best to improve the project.

# Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [LukeSkywalker92](https://github.com/LukeSkywalker92) for creating the [MMM-DWD-WarnWeather](https://github.com/LukeSkywalker92/MMM-DWD-WarnWeather) module that I used as guidance in creating this module.
