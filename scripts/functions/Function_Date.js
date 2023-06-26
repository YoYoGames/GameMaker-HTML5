
// **********************************************************************************************************************
// 
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
// 
// File:			Function_Date.js
// Created:			27/05/2011
// Author:			Mike
// Project:			HTML5
// Description:		
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 27/05/2011		
// 
// **********************************************************************************************************************

// 1970/01/01 corresponds to getTime() == 0
var DEFAULT_YEAR = 1970;
var DEFAULT_MONTH = 0;
var DEFAULT_DAY = 1;

// These based on DateUtils (as used by Delphi_Runner) to get datetime spans
var DAYS_IN_YEAR = 365.25;
var DAYS_IN_MONTH = 30.4375;

var monthlen = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var totalmonthlen = [];

var SECONDS_IN_A_DAY	= (86400.0);
var MONTH_IN_SECONDS	= (SECONDS_IN_A_DAY*30);

var g_bLocalTime = true;
var TIMEZONE_LOCAL=0;
var TIMEZONE_UTC=1;


// #############################################################################################
/// Function:<summary>
///          	Convert from GameMaker "time" (day.time) into standard datetime
///          </summary>
///
/// In:		<param name="_datetime"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function FromGMDateTime(_datetime) {

	if (_datetime < DAYS_SINCE_1900)
	{
		return _datetime * MILLISECONDS_IN_A_DAY;
	} else
	{
		return (_datetime - DAYS_SINCE_1900) * MILLISECONDS_IN_A_DAY;
	}
}




// #############################################################################################
/// Function:<summary>
///             Checks to see if a given year is a leap year
///          </summary>
// #############################################################################################
function is_leap_year(year)
{
    return year%400 ==0 || (year%100 != 0 && year%4 == 0);
}

// #############################################################################################
/// Function:<summary>
///             Returns an array containing the numbers of days in each month for the given year
///          </summary>
// #############################################################################################
function get_month_lengths(year)
{
    var monthLengths = monthlen.slice();;
    if (is_leap_year(year)) {        
        monthLengths[1] = 29;
    }
    return monthLengths;
}

// #############################################################################################
/// Function:<summary>
///             Mimics the operation of DateUtils.IsValidDateTime() (see fn body for more detail)
///          </summary>
// #############################################################################################
function is_valid_date_time(year, month, day, hour, minute, second, millisecond)
{
	year = yyGetInt32(year);
	month = yyGetInt32(month);
	day = yyGetInt32(day);
	hour = yyGetInt32(hour);
	minute = yyGetInt32(minute);
	second = yyGetInt32(second);
	millisecond = yyGetInt32(millisecond);

// IsValidDateTime returns True if:
// - Year falls in the range from 1 through 9999 inclusive.
// - Month falls in the range from 1 through 12 inclusive.
// - Day falls in the range from 1 through the number of days in the specified month.
// - Hour falls in the range from 0 through 24, and if AHour is 24, then AMinute, ASecond, and AMilliSecond must all be 0.
// - Minute falls in the range from 0 through 59 inclusive.
// - Second falls in the range from 0 through 59 inclusive.
// - MilliSecond falls in the range from 0 through 999 inclusive.
    if ((year >= 1970) &&
        (month >= 1) && (month <= 12) &&
        (day >= 1) && (day <= 31) &&
        (hour >= 0) && (hour <= 23) &&
        (minute >= 0) && (minute <= 59) &&
        (second >= 0) && (second <= 59) &&
        (millisecond >= 0) && (millisecond <= 999))
    {
        // Check day more precisely against its month
        if (day > 28) {
            switch (month) {
                case 2: // February
                    if (!is_leap_year(year) || (day > 29)) {
                        return 0;
                    }                    
                break;                
                case 4: // April
                case 6: // June
                case 9: // September
                case 11:// November
                    if (day > 30) {
                        return 0;
                    }
                break;                                
            }                                       
        }
    }
    else {
        return 0;
    }
    return 1;
}

