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