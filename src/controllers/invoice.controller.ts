import { InvoiceDto } from "@/dtos/invoice.dto";
import { HttpException } from "@/exceptions/HttpException";
import { InvoiceService } from "@/services/invoice.service";
import { NextFunction, Request, Response } from "express";

export class InvoiceController {
    private invoiceService: InvoiceService
    constructor() {
        this.invoiceService = new InvoiceService();
    }
    public createInvoice = async (req: Request, res: Response, next: NextFunction) => {
        const invoice: InvoiceDto = req.body;
        try {
            const createInvoice = await this.invoiceService.createInvoice(invoice);
            res.status(201).json({ data: createInvoice, message: 'Invoice created successfully' });
        } catch (error) {  
            next(new HttpException(500, error.message || 'Something went wrong'));
        }
    }
    public getInvoice = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const getInvoice = await this.invoiceService.findInvoiceById(id);
            res.status(200).json({ data: getInvoice, message: 'Invoice fetched successfully' });
        } catch (error) {
            next(new HttpException(500, error.message || 'Something went wrong'));
        }
    }
    public getInvoices = async (req: Request, res: Response, next: NextFunction) => {
        const { query }: any = req;
        try {
            const getInvoices = await this.invoiceService.findAllInvoice(query);
            res.status(200).json({ data: getInvoices, message: 'Invoices fetched successfully' });
        } catch (error) {
            next(new HttpException(500, error.message || 'Something went wrong'));
        }
    }
    public updateInvoice = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const invoice: InvoiceDto = req.body;
        try {
            const updateInvoice = await this.invoiceService.updateInvoice(id, invoice);
            res.status(200).json({ data: updateInvoice, message: 'Invoice updated successfully' });
        } catch (error) {
            next(new HttpException(500, error.message || 'Something went wrong'));
        }
    }
    public deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const deleteInvoice = await this.invoiceService.deleteInvoice(id);
            res.status(200).json({ data: deleteInvoice, message: 'Invoice deleted successfully' });
        } catch (error) {
            next(new HttpException(500, error.message || 'Something went wrong'));
        }
    }
}