var MILLISECONDS_IN_A_DAY = 86400000.0;	//milliseconds in a day.
var DAYS_SINCE_1900 = 25569;
// #############################################################################################
/// Function:<summary>
///             Returns the date-time value that corresponds to the current moment.
///          </summary>
///
/// Out:	 <returns>
///				The current date/time value
///			 </returns>
// #############################################################################################
function date_current_datetime()
{
    var dt = new Date();
    var mm = dt.getMilliseconds();
    var t = dt.getTime()-mm;
	return (t / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the date-time value that corresponds to the current date only (ignoring the time).
///          </summary>
///
/// Out:	<returns>
///				time value
///			</returns>
// #############################################################################################
function date_current_date() {
	var d = new Date();
	return (~ ~(d.getTime() / MILLISECONDS_IN_A_DAY)) + DAYS_SINCE_1900;
}



// #############################################################################################
/// Function:<summary>
///          	Returns the date-time value that corresponds to the current time only (ignoring the date).
///          </summary>
///
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_current_time() {

	var d = new Date();
	d.setFullYear(DEFAULT_YEAR, DEFAULT_MONTH, DEFAULT_DAY);

	var f = (d.getTime() / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
	return (f - (~~f));
}


// #############################################################################################
/// Function:<summary>
///          	Creates a date-time value corresponding to the indicated date.
///          </summary>
///
/// In:		<param name="_year"></param>
///			<param name="_month"></param>
///			<param name="_day"></param>
///			<param name="_hour"></param>
///			<param name="_minute"></param>
///			<param name="_second"></param>
/// Out:	<returns>
///				a full "time"value
///			</returns>
// #############################################################################################
function date_create_datetime(_year, _month, _day, _hour, _minute, _second)
{
    _year = yyGetInt32(_year);
    _month = yyGetInt32(_month);
    _day = yyGetInt32(_day);
    _hour = yyGetInt32(_hour);
    _minute = yyGetInt32(_minute);
    _second = yyGetInt32(_second);

	var d = new Date();
	if( g_bLocalTime )
	{
	    d.setFullYear(_year, _month - 1, _day);
	    d.setHours(_hour, _minute, _second, 10);
	}
	else
	{
	    d.setUTCFullYear(_year, _month - 1, _day);
	    d.setUTCHours(_hour, _minute, _second, 10);
	}

	return (d.getTime() / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}


// #############################################################################################
/// Function:<summary>
///             Returns the year corresponding to the date.
///          </summary>
///
/// In:		 <param name="_time"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function date_get_year(_time) {
	var d = new Date();
	d.setTime(FromGMDateTime(yyGetReal(_time)));
    
	return (g_bLocalTime) ? d.getFullYear() : d.getUTCFullYear();
}


// #############################################################################################
/// Function:<summary>
///             Returns the month corresponding to the date.
///          </summary>
///
/// In:		 <param name="_time"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function date_get_month(_time) {
	var d = new Date();
	d.setTime(FromGMDateTime(yyGetReal(_time)));

	return (g_bLocalTime) ? (d.getMonth())+1 : (d.getUTCMonth())+1;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the day of the month corresponding to the date.
///          </summary>
///
/// In:		<param name="_time"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_get_day(_time) {
	var d = new Date();
	d.setTime(FromGMDateTime(yyGetReal(_time)));

	return (g_bLocalTime) ? d.getDate() : d.getUTCDate();
}

// #############################################################################################
/// Function:<summary>
///             Returns the day of the week corresponding to the date.
///          </summary>
///
/// In:		 <param name="_time"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function date_get_weekday(_time)
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));
    
    return (g_bLocalTime) ? d.getDay() : d.getUTCDay();
}



// #############################################################################################
/// Function:<summary>
///             Returns the week of the year corresponding to the date.
///          </summary>
///
/// In:		 <param name="_time"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function date_get_week(_time) {
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));

    var w = dayOfYear(d);
    return floor(w / 7);
}


