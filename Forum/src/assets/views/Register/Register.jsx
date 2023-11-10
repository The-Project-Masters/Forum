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
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const register = (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      return alert('The password should be at least 6 symbols');
    }

    getUserByHandle(form.handle)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return alert(`User with handle @${form.handle} already exists!`);
        }

        return registerUser(form.email, form.password)
          .then((u) => {
            createUserHandle(form.handle, form.firstName, form.lastName, u.user.uid, u.user.email)
              .then(() => {
                navigate('/home');
              })
              .catch(console.error);
          })
          .catch((e) => {
            if (e.message.includes(`email-already-in-use`)) {
              alert(`Email ${form.email} has already been registered!`);
            }
          });
      })
      .catch(console.error);
  };

  return (
    <>
      <h2 className="text-white text-center mb-4">Register</h2>
      <Form className="Form text-center">
        <Form.Group className="form-group row">
          <Form.Label htmlFor="email" className="col-sm-3 text-white text-right">
            Email:{' '}
          </Form.Label>
          <Col xs="9">
            <Form.Control
              id="email"
              type="email"
              value={form.email}
              required
              onChange={updateForm('email')}
            />
          </Col>
        </Form.Group>
        <Form.Group className="form-group row">
          <Form.Label htmlFor="handle" className="col-sm-3 text-white text-right">
            Handle:{' '}
          </Form.Label>
          <Col xs="9">
            <Form.Control
              id="handle"
              type="text"
              value={form.handle}
              onChange={updateForm('handle')}
            />
          </Col>
        </Form.Group>
        <Form.Group className="form-group row">
          <Form.Label htmlFor="firstName" className="col-sm-3 text-white text-right">
            First name:{' '}
          </Form.Label>
          <Col xs="9">
            <Form.Control
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={updateForm('firstName')}
            />
          </Col>
        </Form.Group>
        <Form.Group className="form-group row">
          <Form.Label htmlFor="lastName" className="col-sm-3 text-white text-right">
            Last name:{' '}
          </Form.Label>
          <Col xs="9">
            <Form.Control
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={updateForm('lastName')}
            />
          </Col>
        </Form.Group>
        <Form.Group className="form-group row">
          <Form.Label htmlFor="password" className="col-sm-3 text-white text-right">
            Password:{' '}
          </Form.Label>
          <Col xs="9">
            <Form.Control
              id="password"
              type="password"
              value={form.password}
              required
              onChange={updateForm('password')}
            />
          </Col>
        </Form.Group>
        <Button onClick={register}>Register</Button>
      </Form>

      <div className="w-100 text-white text-center mt-2">
        Already have account?{' '}
        <Link to="/login" className="text-white">
          <strong>Login</strong>
        </Link>
      </div>
    </>
  );
};

export default Register;
