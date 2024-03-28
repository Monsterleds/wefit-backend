import 'reflect-metadata';
import 'dotenv/config'

import { app } from './index';
import { connectDatabase } from '../configs/databases/mysql';

const port = process.env.PORT || 4568;

app.listen(port, () => {
    console.log(`Escutando na porta ${port}`);
    connectDatabase()
});
  