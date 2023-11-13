import './SingleUser.css';
import { useContext } from 'react';
import UserContext from '../../providers/user.context';
import { userRoles } from '../../common/user-roles';
import { Button, Col, Row } from 'react-bootstrap';
import { remove } from 'firebase/database';

const SingleUser = ({ currentUserData, blockUser, unblockUser, makeAdmin, removeAdmin }) => {
  const {
    userData: { handle, role },
  } = useContext(UserContext);

  const isUserBlocked = () => {
    return currentUserData.role === userRoles.BLOCKED;
  };

  const isUserAdmin = () => {
    return currentUserData.role === userRoles.ADMIN;
  };

  return (
    <>
      <div className="User">
        <Row>
          <Col className="col-lg-2">
            {currentUserData.handle === handle && '>>> '}
            {currentUserData.handle} &nbsp;
          </Col>
          <Col className="col-lg-2">{currentUserData.firstName}</Col>
          <Col className="col-lg-2">{currentUserData.lastName}</Col>
          <Col className="col-lg-2">{currentUserData.email}</Col>
          <Col className="col-lg-2">{'[' + Object.keys(userRoles)[currentUserData.role] + ']'}</Col>
          <Col className="col-lg-2 text-right">
            {currentUserData.role < userRoles.ADMIN && (
              <>
                <Button
                  className={isUserBlocked() ? 'btn-success' : 'btn-danger'}
                  onClick={
                    isUserBlocked()
                      ? () => unblockUser(currentUserData.handle)
                      : () => blockUser(currentUserData.handle)
                  }
                >
                  {isUserBlocked() ? 'Unblock' : 'Block'}
                </Button>{' '}
              </>
            )}

            {currentUserData.role <= userRoles.ADMIN && (
              <>
                <Button
                  className={isUserAdmin() ? 'btn-success' : 'btn-danger'}
                  onClick={
                    isUserAdmin()
                      ? () => removeAdmin(currentUserData.handle)
                      : () => makeAdmin(currentUserData.handle)
                  }
                >
                  {isUserAdmin() ? 'Remove Admin' : 'Make Admin'}
                </Button>{' '}
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};
export default SingleUser;
