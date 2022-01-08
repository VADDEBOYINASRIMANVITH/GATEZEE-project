 module.exports = (Time) => {
     console.log(Time);
     let [time, meridian] = Time.split(' ');
     let [hours, mins] = time.split(':');
     let hour = 0, min = 0;
     min=parseInt(mins)
     if (hours == '12')
     {
          hours = '00';    
     }
     if (meridian == 'pm')
     {
          hour = 12 + parseInt(hours);
     }

     console.log('in 24 hour format');
     console.log(hour);
      console.log(min);
      //return milliseconds from 00:00 time to given time
      return ((hour*60*60+min*60)*1000)
 }


// function convertTime(Time)
// {
//      console.log(Time);
//      let [time, meridian] = Time.split(' ');
//      let [hours, mins] = time.split(':');
//      let hour = 0, min = 0;
//      min=parseInt(mins)
//      if (hours == '12')
//      {
//           hours = '00';    
//      }
//      if (meridian == 'pm')
//      {
//           hour = 12 + parseInt(hours);
//      }

//      console.log('in 24 hour format');
//      console.log(hour);
//      console.log(min);
// }
 

