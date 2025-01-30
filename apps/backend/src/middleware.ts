import { getToken } from "next-auth/jwt";

export const verifySession = async (req:any, res:any, next:any) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log(token)
  if (token) {
    req.user = token;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

