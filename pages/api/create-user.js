const axios = require('axios');

// Creating a user gives you a "bucket" to store all your financial data.
// https://api.basiq.io/reference/create-a-user

export default async function createUser(req, res) {
  if (req.method === 'POST') {
    try {
      const { data } = await axios({
        method: 'post',
        url: 'https://au-api.basiq.io/users',
        headers: {
          Authorization: `Bearer ${req.basiqServerToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: req.body,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: 'Something went wrong' });
    }
  } else {
    // Only POST is allowed
    res.status(400).json({ message: 'Invalid method' });
  }
}
