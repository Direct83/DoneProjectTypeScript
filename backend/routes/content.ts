import express from 'express';

const router = express.Router();

const makeid = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  return [...Array(length)].map((_) => characters.charAt(Math.floor(Math.random() * charactersLength))).join('');
}

router.get('/text', (req: express.Request, res: express.Response) => {
  setTimeout(() => res.json({ text: "Текст с сервера: " + makeid(20) }), 3000)
})

export default router;
