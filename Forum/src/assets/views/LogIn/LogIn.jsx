import { useState, useContext } from 'react';
import './Login.css';
import UserContext from '../../providers/user.context';
import { loginUser } from '../../services/auth.service';
import { getUserData } from '../../services/users.services';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LogIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { setContext } = useContext(UserContext);
  const navigate = useNavigate();

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const login = (e) => {
    e.preventDefault();

    loginUser(form.email, form.password)
      .then((u) => {
        return getUserData(u.user.uid).then((snapshot) => {
          if (snapshot.exists()) {
            setContext({
              user: u.user,
              userData: snapshot.val()[Object.keys(snapshot.val())[0]],
            });

            navigate('/home');
          }
        });
      })
      .catch(console.error);
  };

  return (
    <>
      <h2 className="text-white text-center mb-4">Log In</h2>
      <Form className="Form text-center">
        <Form.Group className="form-group row">
          <Form.Label htmlFor="email" className="col-sm-2 text-white text-right">
            Email:{' '}
          </Form.Label>
          <Col xs="10">
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
          <Form.Label htmlFor="password" className="col-sm-2 text-white text-right">
            Password:{' '}
          </Form.Label>
          <Col xs="10">
            <Form.Control
              id="password"
              type="password"
              value={form.password}
              required
              onChange={updateForm('password')}
            />
          </Col>
        </Form.Group>
        <Button onClick={login}>Login</Button>
      </Form>

      <div className="w-100 text-white text-center mt-2">
        Need an account?{' '}
        <Link to="/register" className="text-white">
          <strong>Register</strong>
        </Link>
      </div>
    </>
  );
};

export default LogIn;