// #############################################################################################
/// Function:<summary>
///             Returns the hour corresponding to the date.
///          </summary>
///
/// In:		 <param name="_time"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function date_get_hour(_time)
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));

    return (g_bLocalTime) ? d.getHours() : d.getUTCHours();
}

// #############################################################################################
/// Function:<summary>
///             Returns the minute corresponding to the date.
///          </summary>
///
/// In:		 <param name="_time"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function date_get_minute(_time)
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));
    
    return (g_bLocalTime) ? d.getMinutes() : d.getUTCMinutes();
}

// #############################################################################################
/// Function:<summary>
///             Returns the second corresponding to the date.
///          </summary>
///
/// In:		 <param name="_time"></param>
/// Out:	 <returns>
///				
///			 </returns>
// #############################################################################################
function date_get_second(_time)
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));
    
    return (g_bLocalTime) ? d.getSeconds() : d.getUTCSeconds();
}

// #############################################################################################
/// Function:<summary>
///             Returns the day in year of _jsDate depending on local/utc setting
///          </summary>
///
/// In:		 <param name="_jsDate"></param>   js Date object
/// Out:	 <returns>
///				day of year for _jsDate
///			 </returns>
function dayOfYear(_jsDate)
{
    var day = 0;
    if( g_bLocalTime )
    {
        var monthlens = get_month_lengths(_jsDate.getFullYear());
        for (var i = 0; i < _jsDate.getMonth(); i++) {
            day += monthlens[i];
        }
        day += _jsDate.getDate();
    }
    else
    {
        var monthlens = get_month_lengths(_jsDate.getUTCFullYear());
        for (var i = 0; i < _jsDate.getUTCMonth(); i++) {
            day += monthlens[i];
        }
        day += _jsDate.getUTCDate();
    }
    return day;
}


// #############################################################################################
/// Function:<summary>
///          	Returns whether the indicated date and time are valid.
///          </summary>
///
/// In:		<param name="_year"></param>
///			<param name="_month"></param>
///			<param name="_day"></param>
///			<param name="_hour"></param>
///			<param name="_minute"></param>
///			<param name="_second"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_valid_datetime(_year,_month,_day,_hour,_minute,_second) {
    return is_valid_date_time(yyGetInt32(_year), yyGetInt32(_month), yyGetInt32(_day), yyGetInt32(_hour), yyGetInt32(_minute), yyGetInt32(_second), 0);
}


// #############################################################################################
/// Function:<summary>
///          	Returns a new date that is amount years after the indicated date. amount must be an integer number.
///          </summary>
///
/// In:		<param name="_date"></param>
///			<param name="_amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_inc_year(_date, _amount) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    d.setUTCFullYear(d.getUTCFullYear() + yyGetInt32(_amount), d.getUTCMonth(), d.getUTCDate());

    return (d.getTime() / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}

// #############################################################################################
/// Function:<summary>
///          	Returns a new date that is amount months after the indicated date. amount must be an integer number.
///          </summary>
///
/// In:		<param name="_date"></param>
///			<param name="_amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_inc_month(_date,_amount) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    d.setUTCFullYear(d.getUTCFullYear(), d.getUTCMonth() + yyGetInt32(_amount), d.getUTCDate());

    return (d.getTime() / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}

// #############################################################################################
/// Function:<summary>
///          	Returns a new date that is amount weeks after the indicated date. amount must be an integer number.
///          </summary>
///
/// In:		<param name="_date"></param>
///			<param name="_amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_inc_week(_date, _amount) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    d.setUTCFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + (yyGetInt32(_amount) * 7));

    return (d.getTime() / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}

// #############################################################################################
/// Function:<summary>
///          	Returns a new date that is amount days after the indicated date. amount must be an integer number.
///          </summary>
///
/// In:		<param name="date"></param>
///			<param name="amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_inc_day(_date, _amount) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    d.setUTCFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + yyGetInt32(_amount));

    return (d.getTime() / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}


// #############################################################################################
/// Function:<summary>
///          	Returns a new date that is amount hours after the indicated date. amount must be an integer number.
///          </summary>
///
/// In:		<param name="_date"></param>
///			<param name="_amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_inc_hour(_date, _amount) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    d.setUTCHours(d.getUTCHours() + yyGetInt32(_amount), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());

    return (d.getTime() / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}

