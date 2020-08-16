export class ShopItem extends Object {
    public cost: Number;
    public itemType: String;
    // How much the item will upgrade something
    public itemTypeValue: Number;
    constructor(cost: Number, itemType: String, itemTypeValue: Number){
        super();
        this.cost = cost;
        this.itemType = itemType;
        this.itemTypeValue;
    }
}
