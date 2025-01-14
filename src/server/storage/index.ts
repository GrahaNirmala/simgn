import { TInsertStorage, TStorage, Storage } from '../db/schema';
import { db } from '../db';
import path from 'path';
import { bucket } from '../security/firebase';

export async function uploadFile(file: File) {
  const { name, ext } = path.parse(file.name);
  const storage: TInsertStorage = {
    name: name,
    ext: ext,
  };

  const [newStorage] = await db().insert(Storage).values(storage).returning();
  const objectName = newStorage.token + storage.ext;
  const fileRef = bucket.file(objectName);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(bytes));
  await fileRef.save(buffer);
  

  return { ...newStorage };
}

export async function getFile(storage: TStorage) {
  const objectName = storage.token + storage.ext;
  const fileRef = bucket.file(objectName);
  return fileRef; 
}

// Delete a file from Firebase Storage and the database
export async function deleteFile(storage: TStorage) {
  const objectName = storage.token + storage.ext;
  const fileRef = bucket.file(objectName);
  await fileRef.delete();
}

// Update a file in Firebase Storage
export async function updateFile(file: File, oldStorage: TStorage) {
  // Delete the old file first
  await deleteFile(oldStorage);

  // Upload the new file
  return await uploadFile(file);
}