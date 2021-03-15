import express from 'express';

export default (err: any, req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(500).json({message: 'server error status 500'});
};
