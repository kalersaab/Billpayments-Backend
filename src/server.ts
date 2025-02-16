import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { BillRoute } from './routes/bills.route';
import ngrok from '@ngrok/ngrok';
import serverless from "serverless-http";
ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new BillRoute()]);

app.listen();

export const handler = serverless(app.getServer());