# gas-sign-in
A simple sign-in form (kiosk) designed on Google Apps Scripts (GAS) that tracks attendance and information about a person signing in on Google Sheets, and uses that information to simplify the sign-in process on subsequent visits.

## The task
This project was implemented for a student group that needs to keep track of paper event waivers. The student group gets a new set of waivers every few months, and there might be multiple instances of the event during that period. A participant only needs to sign a waiver once in each period. We wanted an application that could automatically tell a participant if the group already has an up-to-date waiver for them, and as a bonus, help keep track of attendance and gather information about the participant as needed, while being a quick process that folks can do on a tablet as they come in the door.

## Acknowledgements
The frameworks of this app come from many different sources, and I know I didn't perfectly keep track of them as I coded. This app goes beyond the other GAS projects that I was able to find, as it used one script to both (1) pull information from a Google Sheet onto a page hosted on GAS and (2) post information to the Sheet. The insprirations for these two components are:

(1) [A cache of a blog post by Harshit Mehta](https://webcache.googleusercontent.com/search?q=cache:J4roqMx7nVIJ:https://www.topcoder.com/blog/a-simple-webapp-using-google-apps-scripts/+&cd=10&hl=en&ct=clnk&gl=ca&client=firefox-b-ab)

(2) [Jamie Wilson's GAS How-to on Github](https://github.com/jamiewilson/form-to-google-sheets)

## How to build this!

### 1. Create a new Google Sheet
1. Create a blank spreadsheet.
2. Name the spreadsheet.
3. Put in the headers! Everything except "timestamp" is just the name of a field in the form, so if you put different fields in the form, change the headers to match. I used the following headers:

|   | A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|---|
| **1** | surname | firstname | waiver | timestamp | email | notify | student | membershipinterest |

### 2. Create a Google Apps Script
1. Click on `Tools > Script Editor…` which should open a new tab with a brand new scripts. This script is automatically conneted to the Google Sheet we just made, which is assumed in the included code.
2. Name the new script.
3. Replace the default code (at the time of writing, it looked like a `function myFunction() {}` block) with the code in Code.js.
4. Save the script (`Ctrl+S` or `File > Save`).

### 3. Deploy the project as a web app
> **Note:** I have no idea what these steps do. I followed them because Jamie Wilson said to in [their how-to](https://github.com/jamiewilson/form-to-google-sheets), but you may be able to follow different steps and get satisfactory results. I don't know; I haven't experimented.

1. Click on `Publish > Deploy as web app...`.
2. Set `Project Version` to `New` and put `initial version` in the input field below.
3. Leave `Execute the app as:` set to `Me(your@address.com)`.
4. For `Who has access to the app:` select `Anyone, even anonymous`.
5. Click `Deploy`.
6. In the popup, copy the `Current web app URL` from the dialog.
7. And click `OK`.
8. If you have a custom domain with Gmail, you _might_ need to click `OK`, refresh the page, and then go to `Publish > Deploy as web app…` again to get the proper web app URL. It should look something like `https://script.google.com/a/yourdomain.com/macros/s/XXXX…`.

> The link you are copying is for a formal published version. If you are making changes to the project and doing frequent testing, you want the link that ends in `\dev` instead of `\exec`. You can copy this from the link that says `Test web app for your latest code.` instead of the `Current web app URL`. Be sure to change it back when you formally publish your app.
> See the [Google Apps Scripts guide for web apps](https://developers.google.com/apps-script/guides/web#deploying_a_script_as_a_web_app) for more information. 

### 4. Set up the webpage which will act as your sign-in kiosk
1. Create a new html file: `File > New > Html File`.
2. Name the file `index.html`.
3. Replace the default code with the code in index.html.
4. In the new code, replace the current form action `<SCRIPT URL>` with the link you copied in Step 3.

### 5. Try out your new sign-in kiosk!
1. Visit the link you copied in Step 3.
2. Test!

## Find a bug? Have feedback or requests?
Please [create a new issue](https://github.com/nmady/gas-sign-in/issues/new). We're aiming to deploy this app at our next event in August 2018, which is when the true testing begins. Hope this app helps someone with their GAS project.
