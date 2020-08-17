export class ShopItem extends Object {
    public name: String;
    public cost: Number;
    public itemType: Number;
    // How much the item will upgrade something
    public itemTypeValue: Number;
    constructor(name: String, cost: Number, itemType: Number, itemTypeValue: Number){
        super();
        this.name = name;
        this.cost = cost;
        this.itemType = itemType;
        this.itemTypeValue;
    }
}

// This enum should be used when deciding item type

export const ITEM_TYPE = {
    WEAPON_FIRERATE: 0,
    WEAPON_DMG: 1,
    WEAPON_SPREAD: 2,
    MAX_HEALTH: 3,
    PLAYER_SPEED: 4
}
