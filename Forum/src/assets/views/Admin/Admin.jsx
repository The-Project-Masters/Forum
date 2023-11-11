import './Admin.css';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../../providers/user.context';
import SingleUser from '../../components/SingleUser/SingleUser';
import { userRoles } from '../../common/user-roles';
import { Card, ListGroup } from 'react-bootstrap';
import { getLiveUserDatas, getUserDatas, updateUserRole } from '../../services/users.services';

const Admin = () => {
  const { userData } = useContext(UserContext);

  const [userDatas, setUserDatas] = useState([]);

  useEffect(() => {
    const listen = (snapshot) => {
      console.log('users changes detected');
      !snapshot.exists() && setUserDatas([]);

      setUserDatas(Object.keys(snapshot.val()).map((key) => snapshot.val()[key]));
    };

    getUserDatas().then(listen);

    const unsubscribe = getLiveUserDatas(listen);

    return () => unsubscribe();
  }, []);

  const blockUser = (handle) => {
    if (handle === userData.handle) {
      alert("You can't block yourself");
      return;
    }
    updateUserRole(handle, userRoles.BLOCKED);
  };
  const unblockUser = (handle) => {
    updateUserRole(handle, userRoles.BASIC);
  };
  const makeAdmin = (handle) => {
    updateUserRole(handle, userRoles.ADMIN);
  };

  const removeAdmin = (handle) => {
    updateUserRole(handle, userRoles.BASIC);
  };

  return (
    <>
      <h2>This is the Admin page</h2>

      <Card className="mt-4 mb-4 ">
        <ListGroup variant="flush">
          {userDatas.map((data) => (
            <ListGroup.Item key={data.uid}>
              <SingleUser
                currentUserData={data}
                blockUser={blockUser}
                unblockUser={unblockUser}
                makeAdmin={makeAdmin}
                removeAdmin={removeAdmin}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </>
  );
};

export default Admin;
