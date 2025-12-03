# README for creative web assessment two
## TimeCap

### Proposal
- My proposed web app is a social media app called TimeCap. This will be a time capsule app where users can create albums of trips, events, and more, and take photos or videos to lock within these albums for a set period, such as a year. Once that time is up, the album gets unlocked, and the user can reminisce about their previous trip.
- I want the app to output the media as a Polaroid to add to the UX and give it a more dated look.
- I think the app should allow an initial look at the media for security reasons, as well as allow the user to delete/re-take, but once they are happy and have submitted the media, not be able to access the media until the set time is up.
- I want this to be an app that allows the user to visualise and reminisce on their memories of the past. Maybe it's been a couple of years, and they're about to go on another trip, and a locked drip gets unlocked, and they get to experience their previous trip again, all in one location and using a Polaroid format to boost the nostalgia factor.
- Once unlocked, the media will be public to followers.

### Ideas for the app
- From a technical standpoint, the stack I'm thinking of using would be Node.js for the backend, React-Bootstrap for the front and MongoDB for the database, as it's a no sql query database and will be sufficient enough for the amount of data I will be storing.
- The camera functionality will be an API, I'm thinking the Media Devices API, as it's free and built into browsers.
- For the "locking capsule" part, I will add a release date field to MongoDB.

### How will the app use data
- Firstly, the app will contain user profiles, so user login details and profile pictures will be stored.
- The app's purpose is to capture memories and lock them for the future, so the app will also store pictures and videos.
- The app needs to store dates and times to accurately unlock the media.
- App may also include locational data of where the media was taken.

### How the app may present a novel experience
- I think the main novel experience is not having your content immediately on show, which I think will attract more genuine content and not fake media for instant popularity or gratification.
- I also feel that this idea is a perfect blend of emotion and technology. Allowing for nostalgic memories, reliving times with loved ones, and for self-reflection on where your life has been and is going. And it makes users think about future selves.
 
### Target Audience
- I think the main big one is for people who enjoy reminiscing, who love the nostalgic feeling.
- People with bad memories - this app not only shows them a visualisation of memories it also allows time for people to be surprised when they get reminded of trips and memories they have perhaps
- forgotten.
- The album feature is great for people who love documenting their lives, as it allows them to keep all media in one location.
   
## Key Techniques For submission two
- The main techniques involve the use of GET, POST, and fetch requests with express js and mongoose for connecting to a MongoDB cluster.
- However, the key features added are an admin page that only gets added to the navbar when the user has been verified as an admin. On this page, the admin can view both users and their posts and delete either specific posts or the user and all their posts.
- The app page also now features like buttons on all the posts with a like counter; the like button, however, is only allowed for non-authors of the post. When the author tries to like their own post, a message pops up saying that liking is not permitted to the author and the like is not logged into the database.
- The system also now features a profile page where the user can change their name, and their change gets updated and saved into MongoDB and also displayed on the app and profile pages.
- Also, the login page is served with ejs - Dave and I spoke, and he was happy for me to just serve the login page as we discussed that I want to learn and use React for my front-end.

### The proposed technology stack and application architecture 
- My proposed stack that will be implemented into my app is the MERN stack (MongoDB, Express, React, and Node.js).
- I selected this stack because it is the industry standard for modern web development. By mirroring a real-world environment, this project allows me to build the practical skills necessary for a professional role.
- Mern has grown to be very popular as the Full-Stack of JavaScript with Express and Node as the backend seamlessly intergrates with the JavaScript/JSON data formatted MongoDB that eliminates the need to introduce more languages such as SQL.
- React remains the most popular frontend libary due to its component-based architecture, flexibility, large community, and massive ecosystem. As well as its ability to be highly scalable and still keep its high performance.

### UI/IX design considerations
- All of my designs have been created using the software Figma:
Home Page:
<br>
<img width="706" height="601" alt="image" src="https://github.com/user-attachments/assets/fd30e18c-cd5e-447d-ae43-b3bca95eb9c9" />
<br>
Time Capsule Album Page:
<br>
<img width="693" height="631" alt="image" src="https://github.com/user-attachments/assets/a7835737-4101-4b5d-ab14-1f68307baf1d" />
<br>
Camera Page:
<br>
<img width="723" height="626" alt="image" src="https://github.com/user-attachments/assets/2a1f3611-e333-4089-9f5b-e2a0818c50fb" />
<br>
