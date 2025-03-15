import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { BillRoute } from './routes/bills.route';
import serverless from "serverless-http";
import { CashRoute } from './routes/cash.route';
ValidateEnv();

const app = new App([new UserRoute(), new BillRoute(), new CashRoute()]);

app.listen();

export const handler = serverless(app.getServer());