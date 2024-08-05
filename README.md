# Project Write-Up: Movie Watchlist

## About the project

Scrimba Frontend Career Path

Module 8: Working with APIs

Project: Movie Watchlist

Brief: Create a Movie Watchlist app with two pages. One page should have a search functionality that pulls movie results from OMDb’s API. You should be able to add individual movies to a watchlist. The second page should display the watchlist contents.

## Testing / Review notes

A few things to be aware of while testing the app….

- Most of the work in this project is out of scope of the assignment, most of the relevant material is in /data/omdb.js
- If you don’t want to ‘sign up’ you can use test credentials username: [morpheus@zion.com](mailto:morpheus@zion.com) and password followthewhiterabbit
- The sign-up feature is fully functional, feel free to enter any silly details to test (there is no verification for the sign up email address (e.g. you could just put x@y.com), but you’ll need to remember what you put to sign in again afterwards. You don’t have to sign up as there are test credentials available, but the sign-up form has some fun validation
- There are a couple of small bugs that will show up in the scrim console but I haven’t tracked them down yet; one ‘unknown’ error if you use auto-complete to fill out an input, so probably something related to my validation, and then another bug which sometimes occurs reading a classList; I will get around to tracking this down at some point but there is now quite a lot of code to go through and I can’t re-produce the error locally for some reason
- The google and github sign in features are functional but not in the scrim due to pop-up restrictions, they will only work in the Netlify version
- Be patient when searching for movies, the way I’m retrieving the data to display can cause some slowness, haven’t worked out a good solution for this yet. There is a friendly progress bar to keep you informed of your search progress, lol

# The project

## Planning

Straight away decided I’d like to use some kind of database instead of local storage. I think I’d also like to try implementing authentication so that the app can be used by multiple users, each with their own lists. I’d also like to add some functionality whereby the user can write a brief comment about the movie, maybe a toggle to say that they have watched the movie or not. This means we’ll probably also need some kind of filtering to show/hide watched movies. I think that’s probably enough to be getting on with…

I have used the realtime firebase database for a few projects now, but intrigued to try firestore so I think we’ll go with that…

### Features (planned)

- 2 page app, Movie Search and Movie Watchlist
- Modular design with vanilla JS ‘router’ (will re-use from Learning journal)
- Fully responsive with mobile/desktop views
- Firestore for data storage
- Firestore for authentication (?)
- Boxicons for, well, icons
- Finishing touches…
  - Ability to rate a movie (maybe re-use star rating functions from M5: Restaurant Ordering Project?)
  - Ability to add a comment for each movie
  - Ability to mark a movie as watched/unwatched
  - Pagination for many results, if needed
- I had this idea a couple of days later…what about a kind of timeline that shows you what you watched and when? Ooo…and I was hoping to get this one done quite quickly…

## A first for everything

These are the things I used for the first time in this project (probably why it took so long, haha)

- Firestore Database
  - CRUD operations, transactions, queries, although didn’t get round to using sort
- Firestore Authentication
  - Signing up with email, signing in with google, github accounts
- Shave.js, a small but cool library for truncating text
- A whole bunch of other built in javascript functions and html features that were necessary to get this working how I wanted, inc. but not limited to:
  - Lots of work with the event object related to positioning (listmenu.js)
  - Working with getting user input back from a modal (modalwithconfirm.js)
  - html5 progress tag/element (progressbar.js)
- ChatGPT for helper functions; many functions in utils.js was written by ChatGPT and just required a few small tweaks, some of them I didn’t need to change at all and worked perfectly straight away

## The build process

- This ended up taking me a long time, as work got pretty crazy right around the time I started, along with many other things happening in life—which meant I wasn’t able to complete this as quickly as I’d hoped. I’d say the finished project represents approximately 60-80 hours of work/research
- Some days I wrote as little as two or three lines of code, other days I was able to carve out a few hours of precious time. Much of the project was completed during my train commute to work whilst connected to my mobile hotspot 🤣
- I followed the same basic methodology that I did for simpler projects, although I did get hung up a few times as there was so much more going on with this one. Getting the basic functionality down before working on styling was still the overall path
- To speed things up I re-used a lot of existing modular code from my color scheme generator project (as you can see the designs are fairly similar, the way the header/footer/nav menu look and feel is very similar. I changed up the color scheme toward the end of the project to give it more of a different feel
- The database implementation wasn’t as difficult as I’d feared it would be, although there were many, many frustrations along the way mostly relating to the order of my async code and not understanding certain features/functionality of async (e.g. when to use promise.all or go for sequential processing in a for…of loop) which caused me some lingering niggles that took a while to resolve. It took a while to decide on the actual database structure and having now read more about firebase I see I’ve set it up in a very inefficient way more like an old school sql database, but by the time I realised I was too far in, haha
- The authentication side of things was actually fairly straight forward, there is plenty of info available on the web and again the most time consuming thing was probably just the research at the start and getting everything set up
- Overall I’m happy with what I achieved, and the end result was better than I’d hoped for at the outset, so I’m glad I spent the extra time on it! Looking forward to moving ahead on the course path

## Scrim notes

- You can use the following credentials to test the functionality: [morpheus@zion.com](mailto:morpheus@zion.com) and password followthewhiterabbit
- Additionally, feel free to create a test user if you want. The sign up form has some fun validation stuff going on, and It doesn’t require email verification so feel free to create any silly test user account, you’ll be able to log in and play around
- I disabled google and github login features as signInWithPopUp doesn’t work in a scrim, if you’d like to test that functionality please use the Netlify build
- Trying to get this project working in a scrim highlighted a few more bugs that needed to be tracked down mostly related to imports
- Please be patient when searching for movies…there are a lot of API calls going out as I’m pulling more data than I should be for the movie results (full data for each movie). This can take a while, I may have to simplify the data shown in the movie results in an update to make the search faster—it was taking so long I ended up adding a progress bar to show progress instead of just a static spinner
- If you end up waiting longer than ten seconds or so for the results, you’ll probably have to refresh and try again…or use the Netlify build

## Netlify deploy notes

- Couldn’t build at all using TLA (top level await) to load some of my async modules; received a build warning along the lines of ‘Top-level await is not available in the configured target environment’ or similar. Turns out not so much a netlify problem but the bundler that netlify uses to build the project (esbuild). Was using ES2020, and needed to use ES2022. Fixed by adding the following to the Vite config…
  ```jsx
   build: {
  	  target: "es2022"
  },
  esbuild: {
      target: "es2022"
  },
  optimizeDeps:{
      esbuildOptions: {
      target: "es2022",
      }
  }
  ```

```
build: {
    target: 'es2022',
  },
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
```

- I’d accidentally used http instead of https in my omdb api calls, so after I deployed to Netlify they didn’t work, at all. Browser console quickly revealed the issue, easy fix
- Used a very basic method to hide API keys from repository, without using dotenv, by running the a command at build time and then importing the APIs in code. This is not ideal as it still means the API keys are compiled into the frontend, but better than leaving them in the repository, at least

## Project timeline

Think of this as a diary of my ‘process’. I put process in quotes because its more just things spilling out of my brain as and when I think of them. I don’t necessarily always start with the design…sometimes I do, if I have a strong opinion about how the finished product should look. But with some projects, I focus on coding some functionality first; while I’m doing this, some kind of design ideas usually start to flow, at which point I’ll jump into Photoshop or Figma to record said ideas.

## 📆 Timeline & process (toggle open if you’re interested)

### May 23, 2024

- I decided on what features to include, quickly realised this could turn into a huge effort so narrowed it down to a few things I really wanted to implement, as detailed under the Planning heading above. Hopefully will get some time to start coding later.

### May 24, 2024

- Created new git repository, cloned it locally and scaffolded a new vite project
- Created the folder structure
  - ‘pages’ — js, css and/or html relating to project pages. router.js will also go here
  - ‘data’ — a module containing all api functionality will live here, as will any firebase stuff going forward
  - ‘styles’ — global css styles will live here
  - ‘utils’ — utils and helper modules will go here
- Decided on a working title for the app with the help of my good friend ChatGPT 4. I’m calling it ‘Reel talk’ for now (imagining some future social elements haha).
- Did some basic project setup, adding simple html stuff like title, etc. Vite takes care of the other basics like doctype, lang, viewport, etc.
- Applied some basic CSS rules. I found [this ‘modern’ CSS reset](https://www.joshwcomeau.com/css/custom-css-reset/) which was very similar to a lot of the stuff I already change before each project…plus a few extra goodies. It’s super minimal which I also like.
- Watched [Getting started with Firebase Authentication on the web](https://www.youtube.com/watch?v=rbuSx1yEgV8)
- Took a deep breath, set up a new project in firebase, created a firestore db instance and authentication instance with a test user
- Read about alternative ways to import Firestore (instead of Firebase SDK via npm) as I wanted to make sure it works in the Scrimba editor
- Set up basic firebase import code. Because of the way I structure the modules, and because of using async code in the module, I had to come up with a way of loading the module but having the script wait for it. [This](https://www.notion.so/Project-Write-Up-Movie-Watchlist-acfe83807c484cd0a6688fecca615520?pvs=21) gave me half the answer, but as my module load asynchronously, returning a promise, I needed a way to await it’s fulfilment properly otherwise subsequent code won’t run. I ended up using a dynamic import inside an IFFE function like so…have to use this where ever I import my db module
  ```jsx
  const db = await (async () => {
    const { db } = await import('./data/db')
    return db
  })()

  // Do stuff with db
  ```
- Set up basic firebase authentication functions, eventually tested successfully. Time to call it a night.

### May 25, 2024

- I don’t have much access to my laptop today but spent some time googling for things that will be useful later in the project
- CSS Timelines - [https://freefrontend.com/css-timelines/#google_vignette](https://freefrontend.com/css-timelines/#google_vignette)
- Firebase Auth UI - [https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
- OMDB - [https://www.omdbapi.com](https://www.omdbapi.com/)
- Firestore docs - [https://firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore)
- Got on my laptop in the evening and wasted 2 hours trying to get firebaseui to work, before realising it’s no longer properly compatible unless using firebase with the compatibility libraries, which don’t work when loading from CDN. I wanted to use firebase ui for all the login/logout/signup flows but looks like i’ll be building those from scratch now
- Got basic google auth working via firebase

### May 26, 2024

- Copied the ‘router’ code from my Learning journal project and started to adapt it for the movie watchlist. Previously the router only rendered the main section of the page in between the header and footer; this time I want it to render header/main/footer with every page change. Easier for updating nav, etc.
- Created a folder for components, as forgot that one when planning
- Scaffolded the header and footer components, and home page. Created other files for the ‘Find movie’ and ‘Watch list’ pages
- Added CSS reset, just stuffed it into the global ‘styles.css’ sheet as this won’t contain much else

### May 27, 2024

- Only got an hour in today, so spent that mostly ironing out a few wrinkles in my routing code
- Tomorrow I’ll write the code for the OMDb search functions and also make a start on the Firestore functions

### May 28, 2024

- Morning commute
  - Started watching an introductory series about Firestore, [here is a link to Episode 1](https://www.youtube.com/watch?v=v_hR4K4auoQ). Should have a bit more time to work on the project later today; catching a flight to Luxembourg as my company is soon moving premises there, and I have to go and do some prep work for that! But this evening I can spend mostly learning (hopefully)
  - Did a bunch of reading about setting/accessing environment variables in Netlify (to hide API keys etc)
  - Signed up for my Omdb API key, wrote a test function to check it was working
  - I wanted to set up prettier before I get too much further into the project, so bookmarked this article about [setting up prettier with vite/npm](https://dev.to/sharathmohan007/setup-prettier-with-vite-vs-code-3fme) for later reading
- Airport lounge
  - Read the above article re: prettier
  - Wrote the API functions to pull the movie data from OMDB. Probably the most straight forward part of the project. Ended up with just two functions, one for search and another to pull the data for a single movie
  - Copied over some more CSS that I will re-use from old projects for example the css for the loading spinner I used in the Invoice Creator and Color Picker projects

### May 29, 2024

- Watched [Episode 2 of the Firestore series](https://www.youtube.com/watch?v=Ofux_4c94FI&list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ&index=2) on youtube.
- Also, here is the [complete playlist](https://www.youtube.com/playlist?list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ)

### May 30, 2024

- Barely managed to spare 15 mins to read some more about firestore collections/documents. Hope to find more time tomorrow but it’s not looking good 😂

### May 31, 2024

- Watched [How to structure your Firestore data](https://www.youtube.com/watch?v=haMOUb3KVSo&t=31s)
- Came up with [this](https://www.notion.so/Movielist-data-structure-firestore-45627668ac744aa38c3da89cd127aef8?pvs=21) as a basic plan for data storage

### June 1, 2024

- Saturday, should of got up earlier but was sooo tired. Got up late but feeling fresh at least, had an hour or so to kill so did something easy. Imported the rest of the header and footer components from my color scheme generator, tweaked them for this project. Made a logo for the app with inspiration from google images, as always. Well, I say made…more like directly copied (pen tool in Photoshop for the win) with merely a slight rotation for added freshness.
- Decided I think I’ll go with a dark theme only for this app, got enough to do already without adding extra themes
- Out for dinner with friends tonight, but if I’m back early enough I might work on firebase read/write functionality
- Read this page whilst en route to friends, bookmarking here for later use: Get Data with Cloud Firestore
- [https://firebase.google.com/docs/firestore/query-data/get-data](https://firebase.google.com/docs/firestore/query-data/get-data)

### June 2, 2024

- Had some time in a hotel in the evening, so decided to make the routing module ‘user aware’ so that it can either either allow or deny access to a page based on authentication status, and do other stuff like show different menu options if the user is logged in
- Added another field to each route in the routing object, `requiresLogin`, which is just a simple boolean and lets the router know if it should check for a logged in user before displaying the page
- The thing that tripped me up for a good while here was where to place the onAuthStateChange call within my modular structure. I was having an issue where if I tried to access a page that shouldn’t load under a given scenario (e.g. the signin page should redirect if a user tries to access it while already logged in. by typing the URL manually) the page would briefly load before the onAuthStateChange fired off and redirected it. Not a dealbreaker but a visual anomaly I’d rather not have.
  The solution was to move the onAuthStateChange call into my router.renderStartPage() function which is always called the first time the page loads or upon a refresh (or when user hits return, for example after typing a URL). I moved all the logic of deciding what should happen when the auth state changes into this function, which is the first thing to be called…in this way it prevents the ‘router’ from rendering anything before the authState has been determined.
- Then just needed to tweak it with a few if/else statements to make sure that it does the right thing when the user logs in/out, and voila.

### June 5, 2024

- Well, I didn’t get anything done for a few days as had a big project on at work which left me exhausted. This morning on my commute I cleaned up and re-factored a little, to get ready for the next part of implementation. Didn’t have any time for coding for the rest of the day 😒

### June 6, 2024

- Started on the movie search and lists pages. Then realised I needed to backtrack to firestore as we’re going to need user profiles etc to pull the right data and to create the watchlist(s) for the right user. Only had 30 mins in the morning and 30 mins in the evening but managed to build functions to read/write a user profile document to firestore

### June 8, 2024

- Today was super fun, it’s a bit sad but I got the jitters from excitement working with firestore, haha.
- Main references I used today were…
  - [https://firebase.google.com/docs/firestore/query-data/get-data](https://firebase.google.com/docs/firestore/query-data/get-data)
  - [https://firebase.google.com/docs/firestore/manage-data/add-data](https://firebase.google.com/docs/firestore/manage-data/add-data)
  - [https://stackoverflow.com/questions/69519447/how-to-get-server-timestamp-from-firebase-v9](https://stackoverflow.com/questions/69519447/how-to-get-server-timestamp-from-firebase-v9)
  - [https://firebase.google.com/docs/firestore/manage-data/transactions#transactions](https://firebase.google.com/docs/firestore/manage-data/transactions#transactions)
- Built most of the simple functions I’ll need, then started looking into ‘transactions’. This is where you batch reads and writes into the same function, and all the operations are executed together.
- Had a few weird issues but then spotted it was because I wasn’t using async/await properly in some places. Having worked with async/await a bit now, I’m starting to realise—when I get certain errors—that they are indicative of an async issue, so that’s good. I’m learning something!

### June 9, 2024

- Converted all db write functions to transaction based operations, where it makes sense. Usually when writing there is some element of reading that goes with it…for example, if I’m adding a movie to a list, I’m probably going to want to make sure that movie doesn’t already exist on the list. So the transaction wraps the ‘read’ (is the movie on the list?) and the ‘write’ (put the movie on the list!) into the same ‘unit’, or part of the function. But when creating a new list, well, every list is created with a unique ID, so not much checking to do there and we just create the list without doing anything prior.

### June 10, 2024

- Worked on fleshing out the various functions. Decided I wanted a local collection of the full movie data, which would only be accessed when loading the lists, as I didn’t want to pull the full data every time I pulled a list from the DB. Had to write a few extra functions to make this happen and might seem like overkill, but it gave me more chances to work with async / await and practice adding / removing from firestore.

### June 11, 2024

- Created queries to load all lists for the uid of the current user
- Created a ‘list’ page/module that loads a single list when called with the doc.ref.path as an argument
- Finished all the core functionality, tomorrow can start thinking about styling. Planning to keep this one fairly simple from a styling perspective as I spent so long on functionality already
- Really pleased with what I’ve been able to achieve with firebase/firestore. I’m a happy lad 😎 but still far from being finished

### June 12, 2024

- Forgot a couple of things…created new list button and add movie to list button, along with auto refresh functionality for when new lists are added and removed.
- Used onSnapshot with a query, in order to listen to changes only for the lists belonging to the logged in users’ uid.
- Used onAuthStateChanged to determine when to start listening for changes or not…this is really a must for any content that users a logged in users data that needs to be retrieved on the initial page load

### June 13, 2024

- Built a little context menu that pops up to let the user choose which of their lists they’d like to add a movie to
- This was a lot more work than I’d imagined! Found a cool page with some info that helped me blast out the code for the menu, although I had to modify it as it used some deprecated code. But that was the quick part…
- Then took me a good while to figure out a good way to get the IDs of the lists through to the context menu module, and to make sure it was always the right lists for the signed in user etc. This messed with my head but got there in the end!

### June 14, 2024

- Realised I forgot to add a Remove button to each movie when shown in the list view to allow the user to remove it, so I added that in on my train journey to work! Lovely quiet train on a friday these days when most of the city seems to be working from home. So, easy to GSD!

### June 15, 2024

- Worked on handling errors e.g if you try to sign up with github but you already have an account registered via google
- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- Learned a bit more about error handling and that you can destructure out parts of the error to use for specific error cases
- Added github as an auth provider
- Fixed re-direct bug when signing up as a new user via the email/password form
- Fixed the onSnapshot listener bugs for lists view and individual lists view where sometimes it would show old lists from the previously logged in user
- Re-factored the onAuthStateChange listener that handles whether or not to allow access to pages that require a login, changed to using an object based approach instead of a big if/else tree

### June 16, 2024

Started work on CSS but was a bit directionless, decided I did need a Figma design afterall. Just did a quick mockup to give me something to work towards. Here it is…

### June 17, 2024

- Wow this is a busy week, just about managing an hour a day on my commute
- Worked on CSS for the find movie page

### June 18, 2024

- Finished CSS for find movie page, trying to work out how to deal with different lengths of text in the plot-list

### June 19, 2024

- Implemented a cool little module called ‘shave.js’ which truncates text based on the desired pixel height of the element
- Learned about and implemented an ‘observer’ that I’m using to fire the shave function on all the plot text as the main node element changes size. I wanted the movie cards to reflow with the resizing, so need to constantly adjust for the size of the ‘cards’

### June 20, 2024

- Realised I needed a modal popup in the even the user tries to add a duplicate movie to a list
- Turned to my trusty dialog element for the modal, but had a few woes trying to get it working…got frustrated and went to bed

### June 21, 2024

- Turns out the issue with the modal was just my tiredness, fixed that on the morning commute :-)
- Updated use of the modal in other areas, i.e. to warn if there are no lists created yet
- Styled the modal, added functionality to close it if clicking outside
- Added ability to pass a custom message through to the modal
- Added code for the nav menu to apply a style to the active page
- Made a lot of progress today but at the moment it feels like every time I cross one thing off my todo list, I add two more
- Tomorrow I’d like to tackle the mylists page at least, possibly the movies page also. I moved a lot of the CSS from the findmovies.css file into pagesglobal (e.g. header and movie card styles) so I can re-use them on the other pages tomorrow
- So much re-factoring still to do 😕

### June 24, 2024

- Ok we didn’t get much done, only had an hour total today to work on the project…
- Added the individual page header styles and elements to mylists and individual list pages

### June 25, 2024

- Styled the lists page

### June 26, 2024

- Wrote all the functions to update the watched attribute of each movie, had to also make sure to pull this data into the list.js module when rendering a movie list so we can show the right value
- Used chatgpt to create a function that calculates the percentage of watched movies from an array of boolean values gleaned from the current movies in a list. Fun!

### July 1, 2024

- Only had a precious few minutes per day for the last few days, just worked on updating the styling for the findmovies.js and list.js files, as they’re basically the same and use the same css (pagesglobal.css); not sure that’s the best place for this CSS, if it was a real project I’d probably move it but it’s staying where it is for now
- It’s really coming together, all of the main UI is now in place except for welcome and sign up page. Will get some basic content/styling in place for those and then it’s time to re-factor and work through my small ‘nice 2 have’ list!
- Finished building out the ‘watched’ toggle button, played around with a couple different active styles till I found one that matched what I had in my head

### July 2, 2024

- Added users photo in top right when signed in
- Added a default image for users that don’t have a photo
- Implemented a feature to parse out the first name/family name from the display name when signing up with github

### July 3, 2024

- Fixed the refresh bug in the router so that refresh works when viewing a list

### July 4, 2024

- No coding time today :(

### July 5, 2024

- Fixed up a bunch of small things from my to do list such as
  - Added the IMDB link to each movie card in a list
  - Added placeholder image/text for empty lists, or no lists, and empty movie search
  - Added a spinner to give a visual indication that something is happening after the user clicks to add a movie to a list; wanted to have a little tick animation or something, but running out of time and would like to get on with the rest of the course now 🙂

### July 8, 2024

- Back at it after a weekend of no coding (studying for Azure exams)
- Styled the sign-up page
- ‘Fixed’ an annoying bug where the page wouldn’t load immediately after user creation (due to the way I’m creating the user account, and the header needing the account info straight away on auth state change)
- Used a tip off of stack exchange to create an execution delay using a promise and setTimeout
- Heavily modified the validation functions for the form, basically completely re-wrote them, to try and mimic the ‘modern’ style of form validation. Pleased with the result!

### July 9, 2024

- Styled the homepage and sign in page
- Implemented the new style of form validation on the sign in page
- Implemented a little function to show login / signup errors like bad credentials or email address already used, etc

### July 11, 2024

- Fixed a bunch of dodgy CSS
- Spent ages troubleshooting a weird bug where the modal sometimes doesn’t get added so the delete list button doesn’t work…improved it but still noticed it happen a couple of times…still not sure why it’s happening though. Eventually was testing all different scenarios but couldn’t re-produce the bug, so moved on to something else
- Changed header logo so it goes to ‘my lists’ page if the user is signed in, if not it goes to the homepage
- Added spinner while API is grabbing the movie info, on the main search
- Re-factored the ‘shaving’ function as it wasn’t firing under specific circumstances (e.g. initial page load)
- I think the only major things remaining are…
  - Responsive design
  - And finally, refactor anything that needs it
  - Upload to netlify
  - Share!

### July 14, 2024

- A bunch of small fixes and polish ups, e.g. enter key can now be used to create a new list or perform a search
- added loading spinners all over the place, for new movie search, sign up, sign in
- Finally fixed the modal bug (have to add it both in get and refresh functions as one is sometimes called independently of the other

### July 17, 2024

- Ugh. The end is in sight. Hammered out all the responsive design, almost in one sitting (then realised I forgot to style the context menu for mobile so make that two sittings)
- Then just colour scheme and sign in with redirect on mobile and I think we can actually call it done!
- Still having difficulty getting the shave function to fire at the right time…I’ll get there if it kills me 😂

### July 20, 2024

- Hammered everything else out over the last few days, haven’t had time to do my little entries 😟
- Responsive design finished, re-did the whole color scheme using guidance from [this epic page](https://m2.material.io/design/color/dark-theme.html)
- Ended up re-coding a few css files from the ground up as I’d used a desktop first approach in some of them, and wanted everything to be mobile first
- Fixed the text shaving issue by putting a loop in the function that basically repeats the shaving until the tallest element is within the height limit specified
- Re-factored some other sloppy code, made all the event listener implementations more uniform
- Commented everything…there’s a lot going on in this project but I want anyone looking at it to be able to understand as quickly as possibly what’s going on, especially if they are earlier on in their coding journey…so have commented as much as possible
- decided not to implement security permissions in firebase for this project as it’s only a ‘demo’, and also I think the way I’ve implemented the db structure doesn’t really take advantage of Firestore’s optimisations and will make permissions a little more difficult. Maybe not, but this has been a long project and I think I’m done for now. Ready to move on!

### July 23, 2024

- Ok, whilst commenting all the code I found two more annoying bugs, one was related to position of the context menu when adding a movie in mobile mode; to fix it I used a javascript media query to ensure that the position of the menu is rest to top: 0 and left: 0 when the situation is (min-width: 500px)
- Secondly the functionality to limit the text to 3 lines still wasn’t firing properly on initial rendering of a movie list of movie results on the find movies page. Went down a rabbit hole and learned all about the render tree and frame re-painting and reflows and dirty nodes in the DOM and anyway, discovered I can use requestAnimationFrame to essentially tell the browser not to perform certain functions until everything has synced up and the render tree is clean. The reason this works is that my shave function was firing too quickly and getting incorrect (out-of-date) height information for the newly rendered elements. It worked with a set-timeout but that felt too unpredictable and was ugly on screen as you saw a brief flash of the full size element before the shave function stripped it down. Two calls to requestAnimationFrame fixed the issue, and the effect is now triggered reliably and with barely any visual indication that it’s happening
- Finished commenting the code! Now to get it working in a scrim and submit for review…

### July 30, 2024

- Actually getting this working inside a scrim wasn’t too bad in the end…only needed a few small adjustments here and there, mostly to do with import paths
- I disabled Google / Github auth modes inside the scrim as well, as the popup sign in method bugged out
- At the last minute decided I needed a progress bar to show movie loading progress as the many api calls often caused it to appear quite slow and I don’t like the feeling of sitting there just watching a spinner wondering if anything is actually happening

## End Notes / Observations / Random thoughts

- Apologies that I didn’t keep up with posting the links to all the resources I used. I went on to read so much that in the end I just kept forgetting to link to it all in my daily entries. I’m thinking about writing a blog post series to describe everything in this project in more detail so stay tuned for that if you want to know more…?
- I didn’t implement any proper security rules on the database, in a real project it would be important to lock down each user only to his/her relevant info, maybe will get around to this in the future but for now leaving it as is
- I used ChatGPT to save myself a little time on this project (only a little, though). I got it to write most of the functions in the utils.js module, pretty cool…I actually found it _very_ intuitive when it came to understanding what I wanted each function to do. Everything needed minor tweaks but, it was very useful still.
- There is only minimal error checking for a live internet connection, real app would need more of this, I feel
- Only minimal error checking for sign in/sign up issues, real app would need more errors/alerts
- The CSS is all over the place, it started out well but there are some things in the wrong places now, and some of the class names/positions don’t make sense any more. Maybe I will re-factor this at some point but for now I’m done
- Didn’t get around to implementing a proper sorting function for the movies, so they appear in a random order at the moment which is kind of annoying but not the end of the world. I have timestamped each entry of when it was added to the list, so could use that maybe to organise them in future
- I didn’t end up implementing the filter function for hiding watched movies…another nice to have which I’m sure I’ll implement in future
- If you decide to test the ‘sign up via email’ functionality, bear in mind there is no email validation flow, so be sure to enter email accurately 😝 (or you can just put in any email address, actually, as it doesn’t send anything, just uses email for the login id)
- The progress bar was a last minute addition and uses the html progress tag which is quite cool, styling it was a pain though and as you can see it looks a bit ‘mis-placed’ just hanging out in front of all the other elements
- I highly recommend this process of keeping extensive notes for your projects…I’ve retained so much more knowledge from this project just by ‘journaling’ my progress. Next time I think I will have a dedicated section in the project notes for issues I’ve come up against and how they were solved
- ~~I’m not overly happy with how I’ve implemented loading of a single list, although it _does_ work…I don’t like that in router page.get can be called with or without user and listpath, it seems too vague and hard to read for another developer to look at -~~ **FIXED!**
