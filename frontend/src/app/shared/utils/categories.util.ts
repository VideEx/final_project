import {CategoriesUrl} from "../../../types/category.type";

export class CategoriesUtil {
  static getCategoriesValue (category: string): string {

    if (category.toLowerCase() === 'фриланс') {
      return CategoriesUrl.frilans
    } else if (category.toLowerCase() === 'дизайн') {
      return CategoriesUrl.dizain
    } else  if (category.toLowerCase() === 'smm') {
      return CategoriesUrl.smm
    } else  if (category.toLowerCase() === 'таргет') {
      return CategoriesUrl.target
    } else  if (category.toLowerCase() === 'копирайтинг') {
      return CategoriesUrl.kopiraiting
    } else {
      return 'undefined'
    }
  }
}
