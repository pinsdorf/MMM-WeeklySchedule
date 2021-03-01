MMM-WeeklySchedule
==================

This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror). It displays today's timetable from a weekly recurring schedule. It is intended for regular weekly schedules, which have a low update frequency and thus can be maintained manually. Examples are:
* kid’s school classes
* student lectures
* teacher’s teaching schedule
* gym training classes
* household chores
* opening hours of bakery, post office, supermarket 

## Preview

![](images/screenshot.png)

## Installation
1. Navigate into your MagicMirror's `modules` folder. 
2. Execute `git clone https://github.com/pinsdorf/MMM-WeeklySchedule.git`. A new folder will appear. 
3. Navigate into folder `MMM-WeeklySchedule`.
4. Execute `npm install` to install the node dependencies.

## Config
The entry in `config.js` can include the following options:

|Option|Description|
|---|---|
|`schedule`|Defines the data the module shows. It consists of a definition for `timeslots` and `lessons`. See below.|
|`updateInterval`|How often the content is updated.<br>**Default value:** `1 • 60 • 60 • 1000` // every 1 hour |
|`showWeekdayinHeader`|Appends the module `header`text with weekday name, e.g., *on Monday*<br>**Default value:** `true`|
|`showNextDayAfter`|From this time of the day on the module shows the schedule of the *next* day. This is helpful when, e.g., a school day is over and you want to show what is up tomorrow. If you don't like this set the value to `23:59` or `undefined`. <br>**Default value:** `16:00`|
|`allowHTML`|Whether timeslot and lesson texts can contain HTML. Can for example be used to color certain lessons.<br>**Default value:** `false`|

Below is an example of an configuration entry in `config.js`. Make sure that the days of week (mon, tue, wed, ...) are all lower case. The `timeslots` arrays shall have at least the same length as the longest array in `lessons.*`. In other words, make sure each `lesson` entry has a `timeslot` value.

If you want to show no entry at a particular time simply put an empty string as in the example below (cf. first entry for `tue` and `sun`). You can omit one or many weekdays (cf. entry for `sat`). On days without lessons the module shows the text *no lessons*.

The module is localized for English (en), German (de), Swedish (sv) and Danish (da). More input is very welcome. 

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
Setting `allowHTML` to true gives you the possibility to color texts, add images or include any HTML. Here's an example to add red text for reminders:

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

## Dependencies
- [moment](https://www.npmjs.com/package/moment) (installed via `npm install`)

## Notes
- This is my first project using Node, so feel free to submit pull requests or post on the issues and I will do my best to improve the project.

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [LukeSkywalker92](https://github.com/LukeSkywalker92) for creating the [MMM-DWD-WarnWeather](https://github.com/LukeSkywalker92/MMM-DWD-WarnWeather) module that I used as guidance in creating this module.
