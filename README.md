> :warning: Since none of my personal keys are included in this repo, the project will fail to run.


https://github.com/user-attachments/assets/4775b349-a007-4e35-9dfd-d4ae9ea8c5e9



# TDS200 Autumn 2024, Candidate 32

> [!NOTE]
> ### TO RUN THE PROJECT:
> ```
> npm i
> ```
> downloads and installs all dependencies defined in the project's ``` package.json file. ```
>
> Install the app as a standalone application outside Expo Go
> ```
> npx expo prebuild --platform ios --clean   (this shold not be necessary, but just in case)
>
> npm run ios
> ```
---

Registered firebase user you can use:
```
mail: sonny@mail.com

password: 123456
```
If registrering a new user, the simulator needs to be refreshed to show the new users name and profile picture in the header.

---
This solution has been tested on the following platforms:
- Web (Safari and Chrome)
- iOS 13 Pro external device
- iOS simulator (iPhone 15 Pro)
- Android emulator (Pixel 8 Pro) While testing, the Android emulator crashed after implementing Google Sign-In for iOS. I attempted to resolve the issue using platform-specific functions and imports, but without success. The issue could likely be resolved by installing SHA keys for Android, but I have chosen to focus on iOS and web instead.


Application functionality:
- Artwork viewing
The Gallery.tsx page serves as the landing page after users are authorized. It features a scrollable list format that displays all artworks, including key details such as the title, the category, and the artist who posted it.
Each artwork is clickable, providing users access to a detailed view with additional information that is not displayed in the gallery, such as the artwork's description and location.


- Artist Uploads
Any signed-in user (excluding anonymous users) can easily upload their artwork directly from their photo library or camera. Users have the flexibility to upload between 1 and 3 images and provide additional details, including a title, description, and category for their artwork.
Once uploaded, the artworks are instantly available in the gallery feed, making them accessible to a global audience.


- Authentication
User can register as a new user with a username, profile picture, email and password.
A registered user can log in with their username and password.
The gallery feed is accessible to anonymous users, allowing them to browse posts without creating an account. However, anonymous users have restricted access: They cannot view the detailed page of a post, access the map view, and they can't create new posts.


- Seamless Navigation
Navigating around the application should be easy. The set-up of the application starts with a login page that gives several options to choose a method for logging in. After successful login, the user is taken to the Gallery. Now a header is also available, where you click on the image and your own profile is brought up, this is a natural place to log out the user, and you can also navigate to create a new post.
The tab menu is illustrated with icons for seamlessly going to the gallery, new post or the map.
To see detailed information about a post, it is natural to click on the post you want to see more about, this opens a new window that allows the user to see detailed information. From here, the user can open the profile of the relevant artist, open the map or simply navigate back.


- Enhanced Authentication
The application supports 4 login options:
1. Log in with the registered user's email and password.
2. Create a new user and be logged in with it.
3. Log in anonymously.
3. Log in with your Google account. (Only available for iOS)


- Interactive Communication
Users can leave comments on a post and delete it if desired (the delete function is only available on the logged-in user's comments). I don't want anyone to be able to dislike a post, but a user can add a like and also remove this like.


- Search and Filtering
On the Gallery page a user can search after Artists usernames. And on the Map page a user can filter the posts by pressing the filtering buttons, that's filters the post markers by category.


- Artist Profiles
A signed in user can access their own profile from the header which is wrapped around all 3 tabs.
A signed in user can also access all artist profiles by pressing their name on the detailed view, showing their name and uploaded art works.


- Related Exhibition
The artworks in my application are linked together by categories. Users can easily filter posts by category, and geolocations for posts within the same category are displayed on a map. This functionality enhances the user experience by making it easier to explore artworks with similar themes. Additionally, the geolocation feature provides a visual way to navigate related posts, elevating the application beyond a simple feed-based experience and enabling users to discover exhibits in nearby locations.


- User Feedback
In my application, I have implemented user feedback mechanisms to enhance the overall user experience:

- Loading Indicators: All screens display full-screen loading indicators, ensuring that users clearly understand when a page or process is loading.
- User-Friendly Error Messages: Internal error messages, such as those from Firebase, have been converted into user-friendly feedback. For example, during the sign-in process, an error like auth/invalid-email has been replaced with a more understandable message, such as "User not found," to ensure clarity.
- Alerts for Critical Actions: Users receive alerts in scenarios such as attempting to log out, leaving required fields unfilled, or performing other critical actions. These alerts help users avoid errors and confirm intentional actions.
- Anonymous User Support: Anonymous users are provided clear feedback if they attempt to access restricted pages, with an option to sign in and be redirected seamlessly to the sign in screen


- User Accessibility
To ensure that the application is accessible to everyone, including users with disabilities, I have focused on accessibility in both design and functionality, and have carried the WCAG requirements with me to the best of my ability:

Color contrast: Before using colors beyond standard black on white, I tested several combinations with a color contrast checker (https://colourcontrast.cc) to ensure compliance with accessibility standards.

Accessible Interactions: All user interactions, such as text input fields and clickable elements, are marked and structured using accessibility tools to ensure compatibility with screen readers and other assistive technologies.


### Installed Dependencies in my application 
* expo vektor icons (icons used in project)
https://www.npmjs.com/package/@expo/vector-icons

* lottie-react-native (Loading animation)
https://www.npmjs.com/package/lottie-react-native/v/5.0.1

* Firebase
https://firebase.google.com

* Nativewind
https://www.nativewind.dev/getting-started/expo-router

* react-native-responsive-screen
https://www.npmjs.com/package/react-native-responsive-screen

* expo-image-picker (for image uploads)
https://docs.expo.dev/versions/latest/sdk/imagepicker/

* expo camera
https://docs.expo.dev/versions/latest/sdk/camera/

* expo image (For only loading image once)
https://docs.expo.dev/versions/latest/sdk/image/c

* Expo map
https://docs.expo.dev/versions/latest/sdk/map-view/
https://docs.expo.dev/versions/latest/sdk/location/

* to show map on web:
https://www.npmjs.com/package/@teovilla/react-native-web-maps 

* Expo google sign in
https://docs.expo.dev/guides/google-authentication/
---

### Images Used
- SplashScreen Icon, App Icon and Fav Icon:
Generated with ChatGpt and edited in Figma.

Images statically used in the application:
- SignIn.tsx - Dowloaded from freepik(11/06/2024)
(https://www.freepik.com/free-photo/tattooed-young-man-with-pierced-ear-nose-holding-flower-bouquet-front-his-face_4371175.htm)

- SignUp.tsx - Dowloaded from freepik(11/06/2024)
(https://www.freepik.com/free-photo/close-up-tattooed-young-man-holding-floral-bouquet-hand-against-grey-wall_4360850.htm#fromView=serie&position=19)

- UserProfileComponent.tsx - Dowloaded from freepik(11/06/2024)
(https://www.freepik.com/free-photo/tattooed-man-s-hand-holding-sunflower-against-grey-backdrop_4360805.htm#fromView=serie&position=1)

- Images in the application such as posts and profile images are all from freepik, downloaded in the period of the exam

---
### Animation
My LoadingComponent is downloaded and modified 11/02/2024
from https://lottiefiles.com/free-animation/loading-animation-dDllMXjht9 

