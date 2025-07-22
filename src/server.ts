import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { BillRoute } from './routes/bills.route';
import { CashRoute } from './routes/cash.route';
import { InvoiceRoute } from './routes/invoice.route';
import { ProductRoute } from './routes/product.route';
import { CustomerRoute } from './routes/customer.route';
import { CategoryRoute } from './routes/category.route';
ValidateEnv();

const app = new App([new UserRoute(), new BillRoute(), new CashRoute(), new InvoiceRoute(), new CategoryRoute(), new ProductRoute(), new CustomerRoute()]);

app.listen();

export const handler = app.getServer();