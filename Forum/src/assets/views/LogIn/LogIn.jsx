import './Login.css';
import UserContext from '../../providers/user.context';
import { useState, useContext } from 'react';
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
    setForm({ ...form, [prop]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { user } = await loginUser(form.email, form.password);
      const snapshot = await getUserData(user.uid);

      if (snapshot.exists()) {
        const userData = snapshot.val()[Object.keys(snapshot.val())[0]];
        setContext({ user, userData });
        navigate('/home');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h2 className="text-white mt-3 mb-3">Log In</h2>
      <Form className="Form text-left mb-4">
        {['email', 'password'].map((field) => (
          <Form.Group key={field} className="form-group mb-2">
            <Form.Label htmlFor={field} className="col-sm-6 m-2 text-white">
              {field.charAt(0).toUpperCase() + field.slice(1)}:{' '}
            </Form.Label>
            <Col xs="10">
              <Form.Control
                id={field}
                type={field === 'email' ? 'email' : 'password'}
                value={form[field]}
                required
                onChange={updateForm(field)}
              />
            </Col>
          </Form.Group>
        ))}
        <Button onClick={handleLogin}>Login</Button>
      </Form>

      <div className="w-100 text-white mt-2">
        Need an account?
        <Link to="/register" className="text-white">
          <strong>Register</strong>
        </Link>
      </div>
    </>
  );
};

export default LogIn;
