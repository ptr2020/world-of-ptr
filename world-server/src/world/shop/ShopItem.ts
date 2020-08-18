export class ShopItem extends Object {
    public name: string;
    public cost: number;
    public itemType: number;
    // How much the item will upgrade something
    public itemTypeValue: number;
    constructor(name: string, cost: number, itemType: number, itemTypeValue: number){
        super();
        this.name = name;
        this.cost = cost;
        this.itemType = itemType;
        this.itemTypeValue = itemTypeValue;
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
