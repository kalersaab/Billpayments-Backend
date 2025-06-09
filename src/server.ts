import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { BillRoute } from './routes/bills.route';
import { CashRoute } from './routes/cash.route';
import { InvoiceRoute } from './routes/invoice.route';
ValidateEnv();

const app = new App([new UserRoute(), new BillRoute(), new CashRoute(), new InvoiceRoute()]);

app.listen();

export const handler = app.getServer();