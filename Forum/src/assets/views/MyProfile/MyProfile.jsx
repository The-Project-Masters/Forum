import './MyProfile.css';
import { useState, useContext } from 'react';
import { updateUserInfo } from '../../services/users.services';
import { Col, Form, Button } from 'react-bootstrap';
import UserContext from '../../providers/user.context';

const MyProfile = () => {
  const { userData } = useContext(UserContext);

  const [form, setForm] = useState({
    email: userData.email,
    handle: userData.handle,
    firstName: userData.firstName,
    lastName: userData.lastName,
  });

  const updateForm = (prop) => (e) => {
    setForm({ ...form, [prop]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Check for valid email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      return alert('Please enter a valid email address');
    }

    // Check for a non-empty handle
    if (!form.handle.trim()) {
      return alert('Handle cannot be empty');
    }

    // Check for non-empty first and last names
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return alert('First name and last name cannot be empty');
    }

    try {
      // Update user info in Firebase
      await updateUserInfo(userData.handle, 'email', form.email);
      await updateUserInfo(userData.handle, 'firstName', form.firstName);
      await updateUserInfo(userData.handle, 'lastName', form.lastName);

      alert('Profile updated successfully!');
    } catch (error) {
      if (error.message.includes('email-already-in-use')) {
        alert(`Email ${form.email} has already been registered!`);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="card mt-4 mb-4 p-4">
      <h2 className="mb-4">My Profile</h2>
      <Form className="Form">
        {['email', 'firstName', 'lastName'].map((field) => (
          <Form.Group key={field} className="form-group row mt-2 mb-2">
            <Form.Label htmlFor={field} className={`col-sm-3 text-right`}>
              {field === 'firstName'
                ? 'First name'
                : field === 'lastName'
                ? 'Last name'
                : field.charAt(0).toUpperCase() + field.slice(1)}
              :{' '}
            </Form.Label>
            <Col xs="9">
              <Form.Control
                id={field}
                type={field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={updateForm(field)}
              />
            </Col>
          </Form.Group>
        ))}
        <Button onClick={handleProfileUpdate}>Update information</Button>
      </Form>
    </div>
  );
};

export default MyProfile;
