import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
export const generateJwtToken = (data, time = null) => {
  if (time) return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: time });
  return jwt.sign(data, process.env.JWT_SECRET);
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const generatePasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password: string, passwordHash: string) => {
  return bcrypt.compare(password, passwordHash);
};
