# World Clock Widget

## Introduction
The World Clock Widget displays the local time, or the time in a specific time zone, in either digital or analog format.

### How It Works
The analog clock is rendered using the HTML5 `<canvas>` element, while the digital clock is rendered inside of a `<div>` tag. Each clock type redraws itself every second. The font size of the digital clock is not specified in the settings, but rather is automatically scaled so that it grows to be as large as the Placeholder allows.

Time zone conversions are handled using [TimezoneJS](https://github.com/mde/timezone-js), which uses [Olson](http://en.wikipedia.org/wiki/Tz_database) zoneinfo files for its time zone data.

World Clock Widget works in conjunction with [Rise Vision](http://www.risevision.com), the [digital signage management application](http://rva.risevision.com/) that runs on [Google Cloud](https://cloud.google.com).

At this time Chrome is the only browser that this project and Rise Vision supports.

## Development

### Local Development Environment Setup and Installation
The Widget can be installed by executing the following command: `git clone https://github.com/Rise-Vision/widget-world-clock.git`

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas please post your thoughts to our [community](http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it.

### Languages
If you would like to translate the user interface for this product to another language please complete the following:
- Download the English translation file from this repository.
- Download and install POEdit. This is software that you can use to write translations into another language.
- Open the translation file in the [POEdit](http://www.poedit.net/) program and set the language for which you are writing a translation.
- In the Source text window, you will see the English word or phrase to be translated. You can provide a translation for it in the Translation window.
- When the translation is complete, save it with a .po extension and email the file to support@risevision.com. Please be sure to indicate the Widget or app the translation file is for, as well as the language that it has been translated into, and we will integrate it after the translation has been verified.

## Resources
If you have any questions or problems please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Donna Peplinskie](https://github.com/donnapep "Donna Peplinskie")