// #############################################################################################
/// Function:<summary>
///          	Returns a new date that is amount minutes after the indicated date. amount must be an integer number.
///          </summary>
///
/// In:		<param name="_date"></param>
///			<param name="_amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_inc_minute(_date, _amount) {
	var d = new Date();
	d.setTime(FromGMDateTime(yyGetReal(_date)));
	d.setUTCHours(d.getUTCHours(), d.getUTCMinutes() + yyGetInt32(_amount), d.getUTCSeconds(), d.getUTCMilliseconds());

	return (d.getTime() / MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}

// #############################################################################################
/// Function:<summary>
///          	Returns a new date that is amount seconds after the indicated date. amount must be an integer number.
///          </summary>
///
/// In:		<param name="_time"></param>
///			<param name="_amount"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_inc_second(_date, _amount) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    d.setUTCHours(d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds() + yyGetInt32(_amount), d.getUTCMilliseconds());
    return (d.getTime()/ MILLISECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}


// #############################################################################################
/// Function:<summary>
///          	Returns the day of the year corresponding to the date.
///          </summary>
///
/// In:		<param name="_time"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_get_day_of_year(_time) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));

    var days = dayOfYear( d );
    return days;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the hour of the year corresponding to the date.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_get_hour_of_year(_time) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));

    var days = dayOfYear( d );
    var hours = (days-1) * 24;
    if(g_bLocalTime)
        hours += d.getHours();
    else
        hours += d.getUTCHours();
    
    return hours;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the minute of the year corresponding to the date.
