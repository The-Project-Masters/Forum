import {
  get,
  set,
  query,
  ref,
  orderByChild,
  equalTo,
  update,
  onChildChanged,
} from 'firebase/database';
import { db } from '../config/firebase';
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

export const getUserDatas = () => {
  return get(ref(db, 'users'));
};

export const getLiveUserDatas = (listen) => {
  return onChildChanged(ref(db, 'users'), () => {
    get(ref(db, 'users')).then(listen);
  });
};

export const updateUserRole = (handle, role) => {
  return update(ref(db), {
    [`users/${handle}/role`]: role,
  });
};

export const updateUserInfo = async (handle, field, value) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, { [field]: value });
};