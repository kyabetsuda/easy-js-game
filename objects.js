const STRENGTH_WEAK = 1;
const STRENGTH_MIDDLE = 2;
const STRENGTH_STRONG = 3;

function Person(name, nameKana, hp, mp, strength) {
    this.name = name;
    this.nameKana = nameKana;
    this.hp = hp;
    this.mp = mp;
    this.strength = strength;
    this.isAlive = true;
    this.isDefence = false;
}
Person.prototype.attack = function() {
    var damage = getRandomInt(10) + 1;
    var retMap = new Map();
    if (this.strength == STRENGTH_MIDDLE) {
        damage = damage + 10;
    } 
    if (this.strength == STRENGTH_STRONG) {
        damage = damage + 20;
    } 
    retMap.set('damage', damage);
    retMap.set('criticalFlag', false);
    return retMap;
};

function Monster(name, imgClassName, nameKana, hp, mp, strength) {
    this.name = name;
    this.nameKana = nameKana;
    this.imgClassName = imgClassName;
    this.hp = hp;
    this.mp = mp;
    this.strength = strength;
    this.isAlive = true;
    this.isDefence = false;
}
Monster.prototype.attack = function() {
    var damage = getRandomInt(10) + 1;
    var retMap = new Map();
    if (this.strength == STRENGTH_MIDDLE) {
        damage = damage + 10;
    } 
    if (this.strength == STRENGTH_STRONG) {
        damage = damage + 20;
    } 
    var rand = getRandomInt(10);
    if (rand % 3 == 0) {
        // 痛恨の一撃
        retMap.set('damage', damage * 2);
        retMap.set('criticalFlag', true);
    } else {
        retMap.set('damage', damage);
        retMap.set('criticalFlag', false);
    }
    return retMap;
}