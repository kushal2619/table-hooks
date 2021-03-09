import Dexie from 'dexie'
 
const DATABASE_NAME = "CONTACT_INFO"
const DATABASE_VERSION = 1;
const OBJECT_STORE = 'contacts';

const db = new Dexie(DATABASE_NAME);
db.version(DATABASE_VERSION).stores({ [OBJECT_STORE]: '&uid' })

export const initIDB = async() => {
    const promise = await db.open();
    return promise
}

export const fetchFromIDB = async(objectStore) => {
    //console.log(db[objectStore])
    const promise = await db[objectStore].toArray()
    //console.log(promise)
    return promise
}

export const updateIDB = async(objectStore, item) => {
    const uid = item.uid;
    const promise = await db[objectStore].put({uid, item})
    return promise
}

export const deleteInIDB = async(objectStore, id) => {
    const promise = await db[objectStore].delete(id)
    return promise
}

export const closeIDB = () => {
    db.close();
}