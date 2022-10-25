import { db, auth, storage } from "./firebase";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const IMAGE_LOADER = "https://www.google.com/images/spin-32.gif?a";

function getBookRef(id) {
  return doc(db, "books", id);
}

export async function createBook(book) {
  const hasImage = book.image != undefined;
  try {
    const bookRef = await addDoc(collection(db, "books"), {
      ...book,
      image: hasImage ? IMAGE_LOADER : "",
      timestamp: serverTimestamp(),
    });

    if (hasImage) {
      const imagePath = `${auth.currentUser.uid}/${bookRef.id}/${book.image.name}`;
      const newImageRef = ref(storage, imagePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, book.image);
      const publicImageUrl = await getDownloadURL(newImageRef);

      await updateDoc(bookRef, {
        image: publicImageUrl,
        storageUri: fileSnapshot.metadata.fullPath,
      });
    }
  } catch (error) {
    console.error("Error writing new book to Firebase Database", error);
  }
}

export async function updateBook(id, updateObj) {
  try {
    await updateDoc(getBookRef(id), { ...updateObj });
  } catch (error) {
    console.error("Error updating book in Firebase Database", error);
  }
}

export async function deleteBook(id) {
  try {
    await deleteDoc(getBookRef(id));
  } catch (error) {
    console.error("Error deleting book in Firebase Database", error);
  }
}

export function docsArrToBooksArr(docs) {
  return docs.map((doc) => doc.data());
}

export const booksQuery = query(
  collection(db, "books"),
  orderBy("timestamp", "asc")
);