///          </summary>
///
/// In:		<param name="date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_get_minute_of_year(_time) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));

    var days = dayOfYear( d );
    var minutes = (days-1) * 24 * 60;
    if( g_bLocalTime ) {
        minutes += d.getHours() * 60;
        minutes += d.getMinutes();
    }
    else {
        minutes += d.getUTCHours() * 60;
        minutes += d.getUTCMinutes();
    }
    
    return minutes;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the second of the year corresponding to the date.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_get_second_of_year(_time) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_time)));

    var days = dayOfYear( d );
    var seconds = (days-1) * 24 * 60 * 60;
    if( g_bLocalTime ) {
        seconds += d.getHours() * 60 * 60;
        seconds += d.getMinutes() * 60;
        seconds += d.getSeconds();
    }
    else
    {
        seconds += d.getUTCHours() * 60 * 60;
        seconds += d.getUTCMinutes() * 60;
        seconds += d.getUTCSeconds();
    }
    
    return seconds;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of years between the two dates. It reports incomplete years as a fraction. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_year_span(_date1, _date2) 
{
    var d = new Date();
    var date1 = d.setTime(FromGMDateTime(yyGetReal(_date1)));
    var date2 = d.setTime(FromGMDateTime(yyGetReal(_date2)));

    var timeDiff = (date2 - date1);

    return Math.abs(Math.floor(timeDiff / 1000) / 60 / 60 / 24 / DAYS_IN_YEAR);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of months between the two dates. It reports incomplete months as a fraction. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_month_span(_date1,_date2) 
{
    var d = new Date();
    var date1 = d.setTime(FromGMDateTime(yyGetReal(_date1)));
    var date2 = d.setTime(FromGMDateTime(yyGetReal(_date2)));

    var timeDiff = (date2 - date1);

    return Math.abs(Math.floor(timeDiff / 1000) / 60 / 60 / 24 / DAYS_IN_MONTH);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of weeks between the two dates. It reports incomplete weeks as a fraction. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_week_span(_date1,_date2) 
{
    var d = new Date();
    var date1 = d.setTime(FromGMDateTime(yyGetReal(_date1)));
    var date2 = d.setTime(FromGMDateTime(yyGetReal(_date2)));

    var timeDiff = (date2- date1);

    return Math.abs(Math.floor(timeDiff / 1000) / 60 / 60 / 24 / 7);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of days between the two dates. It reports incomplete days as a fraction. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_day_span(_date1,_date2) 
{
    var d = new Date();
    var date1 = d.setTime(FromGMDateTime(yyGetReal(_date1)));
    var date2 = d.setTime(FromGMDateTime(yyGetReal(_date2)));

    var timeDiff = (date2- date1);

    return Math.abs(Math.floor(timeDiff / 1000) / 60 / 60 / 24);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of hours between the two dates. It reports incomplete hours as a fraction. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_hour_span(_date1,_date2) 
{
    var d = new Date();
    var date1 = d.setTime(FromGMDateTime(yyGetReal(_date1)));
    var date2 = d.setTime(FromGMDateTime(yyGetReal(_date2)));

    var timeDiff = (date2 - date1);

    return Math.abs(Math.floor(timeDiff / 1000) / 60 / 60);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of minutes between the two dates. It reports incomplete minutes as a fraction. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_minute_span(_date1, _date2) 
{
    var d = new Date();
    var date1 = d.setTime(FromGMDateTime(yyGetReal(_date1)));
    var date2 = d.setTime(FromGMDateTime(yyGetReal(_date2)));

    var timeDiff = (date2 - date1);

    return Math.abs(Math.floor(timeDiff / 1000) / 60);
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of seconds between the two dates.
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_second_span(_date1, _date2) 
{    
    var d = new Date();
    var date1 = d.setTime(FromGMDateTime(yyGetReal(_date1)));
    var date2 = d.setTime(FromGMDateTime(yyGetReal(_date2)));

    var timeDiff = (date2 - date1);

    return ~~Math.abs(Math.floor(timeDiff / 1000));
}

// #############################################################################################
/// Function:<summary>
///             When performing spans we need to adjust date/times according to whether or
///             not they're during daylight saving time
///          </summary>
/// Out:	<returns>
///				Adjustment necessary in milli-seconds
///			</returns>
// #############################################################################################
function DST_adjustment(_date)
{
    var d = new Date();
    d.setTime(FromGMDateTime(_date));    
    
    return (d.getHours() - d.getUTCHours()) * 60 * 60 * 1000;
}

// #############################################################################################
/// Function:<summary>
///          	Compares the two date-time values. Returns -1, 0, or 1 depending on whether 
///             the first is smaller, equal, or larger than the second value. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_compare_datetime(_date1,_date2) 
{
    _date1 = yyGetReal(_date1);
    _date2 = yyGetReal(_date2);

    if (_date1 < _date2) {
        return -1;
    }
    else if (_date1 > _date2) {
        return 1;
    }
    return 0;
}

// #############################################################################################
/// Function:<summary>
///          	Compares the two date-time values only taking the date part into account. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				Returns -1, 0, or 1 depending on whether the first is 
///             smaller, equal, or larger than the second value. 
///			</returns>
// #############################################################################################
function date_compare_date(_date1, _date2) 
{
	var d1 = new Date();
	d1.setTime(FromGMDateTime(yyGetReal(_date1)));
	
	var d2 = new Date();
	d2.setTime(FromGMDateTime(yyGetReal(_date2)));
	
	/* Calculate the date as (more than) the number of days since 1900.
	 * The year and month are both multiplied by the longest possible of each to ensure a long
	 * month or year can't prematurely overflow into the next one.
	*/
	var date1 = (d1.getFullYear() * 366) + (d1.getMonth() * 31) + d1.getDate();
	var date2 = (d2.getFullYear() * 366) + (d2.getMonth() * 31) + d2.getDate();
	
	return (date1 == date2) ? 0.0 : ((date1 > date2) ? 1.0 : -1.0 );
}

// #############################################################################################
/// Function:<summary>
///          	Compares the two date-time values only taking the time part into account. 
///          </summary>
///
/// In:		<param name="_date1"></param>
///			<param name="_date2"></param>
/// Out:	<returns>
///				Returns -1, 0, or 1 depending on whether the first is 
///             smaller, equal, or larger than the second value. 
///			</returns>
// #############################################################################################
function date_compare_time(_date1, _date2)
{
	var d1 = new Date();
	d1.setTime(FromGMDateTime(yyGetReal(_date1)));
	
	var d2 = new Date();
	d2.setTime(FromGMDateTime(yyGetReal(_date2)));
	
	/* Calculate the time as the number of seconds since the start of the day. */
	var time1 = (d1.getHours() * 3600) + (d1.getMinutes() * 60) + d1.getSeconds();
	var time2 = (d2.getHours() * 3600) + (d2.getMinutes() * 60) + d2.getSeconds();
	
	return (time1 == time2) ? 0.0 : ((time1 > time2) ? 1.0 : -1.0 );
}


// ##### AUX FUNCTIONS #####

// These functions try to keep code as similar as possible to C++

function fromGMDateTime(datetime) {
    return (datetime - DAYS_SINCE_1900) * SECONDS_IN_A_DAY;
}

function toGMDateTime(datetime) {
    return ((datetime + 0.5) / SECONDS_IN_A_DAY) + DAYS_SINCE_1900;
}

function timeFromTM(t) {
    let date = new Date(t.year + 1900, t.month, t.day, t.hour, t.minute, t.second);
    if (g_bLocalTime)
        return date.getTime() / 1000; // JavaScript works in milliseconds
    return date.getTime() / 1000 - date.getTimezoneOffset() * 60; // Convert local time to UTC
}

function timeToTM(time) {
    let date = new Date(time * 1000); // JavaScript works in milliseconds
    let tm = {
        year: date.getUTCFullYear() - 1900, 
        month: date.getUTCMonth(), 
        day: date.getUTCDate(),
        hour: date.getUTCHours(), 
        minute: date.getUTCMinutes(), 
        second: date.getUTCSeconds()
    };
    if (g_bLocalTime) {
        tm.year = date.getFullYear() - 1900;
        tm.month = date.getMonth();
        tm.day = date.getDate();
        tm.hour = date.getHours();
        tm.minute = date.getMinutes();
        tm.second = date.getSeconds();
    }
    return tm;
}

// ##### AUX FUNCTIONS ##### END

// #############################################################################################
/// Function:<summary>
///          	Returns the date part of the indicated date-time value, setting the time part to 0.
///             Takes GML date (day_month_year.time and returns day_month_year part only)
///          </summary>
///
/// In:		<param name="_date">GML (delphi) date format</param>
/// Out:	<returns>
///				Date without fraction (floored)
///			</returns>
// #############################################################################################
function date_date_of(_date) 
{
    let result = -1;

    let tmThis = fromGMDateTime(_date);
    let pT = timeToTM(tmThis);
    if (pT) {
        // Reset the time
        pT.hour = 0;
        pT.minute = 0;
        pT.second = 0;
        result = toGMDateTime(timeFromTM(pT));
    }
    return result;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the time part of the indicated date-time value, setting the date part to 0.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_time_of(_date) 
{
	// BUGFIX: 30633 In the Win32 runtime, this just returns the fmod of the given date value
	return frac( yyGetReal(_date) );
}

// #############################################################################################
/// Function:<summary>
///          	Returns a string that pads a number out to two digits
///          </summary>
// #############################################################################################
function padWidth2(_number) {    
    return ((_number < 10) ? "0" : "") + _number.toString();        
}

// #############################################################################################
/// Function:<summary>
///          	Returns a string indicating the given date and time in the GM format
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_datetime_string(_date) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    
    var str;
    if( g_bLocalTime )
    {
        str =   padWidth2(d.getDate()) + "/" + 
                padWidth2(d.getMonth() + 1) + "/" + 
                d.getFullYear() + " " + 
                padWidth2(d.getHours()) + ":" +
                padWidth2(d.getMinutes()) + ":" +
                padWidth2(d.getSeconds()); 
    }
    else
    {
        str =   padWidth2(d.getUTCDate()) + "/" + 
                padWidth2(d.getUTCMonth() + 1) + "/" + 
                d.getUTCFullYear() + " " + 
                padWidth2(d.getUTCHours()) + ":" +
                padWidth2(d.getUTCMinutes()) + ":" +
                padWidth2(d.getUTCSeconds()); 
    }   
    return str;
}

// #############################################################################################
/// Function:<summary>
///          	Returns a string indicating the given date in the default format for the system.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_date_string(_date) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    var str;
    if( g_bLocalTime ) 
    {
        str =   padWidth2(d.getDate()) + "/" + 
                padWidth2(d.getMonth() + 1) + "/" + 
                d.getFullYear();
    }
    else
    {
        str =   padWidth2(d.getUTCDate()) + "/" + 
                padWidth2(d.getUTCMonth() + 1) + "/" + 
                d.getUTCFullYear();
    }                
    return str;
}

// #############################################################################################
/// Function:<summary>
///          	Returns a string indicating the given time in the default format for the system.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_time_string(_date) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    if (d.toString() == "Invalid Date") {
        return "invalid time";
    }

    
    var str;
    if( g_bLocalTime )
    {
        str =   padWidth2(d.getHours()) + ":" +
                padWidth2(d.getMinutes()) + ":" +
                padWidth2(d.getSeconds());    
    } 
    else
    {
        str =   padWidth2(d.getUTCHours()) + ":" +
                padWidth2(d.getUTCMinutes()) + ":" +
                padWidth2(d.getUTCSeconds());    
    }                
    return str;
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of days in the month indicated by the date-time value.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_days_in_month(_date) 
{
///---->here
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    
    if( g_bLocalTime )
    {
        var monthlens = get_month_lengths(d.getFullYear());
        return monthlens[d.getMonth()];
    }
    
    var monthlens = get_month_lengths(d.getUTCFullYear());
    return monthlens[d.getUTCMonth()];
}

// #############################################################################################
/// Function:<summary>
///          	Returns the number of days in the year indicated by the date-time value.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_days_in_year(_date) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    
    var days = 0;
    var monthlens;
    if( g_bLocalTime )
        monthlens = get_month_lengths(d.getFullYear());
    else
        monthlens = get_month_lengths(d.getUTCFullYear());
        
    for (var i = 0; i < monthlens.length; i++) {
        days += monthlens[i];
    }
    
    return days;
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the year indicated by the date-time value is a leap year.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_leap_year(_date) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    
    if( g_bLocalTime )
        return is_leap_year(d.getFullYear());
        
    return is_leap_year(d.getUTCFullYear());
}

// #############################################################################################
/// Function:<summary>
///          	Returns whether the indicated date-time value is on today.
///          </summary>
///
/// In:		<param name="_date"></param>
/// Out:	<returns>
///				
///			</returns>
// #############################################################################################
function date_is_today(_date) 
{
    var d = new Date();
    d.setTime(FromGMDateTime(yyGetReal(_date)));
    
    var today = new Date();
    if( g_bLocalTime )
    {    
        if ((d.getFullYear() == today.getFullYear()) &&
            (d.getMonth() == today.getMonth()) &&
            (d.getDate() == today.getDate()))
        {
            return true;    
        }
    }
    else
    {
        if ((d.getUTCFullYear() == today.getUTCFullYear()) &&
            (d.getUTCMonth() == today.getUTCMonth()) &&
            (d.getUTCDate() == today.getUTCDate()))
        {
            return true;    
        }
    }
    return false;
}

// #############################################################################################
/// Function:<summary>
///          	sets local/utc timezone for date / current_xxx fns
// #############################################################################################
function date_set_timezone(_timezone)
{
    g_bLocalTime = ( yyGetInt32(_timezone) == TIMEZONE_LOCAL );
}

// #############################################################################################
/// Function:<summary>
///          	gets current timezone for date / current_xxx fns
// #############################################################################################
function date_get_timezone()
{
    if( g_bLocalTime )
        return TIMEZONE_LOCAL;
    
    return TIMEZONE_UTC;
}

