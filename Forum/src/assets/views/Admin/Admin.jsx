import './Admin.css';
import { useState, useEffect } from 'react';
import { userRoles } from '../../common/user-roles';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';
import { getLiveUserDatas, getUserDatas, updateUserRole } from '../../services/users.services';
import SingleUser from '../../components/SingleUser/SingleUser';

const Admin = () => {
  const [userDatas, setUserDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const listen = (snapshot) => {
      !snapshot.exists() && setUserDatas([]);
      const users = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]);
      // Filter users based on the search query
      const filteredUsers = users.filter(
        (user) =>
          user.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUserDatas(filteredUsers);
    };

    getUserDatas().then(listen);

    const unsubscribe = getLiveUserDatas(listen);

    return () => unsubscribe();
  }, [searchQuery]); // Add searchQuery as a dependency

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const blockUser = (handle) => {
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
      <div className="container card m-auto mt-4 mb-4 p-4 pb-1">
        <h2>This is the Admin page</h2>

        <div className="search card p-3 mt-3">
          <h6 className="mb-3 mt-2">Search user by username/handle:</h6>
          <input
            className="form-control"
            type="text"
            placeholder="Enter username..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <Card className="mt-4 mb-4 ">
          <ListGroup variant="flush">
            <div className="list-group-item bg-dark text-white p-3 text-left">
              <Row>
                <Col className="col-lg-2 h5">Username / Handle</Col>
                <Col className="col-lg-2 h5">First name</Col>
                <Col className="col-lg-2 h5">Last name</Col>
                <Col className="col-lg-2 h5">E-mail</Col>
                <Col className="col-lg-2 h5">User role</Col>
                <Col className="col-lg-2 h5">Actions</Col>
              </Row>
            </div>
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
      </div>
    </>
  );
};

export default Admin;
