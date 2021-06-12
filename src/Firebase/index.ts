/* eslint-disable import/no-duplicates */
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/performance";
import "firebase/auth";

import { firebaseConfig } from "./firebase-config";
import { firebaseHomologConfig } from "./firebase-homolog-config";

export const config = process.env.HOMOLOG ? firebaseHomologConfig : firebaseConfig;

const init = firebase.initializeApp(config);

export const db = init.firestore();
export const auth = init.auth();
export const performance = init.performance();
export const fs = firebase.firestore;
export const fbauth = firebase.auth;
export const storage = firebase.storage().ref();
