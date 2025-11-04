import { auth, db, storage, isFirebaseConfigured } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Review } from "../../types/global";

// Auth functions
export const logoutUser = () => {
  if (!auth) throw new Error('Firebase auth not configured');
  return signOut(auth);
};

export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase auth not configured');
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) => {
  if (!db) throw new Error('Firebase not configured');
  return addDoc(collection(db, collectionName), data);
};

export const getDocuments = async (collectionName: string) => {
  if (!db) return [];
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) => {
  if (!db) throw new Error('Firebase not configured');
  return updateDoc(doc(db, collectionName, id), data);
};

export const deleteDocument = (collectionName: string, id: string) => {
  if (!db) throw new Error('Firebase not configured');
  return deleteDoc(doc(db, collectionName, id));
};

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  if (!storage) throw new Error('Firebase storage not configured');
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Review-specific functions
export const submitReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'approved'>) => {
  if (!db) {
    throw new Error('Firebase not configured. Cannot submit review.');
  }
  
  const review: Omit<Review, 'id'> = {
    ...reviewData,
    approved: false, // Reviews need admin approval by default
    createdAt: new Date(),
  };
  
  return await addDocument('reviews', review);
};

export const getApprovedReviews = async (): Promise<Review[]> => {
  if (!db) {
    console.warn('Firebase not configured. Returning empty reviews.');
    return [];
  }
  
  const reviewsRef = collection(db, 'reviews');
  const q = query(
    reviewsRef, 
    where('approved', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Review[];
};

export const getAllReviews = async (): Promise<Review[]> => {
  if (!db) {
    console.warn('Firebase not configured. Returning empty reviews.');
    return [];
  }
  
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Review[];
};

export const approveReview = async (reviewId: string) => {
  return await updateDocument('reviews', reviewId, { 
    approved: true, 
    updatedAt: new Date() 
  });
};
