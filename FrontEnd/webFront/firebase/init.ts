// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDaxx7Y1w0KHBuieOoBX2fOAOvKuAZhThk",
    authDomain: "tpa-web-d39e0.firebaseapp.com",
    projectId: "tpa-web-d39e0",
    storageBucket: "tpa-web-d39e0.appspot.com",
    messagingSenderId: "595650482041",
    appId: "1:595650482041:web:123c0de552b1a61e2be9a8",
    measurementId: "G-F43V3D9LW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(firebase_app);
const storage = getStorage(app);

// export const db = getFirestore(app);

export const enum path {
    profilePicture = 'profilePict/',
    postPicture = 'post/',
    reels = 'reels/',
    chatImages = 'chat/',
    groupPost = 'groupPost/',
    groupFile = 'groupFile/',
    story = 'story/'

}

export const GetProfilePictRef = (file : string) =>{
    const finalPath = path.profilePicture + file
    return ref(storage,finalPath)
}

export const GetGroupPostRef = (file : string) =>{
    const finalPath = path.groupPost + file
    return ref(storage,finalPath)
}

export const GetPostPictRef = (file : string) =>{
    const finalPath = path.postPicture + file
    return ref(storage,finalPath)
}

export const GetReelsRef = (file : string) =>{
    const finalPath : string = path.reels + file
    return ref(storage,finalPath)
}

export const GetPostFileRef = (file : string) =>{
    const finalPath : string = path.groupFile + file
    return ref(storage,finalPath)
}


export const GetChatRef = (file : string) =>{
    const finalPath : string = path.chatImages + file
    return ref(storage,finalPath)
}

export const GetStoryRef = (file : string) =>{
    const finalPath : string = path.story + file
    return ref(storage,finalPath)
}
