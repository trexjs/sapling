```js

Auth
- For students or teachers to login they need to create an account on the platform with,
    - username or email & password

Email & OTP Support
    - Welcome Email
    - Verify the school 
    - Forgot password
        - Username or email or phone number
        - New pass
        - Confirm pass
        - Enter the OTP
    - Reset password
        - Username or email or phone number
        - Old pass
        - Confirm pass
        - Enter the OTP
- Passwords are of 6 digits ( numbers, alphabets, special chars of only _,@,#,$,%)
- Create all the email templates in single folder named `templates`
- We need to use AWS SES for email configuration or we can use any solution for that matter to test out in developement environement
- bycrpt package
- refersh token mechanism
- salt 
- store token & other data in a config.json file


Create a config file from where we can manage which apis are private / public & how can access them

```