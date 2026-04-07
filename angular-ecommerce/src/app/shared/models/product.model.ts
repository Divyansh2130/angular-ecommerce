export interface Product{
    title:string;
    description?:string;
    price:number;
    originalPrice:number;
    rating:number;
    image:string;
    category?:string;
    discount?:string;
    tag?:string;
    reviews?:number;
}