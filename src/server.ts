import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { BillRoute } from './routes/bills.route';
import ngrok from '@ngrok/ngrok';
import serverless from "serverless-http";
import { CashRoute } from './routes/cash.route';
ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new BillRoute(), new CashRoute()]);

app.listen();

export const handler = serverless(app.getServer());