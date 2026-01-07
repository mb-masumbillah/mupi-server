import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { user: string; role: string; email: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expiresIn as any });
};

export const verifyToken = (token:string, secret:string) =>{
    return jwt.verify(token, secret) as JwtPayload
}
