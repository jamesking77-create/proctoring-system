
const { login } = require('../controllers/authControllers');

test('Login with valid username and password should return success message', () => {
  const req = { body: { username: 'PeterPan', password: 'Password' } };
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  login(req, res);

  expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
  expect(res.status).not.toHaveBeenCalled();
});

test('Login with invalid username or password should return 401 status', () => {
  const req = { body: { username: 'invalidUsername', password: 'invalidPassword' } };
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  login(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
});
