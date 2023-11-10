import './Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth.service';
import { getUserByHandle, createUserHandle } from '../../services/users.services';
import { Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    handle: '',
    firstName: '',
    lastName: '',
  });
  
  const navigate = useNavigate();

  const updateForm = (prop) => (e) => {
    setForm({ ...form, [prop]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Check for minimum password length
    if (form.password.length < 6) {
      return alert('The password should be at least 6 characters');
    }

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
      // Check if the handle already exists
      const handleSnapshot = await getUserByHandle(form.handle);
      if (handleSnapshot.exists()) {
        return alert(`User with handle @${form.handle} already exists!`);
      }

      // Attempt user registration
      const userSnapshot = await registerUser(form.email, form.password);
      const userId = userSnapshot.user.uid;

      // Create user handle and navigate to home page
      await createUserHandle(form.handle, form.firstName, form.lastName, userId, form.email);
      navigate('/home');
    } catch (error) {
      if (error.message.includes('email-already-in-use')) {
        alert(`Email ${form.email} has already been registered!`);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
      <h2 className="text-white text-center mb-4">Register</h2>
      <Form className="Form text-center">
        {['email', 'handle', 'firstName', 'lastName', 'password'].map((field) => (
          <Form.Group key={field} className="form-group row">
            <Form.Label htmlFor={field} className={`col-sm-3 text-white text-right`}>
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
                type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                value={form[field]}
                required={field === 'password'}
                onChange={updateForm(field)}
              />
            </Col>
          </Form.Group>
        ))}
        <Button onClick={handleRegistration}>Register</Button>
      </Form>

      <div className="w-100 text-white text-center mt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-white">
          <strong>Login</strong>
        </Link>
      </div>
    </>
  );
};

export default Register;
