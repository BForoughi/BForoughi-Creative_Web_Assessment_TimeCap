# README for creative web assessment two
## TimeCap

### Proposal
- My proposed web app is a social media app called TimeCap. This will be a time capsule app where users can create albums of trips, events, and more, and take photos or videos to lock within these albums for a set period, such as a year. Once that time is up, the album gets unlocked, and the user can reminisce about their previous trip.
- I want the app to output the media as a Polaroid to add to the UX and give it a more dated look.
- I think the app should allow an initial look at the media for security reasons, as well as allow the user to delete/re-take, but once they are happy and have submitted the media, not be able to access the media until the set time is up.
- I want this to be an app that allows the user to visualise and reminisce on their memories of the past. Maybe it's been a couple of years, and they're about to go on another trip, and a locked drip gets unlocked, and they get to experience their previous trip again, all in one location and using a Polaroid format to boost the nostalgia factor.
- Once unlocked the media will be public to followers.

### Ideas for the app
- From a technical standpoint, the stack I'm thinking of using would be Node.js for the backend, React-Bootstrap for the front and MongoDB for the database, as it's a no sql query database and will be sufficient enough for the amount of data I will be storing.
- The camera functionality will be an API, I'm thinking the Media Devices API, as it's free and built into browsers.
- For the "locking capsule" part, I will add a release date field to MongoDB.

### How will the app use data
- Firstly the app will contain user profiles so, user login details and profile pictures will be stored.
- The apps premice is to capture memories and lock them for the future so the app will also store pictures and videos.
- The app needs to store dates and times in order to accuratley unlocked the media.
- App may also include locational data of where the media was taken.

  ### How the app may present a novel experince
  - I think the main novel experince is not having your content immedietly on show, which I think will attract more geniue content and not fake media for instant popularity or gratification.
  - I also feel that this idea is a perfect blend of emotion and technology. Allowing for nostalgic memories, reliving times with loved ones, and for self reflection on where your life has been and going. And it makes users think about future selves.
 
    ### Target Audience
    - I think the main big one is for people who enjoy remincing about the past, who live the nostalgic feeling.
    - People with bad memories - this app not only shows them a visulisaton of memories it also allows time for people to be suprised when they get reminded of trips and memories they have perhaps forgot.
    - The album feature is great for people who love documenting their lives as it allows for them to keep all media in one location.
