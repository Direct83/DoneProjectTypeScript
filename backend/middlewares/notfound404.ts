import express from 'express';

export default (req: express.Request, res: express.Response) => {
  res.status(404).json({message: 'notfound'});
};
