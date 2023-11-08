import { get, set, query, ref, orderByChild, equalTo } from 'firebase/database';
import { db } from '../config/firebase-config';
import { userRoles } from '../common/user-roles';

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, firstName, lastName, uid, email) => {
  return set(ref(db, `users/${handle}`), {
    handle,
    firstName,
    lastName,
    uid,
    email,
    createdOn: new Date(),
    likedTweets: {},
    role: userRoles.BASIC,
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};
