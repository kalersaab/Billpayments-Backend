import { CategoryDto } from "@/dtos/category.dto";
import categorySchema from "@/models/category.model";
import { InferSchemaType, model, Model } from "mongoose";
import { Service } from "typedi";

@Service()
export class CategoryService{
    private _category: Model<InferSchemaType<typeof categorySchema>>
    constructor(){
        this._category = model('category', categorySchema);
    }
    public async createCategory(category: CategoryDto){
        try {
            const createCategory = new this._category({...category});
            await createCategory.save();
            return createCategory;
        } catch (error) {
            throw error;
        }
    }
    public async findCategory(query: { page: string; limit: string; keyword?: string }){
        const pageIndex = parseInt(query.page, 10) || 0;
        const pageSize = parseInt(query.limit, 10) || 10;
        const searchCriteria: {} = {};
        if (query.keyword) {
            searchCriteria['$or'] = [
              {
                name: { $regex: `${query.keyword?.trim()}`, $options: 'i' },
              },
            ];
          }
        try {
            const findCategory = await this._category.aggregate([
                { $match: searchCriteria },
                {
                  $sort: { lastActiveDate: -1 },
                },
                {
                  $facet: {
                    data: [{ $skip: pageIndex * pageSize }, { $limit: pageSize }],
                    count: [{ $count: 'total' }],
                },
                },
            ]);
            return { data: findCategory[0]?.data, count: findCategory[0]?.count[0]?.total };
        } catch (error) {
            throw error;
        }
    }
    public async updateCategory(id: string, category: CategoryDto){
        try {
            const updateCategory = await this._category.findByIdAndUpdate(id, category, { new: true });
            return updateCategory;
        } catch (error) {
            throw error;
        }
    }
    public async findCategoryById(id: string){
        try {
            const findCategory = await this._category.findById(id);
            return findCategory;
        } catch (error) {
            throw error;
        }
    }
    public async deleteCategory(id: string){
        try {
            const deleteCategory = await this._category.findByIdAndDelete(id);
            return deleteCategory;
        } catch (error) {
            throw error;
        }
    }
}