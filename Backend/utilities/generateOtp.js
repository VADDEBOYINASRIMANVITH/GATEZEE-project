module.generateOtp = () => {
     otp = "";
     for (var i = 1; i <= 6; i++)
     {
          otp += Math.floor(Math.random() * 10);   
     }

     return otp;
}