import taxonomyController from '@/lib/features/taxonomy/controller'

class controller extends taxonomyController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the categoryController class extended of the main parent class baseController.
   *
   * @param service - categoryService
   *categoryCtrl
   * @beta
   */
  constructor(type: any) {
    super(type)
  }
}

const productCategoryCtrl = new controller('product_cat') //product_category
export default productCategoryCtrl
