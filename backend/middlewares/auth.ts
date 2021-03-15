import express from 'express';

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.user) {
    res.json({ session: false, message: 'not authorize' });
  } else next();
};
