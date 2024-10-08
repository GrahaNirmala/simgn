import admin from "firebase-admin";
import { config } from "@/server/config";

// Define the firebaseConfig object, make sure all values are properly set.
const firebaseConfig = {
  projectId: config.firebase.id,  // Ensure camelCase here
  privateKey: config.firebase.private.replace(/\\n/g, '\n'),  // Correct private key format
  clientEmail: config.firebase.email,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),  // Proper type casting
    storageBucket: config.firebase.storageBucket,  // Ensure the storage bucket value is correctly set
  });
}

const bucket = admin.storage().bucket();

export { admin, bucket };
